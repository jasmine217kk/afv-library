import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["tests/*/{skill-tests,script-tests}/**/*.test.{ts,js}"],
    exclude: ["**/node_modules/**", "**/.git/**", "tests/.*/**"],
    globals: true,
    testTimeout: 30_000,
  },
})
