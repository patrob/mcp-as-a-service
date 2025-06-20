import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command:
      "NEXTAUTH_SECRET='test-secret-for-playwright' NEXTAUTH_URL='http://localhost:3000' npm run dev",
    port: 3000,
    env: {
      NEXTAUTH_SECRET: "test-secret-for-playwright",
      NEXTAUTH_URL: "http://localhost:3000",
    },
    reuseExistingServer: true,
  },
};

export default config;

