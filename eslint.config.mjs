import { fileURLToPath } from "node:url"
import { dirname } from "node:path"

import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
})

export default [
  {
    ignores: [
      "node_modules/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "generated/**",
      "**/*.pb.js",
      "**/.env.*",
      ".eslintrc.*",
      "eslint.config.*",
      "prettier.config.*",
      "package-lock.json"
    ]
  },
  {
    files: ["src/**/*.ts"]
  },
  ...compat.config({
    extends: ["./.eslintrc.js"]
  }),
  {
    files: ["eslint.config.*", ".eslintrc.*", "prettier.config.*"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "import/no-commonjs": "off",
      "no-undef": "off"
    }
  }
]
