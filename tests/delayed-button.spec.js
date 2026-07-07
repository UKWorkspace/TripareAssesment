import { test, expect } from '@playwright/test';



test.describe('Delayed Button Flow', () => {
  test('confirm button only becomes clickable once enabled, then shows success', async ({ page }) => {
    await page.goto('https://claude.ai/public/artifacts/1e02a9a5-4f20-4f19-a7ba-6c3f16c6eab9');

    // 1. Navigate to the Timing Challenges tab
    await page.getByRole('button', { name: '⏱️ Timing Challenges' }).click();

    // 2. Click "Start Process"
    const startButton = page.getByRole('button', { name: 'Start Process' });
    await expect(startButton).toBeVisible();
    await startButton.click();

    // 3. Wait for the "Confirm Action" button to become enabled (not just visible).
    // Playwright's toBeEnabled() polls/auto-retries until the assertion passes or
    // the test/expect timeout is hit — no manual waitForTimeout is used.
    const confirmButton = page.getByRole('button', { name: '✓ Confirm Action' });
    await expect(confirmButton).toBeVisible();
    await expect(confirmButton).toBeEnabled();

    // 4. Click the confirm button
    await confirmButton.click();

    // 5. Verify the success message appears
    await expect(page.getByText('Action Confirmed Successfully!')).toBeVisible();
  });
});
