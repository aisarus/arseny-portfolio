// @lovable.dev/vite-tanstack-config already includes the framework plugins.
// Keep Lovable's normal SSR target untouched, but emit a prerendered static build
// when CI sets PAGES_STATIC_BUILD=true. Public case-study pages are copied as static files,
// so the TanStack prerenderer must not crawl them as application routes.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isPagesBuild = process.env.PAGES_STATIC_BUILD === "true";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    ...(isPagesBuild
      ? {
          prerender: {
            enabled: true,
            autoStaticPathsDiscovery: false,
            crawlLinks: false,
            failOnError: true,
          },
          pages: [{ path: "/" }, { path: "/cv" }],
        }
      : {}),
  },
  ...(isPagesBuild
    ? {
        // Static verification leaves TanStack's prerendered client output in dist/client.
        nitro: false,
        vite: { base: "/arseny-portfolio/" },
      }
    : {}),
});
