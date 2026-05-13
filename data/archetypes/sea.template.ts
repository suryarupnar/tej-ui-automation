import { ShipmentData } from '../interfaces/master.types';

// Default Sea archetype – used by all Sea shipment combinations.
// Tests override `shipmentType` and `shipmentMode` as needed.
//
// `mbl` / `hbl` keys follow the convention:
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
  // Keys = data-testid (or role/label-based ID) of the element in the MBL tab.
  // Values = string to fill / option to select.
  //
  // Combobox fields (data-testid with getByTestId):
  //   mbl.shippingLine | mbl.coLoader | mbl.agent
  //   mbl.originOfGoods | mbl.receiptLocation | mbl.deliveryLocation
  //
  // Datepicker fields (wrapper testid suffix "-wrapper"):
  //   mbl.inwardDate-wrapper
  //   mbl.invoiceSbRows.0.invoiceDate-wrapper
  //   mbl.invoiceSbRows.0.sbDate-wrapper
  mbl: {
    // ── Header ─────────────────────────────────────────────────────────────
    'mbl.bookingNo':              '847',
    'mbl.mblNumber':              '3883',

    // ── Parties ────────────────────────────────────────────────────────────
    'mbl.shipperName':            'abc',
    'mbl.shipperFullAddress':     'acswc',
    'mbl.consigneeName':          'abca',
    'mbl.consigneeFullAddress':   'bcajhc',

    // Click 'Copy Consignee' → auto-fills Notify Party from Consignee
    'mbl.__copyConsignee':        'Copy Consignee',   // interaction: button

    'mbl.forwarderName':          'abc',
    'mbl.forwarderFullAddress':   'abc',
    'mbl.contractPartyName':      'abc',
    'mbl.contractPartyFullAddress': 'asc',
    'mbl.freightPayerName':       'abc',
    'mbl.freightPayerFullAddress': 'abc',

    // ── Carrier / Agent (MUI comboboxes) ───────────────────────────────────
    'mbl.shippingLine':           'mahesh transport',
    'mbl.coLoader':               'mahesh transport',
    'mbl.agent':                  'mahesh transport',

    // ── Voyage Details ──────────────────────────────────────────────────────
    'mbl.vessel':                 'Abc',
    'mbl.voyage':                 'abc',
    'mbl.preCarriageBy':          'abc',

    // ── Locations (combobox + free-text override) ───────────────────────────
    'mbl.originOfGoods':          'Tahuna',
    'mbl.receiptLocation':        'Bucksport',
    'mbl.deliveryLocation':       'Friendship',
    'mbl.originTerminal':         'abc',
    'mbl.destinationTerminal':    'abc',

    // ── Cargo ───────────────────────────────────────────────────────────────
    'mbl.cargoDescription':       'abc',
    'mbl.marksAndNumbers':        'abc',

    // ── Import Details ──────────────────────────────────────────────────────
    'mbl.manifestNo':             '876',
    'mbl.cfsName':                'ahbc',

    // ── Invoice / SB Row ────────────────────────────────────────────────────
    'mbl.invoiceSbRows.0.invoiceNo':                '8348493',
    'mbl.invoiceSbRows.0.invoiceDate-wrapper':       '13/05/2026',   // datepicker
    'mbl.invoiceSbRows.0.sbNo':                      '83',
    'mbl.invoiceSbRows.0.sbDate-wrapper':            '13/05/2026',   // datepicker
  },
  // ── HBL tab field data (only used when mode = 'MB/L & HB/L') ────────────
  // Combobox fields: hbl.originOfGoods | hbl.receiptLocation |
  //                  hbl.deliveryLocation | hbl.issueLocation
  // Datepicker:      hbl.issuedOn-wrapper
  hbl: {
    // ── Header ─────────────────────────────────────────────────────────────
    'hbl.hblNumber':              'hbl2934',

    // ── Parties ────────────────────────────────────────────────────────────
    'hbl.shipperName':            'ABC',
    'hbl.consigneeName':          'abc',

    // Click 'Copy Consignee' → auto-fills Notify Party from Consignee
    'hbl.__copyConsignee':        'Copy Consignee',   // interaction: button

    // ── Voyage Details ──────────────────────────────────────────────────────
    'hbl.preCarriageBy':          'abc',

    // ── Locations (MUI comboboxes) ──────────────────────────────────────────
    'hbl.originOfGoods':          'Friendship',
    'hbl.receiptLocation':        'Friendship',
    'hbl.deliveryLocation':       'Tahuna',

    // ── Cargo ───────────────────────────────────────────────────────────────
    'hbl.cargoDescription':       'abc',
    'hbl.marksAndNumbers':        'abc',

    // ── Issue Details ───────────────────────────────────────────────────────
    'hbl.issueLocation':          'Friendship',
    'hbl.issuedOn-wrapper':       '13/05/2026',   // datepicker
  },
};
