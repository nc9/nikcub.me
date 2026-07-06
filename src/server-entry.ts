import handler from "@tanstack/react-start/server-entry"

/**
 * Custom Worker entry. Delegates to the TanStack Start handler and adds baseline
 * security headers to every response. Once the domain is cut over, the www host
 * is 301'd to the apex here (no-op on the workers.dev preview).
 */
const APEX = "nikcub.me"

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ")

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CSP,
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
}

const tanstack = handler as {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response>
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const url = new URL(request.url)
    if (url.hostname === `www.${APEX}`) {
      url.hostname = APEX
      return Response.redirect(url.toString(), 301)
    }

    const res = await tanstack.fetch(request, env, ctx)
    const headers = new Headers(res.headers)
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v)
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers,
    })
  },
}
