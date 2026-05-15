import { TabFieldMap } from './tab.field.types';
import { OfferGeneralData } from './offer.general.types';

export interface OfferFinancialData {
    [key: string]: any;
}

export interface OfferRemarksData {
    [key: string]: any;
}

export interface OfferCargoData {
    grossWeight: string;
    grossVolume: string;
    packageCount: string;
    packageType: string;
    commodityType: string;
    description: string;
}

/**
 * Master shape for a full Offer data payload.
 */
export interface OfferData {
    general: OfferGeneralData;
    cargo?: OfferCargoData; // Added back as requested
    financial?: OfferFinancialData;
    remarks?: OfferRemarksData;
    tabFieldMap?: TabFieldMap;
}
