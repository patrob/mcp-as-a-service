import { test, expect, type Page } from "@playwright/test";

const mockLoggedInSession = async (page: Page) => {
  await page.route("**/api/auth/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        user: {
          id: "test-user-id",
          name: "Test User",
          email: "test@example.com",
          image: null,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      }),
    });
  });

  await page.route("**/api/auth/csrf", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        csrfToken: "mock-csrf-token",
      }),
    });
  });
};

const mockFeatureFlags = async (page: Page) => {
  await page.addInitScript(() => {
    (window as any).__FEATURE_FLAGS_OVERRIDE__ = {
      'auth-enabled': true,
      'dashboard-enabled': true,
    };
  });
};

const mockLoggedOutSession = async (page: Page) => {
  await page.route("**/api/auth/session", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(null),
    });
  });

  await page.route("**/api/auth/signout**", async (route) => {
    await route.fulfill({
      status: 302,
      headers: {
        Location: "/",
      },
    });
  });
};

test("can sign in and sign out with GitHub", async ({ page }) => {
  await page.goto("/");

  await mockFeatureFlags(page);
  await mockLoggedInSession(page);
  await page.reload();
  await expect(page.getByTestId("user-menu-trigger")).toBeVisible();

  await mockLoggedOutSession(page);
  await page.getByTestId("user-menu-trigger").click();
  await page.getByRole("menuitem", { name: "Sign Out" }).click();

  await page.reload();
  await expect(page.getByText("Sign In")).toBeVisible();

  await page.unroute("**/api/auth/session");
  await page.unroute("**/api/auth/signout**");
  await page.unroute("**/api/auth/csrf");
});

test("can sign in and sign out with Google", async ({ page }) => {
  await page.goto("/");

  await mockFeatureFlags(page);
  await mockLoggedInSession(page);
  await page.reload();
  await expect(page.getByTestId("user-menu-trigger")).toBeVisible();

  await mockLoggedOutSession(page);
  await page.getByTestId("user-menu-trigger").click();
  await page.getByRole("menuitem", { name: "Sign Out" }).click();

  await page.reload();
  await expect(page.getByText("Sign In")).toBeVisible();

  await page.unroute("**/api/auth/session");
  await page.unroute("**/api/auth/signout**");
  await page.unroute("**/api/auth/csrf");
});

