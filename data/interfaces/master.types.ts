import { ShipmentDetailsData } from './details.types';
import { CargoData }           from './cargo.types';

// ─────────────────────────────────────────────────────────────────────────────
// Master shape for a full shipment data payload.
//
// `details`  → always required  (drives the creation form)
// `cargo`    → always present   (Cargo & Equipment tab)
//
// Uncommon tab sections – all optional; only provided when the test
// explicitly needs to fill that tab's fields.
//   mawb     → Air: MAWB tab
//   hawb     → Air: HAWB tab  (MAWB & HAWB mode only)
//   waybill  → Land: Waybill tab
//   mbl      → Sea: MBL tab
//   hbl      → Sea: HBL tab  (MB/L & HB/L mode only)
//   trucking → Land / Sea: Trucking tab
//   billing  → All: Cost & Revenues tab
// ─────────────────────────────────────────────────────────────────────────────

export interface ShipmentData {
    details:   ShipmentDetailsData;
    cargo?:    CargoData;

    // ── Uncommon / conditional tab data ──────────────────────────────────────
    mawb?:     Record<string, unknown>;  // Air – MAWB tab fields
    hawb?:     Record<string, unknown>;  // Air – HAWB tab fields
    waybill?:  Record<string, unknown>;  // Land – Waybill tab fields
    mbl?:      Record<string, unknown>;  // Sea – MBL tab fields
    hbl?:      Record<string, unknown>;  // Sea – HBL tab fields
    trucking?: Record<string, unknown>;  // Land/Sea – Trucking tab fields

    // ── Universal tab data ────────────────────────────────────────────────────
    billing?:  Record<string, unknown>;  // All – Cost & Revenues tab fields
}
