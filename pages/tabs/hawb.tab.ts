import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class HawbTab extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    readonly hawbNumber = this.page.getByTestId('hawbNumber');
    readonly shipper    = this.page.getByTestId('shipperId');
    readonly consignee  = this.page.getByTestId('consigneeId');

    async fill(data: any) {
        if (data.hawbNumber) await this.hawbNumber.fill(data.hawbNumber);
        if (data.shipper)    await this.comboxFill(this.shipper, data.shipper);
        if (data.consignee)  await this.comboxFill(this.consignee, data.consignee);
    }

    async validate(data: any) {
        if (data.hawbNumber) await this.expectData(this.hawbNumber, data.hawbNumber);
        if (data.shipper)    await this.expectData(this.shipper, data.shipper);
        if (data.consignee)  await this.expectData(this.consignee, data.consignee);
    }
}
