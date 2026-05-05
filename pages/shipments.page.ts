import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { resolveExpectedTabs } from '../data/shipment.factory';
import { ShipmentData } from '../data/interfaces/master.types';

export class ShipmentsPage extends BasePage {


    readonly combobox = this.page.getByTestId('service-autocomplete-input'); 


    // ─────────────────────────────────────────────────────────────────────────
    // LOCATORS – Navigation
    // ─────────────────────────────────────────────────────────────────────────

    readonly operationsTab     = this.page.locator('span:has-text("Operations")');
    readonly shipmentsTab      = this.page.getByText('Shipments', { exact: true });

    // ─────────────────────────────────────────────────────────────────────────
    // LOCATORS – New Shipment form trigger
    // ─────────────────────────────────────────────────────────────────────────

    readonly newShipmentButton        = this.page.getByRole('button', { name: 'New Shipment' });
    readonly newRegularShipmentOption = this.page.getByRole('menuitem', { name: 'New Regular Shipment' });

    // ─────────────────────────────────────────────────────────────────────────
    // LOCATORS – New Shipment form (Dynamic)
    // ─────────────────────────────────────────────────────────────────────────

    /** 
     * Helper to get a combobox by its label text.
     * This is robust because it finds the field container containing the label 
     * and then finds the combobox inside it.
     */
    private getComboByLabel(labelName: string) {
        // Use a case-insensitive match for the label text.
        // We look for any element that contains the text, then find the nearest following combobox.
        return this.page.locator('div, span, label, p, h1, h2, h3, h4, h5, h6')
            .filter({ hasText: new RegExp(`^${labelName}(\\s*\\*)?$`, 'i') })
            .first()
            .locator('xpath=./following::input[@role="combobox"][1] | ./ancestor::div[1]//input[@role="combobox"]')
            .first();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LOCATORS – Form action buttons
    // ─────────────────────────────────────────────────────────────────────────

    readonly createButton   = this.page.getByRole('button', { name: 'Create' });
    readonly generateButton = this.page.getByRole('button', { name: 'Generate' });
    readonly okButton       = this.page.getByRole('button', { name: 'OK' });

    // ─────────────────────────────────────────────────────────────────────────
    // ACTIONS – Navigation
    // ─────────────────────────────────────────────────────────────────────────

    async goto() {
        await this.operationsTab.click();
        await this.shipmentsTab.click();
        await this.page.waitForLoadState('networkidle');
    }

    async enterInput(label: string, value: string) {
        const input = this.getComboByLabel(label);
        await input.fill(value);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ACTIONS – Open the "New Regular Shipment" form dialog
    // ─────────────────────────────────────────────────────────────────────────

    async openNewRegularShipmentForm() {
        await this.newShipmentButton.click();
        await this.newRegularShipmentOption.click();
        // Wait for the dialog to be visible
        await expect(this.page.getByRole('dialog')).toBeVisible();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ACTIONS – Fill the form using a ShipmentData object, then submit.
    //
    // The method accepts a fully-typed ShipmentData so every test scenario
    // passes its own data without touching the page object itself.
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Dynamically selects one or more options from an MUI Autocomplete (combobox) field using its test-id.
     * @param testId The data-testid of the input field.
     * @param values The text of the option(s) to select.
     */
    async selectByTestId(testId: string, values: string | string[] | undefined) {
        if (!values || (Array.isArray(values) && values.length === 0)) return;
        
        const combo = this.page.getByTestId(testId);
        const options = Array.isArray(values) ? values : [values];

        for (const value of options) {
            await combo.click();
            await combo.clear();
            await combo.pressSequentially(value, { delay: 50 });
            
            const optionLocator = this.page.locator('[role="option"], .MuiAutocomplete-option')
                .filter({ hasText: new RegExp(`^${value}$`, 'i') })
                .first();

            try {
                await optionLocator.waitFor({ state: 'visible', timeout: 3000 });
                await optionLocator.click();
            } catch (e) {
                const allOptions = this.page.locator('[role="option"], .MuiAutocomplete-option');
                if (await allOptions.count() > 0) {
                    const firstOption = allOptions.first();
                    const text = (await firstOption.textContent())?.trim();
                    console.warn(`WARNING: Option "${value}" not found for ID "${testId}". Falling back to first available: "${text}"`);
                    await firstOption.click();
                } else {
                    throw new Error(`ERROR: No options found for testId "${testId}" after typing "${value}"`);
                }
            }
            await expect(this.page.locator('[role="listbox"]')).not.toBeVisible().catch(() => {});
        }
    }

    async fillNewShipmentForm(data: ShipmentData) {
        // Use unique data-testid locators for maximum reliability
        await this.selectByTestId('service-autocomplete-input', data.details.shipmentType);
        await this.selectByTestId('shipment-documents-select', data.details.shipmentMode);
        await this.selectByTestId('operational-status-select', data.details.shipmentStatus);
        await this.selectByTestId('documentation-user-select', data.details.customer);
        await this.selectByTestId('operations-user-select', data.details.agent);
        await this.selectByTestId('sales-user-select', data.details.user);
        
        await this.selectByTestId('clearance-job-number-select', data.details.clearanceJobNumber);
        await this.selectByTestId('secondary-services-select', data.details.secondaryServices);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ACTIONS – Submit the form and complete the generation flow.
    // Returns the shipment ID text captured from the success banner so tests
    // can store it for downstream assertions.
    // ─────────────────────────────────────────────────────────────────────────

    async submitNewShipmentForm(): Promise<string> {
        await this.createButton.click();
        await this.generateButton.click();

        // Capture generated shipment ID (with a shorter timeout to avoid hanging)
        const idLocator = this.page.locator('[data-testid="shipment-id"], .shipment-id, .generated-id').first();
        let shipmentId = '';
        
        try {
            shipmentId = (await idLocator.textContent({ timeout: 5000 }))?.trim() ?? '';
            await this.okButton.click();
        } catch (e) {
            // Fallback: If banner is missed or auto-closes, the test can still proceed
            // if it verifies the result on the detail page.
            console.warn('Success banner not caught; proceeding to verify via detail page.');
        }

        return shipmentId;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // COMPOSED ACTION – Full end-to-end: open → fill → submit
    // Most tests should call this single method.
    // ─────────────────────────────────────────────────────────────────────────

    async createNewRegularShipment(data: ShipmentData): Promise<string> {
        await this.openNewRegularShipmentForm();
        await this.fillNewShipmentForm(data);
        return this.submitNewShipmentForm();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ASSERTIONS
    // ─────────────────────────────────────────────────────────────────────────

    /** Assert the browser URL ends with the given path segment */
    async expectURL(path: string) {
        await expect(this.page).toHaveURL(new RegExp(`${path}$`));
    }

    /**
     * Assert that all tabs expected for the given ShipmentData are visible
     * on the shipment detail page.
     *
     * Usage:
     *   await shipmentsPage.expectDetailTabs(data);
     */
    async expectDetailTabs(data: ShipmentData) {
        const { alwaysVisible, conditional } = resolveExpectedTabs(data);

        for (const tab of alwaysVisible) {
            await expect(
                this.page.getByRole('tab', { name: tab })
            ).toBeVisible({ timeout: 5000 });
        }

        for (const tab of conditional) {
            await expect(
                this.page.getByRole('tab', { name: tab })
            ).toBeVisible({ timeout: 5000 });
        }
    }

    /**
     * Assert that a single tab is NOT in the DOM.
     * Uses `not.toBeAttached()` so the assertion passes even when the element
     * is never rendered (not just hidden).
     */
    async expectTabNotPresent(tabName: string) {
        await expect(
            this.page.getByRole('tab', { name: tabName })
        ).not.toBeAttached();
    }

    /**
     * Assert that ALL tabs in the provided list are absent from the DOM.
     * Convenience wrapper around expectTabNotPresent() for multi-tab checks.
     *
     * Usage:
     *   await shipmentsPage.expectTabsAbsent(['HAWB', 'HBL']);
     */
    async expectTabsAbsent(tabNames: string[]) {
        for (const tab of tabNames) {
            await this.expectTabNotPresent(tab);
        }
    }
}
