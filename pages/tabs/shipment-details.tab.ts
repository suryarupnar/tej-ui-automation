import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class ShipmentDetailsTab extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Locators
    // ─────────────────────────────────────────────────────────────────────────
    readonly lineOfBusiness     = this.page.getByTestId('lineOfBusinessId');
    readonly shippingTerms      = this.page.getByTestId('shippingTermsId');
    readonly category           = this.page.getByTestId('shipmentTypeId');
    readonly nominatedBy        = this.page.getByTestId('nominationType');
    readonly tags               = this.page.getByTestId('tagIds');
    readonly client             = this.page.getByTestId('clientId');
    readonly clientBranch       = this.page.getByTestId('clientBranchId');
    readonly contactPerson      = this.page.getByTestId('contactPersonId');
    readonly clearanceCompany   = this.page.getByTestId('clearanceCompany');
    
    readonly originCountry      = this.page.locator('div').filter({ hasText: /^Origin Country/ }).first();
    readonly originAirport      = this.page.locator('div').filter({ hasText: /^Airport of Loading/ }).first();
    readonly originPort         = this.page.locator('div').filter({ hasText: /^Port of Loading/ }).first();
    readonly originAddress      = this.page.locator('#originAddress');
    
    readonly destinationCountry = this.page.locator('div').filter({ hasText: /^Destination Country/ }).first();
    readonly destinationAirport = this.page.locator('div').filter({ hasText: /^Airport of Discharge/ }).first();
    readonly destinationPort    = this.page.locator('div').filter({ hasText: /^Port of Discharge/ }).first();
    readonly destinationAddress = this.page.locator('#destinationAddress');

    // Date Wrappers
    readonly pickupDateWrapper  = this.page.getByTestId('pickupDate-wrapper');
    readonly etdWrapper         = this.page.getByTestId('estimatedTimeDepartureDate-wrapper');
    readonly flightDateWrapper  = this.page.getByTestId('loadingDate-wrapper');
    readonly etaWrapper         = this.page.getByTestId('estimatedTimeArrivalDate-wrapper');
    readonly arrivalDateWrapper = this.page.getByTestId('arrivalDate-wrapper');
    readonly deliveryDateWrapper= this.page.getByTestId('deliveryDate-wrapper');
    readonly inwardDateWrapper  = this.page.getByTestId('inWardDate-wrapper');

    // Date Modal
    readonly editDatesBtn   = this.page.getByRole('button', { name: 'Edit Dates' });
    readonly modalSaveBtn   = this.page.getByRole('button', { name: 'Save' });

    /**
     * Fills the Shipment Details tab.
     */
    async fill(data: any) {
        if (data.lineOfBusiness) await this.comboxFill(this.lineOfBusiness, data.lineOfBusiness);
        if (data.shippingTerms)  await this.comboxFill(this.shippingTerms, data.shippingTerms);
        if (data.category)       await this.comboxFill(this.category, data.category);
        if (data.nominatedBy)    await this.comboxFill(this.nominatedBy, data.nominatedBy);
        if (data.tags)           await this.comboxFill(this.tags, data.tags);
        
        if (data.client)         await this.comboxFill(this.client, data.client);
        if (data.clientBranch)   await this.comboxFill(this.clientBranch, data.clientBranch);
        if (data.contactPerson)  await this.comboxFill(this.contactPerson, data.contactPerson);
        
        if (data.clearanceCompany) await this.clearanceCompany.fill(data.clearanceCompany);
        
        if (data.originCountry)      await this.comboxFill(this.originCountry, data.originCountry);
        if (data.originAirport)      await this.comboxFill(this.originAirport, data.originAirport);
        if (data.originPort)         await this.comboxFill(this.originPort, data.originPort);
        if (data.originAddress)      await this.originAddress.fill(data.originAddress);
        
        if (data.destinationCountry) await this.comboxFill(this.destinationCountry, data.destinationCountry);
        if (data.destinationAirport) await this.comboxFill(this.destinationAirport, data.destinationAirport);
        if (data.destinationPort)    await this.comboxFill(this.destinationPort, data.destinationPort);
        if (data.destinationAddress) await this.destinationAddress.fill(data.destinationAddress);

        // Fill Dates if provided
        if (data.dates) await this.fillDates(data.dates);
    }

    /**
     * Fills a MUI v6 DatePicker by clicking the Day spinbutton and typing the
     * date digits. MUI routes each digit into DD / MM / YYYY segments in order.
     * Accepts dates in DD/MM/YYYY or DDMMYYYY format.
     */
    private async fillDatePickerInContainer(container: Locator, dateStr: string) {
        // Strip separators → '06/05/2026' becomes '06052026'
        const digits = dateStr.replace(/[\/\-]/g, '');

        // Click the Day spinbutton to give it focus
        const daySpinbutton = container.getByRole('spinbutton', { name: 'Day' });
        await daySpinbutton.waitFor({ state: 'visible', timeout: 5000 });
        await daySpinbutton.click();

        // Type all digits — MUI automatically advances through DD → MM → YYYY
        await this.page.keyboard.type(digits, { delay: 50 });
    }

    async fillDates(dates: any) {
        await this.editDatesBtn.click();
        
        // Scope to dialog — avoids strict mode violation from duplicate data-testids
        const dialog = this.page.getByRole('dialog', { name: /Edit Job File Dates/ });
        await dialog.waitFor({ state: 'visible' });

        // These 6 fields are INSIDE the modal dialog
        const dialogDateFields = [
            { data: dates.pickupDate,   testId: 'pickupDate-wrapper' },
            { data: dates.etd,          testId: 'estimatedTimeDepartureDate-wrapper' },
            { data: dates.flightDate,   testId: 'loadingDate-wrapper' },
            { data: dates.eta,          testId: 'estimatedTimeArrivalDate-wrapper' },
            { data: dates.arrivalDate,  testId: 'arrivalDate-wrapper' },
            { data: dates.deliveryDate, testId: 'deliveryDate-wrapper' },
        ];

        for (const field of dialogDateFields) {
            if (field.data) {
                const wrapper = dialog.getByTestId(field.testId);
                await this.fillDatePickerInContainer(wrapper, field.data);
                // Small pause so MUI commits each date before moving on
                await this.page.waitForTimeout(200);
            }
        }

        await dialog.getByRole('button', { name: 'Save' }).click();
        await dialog.waitFor({ state: 'hidden' });

        // ⚠️ inwardDate is in the Extra Fields section on the MAIN PAGE, not in the dialog
        if (dates.inwardDate) {
            const inwardWrapper = this.page.getByTestId('inWardDate-wrapper');
            await this.fillDatePickerInContainer(inwardWrapper, dates.inwardDate);
            await this.page.keyboard.press('Tab');
        }
    }

    /**
     * Validates the Shipment Details tab.
     */
    async validate(data: any) {
        if (data.lineOfBusiness) await this.expectData(this.lineOfBusiness, data.lineOfBusiness);
        if (data.shippingTerms)  await this.expectData(this.shippingTerms, data.shippingTerms);
        if (data.category)       await this.expectData(this.category, data.category);
        if (data.nominatedBy)    await this.expectData(this.nominatedBy, data.nominatedBy);
        
        if (data.client)         await this.expectData(this.client, data.client);
        if (data.clientBranch)   await this.expectData(this.clientBranch, data.clientBranch);
        if (data.contactPerson)  await this.expectData(this.contactPerson, data.contactPerson);
        
        if (data.clearanceCompany) await this.expectData(this.clearanceCompany, data.clearanceCompany);
        
        if (data.originCountry)      await this.expectData(this.originCountry, data.originCountry);
        if (data.originAirport)      await this.expectData(this.originAirport, data.originAirport);
        if (data.originAddress)      await this.expectData(this.originAddress, data.originAddress);
        
        if (data.destinationCountry) await this.expectData(this.destinationCountry, data.destinationCountry);
        if (data.destinationAirport) await this.expectData(this.destinationAirport, data.destinationAirport);
        if (data.destinationAddress) await this.expectData(this.destinationAddress, data.destinationAddress);
    }
}
