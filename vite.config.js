import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/fedi-comments.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "lit",
        "lit/directives/unsafe-html.js",
        "lit/directives/when.js",
        "lit/decorators.js",
        "@github/relative-time-element",
      ],
    },
  },
  plugins: [dts()],
});
