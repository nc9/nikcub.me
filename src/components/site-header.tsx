import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="shrink-0">
              <Image
                src="/avatar.webp"
                alt="Nik Cubrilovic"
                width={56}
                height={56}
                className="aspect-square rounded-full ring-2 ring-highlight object-cover"
                priority
              />
            </Link>
            <div>
              <Link href="/" className="group">
                <div className="text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-highlight">
                  Nik Cubrilovic
                </div>
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">
                Engineer writing about AI, data & society
              </p>
            </div>
          </div>
          <nav className="flex gap-6 text-sm">
            <Link
              href="/posts"
              className="text-muted-foreground transition-colors hover:text-highlight"
            >
              Writing
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground transition-colors hover:text-highlight"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground transition-colors hover:text-highlight"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
