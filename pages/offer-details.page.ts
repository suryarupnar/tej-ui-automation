import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { OfferData } from '../data/interfaces/offer.types';
import { resolveOfferTabFieldMap } from '../data/offer.factory';
import { TabFieldEntry } from '../data/interfaces/tab.field.types';

export class OfferDetailsPage extends BasePage {

    // -- Locators --
    readonly saveButton     = this.page.getByRole('button', { name: 'Save' });

    async fillAllTabs(data: OfferData) {
        // Step 1: General Details
        await this.fillGeneralDetailsTab(data);
        
        // Final Step: Save (for current testing)
        await this.saveOffer();
    }

    async fillGeneralDetailsTab(data: OfferData) {
        const d = data.general;
        
        // 1. Client Details
        console.log('    ▶ Filling Client Details...');
        const clientLocator = this.page.getByTestId('client').nth(1);
        await expect(clientLocator).toBeEnabled({ timeout: 5000 }).catch(() => {});
        await this.selectByLocator(clientLocator, d.client.client);
        
        const branchLocator = this.page.getByTestId('branch');
        await expect(branchLocator).toBeEnabled({ timeout: 5000 }).catch(() => {});
        await this.selectByTestId('branch', d.client.branch);

        const contactPersonLocator = this.page.getByRole('combobox', { name: 'Select contact person' });
        await expect(contactPersonLocator).toBeEnabled({ timeout: 5000 }).catch(() => {});
        await this.selectByLocator(contactPersonLocator, d.client.contactPerson);
        
        // 2. General Info
        console.log('    ▶ Filling Shipper/Consignee...');
        await this.page.getByTestId('shipper').fill(d.details.shipper);
        await this.page.getByTestId('consignee').fill(d.details.consignee);
        
        console.log('    ▶ Filling Business Details...');
        await this.selectByTestId('lineOfBusiness', d.details.lineOfBusiness);
        await this.selectByTestId('shippingTerm', d.details.shippingTerm);
        await this.selectByTestId('validityFor', d.details.validityFor);
        await this.selectByTestId('validityStatus', d.details.validityStatus);
        
        // Date
        await this.page.getByRole('button', { name: 'Choose date' }).click();
        await this.page.getByRole('gridcell', { name: d.details.validityDate }).click();
        
        await this.selectByTestId('shipmentType', d.details.shipmentType);
        await this.selectByTestId('receivedFrom', d.details.receivedFrom);
        
        // 3. Address Details
        console.log('    ▶ Filling Address Details (Origin)...');
        await this.selectByTestId('originAddressType', d.address.originAddressType);
        await this.selectByTestId('originCountry', d.address.originCountry);
        
        // Wait for dynamic options to load
        await this.page.waitForTimeout(2000);
        
        const originType = d.address.originAddressType;
        if (originType === 'Airport' || originType === 'Land Address') {
            if (d.address.originAirport) {
                const originAirportLocator = this.page.getByTestId('originAirport');
                await expect(originAirportLocator).toBeEnabled({ timeout: 5000 }).catch(() => {});
                await this.selectByLocator(originAirportLocator, d.address.originAirport);
            }
        } else if (originType === 'Port') {
            if (d.address.originPort) {
                const originPortLocator = this.page.getByTestId('originPort');
                await expect(originPortLocator).toBeEnabled({ timeout: 5000 }).catch(() => {});
                await this.selectByLocator(originPortLocator, d.address.originPort);
            }
        } else if (originType === 'Railway Station') {
            if (d.address.originRailwayStation) {
                const originRailLocator = this.page.getByTestId('originRailwayStation');
                await expect(originRailLocator).toBeEnabled({ timeout: 5000 }).catch(() => {});
                await this.selectByLocator(originRailLocator, d.address.originRailwayStation);
            }
        }
        
        console.log('    ▶ Filling Address Details (Destination)...');
        await this.selectByTestId('destinationAddressType', d.address.destinationAddressType);
        await this.selectByTestId('destinationCountry', d.address.destinationCountry);
        
        // Wait for dynamic options to load
        await this.page.waitForTimeout(2000);
        
        const destType = d.address.destinationAddressType;
        if (destType === 'Airport' || destType === 'Land Address') {
            if (d.address.destinationAirport) {
                const destAirportLocator = this.page.getByTestId('destinationAirport');
                await expect(destAirportLocator).toBeEnabled({ timeout: 5000 }).catch(() => {});
                await this.selectByLocator(destAirportLocator, d.address.destinationAirport);
            }
        } else if (destType === 'Port') {
            if (d.address.destinationPort) {
                const destPortLocator = this.page.getByTestId('destinationPort');
                await expect(destPortLocator).toBeEnabled({ timeout: 5000 }).catch(() => {});
                await this.selectByLocator(destPortLocator, d.address.destinationPort);
            }
        } else if (destType === 'Railway Station') {
            if (d.address.destinationRailwayStation) {
                const destRailLocator = this.page.getByTestId('destinationRailwayStation');
                await expect(destRailLocator).toBeEnabled({ timeout: 5000 }).catch(() => {});
                await this.selectByLocator(destRailLocator, d.address.destinationRailwayStation);
            }
        }

        // 4. Cargo Details (Optional)
        if (data.cargo) {
            console.log('    ▶ Adding Cargo Details...');
            await this.page.getByRole('button', { name: 'Add Cargo' }).click();
            await this.page.getByTestId('cargoDetails.0.grossWeight').fill(data.cargo.grossWeight);
            await this.page.getByTestId('cargoDetails.0.grossVolume').fill(data.cargo.grossVolume);
            await this.page.getByTestId('cargoDetails.0.noOf').fill(data.cargo.packageCount);
            
            await this.selectByTestId('cargoDetails.0.commodityType', data.cargo.commodityType);
            await this.page.getByTestId('cargoDetails.0.shortCargoDescription').fill(data.cargo.description);
        }

        // 5. Comments
        console.log('    ▶ Adding Internal Comments...');
        if (d.comments.internalComments) {
            await this.page.locator('textarea[name="internalComments"]').fill(d.comments.internalComments);
        }
    }

    async clickTab(tabName: string) {
        await this.page.locator(`[role="tab"]:has-text("${tabName}")`).click();
        await this.page.waitForTimeout(500);
    }

    async saveOffer() {
        console.log('    ▶ Finalizing and Saving Offer...');
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await this.saveButton.click();

        // Safety Check: Look for "is required" errors
        const errorToast = this.page.locator('div').filter({ hasText: /is required/i });
        if (await errorToast.isVisible({ timeout: 2000 }).catch(() => false)) {
            const errorMsg = await errorToast.innerText();
            throw new Error(`[Offer Creation Failed]: ${errorMsg.trim()}`);
        }

        // Assert success toast
        await expect(this.page.getByText('Offer created successfully')).toBeVisible({ timeout: 10000 });
        
        // Wait for navigation back to the main list page
        await expect(this.page).toHaveURL(/\/crm\/offers\/?$/, { timeout: 15000 });
        console.log('    ✓ Offer saved successfully and navigated back to list.');
    }
}
