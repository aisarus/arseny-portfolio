import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const isStaticVerification = process.env.PAGES_STATIC_BUILD === "true";

export default defineConfig({
  base: isStaticVerification ? "/arseny-portfolio/" : "/",
  resolve: {
    // Vite 8 resolves paths from tsconfig natively; no vite-tsconfig-paths plugin required.
    tsconfigPaths: true,
  },
  build: {
    assetsInlineLimit: 0,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(
      isStaticVerification
        ? {
            prerender: {
              enabled: true,
              autoStaticPathsDiscovery: false,
              crawlLinks: false,
              failOnError: true,
            },
            pages: [{ path: "/" }, { path: "/cv" }],
          }
        : {},
    ),
    ...(isStaticVerification ? [] : [nitro()]),
    viteReact(),
  ],
});
