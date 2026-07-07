import { test, expect } from '@playwright/test';

test.describe('Conditional Login Flow', () => {
  test('admin and standard logins render the correct exclusive panel', async ({ page }) => {
    await page.goto('https://claude.ai/public/artifacts/1e02a9a5-4f20-4f19-a7ba-6c3f16c6eab9');

    // 1. Navigate to the Flaky Selectors tab
    await page.getByRole('button', { name: '🎯 Flaky Selectors' }).click();

    // 2. Click "Admin User" login button
    await page.getByRole('button', { name: "Admin User" }).click();

    // 3. Wait for dashboard to load (handle any loading state in between).
    const loadingIndicator = page.getByText(/loading/i);
    if (await loadingIndicator.count()) {
      await expect(loadingIndicator).toBeHidden();
    }

    const adminPanel = page.getByText("🔐 Admin Panel");
    const standardPanel = page.getByText("Standard access level");

    // 4. Verify the Admin Panel is visible, and the Standard Panel is not present.
    await expect(adminPanel).toBeVisible();
    await expect(standardPanel).toHaveCount(0);

    // 5. Click Logout
    await page.getByRole('button', { name: 'Logout' }).click();

    // Confirm we're back at a logged-out state before logging in again.
    await expect(page.getByRole('button', { name: 'Admin User' })).toBeVisible();

    // 6. Click "Standard User" login button
    await page.getByRole('button', { name: 'Standard User' }).click();

    if (await loadingIndicator.count()) {
      await expect(loadingIndicator).toBeHidden();
    }

    // 7. Verify the Standard Panel is visible, and the Admin Panel is not present.
    await expect(standardPanel).toBeVisible();
    await expect(adminPanel).toHaveCount(0);
  });
});
