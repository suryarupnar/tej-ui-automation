import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class MblTab extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    readonly mblNumber    = this.page.locator('[id$="mblNumber"]');
    readonly shippingLine = this.page.locator('div').filter({ hasText: /^Shipping Line/ }).first();
    readonly vessel       = this.page.locator('[id$="vesselName"]');

    async fill(data: any) {
        if (data.mblNumber)    await this.mblNumber.fill(data.mblNumber);
        if (data.shippingLine) await this.comboxFill(this.shippingLine, data.shippingLine);
        if (data.vessel)       await this.vessel.fill(data.vessel);
    }

    async validate(data: any) {
        if (data.mblNumber)    await this.expectData(this.mblNumber, data.mblNumber);
        if (data.shippingLine) await this.expectData(this.shippingLine, data.shippingLine);
        if (data.vessel)       await this.expectData(this.vessel, data.vessel);
    }
}
