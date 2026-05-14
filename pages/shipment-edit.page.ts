import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ShipmentDetailsTab } from './tabs/shipment-details.tab';
import { CargoTab } from './tabs/cargo.tab';
import { MawbTab } from './tabs/mawb.tab';
import { HawbTab } from './tabs/hawb.tab';
import { WaybillTab } from './tabs/waybill.tab';
import { MblTab } from './tabs/mbl.tab';
import { HblTab } from './tabs/hbl.tab';

export class ShipmentEditPage extends BasePage {
    readonly shipmentDetailsTab: ShipmentDetailsTab;
    readonly cargoTab: CargoTab;
    readonly mawbTab: MawbTab;
    readonly hawbTab: HawbTab;
    readonly waybillTab: WaybillTab;
    readonly mblTab: MblTab;
    readonly hblTab: HblTab;

    constructor(page: Page) {
        super(page);
        this.shipmentDetailsTab = new ShipmentDetailsTab(page);
        this.cargoTab           = new CargoTab(page);
        this.mawbTab            = new MawbTab(page);
        this.hawbTab            = new HawbTab(page);
        this.waybillTab         = new WaybillTab(page);
        this.mblTab             = new MblTab(page);
        this.hblTab             = new HblTab(page);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Locators
    // ─────────────────────────────────────────────────────────────────────────
    readonly generateButton = this.page.getByRole('button', { name: 'Generate' });
    readonly okButton       = this.page.getByRole('button', { name: 'OK' });
    readonly saveButton     = this.page.getByRole('button', { name: 'Save' });

    // ─────────────────────────────────────────────────────────────────────────
    // Navigation
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Clicks a tab using a flexible text match or regex.
     */
    async clickTab(tabName: string | RegExp) {
        const tab = this.page.locator('[role="tab"]').filter({ hasText: tabName }).first();
        await tab.click();
        
        // Wait for the tab content to load
        await this.page.locator('text=Loading Data...').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
        await this.page.waitForTimeout(500); // Buffer for UI stability
    }

    async expandAllSections() {
        const activePanel = this.page.getByRole('tabpanel').filter({ visible: true });
        const headers = activePanel.locator('h3');
        const count = await headers.count();
        
        for (let i = 0; i < count; i++) {
            const button = headers.nth(i).locator('button').first();
            if (await button.count() > 0) {
                const isExpanded = await button.getAttribute('aria-expanded');
                if (isExpanded !== 'true') {
                    await button.click();
                    await this.page.waitForTimeout(300);
                }
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Save & Generate
    // ─────────────────────────────────────────────────────────────────────────

    async save() {
        const activeSaveButton = this.saveButton.filter({ visible: true }).first();
        if (await activeSaveButton.isDisabled()) {
            console.log('    ⚠ Save button disabled – skipping.');
            return;
        }
        
        await activeSaveButton.click();

        // Wait for success toast/notification to appear
        const successToast = this.page.locator('text=Tab saved successfully').first();
        await expect(successToast).toBeVisible({ timeout: 15000 });
        
        // Wait for the button to settle (optional but helps stability)
        await expect(activeSaveButton).toBeDisabled({ timeout: 15000 }).catch(() => {});
        
        console.log('    ✓ Tab saved successfully.');
        
        // Wait for toast to disappear to prevent overlapping UI interactions
        await successToast.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }

    async generateNum(): Promise<string> {
        await this.generateButton.click();
        await this.okButton.click();
        const serialNoDisplay = this.page.getByText(/SHP-/).first();
        await expect(serialNoDisplay).toBeVisible({ timeout: 15000 });
        await this.okButton.click({ timeout: 2000 }).catch(() => {});
        const id = (await serialNoDisplay.innerText()).trim();
        console.log(`  ▶ Generated Shipment Number: ${id}`);
        return id;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Fill Methods
    // ─────────────────────────────────────────────────────────────────────────

    async shipmentFill(data: any): Promise<void> {
        await this.expandAllSections();
        await this.shipmentDetailsTab.fill(data);
        await this.save();
    }

    async cargoFill(data: any) {
        // Matches "Cargo" or "Cargo & Equipments"
        await this.clickTab(/^Cargo/);
        await this.expandAllSections();
        await this.cargoTab.fill(data);
        await this.save();
    }

    async mawbFill(data: any) {
        await this.clickTab(/^MAWB$/);
        await this.expandAllSections();
        await this.mawbTab.fill(data);
        await this.save();
    }

    async hawbFill(data: any) {
        await this.clickTab(/^HAWB$/);
        await this.expandAllSections();
        await this.hawbTab.fill(data);
        await this.save();
    }

    async waybillFill(data: any) {
        await this.clickTab(/^Waybill$/);
        await this.expandAllSections();
        await this.waybillTab.fill(data);
        await this.save();
    }

    async mblFill(data: any) {
        // Matches "MB/L" or "MBL"
        await this.clickTab(/^MB\/?L/);
        await this.expandAllSections();
        await this.mblTab.fill(data);
        await this.save();
    }

    async hblFill(data: any) {
        // Matches "HB/L" or "HBL"
        await this.clickTab(/^HB\/?L/);
        await this.expandAllSections();
        await this.hblTab.fill(data);
        await this.save();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Validate Methods
    // ─────────────────────────────────────────────────────────────────────────

    async shipmentValidate(data: any) {
        await this.clickTab(/^Shipment Details$/);
        await this.expandAllSections();
        await this.shipmentDetailsTab.validate(data);
    }

    async cargoValidate(data: any) {
        await this.clickTab(/^Cargo/);
        await this.expandAllSections();
        await this.cargoTab.validate(data);
    }

    async mawbValidate(data: any) {
        await this.clickTab(/^MAWB$/);
        await this.expandAllSections();
        await this.mawbTab.validate(data);
    }

    async hawbValidate(data: any) {
        await this.clickTab(/^HAWB$/);
        await this.expandAllSections();
        await this.hawbTab.validate(data);
    }

    async waybillValidate(data: any) {
        await this.clickTab(/^Waybill$/);
        await this.expandAllSections();
        await this.waybillTab.validate(data);
    }

    async mblValidate(data: any) {
        await this.clickTab(/^MB\/?L/);
        await this.expandAllSections();
        await this.mblTab.validate(data);
    }

    async hblValidate(data: any) {
        await this.clickTab(/^HB\/?L/);
        await this.expandAllSections();
        await this.hblTab.validate(data);
    }
}
