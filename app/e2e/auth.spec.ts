import { test, expect, type Page } from "@playwright/test";

const login = async (page: Page) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Continue with GitHub" }).click();
  await page.waitForURL("/");
};

test("can sign in and sign out", async ({ page }) => {
  await login(page);
  await page.getByTestId("user-menu-trigger").click();
  await page.getByRole("menuitem", { name: "Sign Out" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByText("Sign In")).toBeVisible();
});

test("can sign in with Google button", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Continue with Google" }).click();
  await page.waitForURL("/");
  await expect(page.getByTestId("user-menu-trigger")).toBeVisible();
});

