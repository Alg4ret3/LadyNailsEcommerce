import { test, expect } from '@playwright/test';

test('Home page should have correct title and hero section', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Lady Nails/);

  // Check for the main hero heading
  const heroHeading = page.locator('h1');
  await expect(heroHeading).toBeVisible();
});

test('Navbar navigation to shop', async ({ page }) => {
  await page.goto('/');

  // Find the "PRODUCTOS" link in navbar (desktop)
  const shopLink = page.getByRole('link', { name: /PRODUCTOS/i }).first();
  await shopLink.click();

  // Expect URL to change to shop
  await expect(page).toHaveURL(/\/shop/);
});

test('Mobile navigation drawer', async ({ page, isMobile }) => {
  if (!isMobile) return;

  await page.goto('/');

  // Click hamburger menu
  await page.getByRole('button', { name: /menu/i }).click();

  // Check if drawer is visible
  const drawer = page.locator('div.fixed.right-0');
  await expect(drawer).toBeVisible();
});
