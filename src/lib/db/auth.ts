import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import {
  STAFF_SESSION_COOKIE,
  createSessionToken,
  sessionCookieMaxAge,
  verifySessionToken,
} from '@/lib/db/session-token'
import { createServiceAuthApi } from '@/lib/db/service-auth'
import type { DbError } from '@/lib/db/postgrest'
import { govibeFetch } from '@/lib/db/tls-fetch'

export {
  STAFF_SESSION_COOKIE as sessionCookieName,
  verifySessionToken,
} from '@/lib/db/session-token'

async function apiFetch(path: string, init?: RequestInit) {
  const base = process.env.GOVIBE_API_URL?.replace(/\/$/, '')
  const key = process.env.GOVIBE_SERVICE_KEY?.trim()
  if (!base || !key) throw new Error('GoVibe API is not configured')
  return govibeFetch(`${base}${path}`, {
    ...init,
    headers: {
      'X-GoVibe-Key': key,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })
}

export async function setSessionCookie(token: string) {
  const jar = await cookies()
  jar.set(STAFF_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionCookieMaxAge(),
  })
}

export async function clearSessionCookie() {
  const jar = await cookies()
  jar.delete(STAFF_SESSION_COOKIE)
}

export async function readSessionCookie(): Promise<string | null> {
  const jar = await cookies()
  return jar.get(STAFF_SESSION_COOKIE)?.value ?? null
}

/** Cookie-session auth for server components / actions only. */
export function createAuthApi() {
  const service = createServiceAuthApi()
  return {
    ...service,
    async signInWithPassword(creds: { email: string; password: string }) {
      const email = creds.email.trim().toLowerCase()
      let res: Response
      try {
        res = await apiFetch(
          `/profiles?email=eq.${encodeURIComponent(email)}&select=id,email,password_hash,active,role&limit=1`,
        )
      } catch {
        return {
          data: { user: null },
          error: { message: 'Could not reach the database.' } satisfies DbError,
        }
      }
      if (!res.ok) {
        return {
          data: { user: null },
          error: { message: 'Could not sign in.' } satisfies DbError,
        }
      }
      const rows = (await res.json()) as Array<{
        id: string
        email: string
        password_hash: string | null
        active: boolean
        role: string
      }>
      const profile = rows[0]
      if (!profile?.password_hash || !profile.active) {
        return {
          data: { user: null },
          error: { message: 'Invalid email or password.' },
        }
      }
      if (profile.role !== 'admin' && profile.role !== 'manager') {
        return {
          data: { user: null },
          error: { message: 'Invalid email or password.' },
        }
      }
      const ok = await bcrypt.compare(creds.password, profile.password_hash)
      if (!ok) {
        return {
          data: { user: null },
          error: { message: 'Invalid email or password.' },
        }
      }
      const token = await createSessionToken({
        sub: profile.id,
        email: profile.email,
      })
      await setSessionCookie(token)
      return { data: { user: { id: profile.id } }, error: null }
    },

    async signOut() {
      await clearSessionCookie()
      return { error: null }
    },

    async getSession() {
      const token = await readSessionCookie()
      if (!token) return { data: { session: null } }
      const payload = await verifySessionToken(token)
      if (!payload) return { data: { session: null } }
      return {
        data: {
          session: {
            access_token: token,
            user: { id: payload.sub },
          },
        },
      }
    },

    async getUser() {
      const token = await readSessionCookie()
      if (!token) return { data: { user: null } }
      const payload = await verifySessionToken(token)
      if (!payload) return { data: { user: null } }
      return {
        data: { user: { id: payload.sub, email: payload.email } },
      }
    },
  }
}
