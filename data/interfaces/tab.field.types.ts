// ─────────────────────────────────────────────────────────────────────────────
// TabFieldEntry  –  One field entry inside a tab that can be:
//   1. Filled   via sendKeys  (input / textarea)
//   2. Selected via autocomplete click  (combobox)
//   3. Read back via getText  and asserted equal to `value`
// ─────────────────────────────────────────────────────────────────────────────

export type TabFieldInteraction =
    | 'fill'        // plain text input / textarea  → fill() then inputValue()
    | 'combobox'    // MUI Autocomplete             → selectByTestId then inputValue()
    | 'text'        // read-only display element    → textContent() only (no sendKeys)
    | 'readonly'    // disabled input / combobox    → inputValue() only (no sendKeys)
    | 'datepicker'  // MUI DatePicker (spinbuttons)  → click Edit Dates, fill spinbuttons
    | 'button';     // Named button click (e.g. 'Copy Consignee') → getByRole('button', { name: value })

export interface TabFieldEntry {
    /** data-testid (or wrapper testid) of the target element */
    testId: string;
    /** Value to send or assert. Use empty string with values[] for multi-select. */
    value: string;
    /** Multiple values for multi-select comboboxes (e.g. tagIds). */
    values?: string[];
    /** Interaction strategy. Defaults to 'fill' when omitted. */
    interaction?: TabFieldInteraction;
}

// ─────────────────────────────────────────────────────────────────────────────
// TabFieldMap  –  The complete map of tabs to their field entries.
// Keyed by the visible tab label (e.g. 'Shipment Details', 'MAWB', 'MBL').
// ─────────────────────────────────────────────────────────────────────────────

export type TabFieldMap = Record<string, TabFieldEntry[]>;
