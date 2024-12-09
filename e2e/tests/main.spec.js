// @ts-check
const { test, expect } = require('@playwright/test');

test('/ redirects to /movies', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(new RegExp('^https?:\\/\\/[^\\/]+\\/movies$'))
});

test('homepage loads', async ({ page }) => {
  await page.goto('/movies');
  await expect(page).toHaveTitle('Currently playing');
  await expect(page.locator('h2')).toHaveText('Currently playing');
  await expect(page.locator('[data-testid=movie-list] div div')).toHaveCount(12)
});

test('makes reservation', async ({ page }) => {
  await page.goto('/movies');
  await page.locator('a').filter({hasText: 'Get Tickets'}).click()
  await expect(page.locator('h2')).toHaveText('Upcoming showings');
  await page.locator('h2 + div a').first().click()
  await expect(page.locator('h2')).toHaveText(new RegExp('^Showtime: .+$'));
  await page.locator('.grid button:not(.bg-gray-500)').first().click()
  await page.getByText('Next').click()
  await page.locator('input[type="email"]').fill('user@example.com')
  await page.locator('button[type="submit"]').click()
  await expect(page.locator('img[alt="reservation qr code"]')).toBeVisible()
});
