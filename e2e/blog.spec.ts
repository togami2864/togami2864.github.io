import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/blog/');
});

test('blog', async ({ page }) => {
  const blogTitles = page.locator('.article_title');
  await blogTitles.nth(0).click();
  await expect(page).toHaveURL(/posts/);
  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL('http://localhost:3000/blog');

  await page.getByRole('link', { name: 'Read more' }).click();
  await expect(page).toHaveURL(/posts\/*/);
  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL('http://localhost:3000/blog');
});
