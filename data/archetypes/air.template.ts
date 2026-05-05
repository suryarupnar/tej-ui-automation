import { ShipmentData } from '../interfaces/master.types';

// Default Air archetype – used by all Air shipment combinations.
// Tests override `shipmentType` and `shipmentMode` as needed.
export const airBaseTemplate: ShipmentData = {
  details: {
    shipmentType:   'Air Outbound',
    shipmentMode:   'MAWB',
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

/** @deprecated Use airBaseTemplate. Kept for backwards compatibility. */
export const airOutboundTemplate = airBaseTemplate;
