import { test as setup } from "../../fixtures"; // import your custom fixtures!

setup('login and save session', async ({ loginPage, page }) => {
    // Use your existing page object methods!
    await loginPage.goto();
    await loginPage.login(process.env.SETUP_EMAIL!, process.env.VALID_PASSWORD!);
    await loginPage.expectSuccess();

    // Save the logged-in state
    await page.context().storageState({ path: 'auth/user.json' });
});
