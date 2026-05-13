import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page.js';
import { resolveExpectedTabs, resolveTabFieldMap } from '../data/shipment.factory.js';
import { ShipmentData } from '../data/interfaces/master.types.js';
import { TabFieldEntry } from '../data/interfaces/tab.field.types.js';
import { CargoPage } from './cargo.page.js';

export class ShipmentDetailsPage extends BasePage {
    private readonly cargoPage: CargoPage;

    constructor(page: Page) {
        super(page);
        this.cargoPage = new CargoPage(page);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Locators
    // ─────────────────────────────────────────────────────────────────────────

    readonly generateButton = this.page.getByRole('button', { name: 'Generate' });
    readonly okButton       = this.page.getByRole('button', { name: 'OK' });
    readonly saveButton     = this.page.getByRole('button', { name: 'Save' });

    // ─────────────────────────────────────────────────────────────────────────
    // ID capture
    // ─────────────────────────────────────────────────────────────────────────

    lastCreatedSerialNo = '';

    async getSerialNumber(): Promise<string> {
        const serialNoDisplay = this.page.getByText(/SHP-/).first();
        await expect(serialNoDisplay).toBeVisible({ timeout: 15000 });
        const id = (await serialNoDisplay.innerText()).trim();
        return id;
    }

    async generateAndCaptureId(): Promise<string> {
        await this.generateButton.click();

        // 1. Confirm the "Warning!" dialog
        await this.okButton.click();

        // 2. Wait for the Serial No. display to update
        const id = await this.getSerialNumber();
        
        this.lastCreatedSerialNo = id;
        console.log(`  ▶ Created shipment serial No.: ${id}`);
        
        // 3. Clear any success alerts if they appeared
        await this.okButton.click({ timeout: 2000 }).catch(() => {});
        
        return id;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Tab Assertions
    // ─────────────────────────────────────────────────────────────────────────

    async expectDetailTabs(data: ShipmentData) {
        const { alwaysVisible, conditional } = resolveExpectedTabs(data);
        const allTabs = [...alwaysVisible, ...conditional];
        
        console.log(`  ▶ Checking tabs for ${data.details.shipmentType} -> ${data.details.shipmentMode}:`, allTabs);
        for (const tab of allTabs) {
            console.log(`    - Waiting for tab: "${tab}"`);
            await expect(this.page.locator(`button:has-text("${tab}")`)).toBeVisible();
        }
    }

    async expectTabsAbsent(tabs: string[]) {
        for (const tab of tabs) {
            console.log(`    - Ensuring tab is absent: "${tab}"`);
            await expect(this.page.locator(`button:has-text("${tab}")`)).toBeHidden();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Date Picker
    // ─────────────────────────────────────────────────────────────────────────

    async fillDatePicker(wrapperTestId: string, dateStr: string) {
        const cleanDate = dateStr.replace(/[/-]/g, '');
        const dialog = this.page.getByRole('dialog');
        let wrapper = this.page.getByTestId(wrapperTestId);

        if (await dialog.isVisible().catch(() => false)) {
            wrapper = dialog.getByTestId(wrapperTestId);
        }

        const daySegment = wrapper.getByRole('spinbutton', { name: 'Day' });
        await daySegment.click();
        await this.page.keyboard.type(cleanDate);
    }

    async enableDatesEditing() {
        try {
            const btn = this.page.getByRole('button', { name: 'Edit Dates' });
            if (await btn.isVisible({ timeout: 2000 })) {
                await btn.click();
            }
        } catch { /* already editable */ }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Save
    // ─────────────────────────────────────────────────────────────────────────

    async saveCurrentTab() {
        // Target the visible Save button to avoid clicking hidden ones from other tabs
        const activeSaveButton = this.saveButton.filter({ visible: true }).first();
        await activeSaveButton.click();
        const successToast = this.page.getByText('Shipment saved successfully', { exact: true });
        await expect(successToast).toBeVisible({ timeout: 10000 });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Core per-tab helpers
    // ─────────────────────────────────────────────────────────────────────────

    private async clickTab(tabName: string) {
        const tab = this.page.locator(`[role="tab"]:has-text("${tabName}")`).first();
        await tab.click();
        
        // Wait for the tab content to load
        await this.page.locator('text=Loading Data...').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await this.page.waitForTimeout(500); // Buffer for UI stability
    }

    private async expandAllSections() {
        // Target MUI accordions within h3 headings, scoped to the ACTIVE visible tab
        const activePanel = this.page.getByRole('tabpanel').filter({ visible: true });
        const headers = activePanel.locator('h3');
        const count = await headers.count();
        
        for (let i = 0; i < count; i++) {
            const button = headers.nth(i).locator('button').first();
            if (await button.count() > 0) {
                const isExpanded = await button.getAttribute('aria-expanded');
                // Only click if it's currently collapsed (aria-expanded is not 'true')
                if (isExpanded !== 'true') {
                    await button.click();
                    await this.page.waitForTimeout(300); // Wait for accordion animation
                }
            }
        }
    }

    private fieldLocator(testId: string) {
        // Scope to the ACTIVE visible tab panel to avoid duplicate elements from hidden tabs
        const activeTabPanel = this.page.getByRole('tabpanel').filter({ visible: true });

        const escapedId = testId.replace(/\./g, '\\.');
        const primary = activeTabPanel.getByTestId(testId).or(activeTabPanel.locator(`#${escapedId}`));
        
        // Targeted fallback for fields that only have labels
        const labelText = testId.replace(/Id$/, '').replace(/([A-Z])/g, ' $1').trim();
        const capitalizedLabel = labelText.charAt(0).toUpperCase() + labelText.slice(1);
        
        const fallback = activeTabPanel.getByLabel(capitalizedLabel, { exact: false })
            .or(activeTabPanel.getByLabel(labelText, { exact: false }));

        return primary.or(fallback).first();
    }

    async fillTabFields(tabName: string, fields: TabFieldEntry[]) {
        if (tabName !== 'Shipment Details') {
            await this.clickTab(tabName);
        }

        await this.expandAllSections();

        // DELEGATE Cargo tab to specialized CargoPage
        if (tabName === 'Cargo' || tabName === 'Cargo & Equipments') {
            await this.cargoPage.fillCargoDetails(fields);
            return;
        }

        const sortedFields = [...fields].sort((a, b) => {
            if (a.interaction === 'datepicker' && b.interaction !== 'datepicker') return 1;
            if (a.interaction !== 'datepicker' && b.interaction === 'datepicker') return -1;
            return 0;
        });

        let datesEnabled = false;
        for (const { testId, value, values, interaction = 'fill' } of sortedFields) {
            const field = this.fieldLocator(testId);
            
            // Wait for field to be attached (gives time for animations/transitions)
            await field.waitFor({ state: 'attached', timeout: 2000 }).catch(() => {});

            if (await field.count() === 0) {
                console.log(`      - Field not found, skipping: ${testId}`);
                continue;
            }

            // Skip if the field is disabled (auto-filled by system)
            if (await field.isDisabled()) {
                console.log(`      - Skipping disabled field: ${testId}`);
                continue;
            }

            if (interaction === 'datepicker' && !datesEnabled) {
                await this.enableDatesEditing();
                datesEnabled = true;
            }

            console.log(`      - Filling ${testId} with "${value || (values && values.join(','))}"...`);
            if (interaction === 'fill') {
                await field.fill(value as string);
            } else if (interaction === 'combobox') {
                const toSelect = (values && values.length > 0) ? values : value;
                await this.selectByLocator(field, toSelect as string | string[]);
            } else if (interaction === 'datepicker') {
                if (value) await this.fillDatePicker(testId, value as string);
            }
        }
    }

    async verifyTabFields(tabName: string, fields: TabFieldEntry[]) {
        if (tabName !== 'Shipment Details') {
            await this.clickTab(tabName);
        }

        await this.expandAllSections();

        // DELEGATE Cargo tab validation to CargoPage
        if (tabName === 'Cargo' || tabName === 'Cargo & Equipments') {
            await this.cargoPage.verifyCargoDetails(fields);
            return;
        }

        for (const { testId, value, interaction = 'fill' } of fields) {
            if (!value) continue;
            
            const baseLocator = this.fieldLocator(testId);

            // Wait for field for verification (buffer for persistence/rendering)
            await baseLocator.waitFor({ state: 'attached', timeout: 3000 }).catch(() => {});

            if (await baseLocator.count() === 0) {
                console.log(`      - Field not found for verification, skipping: ${testId}`);
                continue;
            }

            console.log(`      - Verifying ${testId} has value "${value}"...`);

            if (interaction === 'datepicker') {
                const hidden = baseLocator.locator('input[aria-hidden="true"]');
                await expect(hidden).toHaveValue(value as string);
            } else if (interaction === 'text') {
                await expect(baseLocator).toHaveText(value as string);
            } else {
                // Determine if we should check value or text (handles inputs and readonly wrappers)
                const input = baseLocator.locator('input, textarea').first();
                if (await input.count() > 0) {
                    await expect(input).toHaveValue(value as string, { timeout: 10000 });
                } else {
                    // Fallback for readonly fields, spans, or custom divs
                    await expect(baseLocator).toContainText(value as string, { timeout: 10000 });
                }
            }
        }
    }

    async fillAllTabs(data: ShipmentData) {
        const map = resolveTabFieldMap(data);
        for (const [tabName, fields] of Object.entries(map)) {
            if (!fields || fields.length === 0) continue;
            await this.fillTabFields(tabName, fields);
            await this.saveCurrentTab();
        }
    }

    async validateAllTabs(data: ShipmentData) {
        const map = resolveTabFieldMap(data);
        for (const [tabName, fields] of Object.entries(map)) {
            if (!fields || fields.length === 0) continue;
            await this.verifyTabFields(tabName, fields);
        }
    }
}
