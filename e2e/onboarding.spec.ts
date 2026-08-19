import { test, expect } from "@playwright/test";

// Full onboarding journey against the running iokeep app:
// create an account -> log in -> create a folder -> add a few sample notes.
//
// The backend must be reachable (see playwright.config.ts webServer env).
// A unique username per run keeps this repeatable against the same backend.

const password = "SuperSecret123!";
const username = `e2e_${Date.now()}`;
const folderName = "Automation Folder";
const noteTitles = ["Standup Notes", "Groceries", "Project Ideas"];

test("create account, log in, create a folder and add sample notes", async ({
  page,
}) => {
  await test.step("sign up for a new account", async () => {
    await page.goto("/signup");

    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Password", { exact: true }).fill(password);
    await page.getByPlaceholder("Confirm Password").fill(password);

    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  await test.step("log in", async () => {
    await page.getByPlaceholder("Username").fill(username);
    await page.getByPlaceholder("Password", { exact: true }).fill(password);

    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/app/);
  });

  await test.step("create a folder", async () => {
    await page.getByRole("button", { name: "Create Folder" }).click();

    await page.getByPlaceholder("folder name").fill(folderName);
    await page.getByPlaceholder("folder name").press("Enter");

    const folderButton = page.getByRole("button", { name: folderName });
    await expect(folderButton).toBeVisible();

    // Select the new folder so the notes land inside it (not in "Default").
    await folderButton.click();
  });

  await test.step("add sample notes inside the folder", async () => {
    // The note-manager "+" button is the icon-only faPlus in the middle panel
    // (the left "Create Folder" button also uses faPlus, hence `.last()`).
    const addNoteButton = page.locator('button:has(svg[data-icon="plus"])').last();
    const saveButton = page.locator('button:has(svg[data-icon="floppy-disk"])');
    const editor = page.locator('[contenteditable="true"]');

    for (const title of noteTitles) {
      await addNoteButton.click();
      await editor.click();
      await page.keyboard.type(title);
      await saveButton.click();

      // Each saved note appears in the note list as a button whose accessible
      // name contains its title.
      await expect(
        page.getByRole("button", { name: new RegExp(title) })
      ).toBeVisible();
    }
  });
});
