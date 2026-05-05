import { ShipmentData } from '../interfaces/master.types';

// Default Land archetype – used by all Land shipment combinations.
// Tests override `shipmentType` as needed; mode is always 'Waybill'.
export const landBaseTemplate: ShipmentData = {
  details: {
    shipmentType:   'Land Outbound',
    shipmentMode:   'Waybill',
    shipmentStatus: 'OPEN SHIPMENT',
    customer: process.env.SHIPMENT_CUSTOMER || 'Nimaptest1',
    agent:    process.env.SHIPMENT_AGENT    || 'Imran',
    user:     process.env.SHIPMENT_USER     || 'Michael Reed',
    clearanceJobNumber: '',
    secondaryServices:  [],
  },
  cargo: {
    grossWeight:  '100',
    packageCount: 1,
    packageType:  'Box',
    commodity:    'General Cargo',
  },
};
