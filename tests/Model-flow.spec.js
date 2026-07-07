import { test, expect } from '@playwright/test';

test.describe('Modal Confirmation Flow', () => {
  test('nested modal confirm closes both modals and shows confirmed result', async ({ page }) => {
    await page.goto('https://claude.ai/public/artifacts/1e02a9a5-4f20-4f19-a7ba-6c3f16c6eab9');

    // 1. Navigate to the Responsive tab
    await page.getByRole('tab', { name: 'responsive' }).click();

    // 2. Click "Open Modal"
    await page.getByRole('button', { name: 'Open Modal' }).click();



    // 3. In the modal, click "Show Details".

    await firstModal.getByRole('button', { name: 'Show Details' }).click();



    // 4. In the nested modal, click "Confirm"
    await nestedModal.getByRole('button', { name: 'Confirm' }).click();

    // 5. Verify both modals close
    await expect(page.getByRole('dialog')).toHaveCount(0);

    // 6. Verify result shows "confirmed"
    await expect(page.getByText('confirmed')).toBeVisible();
  });
});
