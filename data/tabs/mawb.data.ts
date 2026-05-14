export const mawbData = {
    carrier:      '0B - Blue Air',
    mawbNumber:   'MAWB0112',
    
    // Shipper
    shipper: {
        name:         'XYZ EXPORTS',
        accountNo:    '12327832',
        addressLine1: 'Industrial Area Phase 1',
        addressLine2: 'Near Main Gate',
        city:         'Mumbai',
        zipCode:      '400001',
        state:        'Maharashtra',
        country:      'India',
        phone:        '9876543210',
        fax:          '9876543211',
        email:        'shipper@example.com',
        taxId:        'TAX12345',
        eoriNumber:   'EORI6789'
    },

    // Consignee
    consignee: {
        name:         'ABC IMPORTS',
        accountNo:    '12323',
        addressLine1: 'Business Park East',
        addressLine2: 'Suite 200',
        city:         'London',
        zipCode:      'EC1A 1BB',
        state:        'Greater London',
        country:      'United Kingdom',
        phone:        '1234567890',
        fax:          '1234567891',
        email:        'consignee@example.com',
        taxId:        'TAX9876',
        eoriNumber:   'EORI4321'
    },

    // Agent
    agentDetails: {
        name:         'GLOBAL FREIGHT AGENTS',
        iataCode:     'A1203',
        addressLine1: 'Cargo Complex',
        addressLine2: 'Terminal 2',
        city:         'Mumbai',
        zipCode:      '400099',
        state:        'Maharashtra',
        country:      'India',
        phone:        '2244668800',
        fax:          '2244668811',
        email:        'agent@example.com'
    },

    agentName:    'Air Line India Pvt Ltd',
    coLoader:     'Air Line India Pvt Ltd',
    flightNumber: 'AIR123',
    routing:      'BOM-LHR',
    goodsDescription: 'ELECTRONIC GOODS',
    marksAndNumbers:  'E-001 TO E-100',

    // Accounting
    accountingInfo: {
        identifier: 'BOL - Bill of flying',
        info:       'PREPAID SHIPMENT'
    },

    chargeCode:               'FC - FREIGHT_CHARGE',
    declaredValueCarriage:    '5000',
    declaredValueCustoms:     '5000',
    weightCharge:             '1200',
    valuationCharge:          '100',
    tax:                      '110',

    // Handling
    specialServiceInfo:       'KEEP UPRIGHT',
    specialHandlingCodes:     ['ACT - Active Temperature'],
    otherServiceInfo:         'DIRECT FLIGHT PREFERRED',
    sci:                      'I',

    // Control Info
    controlInfo: {
        country:     'India',
        identifier:  'ACC_PRIM_010 - Primary',
        information: 'ACCOUNT CONSIGNOR'
    },

    additionalInfo:           'FRAGILE CARGO',
    supplementaryInfo:        'DO NOT STACK',

    // References
    references: {
        refNumber:            'REF-123',
        additionalRefInfo:    'ADD-REF',
        bookingNo:            'BOK-456',
        shipperRef:           'SHP-789',
        forwarderRef:         'FWD-101',
        itnMrnDue:            'ITN-202',
        poNo:                 'PO-303',
        spoNo:                'SPO-404',
        exporterRef:          'EXP-505',
        consigneeOrderNo:     'CON-606',
        invoiceRef:           'INV-707',
        customsBrokerRef:     'CBR-808',
        contractNo:           'CNT-909',
        lcNo:                 'LC-001',
        lcIssueDate:          '14/05/2026',
        lcExpiryDate:         '14/06/2026',
        exportLicenseNo:      'EL-002',
        exportLicenseIssueDate:  '14/05/2026',
        exportLicenseExpiryDate: '14/05/2027'
    },

    // Final Details
    signatureShipper:         'S. SHARMA',
    issueLocation:            'MUMBAI',
    cfsName:                  'MUMBAI CFS',
    igmNo:                    'IGM-2026',
    freeDays:                 '12',
    invoiceNo:                'INV-1232',
    sbNo:                     'SB-12',
    remarks:                  'URGENT DELIVERY'
};
