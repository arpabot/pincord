import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: ["esnext"],
    outDir: "./build",
    emptyOutDir: true,
    rollupOptions: {},
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
  },
  esbuild: {
    minify: true,
  },
});
