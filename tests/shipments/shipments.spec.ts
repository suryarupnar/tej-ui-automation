import { test }           from '../../fixtures';
import { ShipmentData }   from '../../data/interfaces/master.types';
import { DashboardPage }  from '../../pages/dashboard.page';
import { ShipmentsPage }  from '../../pages/shipments.page';
import {
    createAirShipment,
    createLandShipment,
    createSeaShipment,
} from '../../data/shipment.factory';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────

type Pages = { dashboardPage: DashboardPage; shipmentsPage: ShipmentsPage };

/**
 * Full scenario:
 *   1. Navigate → create shipment
 *   2. Assert expected tabs ARE present
 *   3. Assert every tab in `absentTabs` is NOT in the DOM
 */
async function runScenario(
    { dashboardPage, shipmentsPage }: Pages,
    data:       ShipmentData,
    absentTabs: string[] = [],
) {
    await dashboardPage.goto();
    await shipmentsPage.goto();

    const id = await shipmentsPage.createNewRegularShipment(data);
    console.log('Created shipment ID:', id);

    await shipmentsPage.expectDetailTabs(data);

    if (absentTabs.length) {
        await shipmentsPage.expectTabsAbsent(absentTabs);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// ██████████████████████  A I R  ██████████████████████████████████████████████
//
// Universal tabs  : Shipment Details | Cargo & Equipment | Cost & Revenues
// Conditional     : MAWB (always) | HAWB (only with 'MAWB & HAWB')
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Air Inbound', () => {
    test.slow();

    test('MAWB only → MAWB tab present, HAWB absent',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createAirShipment({ details: { shipmentType: 'Air Inbound', shipmentMode: 'MAWB' } }),
                ['HAWB'],
            );
        });

    test('MAWB & HAWB → both MAWB and HAWB tabs present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createAirShipment({ details: { shipmentType: 'Air Inbound', shipmentMode: 'MAWB & HAWB' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Air Cross Trade', () => {
    test.slow();

    test('MAWB only → MAWB tab present, HAWB absent',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createAirShipment({ details: { shipmentType: 'Air Cross Trade', shipmentMode: 'MAWB' } }),
                ['HAWB'],
            );
        });

    test('MAWB & HAWB → both MAWB and HAWB tabs present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createAirShipment({ details: { shipmentType: 'Air Cross Trade', shipmentMode: 'MAWB & HAWB' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Air Outbound', () => {
    test.slow();

    test('MAWB only → MAWB tab present, HAWB absent',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createAirShipment({ details: { shipmentType: 'Air Outbound', shipmentMode: 'MAWB' } }),
                ['HAWB'],
            );
        });

    test('MAWB & HAWB → both MAWB and HAWB tabs present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
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
    test.slow();

    test('Waybill → Waybill & Trucking tabs present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createLandShipment({ details: { shipmentType: 'Land Cross Trade' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Land Domestic', () => {
    test.slow();

    test('Waybill → Waybill & Trucking tabs present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createLandShipment({ details: { shipmentType: 'Land Domestic' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Land Inbound', () => {
    test.slow();

    test('Waybill → Waybill & Trucking tabs present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createLandShipment({ details: { shipmentType: 'Land Inbound' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Land Outbound', () => {
    test.slow();

    test('Waybill → Waybill & Trucking tabs present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
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
    test.slow();

    test('MB/L only → MBL & Trucking present, HBL absent',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Cross Trade', shipmentMode: 'MB/L' } }),
                ['HBL'],
            );
        });

    test('MB/L & HB/L → MBL, HBL & Trucking all present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Cross Trade', shipmentMode: 'MB/L & HB/L' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Sea Domestic', () => {
    test.slow();

    test('MB/L only → MBL & Trucking present, HBL absent',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Domestic', shipmentMode: 'MB/L' } }),
                ['HBL'],
            );
        });

    test('MB/L & HB/L → MBL, HBL & Trucking all present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Domestic', shipmentMode: 'MB/L & HB/L' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Sea Inbound', () => {
    test.slow();

    test('MB/L only → MBL & Trucking present, HBL absent',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Inbound', shipmentMode: 'MB/L' } }),
                ['HBL'],
            );
        });

    test('MB/L & HB/L → MBL, HBL & Trucking all present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Inbound', shipmentMode: 'MB/L & HB/L' } }),
            );
        });
});

// ─────────────────────────────────────────────────────────────────────────────

test.describe('Sea Outbound', () => {
    test.slow();

    test('MB/L only → MBL & Trucking present, HBL absent',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Outbound', shipmentMode: 'MB/L' } }),
                ['HBL'],
            );
        });

    test('MB/L & HB/L → MBL, HBL & Trucking all present',
        async ({ dashboardPage, shipmentsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage },
                createSeaShipment({ details: { shipmentType: 'Sea Outbound', shipmentMode: 'MB/L & HB/L' } }),
            );
        });
});
