import { test, expect } from "@playwright/test";

test("home page has title", async ({ page }) => {
  await page.unroute("**/*");
  await page.goto("/");
  await expect(page).toHaveTitle(/MyMCP/i);
});

