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

    // ── Shipment Details tab – post-creation editable fields ───────────────
    lineOfBusiness:  'Freight Forwarding',
    shippingTerms:   'FCA',
    category:        'Dry Bulk',          // shipmentTypeId dropdown
    nominatedBy:     'Agent',             // nominationType dropdown
    tags:            [],
    client:          'ATMAN PHARMACEUTICALS',

    // Address section
    originCountry:      'India',
    originPort:         'INMUN - Mundra India',
    originAddress:      'Sea Origin Address',
    destinationCountry: 'India',
    destinationPort:    'INPBD - Porbandar India',
    destinationAddress: 'Sea Destination Address',
  },
  cargo: {
    // First dimension row
    packageCount: 1000,
    length:       '1000',
    width:        '1',
    height:       '1000',
    grossWeight:  '2',

    // Calculated / Summary
    netWeight:    '2',
    grossVolume:  '0.000',
    commodityType: 'Cereals',
    description:   'Fragile',
    hsCode:        '123',
    subheading:    'ABC',

    // Sea Specific (visible in UI screenshot)
    packageType:      'Box',
    currency:         'USD - US Dollar',
    chargeableWeight: '2.000',
    declaredValue:    '5000',
    pcinNumber:       'PCIN-SEA-001',
    mcinNumber:       'MCIN-SEA-001',
    csnNumber:        'CSN-SEA-001',

    // Other
    itemNo: '1',
    subItemNo: '2',
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
