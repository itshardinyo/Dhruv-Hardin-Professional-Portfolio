import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Pasted components keep their own ref-in-render patterns (rule 2: keep them exactly), and the site reads
    // browser-only values (matchMedia, fonts) in effects on mount. Both are deliberate, so these are warnings.
    rules: { "react-hooks/refs": "warn", "react-hooks/set-state-in-effect": "warn" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "postcss.config.mjs",
  ]),
]);

export default eslintConfig;
