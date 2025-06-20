import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  reporter: [["list"], ["html", { outputFolder: "playwright-report" }]],
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: [
            "--disable-web-security",
            "--disable-dev-shm-usage",
            "--disable-cache",
            "--disable-application-cache",
            "--disable-offline-load-stale-cache",
            "--disable-background-networking",
          ],
        },
      },
    },
  ],
  webServer: {
    command:
      "NEXTAUTH_SECRET='test-secret-for-playwright' NEXTAUTH_URL='http://localhost:3000' npm run dev",
    port: 3000,
    env: {
      NEXTAUTH_SECRET: "test-secret-for-playwright",
      NEXTAUTH_URL: "http://localhost:3000",
    },
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
};

export default config;

