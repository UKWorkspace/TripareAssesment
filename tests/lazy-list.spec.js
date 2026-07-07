import { test, expect } from "@playwright/test";

test.describe("Load and Verify List Items", () => {
  test("loading more items 3 times results in 15 items with mixed statuses", async ({
    page,
  }) => {
    await page.goto(
      "https://claude.ai/public/artifacts/1e02a9a5-4f20-4f19-a7ba-6c3f16c6eab9",
    );

    // 1. Navigate to the Timing Challenges tab
    await page.getByRole("button", { name: "⏱️ Timing Challenges" }).click();

    const loadMoreButton = page.getByRole("button", {
      name: "Load More Items",
    });
    const listItems = page.locator(
      '//*[@id="artifacts-component-root-react"]/div/main/div/div[2]/div[2]/div[2]/div/div[1]',
    );

    for (let i = 1; i <= 3; i++) {
      const expectedCount = i * 5; // adjust multiplier if the app loads a different batch size
      await loadMoreButton.click();

      const loadingIndicator = page.getByText('loader');
      if (await loadingIndicator.count()) {
        await expect(loadingIndicator).toBeHidden();
      }

      // Wait for the list to actually reflect the new batch before the next click.
      await expect(listItems).toHaveCount(expectedCount);
    }

    // 3. Verify exactly 15 items are displayed
    await expect(listItems).toHaveCount(15);

    // 4. Verify at least one item has status "active" and at least one "pending"
    await expect(page.getByText("active").first()).toBeVisible();
    await expect(page.getByText("pending").first()).toBeVisible();
  });
});
