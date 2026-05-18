
export interface OfferGeneralData {
    client: {
        client: string;
        branch: string;
        contactPerson: string;
    };
    address: {
        originAddressType: string;
        originCountry: string;
        originAirport?: string;
        originPort?: string;
        originRailwayStation?: string;
        destinationAddressType: string;
        destinationCountry: string;
        destinationAirport?: string;
        destinationPort?: string;
        destinationRailwayStation?: string;
    };
    details: {
        mode: 'Air'; 
        type: 'Inbound'; 
        shipper: string;
        consignee: string;
        lineOfBusiness: string;
        shippingTerm: string;
        validityFor: string;
        validityStatus: string;
        validityDate: string; 
        shipmentType: string;
        receivedFrom: string;
    };
    comments: {
        internalComments?: string;
    };
}
