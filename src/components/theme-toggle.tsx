import { Moon, Sun } from "lucide-react"

/**
 * Light/dark switch. The no-flash boot script in __root.tsx reads the same
 * localStorage key before paint, so an explicit choice here sticks across
 * loads; with no stored choice the OS setting wins. Icons are CSS-driven off
 * the root `.dark` class, so SSR and hydration always agree.
 */
function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark")
  try {
    localStorage.setItem("theme", dark ? "dark" : "light")
  } catch {
    // Private mode without storage: the toggle still works for this page view.
  }
}

export function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle light/dark mode"
      className="text-muted-foreground transition-colors hover:text-highlight"
    >
      <Sun aria-hidden="true" className="hidden h-4 w-4 dark:block" />
      <Moon aria-hidden="true" className="h-4 w-4 dark:hidden" />
    </button>
  )
}
