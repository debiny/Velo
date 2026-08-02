import { test, expect } from '../support/fixtures'

test('web app deve estar online', async ({ page }) => {
  await page.goto('/')


  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Velô by Papito/)
})


