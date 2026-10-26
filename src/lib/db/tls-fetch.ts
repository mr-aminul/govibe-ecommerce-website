/**
 * HTTPS fetch for GoVibe PostgREST / MinIO hosts that sit behind a local
 * TLS-inspecting proxy (Forward Trust CA). Node's built-in fetch respects
 * NODE_EXTRA_CA_CERTS, but Turbopack workers often lose that env — so we
 * also load ./certs/forward-trust-root.pem (or GOVIBE_CA_FILE) explicitly.
 */

import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import tls from 'node:tls'
import { URL } from 'node:url'

let cachedHttpsAgent: https.Agent | null | undefined

function resolveCaPath(): string | null {
  const fromEnv = process.env.GOVIBE_CA_FILE?.trim() || process.env.NODE_EXTRA_CA_CERTS?.trim()
  if (fromEnv) {
    return path.isAbsolute(fromEnv) ? fromEnv : path.join(process.cwd(), fromEnv)
  }
  const fallback = path.join(process.cwd(), 'certs/forward-trust-root.pem')
  return fs.existsSync(fallback) ? fallback : null
}

function getGovibeHttpsAgent(): https.Agent | undefined {
  if (cachedHttpsAgent !== undefined) {
    return cachedHttpsAgent ?? undefined
  }

  const insecure =
    process.env.GOVIBE_TLS_INSECURE === '1' ||
    process.env.GOVIBE_TLS_INSECURE === 'true'
  if (insecure) {
    cachedHttpsAgent = new https.Agent({ rejectUnauthorized: false })
    return cachedHttpsAgent
  }

  const caPath = resolveCaPath()
  if (!caPath || !fs.existsSync(caPath)) {
    cachedHttpsAgent = null
    return undefined
  }

  const extraCa = fs.readFileSync(caPath)
  cachedHttpsAgent = new https.Agent({
    ca: [...tls.rootCertificates, extraCa],
  })
  return cachedHttpsAgent
}

function formatNetworkError(err: unknown): Error {
  const cause =
    err && typeof err === 'object' && 'cause' in err
      ? (err as { cause?: unknown }).cause
      : undefined
  const causeObj =
    cause && typeof cause === 'object'
      ? (cause as { code?: string; message?: string })
      : null
  const code = causeObj?.code
  const detail =
    code ||
    causeObj?.message ||
    (err instanceof Error ? err.message : String(err))

  if (
    code === 'SELF_SIGNED_CERT_IN_CHAIN' ||
    code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' ||
    String(detail).includes('certificate')
  ) {
    return new Error(
      `GoVibe API TLS failed (${detail}). Place the proxy CA at certs/forward-trust-root.pem or set GOVIBE_CA_FILE / GOVIBE_TLS_INSECURE=1.`,
    )
  }

  return err instanceof Error ? err : new Error(String(err))
}

/** fetch() with optional local TLS agent for inventivelab HTTPS. */
export async function govibeFetch(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  const agent = getGovibeHttpsAgent()

  if (!agent) {
    try {
      return await fetch(url, init)
    } catch (err) {
      throw formatNetworkError(err)
    }
  }

  return new Promise<Response>((resolve, reject) => {
    try {
      const parsed = new URL(url)
      const method = (init.method || 'GET').toUpperCase()
      const headerBag = new Headers(init.headers)
      const headers: Record<string, string> = {}
      headerBag.forEach((value, key) => {
        headers[key] = value
      })

      const body =
        typeof init.body === 'string'
          ? init.body
          : init.body != null
            ? String(init.body)
            : undefined
      if (
        body != null &&
        !headers['content-length'] &&
        !headers['Content-Length']
      ) {
        headers['Content-Length'] = String(Buffer.byteLength(body))
      }

      const req = https.request(
        {
          protocol: parsed.protocol,
          hostname: parsed.hostname,
          port: parsed.port || 443,
          path: `${parsed.pathname}${parsed.search}`,
          method,
          headers,
          agent,
        },
        (res) => {
          const chunks: Buffer[] = []
          res.on('data', (chunk: Buffer) => chunks.push(chunk))
          res.on('end', () => {
            const status = res.statusCode ?? 0
            const buffer = Buffer.concat(chunks)
            const responseHeaders = new Headers()
            for (const [key, value] of Object.entries(res.headers)) {
              if (value == null) continue
              if (Array.isArray(value)) {
                for (const item of value) responseHeaders.append(key, item)
              } else {
                responseHeaders.set(key, value)
              }
            }
            // Fetch forbids a body on null-body statuses (204/205/304).
            const nullBody = status === 204 || status === 205 || status === 304
            resolve(
              new Response(nullBody ? null : buffer, {
                status,
                statusText: res.statusMessage,
                headers: responseHeaders,
              }),
            )
          })
        },
      )

      req.on('error', (err) => reject(formatNetworkError(err)))
      if (body != null) req.write(body)
      req.end()
    } catch (err) {
      reject(formatNetworkError(err))
    }
  })
}
