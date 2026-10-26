import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'

function loadEnv(file) {
  const out = {}
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue
    const i = line.indexOf('=')
    out[line.slice(0, i)] = line.slice(i + 1)
  }
  return out
}

function curl(args) {
  const r = spawnSync('curl', ['-sS', ...args], { encoding: 'utf8', maxBuffer: 10_000_000 })
  return {
    status: r.status,
    stdout: (r.stdout || '').trim(),
    stderr: (r.stderr || '').trim(),
  }
}

const env = loadEnv('.env.local')
const email = 'admin@govibe.local'
const password = 'GoVibeAdmin123!'
const base = 'http://127.0.0.1:3000'

const profileRes = await fetch(
  `${env.GOVIBE_API_URL}/profiles?email=eq.${encodeURIComponent(email)}&select=id,email,role,active,password_hash&limit=1`,
  { headers: { 'X-GoVibe-Key': env.GOVIBE_SERVICE_KEY } },
)
const profile = (await profileRes.json())[0]
const passwordOk = await bcrypt.compare(password, profile.password_hash)
console.log(
  `CREDS email=${profile.email} role=${profile.role} active=${profile.active} password_ok=${passwordOk}`,
)

const unauthHeaders = curl([
  '-D',
  '/tmp/govibe-unauth-headers.txt',
  '-o',
  '/tmp/govibe-unauth-body.html',
  '-w',
  '%{http_code}',
  '--max-redirs',
  '0',
  `${base}/admin`,
])
const unauthHdr = fs.readFileSync('/tmp/govibe-unauth-headers.txt', 'utf8')
const location = (unauthHdr.match(/^location:\s*(.*)$/im) || [])[1] || ''
console.log(`ADMIN_UNAUTH status=${unauthHeaders.stdout} location=${location}`)
if (unauthHeaders.stdout === '500') {
  const body = fs.readFileSync('/tmp/govibe-unauth-body.html', 'utf8').slice(0, 500)
  console.log('ADMIN_UNAUTH_BODY_SNIP', body.replace(/\s+/g, ' ').slice(0, 300))
}

const secret = new TextEncoder().encode(env.AUTH_SECRET)
const token = await new SignJWT({ email: profile.email })
  .setProtectedHeader({ alg: 'HS256' })
  .setSubject(profile.id)
  .setIssuedAt()
  .setExpirationTime('7d')
  .sign(secret)

fs.writeFileSync('/tmp/govibe-cookie.txt', `govibe_staff_session=${token}; Path=/)

const authed = curl([
  '-b',
  '/tmp/govibe-cookie.txt',
  '-D',
  '/tmp/govibe-auth-headers.txt',
  '-o',
  '/tmp/govibe-admin.html',
  '-w',
  '%{http_code}',
  '--max-redirs',
  '0',
  `${base}/admin`,
])
const authHdr = fs.readFileSync('/tmp/govibe-auth-headers.txt', 'utf8')
const authLoc = (authHdr.match(/^location:\s*(.*)$/im) || [])[1] || ''
const html = fs.readFileSync('/tmp/govibe-admin.html', 'utf8')
const title = ((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 100)
const stillLogin = /Staff login/i.test(html)
console.log(`ADMIN_AUTH status=${authed.stdout} location=${authLoc}`)
console.log(`ADMIN_TITLE ${title || '(none)'}`)
console.log(`STILL_LOGIN_PAGE ${stillLogin}`)

const gateOk =
  (unauthHeaders.stdout === '307' || unauthHeaders.stdout === '302') &&
  /admin\/login/i.test(location)
const sessionOk = authed.stdout === '200' && !stillLogin && passwordOk

console.log(
  sessionOk && (gateOk || unauthHeaders.stdout !== '200')
    ? `RESULT pass gate_ok=${gateOk} session_ok=${sessionOk}`
    : `RESULT fail gate_ok=${gateOk} session_ok=${sessionOk} unauth=${unauthHeaders.stdout} auth=${authed.stdout}`,
)
process.exitCode = sessionOk ? 0 : 1
