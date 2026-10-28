import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";

test("organizer creates an event optimistically and it persists after reload", async ({
  page,
}) => {
  const title = `E2E event ${randomUUID()}`;
  let releaseRequest = () => {};
  const requestGate = new Promise<void>((resolve) => {
    releaseRequest = resolve;
  });

  await page.route("**/dashboard**", async (route) => {
    if (route.request().method() === "POST") await requestGate;
    await route.continue();
  });

  await page.goto("/login");
  await page.getByLabel("Dashboard password").fill("demo-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  const createForm = page
    .locator("form")
    .filter({ has: page.getByRole("heading", { name: "Create an event" }) });

  await createForm.getByLabel("Event title").fill(title);
  await createForm
    .getByLabel("Description", { exact: true })
    .fill("A Playwright test event that verifies the full create flow.");
  await createForm.getByLabel("Category").fill("testing");
  await createForm.getByLabel("Date and time").fill("2027-06-15T18:00");
  await createForm.getByLabel("Location").fill("Online");
  await createForm.getByLabel("Seat capacity").fill("25");
  await createForm.getByRole("button", { name: "Publish event" }).click();

  const eventTitle = page.locator("strong").filter({ hasText: title });
  await expect(eventTitle).toBeVisible();
  await expect(page.getByText("Saving…")).toBeVisible();
  releaseRequest();

  await expect(page.getByText("Saving…")).toHaveCount(0);
  await expect(eventTitle).toBeVisible();
  await page.reload();
  await expect(page.locator("strong").filter({ hasText: title })).toBeVisible();
});
