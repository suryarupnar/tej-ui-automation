import { ShipmentData } from '../interfaces/master.types';

// Default Sea archetype – used by all Sea shipment combinations.
// Tests override `shipmentType` and `shipmentMode` as needed.
//
// `mbl` / `hbl` / `trucking` keys follow the convention:
//   key = data-testid on the detail page tab
//   value = text to sendKeys AND the expected getText result
export const seaBaseTemplate: ShipmentData = {
  details: {
    shipmentType:   'Sea Outbound',
    shipmentMode:   'MB/L Only',
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
  // ── MBL tab field data ───────────────────────────────────────────────────
  // Update keys to match actual data-testid attributes in the MBL tab.
  mbl: {
    'mbl-serial-number':     'MBL-SEA-001',
    'mbl-vessel-name':       'Ever Given',
    'mbl-port-of-loading':   'Jebel Ali',
    'mbl-port-of-discharge': 'Felixstowe',
  },
  // ── HBL tab field data (only used when mode = 'MB/L & HB/L') ────────────
  hbl: {
    'hbl-serial-number':     'HBL-SEA-001',
    'hbl-port-of-loading':   'Jebel Ali',
    'hbl-port-of-discharge': 'Felixstowe',
  },
  // ── Trucking tab field data ──────────────────────────────────────────────
  trucking: {
    'trucking-vehicle-number': 'TRK-SEA-001',
    'trucking-driver-name':    'Mohammed Al Rashid',
  },
};
