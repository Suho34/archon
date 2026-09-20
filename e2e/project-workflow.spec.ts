import { expect, test } from "@playwright/test";

test("complete workflow: create project → add requirement → clarify", async ({
  page,
}) => {
  test.setTimeout(240000);
  const timestamp = Date.now();
  const email = `workflow-${timestamp}@example.com`;
  const projectName = `Archon Engine ${timestamp}`;
  const reqTitle = `Zero-Trust Edge Gateways ${timestamp}`;

  // 1. Sign up to get a fresh authenticated session
  await page.goto("/sign-up");
  await expect(page.locator("form")).toHaveAttribute("data-hydrated", "true");
  await expect(
    page.getByRole("button", { name: "Create account" }),
  ).toBeEnabled();

  await page.getByLabel("Name").fill("Workflow Architect");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("secure-password-1234");
  await page.getByRole("button", { name: "Create account" }).click();

  // 2. Arrive on dashboard
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 45000 });
  await expect(
    page.getByRole("heading", { name: "Your workspace" }),
  ).toBeVisible({ timeout: 20000 });

  // 3. Open Create Project dialog
  await page
    .getByRole("button", { name: /Create Your First Project|New Project/i })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Create New Project" }),
  ).toBeVisible();

  // 4. Fill project form
  await page.getByPlaceholder("e.g. NextGen Analytics").fill(projectName);
  await page.locator("select").first().selectOption("SaaS");
  await page
    .getByPlaceholder(/Brief description of the problem/i)
    .fill("Distributed real-time architectural engine");
  await page
    .getByPlaceholder(/Independent creators/i)
    .fill("Platform Architects");
  await page
    .getByPlaceholder(/10x developer productivity/i)
    .fill("Sub-50ms sync latency");
  await page
    .getByPlaceholder(/Next.js, TypeScript/i)
    .fill("Next.js, TypeScript, PostgreSQL");

  // 5. Submit project creation
  await page.getByRole("button", { name: "Create Project" }).click();

  // 6. Verify project card appears in the grid
  const projectCard = page
    .locator('[data-testid="project-card"]')
    .filter({ hasText: projectName });
  await expect(projectCard).toBeVisible({ timeout: 15000 });

  // 7. Navigate into project workspace
  await projectCard.getByRole("link", { name: /Workspace/i }).click();
  await expect(page).toHaveURL(/\/projects\/[a-zA-Z0-9_-]+$/, { timeout: 25000 });
  await expect(
    page.getByRole("heading", { name: projectName, exact: true }),
  ).toBeVisible({ timeout: 25000 });

  // 8. Add a new architectural specification (Requirement)
  await page
    .getByRole("button", { name: /Add Spec|New Spec/i })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Add New Requirement" }),
  ).toBeVisible();

  await page
    .getByPlaceholder(/Rate-limit public API endpoints/i)
    .fill(reqTitle);
  // Select Security category button
  await page.getByRole("button", { name: "Security" }).click();
  await page
    .getByPlaceholder(/Elaborate on the requirement/i)
    .fill(
      "All inbound requests must pass cryptographic token and mutual TLS validation.",
    );
  await page.getByRole("button", { name: "Create Requirement" }).click();

  // Wait for dialog to dismiss
  await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 25000 });

  // 9. Verify requirement appears in specifications list
  await expect(
    page.getByRole("heading", { name: reqTitle, exact: true }),
  ).toBeVisible({ timeout: 25000 });

  // 10. Trigger AI Clarification (Ambiguity Discovery)
  const discoverBtn = page
    .getByRole("button", {
      name: /Discover Ambiguities|Clarify Again/i,
    })
    .first();
  await expect(discoverBtn).toBeVisible({ timeout: 15000 });
  await discoverBtn.click();

  // 11. Verify clarification card appears
  const clarificationCard = page
    .locator('[data-testid="clarification-card"]')
    .first();
  await expect(clarificationCard).toBeVisible({ timeout: 120000 });

  // 12. Interact with clarification: select option and save answer
  const firstOption = clarificationCard
    .locator('[data-testid="option-button"]')
    .first();
  await expect(firstOption).toBeVisible({ timeout: 15000 });
  await firstOption.click();

  const saveBtn = clarificationCard.getByRole("button", {
    name: "Save Answer",
  });
  await expect(saveBtn).toBeVisible({ timeout: 10000 });
  await saveBtn.click();

  await expect(
    clarificationCard.getByText("Your Answer / Decision"),
  ).toBeVisible({ timeout: 15000 });
});
