import { test, expect } from '@playwright/test';

test('homepage has title and login link', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Parking System/);

    // Check for Login link
    const loginLink = page.getByRole('link', { name: /Login/i });
    await expect(loginLink).toBeVisible();
});
