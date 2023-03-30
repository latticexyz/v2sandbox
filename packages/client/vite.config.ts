import { defineConfig } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";

export default defineConfig({
  server: {
    port: 3000,
    fs: {
      strict: false,
    },
  },
  plugins: [dynamicImport()],
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
    },
  },
  build: {
    rollupOptions: {
      // TODO: revisit this config after splitting out mud config dependencies
      // from the cli package so we don't need to bundle the cli package
      external: ["chalk", "locate-path", "path-exists", "find-up"],
    },
    target: "es2022",
  },
  define: {
    "process.env": {},
  },
});
