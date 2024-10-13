import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      enabled: true,
      provider: "v8",
      reportsDirectory: "./.coverage",
      include: ["src/**"],
    },
  },
});
