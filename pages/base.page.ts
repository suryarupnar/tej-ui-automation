import { expect, type Page, type Locator } from "@playwright/test";

export class BasePage {
    readonly page : Page;

    constructor(page : Page){
        this.page = page;
    }

    /**
     * Unified smart selector for MUI combobox fields via a direct Locator.
     */
    async selectByLocator(trigger: Locator, value: string | string[] | undefined) {
        if (!value || (Array.isArray(value) && value.length === 0)) return;

        if (Array.isArray(value)) {
            for (const val of value) {
                await this.selectByLocator(trigger, val);
            }
            await this.page.keyboard.press('Escape');
            return;
        }

        // Wait for element to be attached
        await trigger.waitFor({ state: 'attached', timeout: 2000 }).catch(() => {});
        
        if (await trigger.count() === 0) {
            console.warn(`      ⚠ Skip: Locator not found.`);
            return;
        }

        if (await trigger.isDisabled()) {
            console.log(`      - Skipping disabled field.`);
            return;
        }

        const tagName = await trigger.evaluate(e => e.tagName.toLowerCase()).catch(() => 'div');
        const inputLocator = (tagName === 'input' || tagName === 'textarea') 
            ? trigger 
            : trigger.locator('input').first();

        // Wait for it to be visible & editable
        await inputLocator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        const isInput = await inputLocator.count() > 0 && await inputLocator.isVisible();

        if (isInput) {
            console.log(`      - Autocomplete: "${value}"`);
            // Fill and explicitly click the matching option
            await inputLocator.fill(value, { timeout: 5000 }).catch((e) => {
                console.warn(`      ⚠ Skip: Failed to fill input for "${value}".`);
                return;
            });
            
            // Force the listbox to render safely
            await this.page.keyboard.press('ArrowDown').catch(() => {});
            
            // Click the option that matches the text. Try exact match first, fall back to partial.
            const listbox = this.page.getByRole('listbox');
            const exactOption = listbox.getByRole('option', { name: value, exact: true });
            
            if (await exactOption.count() > 0) {
                await exactOption.first().click({ timeout: 5000 }).catch((e) => {
                    console.warn(`      ⚠ Skip: Exact option "${value}" found but not clickable.`);
                });
            } else {
                const partialOption = listbox.getByRole('option', { name: value, exact: false });
                await partialOption.first().click({ timeout: 5000 }).catch((e) => {
                    console.warn(`      ⚠ Skip: Option "${value}" not found in listbox.`);
                });
            }
        } else {
            console.log(`      - Dropdown: "${value}"`);
            // Select: Click dropdown and click matching option
            await trigger.click({ timeout: 5000 }).catch((e) => {
                console.warn(`      ⚠ Skip: Trigger for "${value}" not clickable.`);
                return;
            });
            
            const listbox = this.page.getByRole('listbox');
            const exactOption = listbox.getByRole('option', { name: value, exact: true });

            if (await exactOption.count() > 0) {
                await exactOption.first().click({ timeout: 5000 }).catch((e) => {
                    console.warn(`      ⚠ Skip: Exact option "${value}" found but not clickable.`);
                });
            } else {
                const partialOption = listbox.getByRole('option', { name: value, exact: false });
                await partialOption.first().click({ timeout: 5000 }).catch((e) => {
                    console.warn(`      ⚠ Skip: Option "${value}" not found in dropdown.`);
                });
            }
        }
    }

    /**
     * Unified smart selector for MUI combobox fields by testId (Legacy Wrapper).
     */
    async selectByTestId(testId: string, value: string | string[] | undefined) {
        if (!value || (Array.isArray(value) && value.length === 0)) return;
        const escapedId = testId.replace(/\./g, '\\.');
        const trigger = this.page.getByTestId(testId).or(this.page.locator(`#${escapedId}`)).first();
        await this.selectByLocator(trigger, value);
    }

    /**
     * Explicit alias for MUI Select fields.
     */
    async selectFromDropdown(testId: string, value: string | undefined) {
        if (value) await this.selectByTestId(testId, value);
    }

    /**
     * Clicks the dropdown and selects the very first option available in the list.
     * Useful for fields that just need 'any' value to enable dependent fields.
     */
    async selectFirstAvailableOption(trigger: Locator) {
        console.log(`      - Selecting first available option...`);
        
        // Ensure the list is open
        await trigger.click({ timeout: 5000 }).catch(() => {});
        
        const listbox = this.page.getByRole('listbox');
        const firstOption = listbox.getByRole('option').first();
        
        await firstOption.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
        await firstOption.click({ timeout: 5000 }).catch(() => {
            console.warn(`      ⚠ Warning: No options found in listbox.`);
        });
    }
}
