import { createServiceAuthApi } from '@/lib/db/service-auth'
import { createDbClient } from '@/lib/db/postgrest'

/**
 * Service client for server reads/writes against VPS Postgres (PostgREST).
 * Never import in client components — or only via server-only call sites.
 * Does not touch next/headers so shared settings modules can import it.
 */
export function createServiceClient() {
  if (
    !process.env.GOVIBE_API_URL?.trim() ||
    !process.env.GOVIBE_SERVICE_KEY?.trim()
  ) {
    throw new Error(
      'Missing GoVibe API configuration (GOVIBE_API_URL / GOVIBE_SERVICE_KEY)',
    )
  }
  return createDbClient(createServiceAuthApi())
}
