/**
 * Smoke: Admin-style MinIO upload → public URL → app media proxy → delete.
 */
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

function loadEnv(file) {
  const out = {}
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue
    const i = line.indexOf('=')
    out[line.slice(0, i)] = line.slice(i + 1)
  }
  return out
}

function curlCode(url) {
  const r = spawnSync(
    'curl',
    ['-sS', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '30', url],
    { encoding: 'utf8' },
  )
  return r.stdout.trim()
}

const env = loadEnv('.env.local')
for (const k of [
  'MEDIA_S3_ENDPOINT',
  'MEDIA_S3_ACCESS_KEY',
  'MEDIA_S3_SECRET_KEY',
  'MEDIA_PUBLIC_BASE_URL',
]) {
  if (!env[k]?.trim()) {
    console.error(`RESULT fail missing ${k}`)
    process.exit(1)
  }
}

const bucket = 'govibe-product-images'
const key = `smoke-tests/govibe-upload-${Date.now()}.png`
// 1x1 PNG
const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

const client = new S3Client({
  region: env.MEDIA_S3_REGION || 'us-east-1',
  endpoint: env.MEDIA_S3_ENDPOINT,
  forcePathStyle: env.MEDIA_S3_FORCE_PATH_STYLE !== 'false',
  credentials: {
    accessKeyId: env.MEDIA_S3_ACCESS_KEY,
    secretAccessKey: env.MEDIA_S3_SECRET_KEY,
  },
})

console.log(`UPLOAD bucket=${bucket} key=${key}`)
await client.send(
  new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: png,
    ContentType: 'image/png',
    CacheControl: 'public, max-age=31536000, immutable',
  }),
)
console.log('UPLOAD ok')

const publicBase = env.MEDIA_PUBLIC_BASE_URL.replace(/\/$/, '')
const publicUrl = `${publicBase}/${bucket}/${key}`
const publicCode = curlCode(publicUrl)
console.log(`PUBLIC_URL ${publicCode} ${publicUrl}`)

const proxyPath = `/api/media/${encodeURIComponent(bucket)}/${key.split('/').map(encodeURIComponent).join('/')}`
const proxyUrl = `http://127.0.0.1:3000${proxyPath}`
const proxyCode = curlCode(proxyUrl)
console.log(`PROXY_URL ${proxyCode} ${proxyUrl}`)

await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
const afterDelete = curlCode(publicUrl)
console.log(`DELETE ok; PUBLIC_AFTER_DELETE ${afterDelete}`)

const pass =
  publicCode === '200' &&
  proxyCode === '200' &&
  (afterDelete === '404' || afterDelete === '403' || afterDelete === '400')

console.log(
  pass
    ? 'RESULT pass — GoVibe MinIO upload/view/delete works via Admin storage path'
    : `RESULT fail public=${publicCode} proxy=${proxyCode} afterDelete=${afterDelete}`,
)
process.exit(pass ? 0 : 1)
