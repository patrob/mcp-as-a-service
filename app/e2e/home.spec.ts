import { test, expect } from '@playwright/test'

test('home page has title', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle(/mcp/i)
})
