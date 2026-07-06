import { cloudflare } from "@cloudflare/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { markdownContent } from "./plugins/vite-content"

// Plugin order: markdown (enforce:pre, compiles content/**/*.md(x) → {html,
// frontmatter}) → Cloudflare → TanStack Start → Tailwind → React. `resolve.alias
// '@'` is mandatory — the CF dev worker entry does not read tsconfig paths, so
// `@/...` imports fail in `vite dev` without it.
export default defineConfig({
  resolve: { alias: { "@": new URL("./src", import.meta.url).pathname } },
  plugins: [
    markdownContent(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    tailwindcss(),
    viteReact(),
  ],
})
