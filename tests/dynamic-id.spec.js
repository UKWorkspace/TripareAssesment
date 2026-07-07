import { test, expect } from '@playwright/test';

test.describe('Dynamic ID Handling', () => {
  test('selecting "Beta" works after IDs are regenerated', async ({ page }) => {
    await page.goto('https://claude.ai/public/artifacts/1e02a9a5-4f20-4f19-a7ba-6c3f16c6eab9');

    // 1. Navigate to the Flaky Selectors tab
    await page.getByRole('button', { name: '🎯 Flaky Selectors' }).click();

    // 2. Click "Regenerate All IDs"
    await page.getByRole('button', { name: "🔄 Regenerate All IDs" }).click();

    // 3. Select the item named "Beta".

    const betaItem = page.getByText('Beta', { exact: true });
    await betaItem.click();

    // 4. Verify "Beta" is shown as selected.
    const betaContainer = page.locator(':has-text("Beta")').filter({ hasText: 'Beta' }).first();
    try {
      await expect(betaContainer).toHaveAttribute('aria-selected', 'true');
    } catch {

      await expect(page.getByText('beta.*selected|selected.*beta')).toBeVisible();
    }

  });
});
