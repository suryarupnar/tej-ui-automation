import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { TabFieldEntry } from '../data/interfaces/tab.field.types.js';

export class CargoPage extends BasePage {

    // ─────────────────────────────────────────────────────────────────────────
    // Actions for Cargo Tab
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Fills the Cargo tab using the 'Add Cargo' modal workflow.
     */
    async fillCargoDetails(fields: TabFieldEntry[]) {
        console.log(`    ▶ Filling Cargo tab (${fields.length} fields)...`);

        const cargoFields = fields.filter(f => f.interaction !== 'readonly');

        // 1. Open 'New Cargo' modal
        await this.page.getByRole('button', { name: 'Add Cargo' }).click();
        const modal = this.page.getByRole('dialog').filter({ hasText: 'New Cargo' });
        await expect(modal).toBeVisible();

        // 3. Setup dimensions in modal
        await modal.getByRole('button', { name: 'Add Dimensions' }).click();

        // 4. Fill fields inside the modal
        for (const { testId, value, interaction } of cargoFields) {
            // Handle escaping dots in IDs for CSS selectors
            const escapedId = testId.replace(/\./g, '\\.');
            const fieldLocator = modal.getByTestId(testId).or(modal.locator(`#${escapedId}`)).first();
            
            if (interaction === 'combobox') {
                await this.selectByLocator(fieldLocator, value as string | string[]);
            } else {
                await fieldLocator.fill(value as string);
            }
        }

        // 5. Trigger calculation AFTER all fields are populated
        await modal.getByRole('button', { name: 'Calculate Totals' }).click();
        await this.page.waitForTimeout(1000);

        // 6. Save the modal
        // Using a combination of container class and role for stability
        const modalSaveBtn = modal.locator('._cargoSaveBtnContainer_1jyf6_380').getByRole('button', { name: 'Save' });
        await modalSaveBtn.click();
        
        // Wait for modal to disappear
        await expect(modal).toBeHidden();

        console.log('    ✓ Cargo tab filled and modal saved successfully.');
    }

    /**
     * Verifies the Cargo tab fields using a data-driven loop.
     */
    async verifyCargoDetails(fields: TabFieldEntry[]) {
        console.log('\n      [Cargo Tab Verification]');
        let checkedCount = 0;

        for (const { testId, value } of fields) {
            // We use a flexible locator scoped to the active tab panel
            const activeTabPanel = this.page.getByRole('tabpanel');
            const escapedId = testId.replace(/\./g, '\\.');
            const locator = activeTabPanel.getByTestId(testId).or(activeTabPanel.locator(`#${escapedId}`)).first();
            
            // Skip if the field isn't present on the summary view (e.g. modal-only fields)
            if (await locator.count() === 0) continue;

            // Use web-first assertions for auto-retrying
            if (!isNaN(Number(value)) && value.trim() !== '') {
                // For numbers, we check the value but allow for formatting (2000 vs 2000.000)
                const actualValue = await locator.inputValue().catch(() => locator.textContent());
                expect(Number(actualValue), `[Cargo] testId="${testId}"`).toBe(Number(value));
            } else {
                await expect(locator).toHaveValue(value);
            }
            checkedCount++;
        }
        console.log(`    ▶ Cargo tab validation complete. Checked ${checkedCount} fields.`);
    }
}
