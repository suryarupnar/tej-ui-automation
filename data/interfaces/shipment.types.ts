// ─────────────────────────────────────────────────────────────────────────────
// All valid Shipment Type values (maps 1-to-1 with the UI dropdown)
// ─────────────────────────────────────────────────────────────────────────────
export type ShipmentType =
  // Air
  | 'Air Inbound'
  | 'Air Cross Trade'
  | 'Air Outbound'
  // Land
  | 'Land Cross Trade'
  | 'Land Domestic'
  | 'Land Inbound'
  | 'Land Outbound'
  // Sea
  | 'Sea Cross Trade'
  | 'Sea Domestic'
  | 'Sea Inbound'
  | 'Sea Outbound';

// ─────────────────────────────────────────────────────────────────────────────
// All valid Shipment Mode (document-type) values per transport mode:
//   Air   → MAWB | MAWB & HAWB
//   Land  → Waybill
//   Sea   → MB/L | MB/L & HB/L
// ─────────────────────────────────────────────────────────────────────────────
export type ShipmentMode =
  | 'MAWB Only'          // Air – master only
  | 'MAWB & HAWB'   // Air – master + house
  | 'Waybill'       // Land
  | 'MB/L Only'          // Sea – master only
  | 'MB/L & HB/L';  // Sea – master + house

// ─────────────────────────────────────────────────────────────────────────────
export type ShipmentStatus =
  | 'OPEN SHIPMENT'
  | 'CLOSED SHIPMENT'
  | 'CANCELLED';

// ─────────────────────────────────────────────────────────────────────────────
// Tab-resolution result used by the factory & page assertions
// ─────────────────────────────────────────────────────────────────────────────
export interface ShipmentTabConfig {
  /** Tabs always present regardless of shipment configuration */
  alwaysVisible: string[];
  /** Tabs that appear only under specific conditions */
  conditional: string[];
}
