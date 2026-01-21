import { Mail, Twitter, Github, Linkedin, Key } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Nik Cubrilovic for collaboration or media inquiries.",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nik Cubrilovic",
  url: "https://nikcub.me",
  email: "nik@nikcub.me",
  sameAs: [
    "https://twitter.com/dir",
    "https://github.com/nc9",
    "https://linkedin.com/in/nikcub",
    "https://en.wikipedia.org/wiki/Nik_Cubrilovic",
  ],
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Contact
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Interested in collaboration or have a media inquiry? Feel free to
              reach out.
            </p>
          </header>

          <div className="space-y-8">
            {/* Email */}
            <section className="rounded-sm border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-medium text-foreground">Email</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Best for detailed inquiries and collaboration
                  </p>
                  <a
                    href="mailto:nik@nikcub.me"
                    className="mt-3 inline-block text-sm text-primary transition-colors hover:text-primary/80"
                  >
                    nik@nikcub.me
                  </a>
                </div>
              </div>
            </section>

            {/* Social Links */}
            <section className="rounded-sm border border-border bg-card p-6">
              <h2 className="mb-4 font-medium text-foreground">
                Connect on Social
              </h2>
              <div className="space-y-4">
                <a
                  href="https://twitter.com/dir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Twitter className="h-5 w-5" />
                  <span>@dir on Twitter</span>
                </a>
                <a
                  href="https://github.com/nc9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com/in/nikcub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Linkedin className="h-5 w-5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </section>

            {/* GPG Key */}
            <section className="rounded-sm border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-medium text-foreground">
                    GPG Public Key
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    For encrypted communication
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded-sm bg-muted p-3 text-xs">
                    <code>{`-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEYWq0BBYJKwYBBAHaRw8BAQdAnYC7Rx+YTo8i98nNBnV2UoP8kIaL8LJYpkb5
lBTtCsy0FW5jOUBwbS5tZSA8bmM5QHBtLm1lPoiPBBAWCgAgBQJharQEBgsJBwgD
AgQVCAoCBBYCAQACGQECGwMCHgEAIQkQzncKOC7xDukWIQTHhqKQBJ61npWbso/O
dwo4LvEO6bytAQDTALStHYtERbfmo5Ocm4UIxedtGCl0q9jbbh13BaKBBAD7Bmcv
3YciQoxRBNZjmBNH16z//XqPpMlW0mEKq7vvmA20Hk5payBDdWJyaWxvdmljIDxu
aWtAbmlrY3ViLm1lPoiQBBMWCgA4FiEEx4aikASetZ6Vm7KPzncKOC7xDukFAmFq
tdoCGwMFCwkIBwMFFQoJCAsFFgIDAQACHgUCF4AACgkQzncKOC7xDum96QD+O9Ei
gIXi47PrjM/OKu4/GpQk/l4GmM1BGSvImezl+xQBAKzACJ7B33jIgP0K/qu1DZGs
Xl7MxbrdBRRKbzJQKTMGtB5OaWsgQ3Vicmlsb3ZpYyA8Z2l0QG5pa2N1Yi5tZT6I
kAQTFgoAOBYhBMeGopAEnrWelZuyj853Cjgu8Q7pBQJharYJAhsDBQsJCAcDBRUK
CQgLBRYCAwEAAh4FAheAAAoJEM53Cjgu8Q7pEY8A/30v7cjTYpJqPDRm53tadZ/V
Pl6ahcfsRy8ODz0n24KtAP0RBOh45qRcqTrxdy/WhH047kve1EtVDX8ey+WgZNXR
B7g4BGFqtAQSCisGAQQBl1UBBQEBB0BfkcxHlKuUPWxe799APmDwuezQ+QUBz/3S
co8lwJHwSgMBCAeIeAQYFggACQUCYWq0BAIbDAAhCRDOdwo4LvEO6RYhBMeGopAE
nrWelZuyj853Cjgu8Q7pgMMA/AnmRkfi5sb09JMLdnzkg9UmKHUpmsWFdilSBM4h
Wm6KAQD+28bIFRm/t8gGaIlVsL7eSmXSFYKaj5RrSMglX7OuCA==
=G+tQ
-----END PGP PUBLIC KEY BLOCK-----`}</code>
                  </pre>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
