import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command:
      "NEXT_PUBLIC_TEST_SESSION=true NEXTAUTH_SECRET='test-secret-for-playwright' npm run dev",
    port: 3000,
    env: {
      NEXT_PUBLIC_TEST_SESSION: "true",
      NEXTAUTH_SECRET: "test-secret-for-playwright",
    },
    reuseExistingServer: true,
  },
};

export default config;

