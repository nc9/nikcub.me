import { Link as TSLink } from "@tanstack/react-router"
import type { AnchorHTMLAttributes } from "react"

/**
 * Drop-in replacement for `next/link`. Accepts `href`; renders a TanStack Router
 * `Link` for internal paths (client nav + intent preload) and a plain `<a>` for
 * external, mailto/tel and hash links. `to` is loosely typed — routes are
 * validated by hand; the runtime accepts any path string.
 */
const RouterLink = TSLink as unknown as React.FC<
  { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>
>

type LinkProps = { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>

export function Link({ href, children, ...props }: LinkProps) {
  const external = /^(https?:|mailto:|tel:|#)/.test(href)
  if (external) {
    const rel =
      /^https?:/.test(href) && props.target === "_blank"
        ? "noopener noreferrer"
        : props.rel
    return (
      <a href={href} {...props} rel={rel}>
        {children}
      </a>
    )
  }
  return (
    <RouterLink to={href} {...props}>
      {children}
    </RouterLink>
  )
}

export default Link
