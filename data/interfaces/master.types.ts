import { ShipmentDetailsData } from './details.types';
import { CargoData }           from './cargo.types';
import { TabFieldMap }         from './tab.field.types';

// ─────────────────────────────────────────────────────────────────────────────
// Master shape for a full shipment data payload.
//
// `details`  → always required  (drives the creation form)
// `cargo`    → always present   (Cargo & Equipment tab)
//
// Conditional tab sections – typed as Record<string, unknown> so each tab's
// page-object can evolve independently without forcing a master interface update.
//   mawb     → Air: MAWB tab
//   hawb     → Air: HAWB tab  (MAWB & HAWB mode only)
//   waybill  → Land: Waybill tab
//   mbl      → Sea: MBL tab
//   hbl      → Sea: HBL tab  (MB/L & HB/L mode only)
//   trucking → Land / Sea: Trucking tab
//   billing  → All: Cost & Revenues tab
//
// `tabFieldMap`  (optional)
//   When present, `verifyAllTabFields()` on ShipmentsPage will iterate every
//   entry, sendKeys the value into the field, then getText and assert equality.
//   All entries are sourced from the SAME ShipmentData object used during
//   creation — there is no separate data file needed.
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

    // ── Validation map ────────────────────────────────────────────────────────
    /**
     * Maps each tab label → ordered list of {testId, value, interaction} tuples.
     *
     * Consumed by ShipmentsPage.verifyAllTabFields():
     *   For each tab:
     *     1. Click the tab
     *     2. For each field entry:
     *        a. sendKeys (fill / selectByTestId) → interaction type
     *        b. getText  (inputValue / textContent)
     *        c. expect(actual).toBe(expected)
     *
     * Keep this in the same factory/archetype file as the rest of the data so
     * there is a SINGLE source of truth for both creation and validation.
     */
    tabFieldMap?: TabFieldMap;
}
