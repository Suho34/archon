import { expect, test } from "@playwright/test";

test("verify voice studio textarea and modal rendering", async ({ page }) => {
  test.setTimeout(60000);
  const email = `voice-test-${Date.now()}@example.com`;

  await page.goto("/sign-up");
  await expect(page.locator("form")).toHaveAttribute("data-hydrated", "true");

  await page.getByLabel("Name").fill("Voice Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("secure-password-1234");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 35000 });

  // Open Create Project Dialog
  await page.getByRole("button", { name: "New Project" }).first().click();
  await expect(page.getByRole("heading", { name: "Create New Project" })).toBeVisible();

  // Verify Archon Voice Studio banner and header
  await expect(page.getByText("ARCHON VOICE STUDIO")).toBeVisible();
  await expect(page.getByText("Voice Brain Dump")).toBeVisible();
  await expect(page.getByRole("button", { name: /Speak Your Vision/i })).toBeVisible();

  // Verify the dedicated textarea exists, is visible, and accepts input
  const textarea = page.locator("textarea").first();
  await expect(textarea).toBeVisible();
  await textarea.fill("Build an AI-powered voice agent for automated architecture reviews using Next.js and Gemini");
  await expect(textarea).toHaveValue("Build an AI-powered voice agent for automated architecture reviews using Next.js and Gemini");

  // Verify Auto-Fill button is enabled
  const autoFillBtn = page.getByRole("button", { name: /Auto-Fill Form with AI/i });
  await expect(autoFillBtn).toBeEnabled();

  // Verify the divider is visible
  await expect(page.getByText("Or Configure Project Manually")).toBeVisible();

  // Capture screenshot of the modal
  await page.screenshot({
    path: "C:/Users/suhai/.gemini/antigravity-ide/brain/9fd0e77e-e18e-4757-960d-987527721714/voice_studio_modal_verified.png",
    fullPage: false,
  });
});
