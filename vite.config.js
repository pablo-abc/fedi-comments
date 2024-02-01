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
        "@github/relative-time-element",
        "@open-wc/scoped-elements/lit-element.js",
      ],
    },
  },
  plugins: [dts()],
});
