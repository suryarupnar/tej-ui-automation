import { ShipmentData } from '../interfaces/master.types';

// Default Air archetype – used by all Air shipment combinations.
// Tests override `shipmentType` and `shipmentMode` as needed.
//
// `mawb` keys follow the convention:  key = data-testid on the detail page
//                                      value = the string to sendKeys + assert
export const airBaseTemplate: ShipmentData = {
  details: {
    // ── Creation dialog fields ──────────────────────────────────────────────
    shipmentType:   'Air Outbound',
    shipmentMode:   'MAWB Only',
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
    tags:            [],                  // Empty to avoid flaky autocomplete
    client:          'ATMAN PHARMACEUTICALS',
    office:          'Mumbai',

    // Address section
    originCountry:      'Afghanistan',
    originAirport:      'FBD - Fayzabad Airport',
    originAddress:      'Test Origin Address',
    destinationCountry: 'India',
    destinationAirport: 'BOM - Chhatrapati Shivaji International Airport',
    destinationAddress: 'Test Destination Address',

    // Extra fields
    clearanceCompany: '',
    cfsName:  'CFS-AIR-001',
    igmNo:    'IGM-AIR-001',
    freeDays: '7',

    // Dates (DD/MM/YYYY) – set real values so datepicker fields are filled
    pickupDate:   '06/05/2026',
    etd:          '08/05/2026',
    flightDate:   '09/05/2026',
    eta:          '10/05/2026',
    arrivalDate:  '11/05/2026',
    deliveryDate: '13/05/2026',
    inwardDate:   '07/05/2026',
  },
  mawb: {
    'mawb.carrierId': '0B - Blue Air',
    'mawb.mawbNumber': 'MAWB-' + Date.now().toString().slice(-6),

    // Auto-filled from Shipment Details:
    'mawb.originAirport': 'FBD - Fayzabad Airport',
    'mawb.airportOfDepartureOnAWB': 'FBD - Fayzabad Airport',
    'mawb.destinationAirport': 'BOM - Chhatrapati Shivaji International Airport',
    'mawb.airportOfDestinationOnAWB': 'BOM - Chhatrapati Shivaji International Airport',

    // Routing section (Corrected to 'routingLegs')
    'mawb.routingLegs.0.originAirport': 'FBD - Fayzabad Airport',
    'mawb.routingLegs.0.destinationAirport': 'BOM - Chhatrapati Shivaji International Airport',

    'mawb.agent': 'Sanket imp',
    'mawb.flightNumber': 'AI101',
    'mawb.goodsDescription': 'ELECTRONIC GOODS',
    'mawb.marksAndNumbers': 'CASE 1-10',
    'mawb.remarks': 'Handle with care',
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

    // Rating
    mawbRateClass: 'M - Minimum Charge',
    tactRate:      '12',
    mawbTotalCharge: '12000',
    mawbDescription: 'Fragile',

    hawbRateClass: 'N - Normal Rate',
    hawbRate:      '12',
    hawbTotalCharge: '12000',

    // Other
    slac: '010',
    commodityItemNo: '10',
    itemNo: '1',
    subItemNo: '2',
  },

  // ── HAWB tab field data (only used when mode = 'MAWB & HAWB') ───────────
  hawb: {
    'hawb.hawbNumber':      'H-' + Date.now().toString().slice(-6),
    'hawb.shipperName':     'ABC SHIPPING LTD',
    'hawb.consigneeName':   'XYZ PHARMA',
    'hawb.notifyName':      'XYZ PHARMA',
    'hawb.goodsDescription': 'ELECTRONIC COMPONENTS',
    'hawb.marksAndNumbers':  'BOX 1-50',
    
    // Dates (wrapper IDs for datepicker)
    'hawb.letterOfCreditIssueDate-wrapper':  '01/05/2026',
    'hawb.letterOfCreditExpiryDate-wrapper': '31/12/2026',
    'hawb.issuedOn-wrapper':                 '28/05/2026',

    // Charges & Accounting
    'declaredValueForCarriage': '5000',
    'declaredValueForCustoms':  '5000',
    'amountOfInsurance':        '1000',
    'weightCharge':             '150',
    'valuationCharge':          '10',
    'tax':                      '5',
    'totalOtherChargesDueAgent': '20',
    'totalOtherChargesDueCarrier': '30',
    
    // License/Cert
    'exportLicenseNo':          'EL-9922',
    
    // Handling
    'hawb.specialServiceInformation': 'HANDLE WITH CARE',
    'hawb.otherServiceInformation':   'DO NOT STACK',
    'hawb.sci':                       'I',
  },
};

/** @deprecated Use airBaseTemplate. Kept for backwards compatibility. */
export const airOutboundTemplate = airBaseTemplate;
