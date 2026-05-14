import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class WaybillTab extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    readonly waybillNumber = this.page.locator('[id$="waybillNumber"]');
    readonly transporter   = this.page.locator('div').filter({ hasText: /^Transporter/ }).first();

    async fill(data: any) {
        if (data.waybillNumber) await this.waybillNumber.fill(data.waybillNumber);
        if (data.transporter)   await this.comboxFill(this.transporter, data.transporter);
    }

    async validate(data: any) {
        if (data.waybillNumber) await this.expectData(this.waybillNumber, data.waybillNumber);
        if (data.transporter)   await this.expectData(this.transporter, data.transporter);
    }
}
