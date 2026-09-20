import { expect, test } from "@playwright/test";

test("user can create, view, edit, and delete projects in the dashboard grid", async ({
  page,
}) => {
  test.setTimeout(90000);
  const email = `projects-e2e-${Date.now()}@example.com`;

  // 1. Sign up to get a fresh authenticated session
  await page.goto("/sign-up");
  await expect(page.locator("form")).toHaveAttribute("data-hydrated", "true");
  await expect(
    page.getByRole("button", { name: "Create account" }),
  ).toBeEnabled();

  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  await page.getByLabel("Name").fill("Project Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("secure-password-1234");
  await page.getByRole("button", { name: "Create account" }).click();

  // 2. Arrive on dashboard
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 35000 });
  await expect(
    page.getByRole("heading", { name: "Your workspace" }),
  ).toBeVisible({ timeout: 15000 });

  // 3. Verify empty state initially
  await expect(
    page.getByRole("heading", { name: "No projects created yet" }),
  ).toBeVisible();

  // 4. Open Create Project dialog
  await page.getByRole("button", { name: /Create Your First Project/i }).click();
  await expect(
    page.getByRole("heading", { name: "Create New Project" }),
  ).toBeVisible();

  // 5. Fill project form
  await page.getByPlaceholder("e.g. NextGen Analytics").fill("E2E Archon Cloud");
  await page.locator("select").first().selectOption("SaaS");
  await page
    .getByPlaceholder(/Brief description of the problem/i)
    .fill("Real-time distributed collaboration engine");
  await page
    .getByPlaceholder(/Independent creators/i)
    .fill("Enterprise Devs");
  await page
    .getByPlaceholder(/10x developer productivity/i)
    .fill("Sub-10ms sync latency");
  await page
    .getByPlaceholder(/Serverless only/i)
    .fill("Zero downtime guarantee");
  await page
    .getByPlaceholder(/Next.js, TypeScript/i)
    .fill("Next.js, Tailwind, Prisma, PostgreSQL");
  await page
    .getByPlaceholder(/e.g. \$5,000/i)
    .fill("$20,000");

  // 6. Submit creation
  await page.getByRole("button", { name: "Create Project" }).click();

  // 7. Verify project card appears in the grid
  const projectCard = page.locator('[data-testid="project-card"]');
  await expect(projectCard).toBeVisible({ timeout: 15000 });
  await expect(projectCard.getByText("E2E Archon Cloud")).toBeVisible();
  await expect(projectCard.getByText("SaaS")).toBeVisible();
  await expect(projectCard.getByText("Next.js")).toBeVisible();
  await expect(projectCard.getByText("$20,000")).toBeVisible();

  // 8. View details dialog
  await projectCard.getByText("E2E Archon Cloud").click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "E2E Archon Cloud" }),
  ).toBeVisible();
  await expect(page.getByText("Sub-10ms sync latency")).toBeVisible();
  await expect(page.getByText("Enterprise Devs")).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();

  // 9. Edit project
  await projectCard.getByLabel("Project actions").click();
  await page.getByRole("button", { name: "Edit Project" }).click();
  await expect(
    page.getByRole("heading", { name: /Edit E2E Archon Cloud/i }),
  ).toBeVisible();

  const nameInput = page.getByRole("dialog").locator('input[type="text"]').first();
  await nameInput.fill("E2E Archon Cloud (Updated)");
  await page.getByRole("button", { name: "Save Changes" }).click();

  // Verify updated title in card
  await expect(
    projectCard.getByText("E2E Archon Cloud (Updated)"),
  ).toBeVisible({ timeout: 10000 });

  // 10. Delete project
  await projectCard.getByLabel("Project actions").click();
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete Project" }).click();

  // Verify project is removed and empty state returns
  await expect(
    page.getByRole("heading", { name: "No projects created yet" }),
  ).toBeVisible({ timeout: 10000 });
});
