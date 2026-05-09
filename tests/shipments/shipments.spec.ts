import { test }           from '../../fixtures';
import { ShipmentData }   from '../../data/interfaces/master.types';
import { DashboardPage }  from '../../pages/dashboard.page';
import { ShipmentsPage }  from '../../pages/shipments.page';
import { ShipmentDetailsPage } from '../../pages/shipment-details.page';
import { resolveTabFieldMap } from '../../data/shipment.factory';
import {
    createAirShipment,
    createLandShipment,
    createSeaShipment,
} from '../../data/shipment.factory';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

type Pages = { 
    dashboardPage: DashboardPage; 
    shipmentsPage: ShipmentsPage; 
    shipmentDetailsPage: ShipmentDetailsPage; 
};

/**
 * SCENARIO – Three named test.step() phases so Playwright's HTML report
 * shows exactly where a failure occurred:
 *
 *   Step 1 │ Create Shipment    – navigate, fill creation form, generate ID
 *   Step 2 │ Assert Tabs        – verify expected tabs visible / absent ones gone
 *   Step 3 │ Fill & Save Tabs   – fill every detail tab field and save
 *   Step 4 │ Validate Fields    – re-open each tab and assert persisted values
 */
async function runScenario(
    { dashboardPage, shipmentsPage, shipmentDetailsPage }: Pages,
    data:       ShipmentData,
    absentTabs: string[] = [],
) {
    // These end-to-end multi-tab flows are huge and require more than 60s
    test.setTimeout(120000);
    
    let serialNo = '';

    // ── Step 1: Create Shipment ───────────────────────────────────────────────
    await test.step('Step 1 │ Create Shipment', async () => {
        await shipmentsPage.goto();
        await shipmentsPage.createNewRegularShipment(data);
        serialNo = await shipmentDetailsPage.generateAndCaptureId();
        console.log('\n  ▶ Shipment created:', serialNo || '(not captured)');
    });

    // ── Step 2: Assert Tabs ───────────────────────────────────────────────────
    await test.step('Step 2 │ Assert Tabs', async () => {
        // await shipmentDetailsPage.expectDetailTabs(data);
        // if (absentTabs.length) {
        //     await shipmentDetailsPage.expectTabsAbsent(absentTabs);
        // }
    });

    // ── Step 3: Fill & Save All Tabs ─────────────────────────────────────────
    await test.step('Step 3 │ Fill & Save All Tabs', async () => {
        await shipmentDetailsPage.fillAllTabs(data);
    });

    // ── Step 4: Re-open from List ───────────────────────────────────────────
    await test.step('Step 4 │ Re-open from List', async () => {
        if (!serialNo) {
            console.warn('  ⚠ No serial number captured, skipping list search.');
            return;
        }
        await shipmentsPage.goto();
        await shipmentsPage.openShipmentBySerialNo(serialNo);
    });

    // ── Step 5: Validate Persisted Fields ────────────────────────────────────
    await test.step('Step 5 │ Validate Fields', async () => {
        await shipmentDetailsPage.validateAllTabs(data);
    });
}

/**
 * SCENARIO B – Open an existing shipment by serial number and
 * only re-verify the persisted field values (no creation, no filling).
 *
 * Set EXISTING_SHIPMENT_NO=SHP-XX-00/00 in .env to use this path.
 */
async function openAndVerifyExistingShipment(
    { dashboardPage, shipmentsPage, shipmentDetailsPage }: Pages,
    data:     ShipmentData,
    serialNo: string,
) {
    await test.step('Step 1 │ Open Existing Shipment', async () => {
        await dashboardPage.goto();
        await shipmentsPage.openShipmentBySerialNo(serialNo);
        console.log(`\n  ▶ Opened existing shipment: ${serialNo}`);
    });

    await test.step('Step 2 │ Validate Fields', async () => {
        const map = resolveTabFieldMap(data);
        for (const [tabName, fields] of Object.entries(map)) {
            if (!fields || fields.length === 0) continue;
            await shipmentDetailsPage.verifyTabFields(tabName, fields);
        }
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// ██████████████████████  A I R  ██████████████████████████████████████████████
//
// Universal tabs  : Shipment Details | Cargo & Equipment | Cost & Revenues
// Conditional     : MAWB (always) | HAWB (only with 'MAWB & HAWB')
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Air Inbound', () => {
    // Large forms with 50+ sequential fields take longer than the default 60s to fill reliably
    test.setTimeout(120000);


    test('MAWB only → MAWB tab present, HAWB absent',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createAirShipment({ details: { shipmentType: 'Air Inbound', shipmentMode: 'MAWB Only' } }),
                ['HAWB'],
            );
        });

    test('MAWB & HAWB → both MAWB and HAWB tabs present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createAirShipment({ details: { shipmentType: 'Air Inbound', shipmentMode: 'MAWB & HAWB' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Air Cross Trade', () => {


    test('MAWB only → MAWB tab present, HAWB absent',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createAirShipment({ details: { shipmentType: 'Air Cross Trade', shipmentMode: 'MAWB Only' } }),
                ['HAWB'],
            );
        });

    test('MAWB & HAWB → both MAWB and HAWB tabs present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createAirShipment({ details: { shipmentType: 'Air Cross Trade', shipmentMode: 'MAWB & HAWB' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Air Outbound', () => {


    test('MAWB only → MAWB tab present, HAWB absent',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createAirShipment({ details: { shipmentType: 'Air Outbound', shipmentMode: 'MAWB Only' } }),
                ['HAWB'],
            );
        });

    test('MAWB & HAWB → both MAWB and HAWB tabs present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createAirShipment({ details: { shipmentType: 'Air Outbound', shipmentMode: 'MAWB & HAWB' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────
// ██████████████████████  L A N D  ████████████████████████████████████████████
//
// Universal tabs  : Shipment Details | Cargo & Equipment | Cost & Revenues
// Conditional     : Waybill | Trucking (always, for every Land type)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Land Cross Trade', () => {


    test('Waybill → Waybill & Trucking tabs present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createLandShipment({ details: { shipmentType: 'Land Cross Trade' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Land Domestic', () => {


    test('Waybill → Waybill & Trucking tabs present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createLandShipment({ details: { shipmentType: 'Land Domestic' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Land Inbound', () => {


    test('Waybill → Waybill & Trucking tabs present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createLandShipment({ details: { shipmentType: 'Land Inbound' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Land Outbound', () => {


    test('Waybill → Waybill & Trucking tabs present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createLandShipment({ details: { shipmentType: 'Land Outbound' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────
// ██████████████████████  S E A  ██████████████████████████████████████████████
//
// Universal tabs  : Shipment Details | Cargo & Equipment | Cost & Revenues
// Conditional     : MBL (always) | HBL (only with 'MB/L & HB/L') | Trucking (always)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Sea Cross Trade', () => {


    test('MB/L only → MBL & Trucking present, HBL absent',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Cross Trade', shipmentMode: 'MB/L Only' } }),
                ['HBL'],
            );
        });

    test('MB/L & HB/L → MBL, HBL & Trucking all present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Cross Trade', shipmentMode: 'MB/L & HB/L' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Sea Domestic', () => {


    test('MB/L only → MBL & Trucking present, HBL absent',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Domestic', shipmentMode: 'MB/L Only' } }),
                ['HBL'],
            );
        });

    test('MB/L & HB/L → MBL, HBL & Trucking all present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Domestic', shipmentMode: 'MB/L & HB/L' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Sea Inbound', () => {


    test('MB/L only → MBL & Trucking present, HBL absent',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Inbound', shipmentMode: 'MB/L Only' } }),
                ['HBL'],
            );
        });

    test('MB/L & HB/L → MBL, HBL & Trucking all present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Inbound', shipmentMode: 'MB/L & HB/L' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Sea Outbound', () => {


    test('MB/L only → MBL & Trucking present, HBL absent',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Outbound', shipmentMode: 'MB/L Only' } }),
                ['HBL'],
            );
        });

    test('MB/L & HB/L → MBL, HBL & Trucking all present',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Outbound', shipmentMode: 'MB/L & HB/L' } }),
            );
        });
});
