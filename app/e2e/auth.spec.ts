import { test, expect } from '@playwright/test'

const login = async (page) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Continue with GitHub' }).click()
  await page.waitForURL('/')
}

test('can sign in and sign out', async ({ page }) => {
  await login(page)
  await page.getByTestId('user-menu-trigger').click()
  await page.getByRole('menuitem', { name: 'Sign Out' }).click()
  await expect(page).toHaveURL('/')
  await expect(page.getByText('Sign In')).toBeVisible()
})
