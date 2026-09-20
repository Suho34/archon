import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Archon/i);
  await expect(
    page.getByRole("heading", { name: /calmer place to do your best work/i }),
  ).toBeVisible();
});
