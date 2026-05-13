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

        // 3. Setup dimensions in modal — click triggers a re-render, so wait
        //    for the first dimension input to be stable before filling anything.
        await modal.getByRole('button', { name: 'Add Dimensions' }).click();
        const firstDimField = modal.locator('[id^="tempCargoDetails.0.dimensions.0"]').first();
        await firstDimField.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

        // 4. Fill fields inside the modal
        for (const { testId, value, interaction } of cargoFields) {
            const escapedId = testId.replace(/\./g, '\\.');
            const fieldLocator = modal.getByTestId(testId).or(modal.locator(`#${escapedId}`)).first();

            // Wait for field to be attached and stable
            await fieldLocator.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

            if (await fieldLocator.count() === 0 || !(await fieldLocator.isVisible().catch(() => false))) {
                continue;
            }

            if (interaction === 'combobox') {
                await this.selectByLocator(fieldLocator, value as string | string[]);
            } else {
                await fieldLocator.fill(value as string);
            }
        }

        // 5. Trigger calculation AFTER all fields are populated, then wait for it
        //    to apply — web-first assertion replaces the brittle waitForTimeout.
        await modal.getByRole('button', { name: 'Calculate Totals' }).click();
        const grossWeightField = modal.getByRole('spinbutton', { name: 'Gross Weight' });
        await expect(grossWeightField).not.toHaveValue('', { timeout: 5000 }).catch(() => {});

        // 6. Save the modal
        // Using a robust role-based locator instead of a brittle class
        const modalSaveBtn = modal.getByRole('button', { name: 'Save' });
        await modalSaveBtn.click();
        
        // Wait for modal to disappear
        await expect(modal).toBeHidden();

        console.log('    ✓ Cargo tab filled and modal saved successfully.');
    }

    /**
     * Verifies the Cargo tab fields using a data-driven loop.
     */
    async verifyCargoDetails(fields: TabFieldEntry[]) {
        let checkedCount = 0;
        const activeTabPanel = this.page.getByRole('tabpanel');
        
        // Wait for loading indicator to disappear if present
        const loader = activeTabPanel.getByRole('progressbar');
        await expect(loader).not.toBeVisible({ timeout: 15000 }).catch(() => {});

        for (const { testId, value } of fields) {
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
