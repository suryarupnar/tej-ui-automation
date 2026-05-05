import { deepMerge, DeepPartial } from '../utils/object.utils';
import { ShipmentData }           from './interfaces/master.types';
import { ShipmentTabConfig, ShipmentType, ShipmentMode } from './interfaces/shipment.types';
import { airBaseTemplate }        from './archetypes/air.template';
import { landBaseTemplate }       from './archetypes/land.template';
import { seaBaseTemplate }        from './archetypes/sea.template';

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSER FACTORIES
//
// One factory per transport mode. Pass a DeepPartial<ShipmentData> to override
// any nested property; everything else inherits from the archetype defaults.
//
//   AIR  defaults : shipmentType='Air Outbound',  shipmentMode='MAWB'
//   LAND defaults : shipmentType='Land Outbound', shipmentMode='Waybill'
//   SEA  defaults : shipmentType='Sea Outbound',  shipmentMode='MB/L'
// ─────────────────────────────────────────────────────────────────────────────

export function createAirShipment(overrides?: DeepPartial<ShipmentData>): ShipmentData {
    return deepMerge(airBaseTemplate, overrides);
}

export function createLandShipment(overrides?: DeepPartial<ShipmentData>): ShipmentData {
    return deepMerge(landBaseTemplate, overrides);
}

export function createSeaShipment(overrides?: DeepPartial<ShipmentData>): ShipmentData {
    return deepMerge(seaBaseTemplate, overrides);
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB RESOLVER  –  Lookup-table approach (no if/else chains)
//
// Structure:
//   TRANSPORT_GROUP  maps ShipmentType → transport category (air/land/sea)
//   MODE_TABS        maps ShipmentMode → list of tab names it adds
//   BASE_TABS        tabs always added per transport category
//
// To add a new type or mode: add ONE entry to the relevant map. Zero logic edits.
// ─────────────────────────────────────────────────────────────────────────────

/** Maps every ShipmentType to its transport category. */
const TRANSPORT_GROUP: Record<ShipmentType, 'air' | 'land' | 'sea'> = {
    'Air Inbound':      'air',
    'Air Cross Trade':  'air',
    'Air Outbound':     'air',
    'Land Cross Trade': 'land',
    'Land Domestic':    'land',
    'Land Inbound':     'land',
    'Land Outbound':    'land',
    'Sea Cross Trade':  'sea',
    'Sea Domestic':     'sea',
    'Sea Inbound':      'sea',
    'Sea Outbound':     'sea',
};

/**
 * Base conditional tabs added for every shipment of a given transport group.
 * These are always visible regardless of mode.
 */
const BASE_TRANSPORT_TABS: Record<'air' | 'land' | 'sea', string[]> = {
    air:  ['MAWB'],
    land: ['Waybill', 'Trucking'],
    sea:  ['MBL', 'Trucking'],
};

/**
 * Additional tabs unlocked by a specific ShipmentMode.
 * Only the EXTRA tabs are listed here (beyond what BASE_TRANSPORT_TABS provides).
 */
const MODE_EXTRA_TABS: Partial<Record<ShipmentMode, string[]>> = {
    'MAWB & HAWB':  ['HAWB'],
    'MB/L & HB/L':  ['HBL'],
    // 'MAWB'   → no extra tabs
    // 'MB/L'   → no extra tabs
    // 'Waybill'→ no extra tabs
};

/**
 * Returns the tabs that SHOULD be visible on the detail page after the shipment
 * is created, derived purely from the ShipmentData object.
 *
 * Universal (always visible for every shipment):
 *   • Shipment Details
 *   • Cargo & Equipment
 *   • Cost & Revenues
 *
 * Conditional (driven by shipmentType + shipmentMode via lookup tables above).
 */
export function resolveExpectedTabs(data: ShipmentData): ShipmentTabConfig {
    const alwaysVisible = ['Shipment Details', 'Cargo & Equipment', 'Cost & Revenues'];

    const group   = TRANSPORT_GROUP[data.details.shipmentType];
    const base    = BASE_TRANSPORT_TABS[group]     ?? [];
    const extra   = MODE_EXTRA_TABS[data.details.shipmentMode] ?? [];

    const conditional = [...base, ...extra];

    return { alwaysVisible, conditional };
}
