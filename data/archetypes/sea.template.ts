import { ShipmentData } from '../interfaces/master.types';

// Default Sea archetype – used by all Sea shipment combinations.
// Tests override `shipmentType` and `shipmentMode` as needed.
export const seaBaseTemplate: ShipmentData = {
  details: {
    shipmentType:   'Sea Outbound',
    shipmentMode:   'MB/L',
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
