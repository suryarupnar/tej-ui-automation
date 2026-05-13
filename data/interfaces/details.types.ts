import { ShipmentType, ShipmentMode, ShipmentStatus } from './shipment.types';

export interface ShipmentDetailsData {
    /** UI: "Service" dropdown — e.g. 'Air Outbound', 'Sea Inbound' */
    shipmentType:        ShipmentType;
    /** UI: "Shipment Documents" dropdown — document type for the chosen transport mode */
    shipmentMode:        ShipmentMode;
    /** UI: "Operational Status" dropdown */
    shipmentStatus:      ShipmentStatus;
    /** UI: "Documentation" user autocomplete — maps to documentationUserId on detail page */
    customer:            string;
    /** UI: "Operations" user autocomplete — maps to operationUserId on detail page */
    agent:               string;
    /** UI: "Sales" user autocomplete — maps to salesUserId on detail page */
    user:                string;
    /** UI: "Clearance Job Number" autocomplete (optional) */
    clearanceJobNumber?: string;
    /** UI: "Secondary Services" multi-select (optional) */
    secondaryServices?:  string[];

    // ── Detail-page fields (visible after shipment is created) ────────────────
    /** UI: "Line of Business" autocomplete — testId: lineOfBusinessId */
    lineOfBusiness?:     string;
    /** UI: "Shipping Terms" autocomplete — testId: shippingTermsId */
    shippingTerms?:      string;
    /** UI: "Client" autocomplete — testId: clientId */
    client?:             string;
    /** UI: "Office" autocomplete — testId: office */
    office?:             string;
    /** UI: "Origin Country" autocomplete — testId: originCountry */
    originCountry?:      string;
    /** UI: "Airport of Loading" autocomplete — testId: originAirport (full label e.g. 'DXB - Dubai Intl') */
    originAirport?:      string;
    /** UI: "Port of Loading" autocomplete — testId: originPort (full label e.g. 'INMUN - Mundra India') */
    originPort?:         string;
    /** UI: "Destination Country" autocomplete — testId: destinationCountry */
    destinationCountry?: string;
    /** UI: "Airport of Discharge" autocomplete — testId: destinationAirport (full label e.g. 'LHR - Heathrow') */
    destinationAirport?: string;
    /** UI: "Port of Discharge" autocomplete — testId: destinationPort (full label e.g. 'INPBD - Porbandar India') */
    destinationPort?:    string;
    /** UI: "Clearance Company" text input — testId: clearanceCompany */
    clearanceCompany?:   string;
    /** UI: "CFS Name" text input — testId: cfsName */
    cfsName?:            string;
    /** UI: "IGM No." text input — testId: igmNO */
    igmNo?:              string;
    /** UI: "Shipment Type" cargo category dropdown — testId: shipmentTypeId (e.g. 'Dry Bulk', 'Liquid Bulk') */
    category?:           string;
    /** UI: "Nominated By" dropdown — testId: nominationType (e.g. 'Agent') */
    nominatedBy?:        string;
    /** UI: "Tags" multi-select — testId: tagIds */
    tags?:               string[];
    /** UI: "Contact Person" autocomplete — testId: contactPersonId */
    contactPerson?:      string;
    /** Origin address textarea (datatestid: originAddress) */
    originAddress?:      string;
    /** Destination address textarea (datatestid: destinationAddress) */
    destinationAddress?: string;
    /** UI: "Free Days" number input — testId: freeDays */
    freeDays?:           string;
    // ── Date fields (DD/MM/YYYY format, require "Edit Dates" button first) ────────────
    /** UI: "Pickup / Stuffing Date" — testId wrapper: pickupDate-wrapper */
    pickupDate?:         string;
    /** UI: "ETD" — testId wrapper: estimatedTimeDepartureDate-wrapper */
    etd?:                string;
    /** UI: "Flight Date" — testId wrapper: loadingDate-wrapper */
    flightDate?:         string;
    /** UI: "ETA" — testId wrapper: estimatedTimeArrivalDate-wrapper */
    eta?:                string;
    /** UI: "Arrival Date" — testId wrapper: arrivalDate-wrapper */
    arrivalDate?:        string;
    /** UI: "Delivery Date" — testId wrapper: deliveryDate-wrapper */
    deliveryDate?:       string;
    /** UI: "Inward Date" — testId wrapper: inWardDate-wrapper */
    inwardDate?:         string;
}
