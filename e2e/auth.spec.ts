import { expect, test } from "@playwright/test";

test("a user can sign up and reach the dashboard", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;

  await page.goto("/sign-up");
  await expect(page.locator("form")).toHaveAttribute("data-hydrated", "true");
  await expect(
    page.getByRole("button", { name: "Create account" }),
  ).toBeEnabled();

  await page.getByLabel("Name").fill("E2E User");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("correct-horse-battery-staple");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 25000 });
  await expect(
    page.getByRole("heading", { name: "Your workspace" }),
  ).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(email)).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL(/\/sign-in$/, { timeout: 15000 });
});
