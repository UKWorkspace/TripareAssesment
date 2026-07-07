# Hotel Recommendation App — Playwright UI Automation

Playwright test suite covering 5 required flows in the test application:
Timing Challenges, Flaky Selectors, and Responsive tabs.

**App under test:** https://claude.ai/public/artifacts/1e02a9a5-4f20-4f19-a7ba-6c3f16c6eab9

## Prerequisites
- Node.js 18+
- npm

## Setup
```bash
npm install
npx playwright install --with-deps chromium
```

## Run all tests
```bash
npx playwright test
```

## Other useful commands
```bash
npx playwright test --headed          # watch the browser while tests run
npx playwright test --ui              # interactive UI mode
npx playwright test tests/modal-flow.spec.ts   # run a single file
npx playwright show-report            # view the HTML report after a run
```

## Project structure
```
playwright.config.ts
package.json
tests/
  delayed-button.spec.ts       # Test 1: Delayed Button Flow
  lazy-list.spec.ts            # Test 2: Load and Verify List Items
  dynamic-ids.spec.ts          # Test 3: Dynamic ID Handling
  conditional-render.spec.ts   # Test 4: Conditional Login Flow
  modal-flow.spec.ts           # Test 5: Modal Confirmation Flow
```

## What each test covers

| File | Flow | Key acceptance criteria handled |
|---|---|---|
| `delayed-button.spec.ts` | Start Process → wait for Confirm Action to become enabled → click → success message | No `waitForTimeout`; waits on `toBeEnabled()`, not just visibility |
| `lazy-list.spec.ts` | Click "Load More Items" 3x → 15 items total, mixed "active"/"pending" statuses | Waits for each batch's loading state to clear before the next click |
| `dynamic-ids.spec.ts` | Regenerate All IDs → select "Beta" → verify selected | Selects by visible text/accessible name, never by `id` |
| `conditional-render.spec.ts` | Log in as Admin → verify Admin Panel only → logout → log in as Standard → verify Standard Panel only | Waits out any loading state between login and dashboard; asserts the *other* panel has zero count, not just that one is visible |
| `modal-flow.spec.ts` | Open Modal → Show Details (nested modal) → Confirm → both close → "confirmed" result | Scopes clicks to `page.getByRole('dialog').last()` so actions land on the correct top layer instead of clicking through to the modal underneath |

## Design principles used throughout
- **No hardcoded waits** — every wait is an auto-retrying Playwright `expect(...)` assertion (`toBeVisible`, `toBeEnabled`, `toHaveCount`, `toBeHidden`), which polls until the condition is true or the timeout elapses.
- **Resilient selectors** — locators use accessible roles and visible text (`getByRole`, `getByText`) rather than CSS classes or DOM `id`s, so tests keep passing across ID regeneration or minor markup changes.
- **Layer-aware modal handling** — nested dialogs are targeted via `.last()` on the dialog role so clicks never leak through to a background modal.
- **Negative assertions for conditional UI** — conditional-render checks use `toHaveCount(0)` on the panel that should be absent, not just visibility of the one that should be present, to catch cases where both accidentally render.

## Note on selectors
The app under test is a client-rendered SPA, so its live DOM/`data-testid` attributes weren't directly inspectable while writing this suite. Selectors are built from the button labels, tab names, and dialog roles described in the assignment brief. If the app exposes `data-testid` attributes, consider swapping the `getByRole`/`getByText` locators for `page.getByTestId(...)` for additional resilience — recommended before the interview verification pass.

## CI notes
`playwright.config.ts` is set up for reliability in CI:
- `retries: 1` on CI only
- Trace, screenshot, and video captured only on failure, for fast debugging
- `fullyParallel: true` for faster runs

To confirm consistency (e.g., for Test 1's "must pass across 10 consecutive runs" criterion):
```bash
npx playwright test tests/delayed-button.spec.ts --repeat-each=10
```
