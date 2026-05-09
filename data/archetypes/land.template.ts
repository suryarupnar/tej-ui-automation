import { ShipmentData } from '../interfaces/master.types';

// Default Land archetype – used by all Land shipment combinations.
// Tests override `shipmentType` as needed; mode is always 'Waybill'.
//
// `waybill` / `trucking` keys follow the convention:
//   key = data-testid on the detail page tab
//   value = text to sendKeys AND the expected getText result
export const landBaseTemplate: ShipmentData = {
  details: {
    shipmentType:   'Land Outbound',
    shipmentMode:   'Waybill',
    shipmentStatus: 'OPEN SHIPMENT',
    customer: 'Nimaptest1',
    agent:    'Imran',
    user:     'Michael Reed',
    clearanceJobNumber: '',
    secondaryServices:  [],
  },
  cargo: {
    grossWeight:  '100',
    packageCount: 1,
    packageType:  'Box',
    commodityType: 'General Cargo',
  },
  // ── Waybill tab field data ───────────────────────────────────────────────
  // Update keys to match actual data-testid attributes in the Waybill tab.
  waybill: {
    'waybill-serial-number': 'WB-LND-001',
    'waybill-carrier':       'DHL',
    'waybill-origin':        'Dubai',
    'waybill-destination':   'Abu Dhabi',
  },
  // ── Trucking tab field data ──────────────────────────────────────────────
  trucking: {
    'trucking-vehicle-number': 'TRK-001',
    'trucking-driver-name':    'Ali Hassan',
  },
};
