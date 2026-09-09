// @lovable.dev/vite-tanstack-config already includes the framework plugins.
// Keep Lovable's normal SSR target untouched, but emit a prerendered static build
// when GitHub Pages CI sets PAGES_STATIC_BUILD=true.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isPagesBuild = process.env.PAGES_STATIC_BUILD === "true";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    ...(isPagesBuild
      ? {
          prerender: {
            enabled: true,
            autoStaticPathsDiscovery: true,
            crawlLinks: true,
            failOnError: true,
          },
          pages: [{ path: "/" }, { path: "/cv" }],
        }
      : {}),
  },
  ...(isPagesBuild
    ? {
        // GitHub Pages only serves static files. Skipping Nitro leaves TanStack's
        // prerendered client output in dist/client.
        nitro: false,
        vite: { base: "/arseny-portfolio/" },
      }
    : {}),
});
