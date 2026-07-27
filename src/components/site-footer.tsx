import { Github, Mail, Twitter } from "lucide-react"
import { Link } from "@/components/link"
import { NewsletterSignup } from "@/components/newsletter-signup"

export function SiteFooter() {
  // Compute inside the component: at module top-level the Cloudflare Workers
  // clock is frozen at the Unix epoch (1970) until the first request, which
  // would mismatch the client's real year and break hydration.
  const YEAR = new Date().getFullYear()

  return (
    <footer>
      <NewsletterSignup />

      <div className="border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <p>© 1999 - {YEAR} Nik Cubrilovic</p>
              <Link
                href="/privacy"
                className="transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
            </div>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/dir"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
                Twitter
              </a>
              <a
                href="https://github.com/nc9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="mailto:nik@nikcub.me"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
