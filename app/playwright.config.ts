import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  webServer: {
    command: 'npm run build && npm start',
    port: 3000,
    reuseExistingServer: true
  }
}

export default config
