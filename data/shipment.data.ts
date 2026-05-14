import { shipmentDetailsData } from './tabs/shipment-details.data';
import { cargoData }           from './tabs/cargo.data';
import { mawbData }            from './tabs/mawb.data';
import { hawbData }            from './tabs/hawb.data';
import { mblData }             from './tabs/mbl.data';
import { hblData }             from './tabs/hbl.data';
import { waybillData }         from './tabs/waybill.data';

export type ShipmentData = {
    details:  any;
    cargo?:   any;
    mawb?:    any;
    hawb?:    any;
    mbl?:     any;
    hbl?:     any;
    waybill?: any;
};

/**
 * SIMPLIFIED DATA STORAGE
 * Each tab has its own data object. 
 * Coordination with Page Objects is direct and easy.
 */
export const shipmentData = {
    details:  shipmentDetailsData,
    cargo:    cargoData,
    mawb:     mawbData,
    hawb:     hawbData,
    mbl:      mblData,
    hbl:      hblData,
    waybill:  waybillData,
};

export {
    shipmentDetailsData,
    cargoData,
    mawbData,
    hawbData,
    mblData,
    hblData,
    waybillData,
};
