import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class HblTab extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    readonly hblNumber = this.page.locator('[id$="hblNumber"]');
    readonly shipper   = this.page.locator('div').filter({ hasText: /^Shipper/ }).first();

    async fill(data: any) {
        if (data.hblNumber) await this.hblNumber.fill(data.hblNumber);
        if (data.shipper)   await this.comboxFill(this.shipper, data.shipper);
    }

    async validate(data: any) {
        if (data.hblNumber) await this.expectData(this.hblNumber, data.hblNumber);
        if (data.shipper)   await this.expectData(this.shipper, data.shipper);
    }
}
