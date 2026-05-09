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

        // Wait for element to be attached and visible
        await trigger.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
        
        if (await trigger.count() > 0 && await trigger.isDisabled()) {
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
            // Fill and explicitly click the matching option
            await inputLocator.fill(value, { timeout: 5000 }).catch((e) => {
                throw new Error(`Failed to fill input for value "${value}". It may be hidden or obscured.`);
            });
            
            // Force the listbox to render safely
            await this.page.keyboard.press('ArrowDown').catch(() => {});
            
            // Click the option that matches the text EXACTLY (auto-retries)
            const listbox = this.page.getByRole('listbox');
            const option = listbox.getByRole('option', { name: value, exact: true });
            
            await option.click({ timeout: 5000 }).catch((e) => {
                throw new Error(`Autocomplete Option "${value}" (exact) not found in listbox`);
            });
        } else {
            // Select: Click dropdown and click matching option
            await trigger.click({ timeout: 5000 }).catch((e) => {
                throw new Error(`Failed to click dropdown trigger. It may be hidden or obscured.`);
            });
            
            const listbox = this.page.getByRole('listbox');
            const option = listbox.getByRole('option', { name: value, exact: true });
            
            await option.click({ timeout: 5000 }).catch((e) => {
                throw new Error(`Select Option "${value}" (exact) not found in dropdown`);
            });
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
}
