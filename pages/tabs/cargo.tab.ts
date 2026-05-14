import { Page, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class CargoTab extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Locators
    // ─────────────────────────────────────────────────────────────────────────
    readonly addCargoButton     = this.page.getByRole('button', { name: 'Add Cargo' });
    readonly modal              = this.page.getByRole('dialog').filter({ hasText: 'New Cargo' });
    readonly addDimensionsBtn   = this.modal.getByRole('button', { name: 'Add Dimensions' });
    readonly calculateTotalsBtn = this.modal.getByRole('button', { name: 'Calculate Totals' });
    readonly modalSaveButton    = this.modal.getByRole('button', { name: 'Save' });

    // Dimension Fields (using specific indices as seen in recording)
    readonly dimPackageCount = this.modal.getByTestId('tempCargoDetails.0.dimensions.0.packageCount');
    readonly dimLength       = this.modal.getByTestId('tempCargoDetails.0.dimensions.0.length');
    readonly dimWidth        = this.modal.getByTestId('tempCargoDetails.0.dimensions.0.width');
    readonly dimHeight       = this.modal.getByTestId('tempCargoDetails.0.dimensions.0.height');
    readonly dimGrossWeight  = this.modal.getByTestId('tempCargoDetails.0.dimensions.0.grossWeight');

    // Cargo Summary Fields
    readonly netWeight             = this.modal.getByTestId('tempCargoDetails.0.netWeight');
    readonly commodityType         = this.modal.getByTestId('tempCargoDetails.0.commodityType');
    readonly shortCargoDescription = this.modal.getByTestId('tempCargoDetails.0.shortCargoDescription');
    readonly hsCode                = this.modal.getByRole('textbox', { name: 'HS Code' });
    readonly subheading            = this.modal.getByRole('textbox', { name: 'Subheading' });

    // Air Specific (MAWB/HAWB)
    readonly mawbRateClass        = this.modal.getByTestId('tempCargoDetails.0.mawbRateClass');
    readonly tactRate             = this.modal.getByTestId('tempCargoDetails.0.tactRate');
    readonly mawbTotalCharge      = this.modal.getByTestId('tempCargoDetails.0.mawbTotalCharge');
    readonly mawbCargoDescription = this.modal.getByTestId('tempCargoDetails.0.mawbCargoDescription');
    readonly hawbRateClass        = this.modal.getByTestId('tempCargoDetails.0.hawbRateClass');
    readonly hawbRate             = this.modal.getByTestId('tempCargoDetails.0.hawbRate');
    readonly hawbTotalCharge      = this.modal.getByTestId('tempCargoDetails.0.hawbTotalCharge');

    // Identification
    readonly slac            = this.modal.getByTestId('tempCargoDetails.0.slac');
    readonly commodityItemNo = this.modal.getByTestId('tempCargoDetails.0.commodityItemNo');
    readonly itemNo          = this.modal.getByTestId('tempCargoDetails.0.itemNo');
    readonly subItemNo       = this.modal.getByTestId('tempCargoDetails.0.subItemNo');

    /**
     * Fills the Cargo tab via the Add Cargo modal.
     */
    async fill(data: any) {
        await this.addCargoButton.click();
        await expect(this.modal).toBeVisible();

        // Dimensions Modal
        await this.addDimensionsBtn.click();
        if (data.packageCount) await this.dimPackageCount.fill(data.packageCount.toString());
        if (data.length)       await this.dimLength.fill(data.length.toString());
        if (data.width)        await this.dimWidth.fill(data.width.toString());
        if (data.height)       await this.dimHeight.fill(data.height.toString());
        if (data.grossWeight)  await this.dimGrossWeight.fill(data.grossWeight.toString());

        await this.calculateTotalsBtn.click();

        // Summary Info
        if (data.netWeight)     await this.netWeight.fill(data.netWeight.toString());
        if (data.commodityType) await this.comboxFill(this.commodityType, data.commodityType);
        if (data.description)   await this.shortCargoDescription.fill(data.description);
        if (data.hsCode)        await this.hsCode.fill(data.hsCode);
        if (data.subheading)    await this.subheading.fill(data.subheading);

        // Air Specific
        if (data.mawbRateClass)   await this.comboxFill(this.mawbRateClass, data.mawbRateClass);
        if (data.tactRate)        await this.tactRate.fill(data.tactRate.toString());
        if (data.mawbTotalCharge) await this.mawbTotalCharge.fill(data.mawbTotalCharge.toString());
        if (data.mawbDescription) await this.mawbCargoDescription.fill(data.mawbDescription);
        
        if (data.hawbRateClass)   await this.comboxFill(this.hawbRateClass, data.hawbRateClass);
        if (data.hawbRate)        await this.hawbRate.fill(data.hawbRate.toString());
        if (data.hawbTotalCharge) await this.hawbTotalCharge.fill(data.hawbTotalCharge.toString());

        // Identification
        if (data.slac)            await this.slac.fill(data.slac.toString());
        if (data.commodityItemNo) await this.commodityItemNo.fill(data.commodityItemNo.toString());
        if (data.itemNo)          await this.itemNo.fill(data.itemNo.toString());
        if (data.subItemNo)       await this.subItemNo.fill(data.subItemNo.toString());

        await this.modalSaveButton.click();
        await expect(this.modal).toBeHidden();
    }

    /**
     * Validates the Cargo tab.
     */
    async validate(data: any) {
        const activeTabPanel = this.page.getByRole('tabpanel').filter({ visible: true });
        
        // Basic Summary fields visible on the tab list
        if (data.packageCount) await this.expectData(activeTabPanel.getByTestId('packageCount'), data.packageCount.toString());
        if (data.grossWeight)  await this.expectData(activeTabPanel.getByTestId('grossWeight'), data.grossWeight.toString());
        if (data.netWeight)    await this.expectData(activeTabPanel.getByTestId('netWeight'), data.netWeight.toString());
        if (data.commodityType) await this.expectData(activeTabPanel.getByTestId('commodityType'), data.commodityType);
        
        // Air Specific if applicable and visible
        if (data.mawbRateClass)   await this.expectData(activeTabPanel.getByTestId('mawbRateClass'), data.mawbRateClass);
        if (data.mawbTotalCharge) await this.expectData(activeTabPanel.getByTestId('mawbTotalCharge'), data.mawbTotalCharge.toString());
    }
}
