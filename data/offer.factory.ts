import { deepMerge, DeepPartial } from '../utils/object.utils';
import { OfferData } from './interfaces/offer.types';
import { offerBaseTemplate } from './archetypes/offer.template';
import { TabFieldMap, TabFieldEntry } from './interfaces/tab.field.types';

/**
 * Creates an Air Offer data payload.
 */
export function createAirOffer(overrides?: DeepPartial<OfferData>): OfferData {
    return deepMerge(offerBaseTemplate, overrides);
}

/**
 * Placeholder for Sea Offer data payload.
 */
export function createSeaOffer(overrides?: DeepPartial<OfferData>): OfferData {
    return deepMerge(offerBaseTemplate, overrides);
}

/**
 * Placeholder for Land Offer data payload.
 */
export function createLandOffer(overrides?: DeepPartial<OfferData>): OfferData {
    return deepMerge(offerBaseTemplate, overrides);
}

/**
 * Maps the OfferData object to UI fields (testIds) for each tab.
 */
export function resolveOfferTabFieldMap(data: OfferData): TabFieldMap {
    const map: TabFieldMap = {};

    // 1. General Details Tab
    const generalFields: TabFieldEntry[] = [
        { testId: 'clientId',        value: data.general.client.client,        interaction: 'combobox' },
        { testId: 'branchId',        value: data.general.client.branch,        interaction: 'combobox' },
        { testId: 'contactPersonId', value: data.general.client.contactPerson, interaction: 'combobox' },
        { testId: 'originCountryId',      value: data.general.address.originCountry,      interaction: 'combobox' },
        { testId: 'originAirportId',      value: data.general.address.originAirport ?? '',      interaction: 'combobox' },
        { testId: 'destinationCountryId', value: data.general.address.destinationCountry, interaction: 'combobox' },
        { testId: 'destinationAirportId', value: data.general.address.destinationAirport ?? '', interaction: 'combobox' },
        { testId: 'shipperId',          value: data.general.details.shipper,        interaction: 'fill' },
        { testId: 'consigneeId',        value: data.general.details.consignee,      interaction: 'fill' },
        { testId: 'lineOfBusinessId',   value: data.general.details.lineOfBusiness, interaction: 'combobox' },
        { testId: 'shippingTermId',     value: data.general.details.shippingTerm,   interaction: 'combobox' },
        { testId: 'validityForId',      value: data.general.details.validityFor,    interaction: 'combobox' },
        { testId: 'validityStatusId',   value: data.general.details.validityStatus, interaction: 'combobox' },
        { testId: 'validityDate',       value: data.general.details.validityDate,   interaction: 'datepicker' },
        { testId: 'shipmentTypeId',     value: data.general.details.shipmentType,   interaction: 'combobox' },
        { testId: 'receivedFromId',     value: data.general.details.receivedFrom,   interaction: 'combobox' },
    ];
    
    map['General Details'] = generalFields;
    
    return map;
}
