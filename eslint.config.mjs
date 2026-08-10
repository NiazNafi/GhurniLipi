import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /**
       * This project ships its own image pipeline: scripts/prepare-assets.mjs
       * emits colour-corrected webp at the exact widths the layout uses, and
       * src/data/media-manifest.json carries the srcset and blur placeholder
       * for each one. Plain <img> consumes that directly. next/image would
       * re-encode already-final files and add a server hop, so the rule is off
       * on purpose rather than warned about in four places.
       */
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
