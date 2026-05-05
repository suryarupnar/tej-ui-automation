import { ShipmentType, ShipmentMode, ShipmentStatus } from './shipment.types';

export interface ShipmentDetailsData {
    /** UI: "Service" dropdown — e.g. 'Air Outbound', 'Sea Inbound' */
    shipmentType:        ShipmentType;
    /** UI: "Shipment Documents" dropdown — document type for the chosen transport mode */
    shipmentMode:        ShipmentMode;
    /** UI: "Operational Status" dropdown */
    shipmentStatus:      ShipmentStatus;
    /** UI: "Documentation" user autocomplete */
    customer:            string;
    /** UI: "Operations" user autocomplete */
    agent:               string;
    /** UI: "Sales" user autocomplete */
    user:                string;
    /** UI: "Clearance Job Number" autocomplete (optional) */
    clearanceJobNumber?: string;
    /** UI: "Secondary Services" multi-select (optional) */
    secondaryServices?:  string[];
}
