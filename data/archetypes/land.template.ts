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
    clearanceCompany: '',
    secondaryServices:  [],

    // ── Shipment Details tab fields ───────────────
    lineOfBusiness:  'Freight Forwarding',
    shippingTerms:   'FCA',
    category:        'Dry Bulk',
    nominatedBy:     'Agent',
    tags:            [],
    client:          'ATMAN PHARMACEUTICALS',
    office:          'Mumbai',

    originCountry:      'India',
    originAddress:      'Mumbai Test Address',
    destinationCountry: 'United Arab Emirates',
    destinationAddress: 'Dubai Test Address',
  },
  cargo: {
    grossWeight:  '100',
    packageCount: 1,
    packageType:  'Box',
    commodityType: 'Cereals',
  },
  // ── Waybill tab field data ───────────────────────────────────────────────
  // Update keys to match actual data-testid attributes in the Waybill tab.
  waybill: {
    'waybill.waybillNumber': 'W-' + Date.now().toString().slice(-6),
    
    // Shipper
    'waybill.shipperName':         'ABC EXPORTS',
    'waybill.shipperAccountNo':    'ACC-991',
    'waybill.shipperAddressLine1': 'Sector 10',
    'waybill.shipperAddressLine2': 'MIDC',
    'waybill.shipperPlaceCity':    'Mumbai',
    'waybill.shipperZipCode':      '400001',
    'waybill.shipperPostPortStatus': 'Maharashtra',
    'waybill.shipperCountry':      'India',
    
    // Consignee
    'waybill.consigneeName':         'XYZ IMPORTS',
    'waybill.consigneeAddressLine1': 'Road 44',
    'waybill.consigneePlaceCity':    'Dubai',
    'waybill.consigneeCountry':      'United Arab Emirates',

    // Cargo Info
    'waybill.fullOriginDescription': 'GENERAL LAND CARGO',
    'waybill.marksAndNumbers':       'PACK-1-50',

    // Address Details
    'waybill.originCountry':      'India',
    'waybill.originAddress':      'Mumbai, Maharashtra',
    'waybill.destinationCountry': 'United Arab Emirates',
    'waybill.destinationAddress': 'Dubai, UAE',

    // References & Accounting
    'waybill.attachedDocuments':  'INVOICE, PACKING LIST',
    'waybill.senderInstructions': 'DELIVER BEFORE 5PM',
    'waybill.declaredValueInp':   '15000',
    'waybill.issueLocation':      'MUMBAI',
    'waybill.issuedOn-wrapper':   '28/05/2026',
    'waybill.remarks':            'LAND SHIPMENT TEST',
  },
};
