import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project utility scripts and design artifact not part of runtime app code.
    "check-supabase-schema.js",
    "verify-complete-schema.js",
    "verify-schema-direct.js",
    "verify-supabase-schema.js",
    "verify-supabase-schema.ts",
    "fitosys-ui-design.jsx",
  ]),
]);

export default eslintConfig;
