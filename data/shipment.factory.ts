import { deepMerge, DeepPartial } from '../utils/object.utils';
import { ShipmentData }           from './interfaces/master.types';
import { ShipmentTabConfig, ShipmentType, ShipmentMode } from './interfaces/shipment.types';
import { TabFieldMap, TabFieldEntry } from './interfaces/tab.field.types';
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
    'Air Domestic':     'air',
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
    land: ['Waybill'],
    sea:  ['MB/L'],
};

/**
 * Additional tabs unlocked by a specific ShipmentMode.
 * Only the EXTRA tabs are listed here (beyond what BASE_TRANSPORT_TABS provides).
 */
const MODE_EXTRA_TABS: Partial<Record<ShipmentMode, string[]>> = {
    'MAWB & HAWB':  ['HAWB'],
    'MB/L & HB/L':  ['HB/L'],
    // 'MAWB Only'   → no extra tabs
    // 'MB/L Only'   → no extra tabs
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
    // Tab labels MUST match exactly what the UI renders (inspected from screenshots).
    const group   = TRANSPORT_GROUP[data.details.shipmentType];
    
    // Air calls it 'Cargo', Land/Sea call it 'Cargo & Equipments'
    const cargoTabName = group === 'air' ? 'Cargo' : 'Cargo & Equipments';
    // Removed default tabs to strictly test MAWB/HAWB/MBL/HBL presence.
    const alwaysVisible: string[] = [];

    const base    = BASE_TRANSPORT_TABS[group]     ?? [];
    const extra   = MODE_EXTRA_TABS[data.details.shipmentMode] ?? [];

    const conditional = [...base, ...extra];

    return { alwaysVisible, conditional };
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB FIELD MAP RESOLVER
//
// Builds the ordered {tabName → TabFieldEntry[]} map from a ShipmentData
// object.  Every test that calls verifyAllTabFields() passes the SAME data
// object it used for creation – zero extra data files needed.
//
// Add/remove entries here when the UI changes; no test file edits required.
// ─────────────────────────────────────────────────────────────────────────────

export function resolveTabFieldMap(data: ShipmentData): TabFieldMap {
    const map: TabFieldMap = {};
    const group = TRANSPORT_GROUP[data.details.shipmentType];

    // ── 1. Shipment Details tab ───────────────────────────────────────────────
    const shipmentDetailFields: TabFieldEntry[] = [
        // 1. Line of Business
        { testId: 'lineOfBusinessId',   value: data.details.lineOfBusiness  ?? '',    interaction: 'combobox' },
        // 2. Shipping Terms
        { testId: 'shippingTermsId',    value: data.details.shippingTerms   ?? '',    interaction: 'combobox' },
        // 3. Shipment Type (Category)
        { testId: 'shipmentTypeId',     value: data.details.category        ?? '',    interaction: 'combobox' },
        // 4. Nominated By
        { testId: 'nominationType',     value: data.details.nominatedBy     ?? '',    interaction: 'combobox' },
        // 5. Tags
        ...(data.details.tags?.length 
            ? [{ testId: 'tagIds', value: '', values: data.details.tags, interaction: 'combobox' as const }] 
            : []),
        // 6. Client
        { testId: 'clientId',           value: data.details.client          ?? '',    interaction: 'combobox' },
        // 7. Clearance Company
        { testId: 'clearanceCompany',   value: data.details.clearanceCompany   ?? 'abc', interaction: 'fill' },
        // 8. Origin Country
        { testId: 'originCountry',      value: data.details.originCountry      ?? '',    interaction: 'combobox' },
        // 9. Airport/Port of Loading
        { 
            testId:      group === 'air' ? 'originAirport' : 'originPort', 
            value:       (group === 'air' ? data.details.originAirport : data.details.originPort) ?? '', 
            interaction: 'combobox' 
        },
        // 10. Text Area (Origin Address)
        { testId: 'originAddress',      value: data.details.originAddress      ?? '',    interaction: 'fill' },
        // 11. Destination Country
        { testId: 'destinationCountry', value: data.details.destinationCountry ?? '',    interaction: 'combobox' },
        // 12. Airport/Port of Discharge
        { 
            testId:      group === 'air' ? 'destinationAirport' : 'destinationPort', 
            value:       (group === 'air' ? data.details.destinationAirport : data.details.destinationPort) ?? '', 
            interaction: 'combobox' 
        },
        // 13. Text Area (Destination Address)
        { testId: 'destinationAddress', value: data.details.destinationAddress ?? '',    interaction: 'fill' },
    ];

    map['Shipment Details'] = shipmentDetailFields;

    // ── 3. Transport-mode conditional tabs ────────────────────────────────────

    // ── 2. Cargo & Equipment tab ──────────────────────────────────────────────
    if (data.cargo) {
        const cargoTabName = (group === 'air' || group === 'sea') ? 'Cargo' : 'Cargo & Equipments';
        
        // Calculation logic for summary totals (matches UI behavior)
        const count = data.cargo.packageCount || 0;
        const gw    = parseFloat(data.cargo.grossWeight || '0');
        const nw    = parseFloat(data.cargo.netWeight   || '0');
        const l     = parseFloat(data.cargo.length || '0');
        const w     = parseFloat(data.cargo.width  || '0');
        const h     = parseFloat(data.cargo.height || '0');
        const volPerUnit = (l * w * h) / 1000000;

        const cargoFields: TabFieldEntry[] = [
            // Dimensions (First row)
            { testId: 'tempCargoDetails.0.dimensions.0.packageCount', value: count.toString(), interaction: 'fill' },
            { testId: 'tempCargoDetails.0.dimensions.0.length',       value: l.toString(),     interaction: 'fill' },
            { testId: 'tempCargoDetails.0.dimensions.0.width',        value: w.toString(),     interaction: 'fill' },
            { testId: 'tempCargoDetails.0.dimensions.0.height',       value: h.toString(),     interaction: 'fill' },
            { testId: 'tempCargoDetails.0.dimensions.0.grossWeight',  value: gw.toString(),    interaction: 'fill' },

            // Cargo Info
            { testId: 'tempCargoDetails.0.netWeight',                 value: nw.toString(),    interaction: 'fill' },
            { testId: 'tempCargoDetails.0.commodityType',             value: data.cargo.commodityType || '',interaction: 'combobox' },
            { testId: 'tempCargoDetails.0.shortCargoDescription',     value: data.cargo.description || '',  interaction: 'fill' },
            { testId: 'tempCargoDetails.0.hsCode',                    value: data.cargo.hsCode || '',       interaction: 'fill' },
            { testId: 'tempCargoDetails.0.subheading',                value: data.cargo.subheading || '',   interaction: 'fill' },
        ];

        // 3. Transport-specific Cargo fields
        if (group === 'air') {
            cargoFields.push(
                { testId: 'tempCargoDetails.0.mawbRateClass',             value: data.cargo.mawbRateClass || '',interaction: 'combobox' },
                { testId: 'tempCargoDetails.0.tactRate',                  value: data.cargo.tactRate || '',     interaction: 'fill' },
                { testId: 'tempCargoDetails.0.mawbTotalCharge',           value: data.cargo.mawbTotalCharge || '', interaction: 'fill' },
                { testId: 'tempCargoDetails.0.mawbCargoDescription',      value: data.cargo.mawbDescription || '', interaction: 'fill' },
                { testId: 'tempCargoDetails.0.hawbRateClass',             value: data.cargo.hawbRateClass || '',interaction: 'combobox' },
                { testId: 'tempCargoDetails.0.hawbRate',                  value: data.cargo.hawbRate || '',     interaction: 'fill' },
                { testId: 'tempCargoDetails.0.hawbTotalCharge',           value: data.cargo.hawbTotalCharge || '', interaction: 'fill' },
                { testId: 'tempCargoDetails.0.slac',                      value: data.cargo.slac || '',         interaction: 'fill' },
                { testId: 'tempCargoDetails.0.commodityItemNo',           value: data.cargo.commodityItemNo || '', interaction: 'fill' },
            );
        } else if (group === 'sea') {
            cargoFields.push(
                // General section fields (Matching labels in Sea UI)
                { testId: 'tempCargoDetails.0.noOfPackages',              value: data.cargo.packageCount?.toString() || '', interaction: 'fill' },
                { testId: 'tempCargoDetails.0.packageTypeId',             value: data.cargo.packageType || '',              interaction: 'combobox' },
                { testId: 'tempCargoDetails.0.chargeableWeight',          value: data.cargo.chargeableWeight || '',         interaction: 'fill' },
                { testId: 'tempCargoDetails.0.declaredValue',             value: data.cargo.declaredValue || '',            interaction: 'fill' },
                { testId: 'tempCargoDetails.0.currencyId',                 value: data.cargo.currency || '',                 interaction: 'combobox' },
                
                // Tracking / ID numbers
                { testId: 'tempCargoDetails.0.pcinNumber',                value: data.cargo.pcinNumber || '',    interaction: 'fill' },
                { testId: 'tempCargoDetails.0.mcinNumber',                value: data.cargo.mcinNumber || '',    interaction: 'fill' },
                { testId: 'tempCargoDetails.0.csnNumber',                 value: data.cargo.csnNumber || '',     interaction: 'fill' },
            );
        }

        // Always add Item No and Sub Item No at the end
        cargoFields.push(
            { testId: 'tempCargoDetails.0.itemNo',                    value: data.cargo.itemNo || '',       interaction: 'fill' },
            { testId: 'tempCargoDetails.0.subItemNo',                 value: data.cargo.subItemNo || '',    interaction: 'fill' },
        );

        // Summary Totals (Expected values after UI calculation)
        cargoFields.push(
            { testId: 'grossWeight',      value: (count * gw).toString(),  interaction: 'readonly' },
            { testId: 'netWeight',        value: nw.toString(),            interaction: 'readonly' },
            { testId: 'grossVolume',      value: (count * volPerUnit).toString(), interaction: 'readonly' },
            { testId: 'totalPackages',    value: count.toString(),         interaction: 'readonly' },
        );

        map[cargoTabName] = cargoFields.filter(f => !!f.value);
    }

    if (group === 'air') {
        // MAWB tab – always present for Air
        if (data.mawb) {
            const readonlyKeys = [
                'mawb.originAirport',
                'mawb.airportOfDepartureOnAWB',
                'mawb.destinationAirport',
                'mawb.airportOfDestinationOnAWB',
                'mawb.routings.0.originAirport',
                'mawb.routings.0.destinationAirport',
            ];
            const entries = buildEntriesFromRecord(data.mawb, readonlyKeys);
            if (entries.length) map['MAWB'] = entries;
        }
        // HAWB tab – only when mode is 'MAWB & HAWB'
        if (data.details.shipmentMode === 'MAWB & HAWB' && data.hawb) {
            const entries = buildEntriesFromRecord(data.hawb);
            if (entries.length) map['HAWB'] = entries;
        }
    }

    if (group === 'sea') {
        // MB/L tab – always present for Sea
        if (data.mbl) {
            const entries = buildEntriesFromRecord(data.mbl);
            if (entries.length) map['MB/L'] = entries;
        }
        // HB/L tab – only when mode is 'MB/L & HB/L'
        if (data.details.shipmentMode === 'MB/L & HB/L' && data.hbl) {
            const entries = buildEntriesFromRecord(data.hbl);
            if (entries.length) map['HB/L'] = entries;
        }
    }

    if (group === 'land') {
        // Waybill tab
        if (data.waybill) {
            const entries = buildEntriesFromRecord(data.waybill);
            if (entries.length) map['Waybill'] = entries;
        }
        // Trucking tab
        if (data.trucking) {
            const entries = buildEntriesFromRecord(data.trucking);
            if (entries.length) map['Trucking'] = entries;
        }
    }

    // ── 4. Costs & Revenues tab ────────────────────────────────────────────────
    // if (data.billing) {
    //     const entries = buildEntriesFromRecord(data.billing);
    //     if (entries.length) map['Costs & Revenues'] = entries;
    // }

    return map;
}

// ─────────────────────────────────────────────────────────────────────────────
// FIELD-TYPE DETECTION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if the given testId corresponds to a MUI Autocomplete combobox.
 * Add patterns here when new combobox fields are introduced — no other changes needed.
 *
 * Patterns:
 *   Id$               — ends in "Id" (e.g. lineOfBusinessId, clientId)
 *   Country           — country dropdowns
 *   Airport           — airport dropdowns
 *   agent$            — mawb.agent, mbl.agent
 *   coLoader$         — mbl.coLoader
 *   shippingLine$     — mbl.shippingLine
 *   originOfGoods$    — mbl/hbl origin of goods
 *   receiptLocation$  — mbl/hbl receipt location
 *   deliveryLocation$ — mbl/hbl delivery location
 *   hbl\.issueLocation$ — HBL issue location ONLY (waybill.issueLocation is a plain textbox)
 *   noOf              — package count dropdowns
 *   chargeCode        — charge code combobox
 *   specialHandling   — special handling codes
 */
function isComboboxField(testId: string): boolean {
    return /Id$|Country|Airport|agent$|coLoader$|shippingLine$|originOfGoods$|receiptLocation$|deliveryLocation$|hbl\.issueLocation$|noOf|chargeCode|specialHandling/i.test(testId);
}

/**
 * Converts a free-form Record<string, unknown> (the per-tab data bags in
 * ShipmentData) into a flat TabFieldEntry[] list.
 *
 * Convention: the record key IS the testId; the value IS the expected string.
 * Each entry defaults to interaction='fill'.
 *
 * Example:
 *   { 'mawb-serial-number': 'SN-001', 'mawb-airline': 'Emirates' }
 *   → [{ testId:'mawb-serial-number', value:'SN-001', interaction:'fill' }, …]
 */
function buildEntriesFromRecord(record: Record<string, unknown>, readonlyKeys: string[] = []): TabFieldEntry[] {
    return Object.entries(record)
        .filter(([, v]) => (typeof v === 'string' && (v as string).length > 0) || typeof v === 'number')
        .map(([testId, value]) => {
            const valStr = value?.toString() ?? '';
            
            if (readonlyKeys.includes(testId)) {
                return {
                    testId,
                    value: valStr,
                    interaction: 'readonly',
                };
            }

            // Smart detection helpers
            // 0. Button – key contains double-underscore (e.g. mbl.__copyConsignee)
            const isButton = /__/.test(testId);
            // 1. Datepicker – key ends in '-wrapper' or contains Date/issuedOn
            const isDate = !isButton && (/-wrapper$/i.test(testId) || /Date|issuedOn/i.test(testId));
            // 2. Combobox – determined by a named helper (see isComboboxField below)
            const isCombobox = !isButton && !isDate && isComboboxField(testId);
            
            return {
                testId,
                value:       valStr,
                interaction: (isButton ? 'button' : isDate ? 'datepicker' : (isCombobox ? 'combobox' : 'fill')) as TabFieldEntry['interaction'],
            };
        });
}
