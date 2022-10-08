import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('Home has the title and links to itself and blog', async ({ page }) => {
  await page.getByRole('link', { name: 'togami2864' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page).toHaveURL('http://localhost:3000/');
  await page.getByRole('link', { name: 'Blog' }).click();
  await expect(page).toHaveURL('http://localhost:3000/blog');
});

test('move to /ja by changing the selector', async ({ page }) => {
  await page.locator('select').selectOption('ja');
  await expect(page).toHaveURL('http://localhost:3000/ja/');
});
