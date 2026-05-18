import { OfferData } from '../interfaces/offer.types';

export const offerBaseTemplate: OfferData = {
    general: {
        client: {
            client: 'SOLAR CHEMFERTS PVT.LTD.',
            branch: 'SOLAR CHEMFERTS PVT.LTD.',
            contactPerson: 'mahesh',
        },
        address: {
            originAddressType: 'Port', // Can be: 'Airport', 'Port', 'Railway Station', 'Land Address'
            originCountry: 'India',
            originAirport: 'AMD - Sardar Vallabhbhai Patel International Airport',
            originPort: 'INNSA - Jawaharlal Nehru Port (Nhava Sheva) India',
            originRailwayStation: 'New Delhi Railway Station (NDL)',
            destinationAddressType: 'Railway Station', // Can be: 'Airport', 'Port', 'Railway Station', 'Land Address'
            destinationCountry: 'India',
            destinationAirport: 'BOM - Chhatrapati Shivaji International Airport',
            destinationPort: 'INVAD - Vadinar Terminal India',
            destinationRailwayStation: 'Mumbai Central (BCT)',
        },
        details: {
            mode: 'Air',
            type: 'Inbound',
            shipper: 'Test Shipper',
            consignee: 'Test Consignee',
            lineOfBusiness: 'Freight Forwarding',
            shippingTerm: 'CIP',
            validityFor: 'Entire Offer',
            validityStatus: 'Valid Until',
            validityDate: new Date().getDate().toString(),
            shipmentType: 'Courier/Express',
            receivedFrom: 'Agent Executive',
        },
        comments: {
            internalComments: 'Handle it properly',
        },
    },
    cargo: {
        grossWeight: '100',
        grossVolume: '200',
        packageCount: '12',
        packageType: 'Aerosol',
        commodityType: 'Animal Fodder / Pet Food',
        description: 'Handle carefully',
    }
};
