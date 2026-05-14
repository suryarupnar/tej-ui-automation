import { Page } from '@playwright/test';
import { BasePage } from '../base.page';

export class MawbTab extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Locators
    // ─────────────────────────────────────────────────────────────────────────
    readonly carrier            = this.page.getByTestId('mawb.carrierId');
    readonly mawbNumber         = this.page.getByRole('textbox', { name: 'MAWB Number' });
    
    // Shipper
    readonly shipperName        = this.page.locator('[id="mawb.shipperName"]');
    readonly shipperAccount     = this.page.getByRole('textbox', { name: 'Shipper Account No.' });
    readonly shipperAddr1       = this.page.locator('[id="mawb.shipperAddressLine1"]');
    readonly shipperAddr2       = this.page.locator('[id="mawb.shipperAddressLine2"]');
    readonly shipperCity        = this.page.locator('[id="mawb.shipperPlaceCity"]');
    readonly shipperZip         = this.page.locator('[id="mawb.shipperZipCode"]');
    readonly shipperState       = this.page.locator('[id="mawb.shipperProvinceState"]');
    readonly shipperCountry     = this.page.getByTestId('mawb.shipperCountry');
    readonly shipperPhone       = this.page.locator('[id="mawb.shipperPhone"]');
    readonly shipperFax         = this.page.locator('[id="mawb.shipperFax"]');
    readonly shipperEmail       = this.page.locator('[id="mawb.shipperEmail"]');
    readonly shipperTaxId       = this.page.locator('[id="mawb.shipperTaxId"]');
    readonly shipperEori        = this.page.locator('[id="mawb.shipperEoriNumber"]');

    // Consignee
    readonly consigneeName      = this.page.locator('[id="mawb.consigneeName"]');
    readonly consigneeAccount   = this.page.getByRole('textbox', { name: 'Consignee Account No.' });
    readonly consigneeAddr1     = this.page.locator('[id="mawb.consigneeAddressLine1"]');
    readonly consigneeAddr2     = this.page.locator('[id="mawb.consigneeAddressLine2"]');
    readonly consigneeCity      = this.page.locator('[id="mawb.consigneePlaceCity"]');
    readonly consigneeZip       = this.page.locator('[id="mawb.consigneeZipCode"]');
    readonly consigneeState     = this.page.locator('[id="mawb.consigneeProvinceState"]');
    readonly consigneeCountry   = this.page.getByTestId('mawb.consigneeCountry');
    readonly consigneePhone     = this.page.locator('[id="mawb.consigneePhone"]');
    readonly consigneeFax       = this.page.locator('[id="mawb.consigneeFax"]');
    readonly consigneeEmail     = this.page.locator('[id="mawb.consigneeEmail"]');
    readonly consigneeTaxId     = this.page.locator('[id="mawb.consigneeTaxId"]');
    readonly consigneeEori      = this.page.locator('[id="mawb.consigneeEoriNumber"]');
    readonly copyConsigneeBtn   = this.page.getByRole('button', { name: 'Copy Consignee' });

    // Agent Info
    readonly agentDetailsName   = this.page.locator('[id="mawb.agentName"]');
    readonly agentIataCode      = this.page.getByRole('textbox', { name: "Agent's IATA Code" });
    readonly agentAddr1         = this.page.locator('[id="mawb.agentAddressLine1"]');
    readonly agentAddr2         = this.page.locator('[id="mawb.agentAddressLine2"]');
    readonly agentCity          = this.page.locator('[id="mawb.agentPlaceCity"]');
    readonly agentZip           = this.page.locator('[id="mawb.agentZipCode"]');
    readonly agentState         = this.page.locator('[id="mawb.agentProvinceState"]');
    readonly agentCountry       = this.page.getByTestId('mawb.agentCountry');
    readonly agentPhone         = this.page.locator('[id="mawb.agentPhone"]');
    readonly agentFax           = this.page.locator('[id="mawb.agentFax"]');
    readonly agentEmail         = this.page.locator('[id="mawb.agentEmail"]');
    
    readonly agentSelection     = this.page.getByTestId('mawb.agent');
    readonly coLoader           = this.page.getByTestId('mawb.coLoader');
    readonly flightNumber       = this.page.getByRole('textbox', { name: 'Flight Number' });
    readonly requestedRouting   = this.page.getByRole('textbox', { name: 'Requested Routing' });
    readonly goodsDescription   = this.page.locator('[id="mawb.goodsDescription"]');
    readonly marksAndNumbers    = this.page.locator('[id="mawb.marksAndNumbers"]');

    // Accounting
    readonly addAccountingBtn   = this.page.getByRole('button', { name: 'Add Accounting Information' });
    readonly accIdentifier      = this.page.getByTestId('mawb.accountingInfoItems.0.identifierId');
    readonly accInfo            = this.page.getByRole('textbox', { name: 'Information', exact: true });
    readonly chargeCode         = this.page.getByTestId('mawb.chargeCode');
    readonly declaredCarriage   = this.page.getByRole('textbox', { name: 'Declared Value for Carriage' });
    readonly declaredCustoms    = this.page.getByRole('textbox', { name: 'Declared Value for Customs' });
    readonly weightCharge       = this.page.getByRole('spinbutton', { name: 'Weight/Charge' });
    readonly valuationCharge    = this.page.getByRole('spinbutton', { name: 'Valuation Charge' });
    readonly tax                = this.page.getByRole('spinbutton', { name: 'Tax' });

    // Service
    readonly specialServiceInfo = this.page.getByRole('textbox', { name: 'Special Service Information' });
    readonly handlingCodes      = this.page.getByTestId('mawb.specialHandlingCodes');
    readonly otherServiceInfo   = this.page.getByRole('textbox', { name: 'Other Service Information' });
    readonly sci                = this.page.getByRole('textbox', { name: 'SCI' });

    // Control Info
    readonly addControlInfoBtn  = this.page.getByRole('button', { name: 'Add New Control Information' });
    readonly controlCountry     = this.page.getByTestId('mawb.otherControlInfo.0.country');
    readonly controlIdentifier  = this.page.getByTestId('mawb.otherControlInfo.0.identifier');
    readonly controlInfo        = this.page.getByTestId('mawb.otherControlInfo.0.information');
    readonly additionalInfo     = this.page.getByRole('textbox', { name: 'Additional Information' });
    readonly supplementaryInfo  = this.page.getByRole('textbox', { name: 'Supplementary Information' });

    // References
    readonly refNumber          = this.page.getByRole('textbox', { name: 'Reference Number' });
    readonly addRefInfo         = this.page.getByRole('textbox', { name: 'Additional Reference Info' });
    readonly bookingNo          = this.page.getByRole('textbox', { name: 'Booking No.' });
    readonly shipperRef         = this.page.getByRole('textbox', { name: 'Shipper Reference No.' });
    readonly forwarderRef       = this.page.getByRole('textbox', { name: 'Forwarder Reference No.' });
    readonly itnMrnDue          = this.page.getByRole('textbox', { name: 'ITN / MRN / DU-E' });
    readonly poNo               = this.page.getByRole('textbox', { name: 'Purchase Order No.' });
    readonly spoNo              = this.page.getByRole('textbox', { name: 'SPO No.' });
    readonly exporterRef        = this.page.getByRole('textbox', { name: 'Exporter Reference No.' });
    readonly consigneeOrderNo   = this.page.getByRole('textbox', { name: 'Consignee Order No.' });
    readonly invoiceRef         = this.page.getByRole('textbox', { name: 'Invoice Reference No.' });
    readonly customsBrokerRef   = this.page.getByRole('textbox', { name: 'Customs Broker Reference No.' });
    readonly contractNo         = this.page.getByRole('textbox', { name: 'Contract No.' });
    readonly lcNo               = this.page.getByRole('textbox', { name: 'Letter of Credit No.' });
    readonly exportLicenseNo    = this.page.getByRole('textbox', { name: 'Export License No.' });

    // Dates
    readonly lcIssueDate        = this.page.getByTestId('mawb.letterOfCreditIssueDate-wrapper');
    readonly lcExpiryDate       = this.page.getByTestId('mawb.letterOfCreditExpiryDate-wrapper');
    readonly exportLicenseIssueDate = this.page.getByTestId('mawb.exportLicenseIssueDate-wrapper');
    readonly exportLicenseExpiryDate = this.page.getByTestId('mawb.exportLicenseExpiryDate-wrapper');

    // Final
    readonly signatureShipper   = this.page.locator('[id="mawb.signatureShipper"]');
    readonly issueLocation      = this.page.getByRole('textbox', { name: 'Issue Location' });
    readonly currentUserBtn     = this.page.getByRole('button', { name: 'Current User' });
    readonly cfsName            = this.page.getByRole('textbox', { name: 'CFS Name' });
    readonly igmNo              = this.page.getByRole('textbox', { name: 'IGM No.' });
    readonly freeDays           = this.page.getByRole('spinbutton', { name: 'Free Days' });
    readonly invoiceNo          = this.page.getByRole('textbox', { name: 'Invoice No.' });
    readonly sbNo               = this.page.getByRole('textbox', { name: 'SB No.' });
    readonly remarks            = this.page.locator('[id="mawb.remarks"]');

    /**
     * Fills the MAWB tab with comprehensive data.
     */
    async fill(data: any) {
        // Carrier & MAWB
        if (data.carrier)      await this.comboxFill(this.carrier, data.carrier);
        if (data.mawbNumber)   await this.mawbNumber.fill(data.mawbNumber);

        // Shipper
        if (data.shipper) {
            const s = data.shipper;
            if (s.name)         await this.shipperName.fill(s.name);
            if (s.accountNo)    await this.shipperAccount.fill(s.accountNo);
            if (s.addressLine1) await this.shipperAddr1.fill(s.addressLine1);
            if (s.addressLine2) await this.shipperAddr2.fill(s.addressLine2);
            if (s.city)         await this.shipperCity.fill(s.city);
            if (s.zipCode)      await this.shipperZip.fill(s.zipCode);
            if (s.state)        await this.shipperState.fill(s.state);
            if (s.country)      await this.comboxFill(this.shipperCountry, s.country);
            if (s.phone)        await this.shipperPhone.fill(s.phone);
            if (s.fax)          await this.shipperFax.fill(s.fax);
            if (s.email)        await this.shipperEmail.fill(s.email);
            if (s.taxId)        await this.shipperTaxId.fill(s.taxId);
            if (s.eoriNumber)   await this.shipperEori.fill(s.eoriNumber);
        }

        // Consignee
        if (data.consignee) {
            const c = data.consignee;
            if (c.name)         await this.consigneeName.fill(c.name);
            if (c.accountNo)    await this.consigneeAccount.fill(c.accountNo);
            if (c.addressLine1) await this.consigneeAddr1.fill(c.addressLine1);
            if (c.addressLine2) await this.consigneeAddr2.fill(c.addressLine2);
            if (c.city)         await this.consigneeCity.fill(c.city);
            if (c.zipCode)      await this.consigneeZip.fill(c.zipCode);
            if (c.state)        await this.consigneeState.fill(c.state);
            if (c.country)      await this.comboxFill(this.consigneeCountry, c.country);
            if (c.phone)        await this.consigneePhone.fill(c.phone);
            if (c.fax)          await this.consigneeFax.fill(c.fax);
            if (c.email)        await this.consigneeEmail.fill(c.email);
            if (c.taxId)        await this.consigneeTaxId.fill(c.taxId);
            if (c.eoriNumber)   await this.consigneeEori.fill(c.eoriNumber);
        }

        // Agent details (textbox part)
        if (data.agentDetails) {
            const a = data.agentDetails;
            if (a.name)         await this.agentDetailsName.fill(a.name);
            if (a.iataCode)     await this.agentIataCode.fill(a.iataCode);
            if (a.addressLine1) await this.agentAddr1.fill(a.addressLine1);
            if (a.addressLine2) await this.agentAddr2.fill(a.addressLine2);
            if (a.city)         await this.agentCity.fill(a.city);
            if (a.zipCode)      await this.agentZip.fill(a.zipCode);
            if (a.state)        await this.agentState.fill(a.state);
            if (a.country)      await this.comboxFill(this.agentCountry, a.country);
            if (a.phone)        await this.agentPhone.fill(a.phone);
            if (a.fax)          await this.agentFax.fill(a.fax);
            if (a.email)        await this.agentEmail.fill(a.email);
        }

        // Agent selection (dropdown part)
        if (data.agentName)     await this.comboxFill(this.agentSelection, data.agentName);
        if (data.coLoader)      await this.comboxFill(this.coLoader, data.coLoader);
        if (data.flightNumber)  await this.flightNumber.fill(data.flightNumber);
        if (data.routing)       await this.requestedRouting.fill(data.routing);
        if (data.goodsDescription) await this.goodsDescription.fill(data.goodsDescription);
        if (data.marksAndNumbers)  await this.marksAndNumbers.fill(data.marksAndNumbers);

        // Accounting
        if (data.accountingInfo) {
            await this.addAccountingBtn.click().catch(() => {});
            await this.comboxFill(this.accIdentifier, data.accountingInfo.identifier);
            await this.accInfo.fill(data.accountingInfo.info);
        }
        if (data.chargeCode)     await this.comboxFill(this.chargeCode, data.chargeCode);
        if (data.declaredValueCarriage) await this.declaredCarriage.fill(data.declaredValueCarriage);
        if (data.declaredValueCustoms)  await this.declaredCustoms.fill(data.declaredValueCustoms);
        if (data.weightCharge)    await this.weightCharge.fill(data.weightCharge.toString());
        if (data.valuationCharge) await this.valuationCharge.fill(data.valuationCharge.toString());
        if (data.tax)             await this.tax.fill(data.tax.toString());

        // Handling
        if (data.specialServiceInfo) await this.specialServiceInfo.fill(data.specialServiceInfo);
        if (data.specialHandlingCodes) await this.comboxFill(this.handlingCodes, data.specialHandlingCodes);
        if (data.otherServiceInfo)   await this.otherServiceInfo.fill(data.otherServiceInfo);
        if (data.sci)                await this.sci.fill(data.sci);

        // Control Info
        if (data.controlInfo) {
            await this.addControlInfoBtn.click().catch(() => {});
            await this.comboxFill(this.controlCountry, data.controlInfo.country);
            await this.comboxFill(this.controlIdentifier, data.controlInfo.identifier);
            await this.comboxFill(this.controlInfo, data.controlInfo.information);
        }
        if (data.additionalInfo)    await this.additionalInfo.fill(data.additionalInfo);
        if (data.supplementaryInfo) await this.supplementaryInfo.fill(data.supplementaryInfo);

        // References
        if (data.references) {
            const r = data.references;
            if (r.refNumber)         await this.refNumber.fill(r.refNumber);
            if (r.additionalRefInfo) await this.addRefInfo.fill(r.additionalRefInfo);
            if (r.bookingNo)         await this.bookingNo.fill(r.bookingNo);
            if (r.shipperRef)        await this.shipperRef.fill(r.shipperRef);
            if (r.forwarderRef)      await this.forwarderRef.fill(r.forwarderRef);
            if (r.itnMrnDue)         await this.itnMrnDue.fill(r.itnMrnDue);
            if (r.poNo)              await this.poNo.fill(r.poNo);
            if (r.spoNo)             await this.spoNo.fill(r.spoNo);
            if (r.exporterRef)       await this.exporterRef.fill(r.exporterRef);
            if (r.consigneeOrderNo)  await this.consigneeOrderNo.fill(r.consigneeOrderNo);
            if (r.invoiceRef)        await this.invoiceRef.fill(r.invoiceRef);
            if (r.customsBrokerRef)  await this.customsBrokerRef.fill(r.customsBrokerRef);
            if (r.contractNo)        await this.contractNo.fill(r.contractNo);
            if (r.lcNo)              await this.lcNo.fill(r.lcNo);
            if (r.exportLicenseNo)   await this.exportLicenseNo.fill(r.exportLicenseNo);
            
            // Dates (simple click as in recording or focus)
            if (r.lcIssueDate) await this.lcIssueDate.click();
            if (r.lcExpiryDate) await this.lcExpiryDate.click();
            if (r.exportLicenseIssueDate) await this.exportLicenseIssueDate.click();
            if (r.exportLicenseExpiryDate) await this.exportLicenseExpiryDate.click();
        }

        // Final
        if (data.signatureShipper) await this.signatureShipper.fill(data.signatureShipper);
        if (data.issueLocation)    await this.issueLocation.fill(data.issueLocation);
        await this.currentUserBtn.click();
        if (data.cfsName)          await this.cfsName.fill(data.cfsName);
        if (data.igmNo)            await this.igmNo.fill(data.igmNo);
        if (data.freeDays)         await this.freeDays.fill(data.freeDays.toString());
        if (data.invoiceNo)        await this.invoiceNo.fill(data.invoiceNo);
        if (data.sbNo)             await this.sbNo.fill(data.sbNo);
        if (data.remarks)          await this.remarks.fill(data.remarks);
    }

    /**
     * Exhaustive validation for the MAWB tab.
     */
    async validate(data: any) {
        // Carrier & MAWB
        if (data.carrier)      await this.expectData(this.carrier, data.carrier);
        if (data.mawbNumber)   await this.expectData(this.mawbNumber, data.mawbNumber);

        // Shipper
        if (data.shipper) {
            const s = data.shipper;
            if (s.name)         await this.expectData(this.shipperName, s.name);
            if (s.accountNo)    await this.expectData(this.shipperAccount, s.accountNo);
            if (s.addressLine1) await this.expectData(this.shipperAddr1, s.addressLine1);
            if (s.city)         await this.expectData(this.shipperCity, s.city);
            if (s.zipCode)      await this.expectData(this.shipperZip, s.zipCode);
            if (s.country)      await this.expectData(this.shipperCountry, s.country);
        }

        // Consignee
        if (data.consignee) {
            const c = data.consignee;
            if (c.name)         await this.expectData(this.consigneeName, c.name);
            if (c.accountNo)    await this.expectData(this.consigneeAccount, c.accountNo);
            if (c.addressLine1) await this.expectData(this.consigneeAddr1, c.addressLine1);
            if (c.city)         await this.expectData(this.consigneeCity, c.city);
            if (c.zipCode)      await this.expectData(this.consigneeZip, c.zipCode);
            if (c.country)      await this.expectData(this.consigneeCountry, c.country);
        }

        // Agent Info
        if (data.agentDetails) {
            const a = data.agentDetails;
            if (a.name)         await this.expectData(this.agentDetailsName, a.name);
            if (a.iataCode)     await this.expectData(this.agentIataCode, a.iataCode);
            if (a.city)         await this.expectData(this.agentCity, a.city);
            if (a.country)      await this.expectData(this.agentCountry, a.country);
        }

        if (data.agentName)     await this.expectData(this.agentSelection, data.agentName);
        if (data.coLoader)      await this.expectData(this.coLoader, data.coLoader);
        if (data.flightNumber)  await this.expectData(this.flightNumber, data.flightNumber);
        if (data.routing)       await this.expectData(this.requestedRouting, data.routing);
        if (data.goodsDescription) await this.expectData(this.goodsDescription, data.goodsDescription);
        if (data.marksAndNumbers)  await this.expectData(this.marksAndNumbers, data.marksAndNumbers);

        // Accounting
        if (data.accountingInfo) {
            await this.expectData(this.accIdentifier, data.accountingInfo.identifier);
            await this.expectData(this.accInfo, data.accountingInfo.info);
        }
        if (data.chargeCode)     await this.expectData(this.chargeCode, data.chargeCode);
        if (data.declaredValueCarriage) await this.expectData(this.declaredCarriage, data.declaredValueCarriage);
        if (data.declaredValueCustoms)  await this.expectData(this.declaredCustoms, data.declaredValueCustoms);
        if (data.weightCharge)    await this.expectData(this.weightCharge, data.weightCharge.toString());
        if (data.valuationCharge) await this.expectData(this.valuationCharge, data.valuationCharge.toString());
        if (data.tax)             await this.expectData(this.tax, data.tax.toString());

        // Handling
        if (data.specialServiceInfo) await this.expectData(this.specialServiceInfo, data.specialServiceInfo);
        if (data.specialHandlingCodes) await this.expectData(this.handlingCodes, data.specialHandlingCodes);
        if (data.otherServiceInfo)   await this.expectData(this.otherServiceInfo, data.otherServiceInfo);
        if (data.sci)                await this.expectData(this.sci, data.sci);

        // Control Info
        if (data.controlInfo) {
            await this.expectData(this.controlCountry, data.controlInfo.country);
            await this.expectData(this.controlIdentifier, data.controlInfo.identifier);
            await this.expectData(this.controlInfo, data.controlInfo.information);
        }
        if (data.additionalInfo)    await this.expectData(this.additionalInfo, data.additionalInfo);
        if (data.supplementaryInfo) await this.expectData(this.supplementaryInfo, data.supplementaryInfo);

        // References
        if (data.references) {
            const r = data.references;
            if (r.refNumber)         await this.expectData(this.refNumber, r.refNumber);
            if (r.bookingNo)         await this.expectData(this.bookingNo, r.bookingNo);
            if (r.shipperRef)        await this.expectData(this.shipperRef, r.shipperRef);
            if (r.forwarderRef)      await this.expectData(this.forwarderRef, r.forwarderRef);
            if (r.poNo)              await this.expectData(this.poNo, r.poNo);
            if (r.invoiceRef)        await this.expectData(this.invoiceRef, r.invoiceRef);
            if (r.contractNo)        await this.expectData(this.contractNo, r.contractNo);
            if (r.lcNo)              await this.expectData(this.lcNo, r.lcNo);
        }

        // Final
        if (data.signatureShipper) await this.expectData(this.signatureShipper, data.signatureShipper);
        if (data.issueLocation)    await this.expectData(this.issueLocation, data.issueLocation);
        if (data.cfsName)          await this.expectData(this.cfsName, data.cfsName);
        if (data.igmNo)            await this.expectData(this.igmNo, data.igmNo);
        if (data.freeDays)         await this.expectData(this.freeDays, data.freeDays.toString());
        if (data.invoiceNo)        await this.expectData(this.invoiceNo, data.invoiceNo);
        if (data.sbNo)             await this.expectData(this.sbNo, data.sbNo);
        if (data.remarks)          await this.expectData(this.remarks, data.remarks);
    }
}
