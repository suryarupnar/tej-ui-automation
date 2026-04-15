import { loginData } from "../../data/login.factory";
import { test } from "../../fixtures"

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Auth - Login Flow (Data-Driven)', () => {

    for (const [scenarioname, data] of Object.entries(loginData)) {

        test(`${scenarioname} @smoke`, async ({ loginPage }) => {

            await loginPage.goto();

            // Action
            await loginPage.login(data.email, data.pass);

            // Assertions based on scenario name
            if (scenarioname === "validUser") {
                await loginPage.expectSuccess();
            }
            else if (['blankEmail', 'blankPass', 'blankBoth', 'invalidEmailFormat'].includes(scenarioname)) {
                if (scenarioname === 'blankEmail' || scenarioname === 'blankBoth') {
                    await loginPage.expectValidationError('Email ID is required')
                } else if (scenarioname === 'blankPass') {
                    await loginPage.passFieldBlur();
                    await loginPage.expectValidationError('Password is required')
                } else {
                    await loginPage.expectValidationError('Invalid email format')
                }
                await loginPage.expectLoginButtonEnabled(false);
            } else {
                await loginPage.expectLoginButtonEnabled(true);
                await loginPage.expectGlobalError();
            }

        })
    }
})
