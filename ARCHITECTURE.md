# Tej Portal – Playwright Automation Architecture

> **Audience:** Everyone on the QA team — including people new to the project.
> **Purpose:** Understand how the framework is structured, where each concern lives, and how to add new tests without breaking existing ones.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Directory Structure](#2-directory-structure)
3. [Architecture Layers](#3-architecture-layers)
4. [Layer 1 – Fixtures](#4-layer-1--fixtures)
5. [Layer 2 – Page Objects](#5-layer-2--page-objects)
6. [Layer 3 – Data (Factories + Types + Archetypes)](#6-layer-3--data-factories--types--archetypes)
7. [Layer 4 – Tests (Specs) & Test Flow](#7-layer-4--tests-specs--test-flow)
8. [Tab Resolution & Field Mapping Logic](#8-tab-resolution--field-mapping-logic)
9. [Shipment Combinations Matrix](#9-shipment-combinations-matrix)
10. [Environment Variables](#10-environment-variables)
11. [How to Run Tests](#11-how-to-run-tests)
12. [How to Add New Shipment Types / Modes](#12-how-to-add-new-shipment-types--modes)
13. [How to Add a New Page](#13-how-to-add-a-new-page)
14. [Naming Conventions](#14-naming-conventions)
15. [Known Improvement Areas](#15-known-improvement-areas)

---

## 1. Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev) | `^1.59` | Browser automation & test runner |
| TypeScript | via `@playwright/test` | Type safety across all layers |
| dotenv | `^17` | Environment variable management |
| Node.js | 24+ | Runtime |

---

## 2. Directory Structure

```text
tej_portal_automation/
│
├── .env                          ← Environment variables (git-ignored — copy from .env.example)
├── .env.example                  ← Template showing all required variables (safe to commit)
├── playwright.config.ts          ← Global Playwright configuration
├── ARCHITECTURE.md               ← This file
│
├── fixtures/
│   └── index.ts                  ← Custom fixture definitions (page objects injected into tests)
│
├── pages/                        ← Page Object Model (POM) layer
│   ├── base.page.ts              ← Abstract base class (holds the `page` instance)
│   ├── login.page.ts             ← Login page: locators + actions + assertions
│   ├── dashboard.page.ts         ← Dashboard page (navigation entry point)
│   ├── shipments.page.ts         ← Shipments list & creation form interaction
│   └── shipment-details.page.ts  ← Post-creation: ID capture, tab assertions, field validation
│
├── data/                         ← Test data layer
│   ├── interfaces/               ← TypeScript interfaces (pure shapes, no logic)
│   │   ├── shipment.types.ts     ← ShipmentType | ShipmentMode | ShipmentStatus unions
│   │   ├── details.types.ts      ← ShipmentDetailsData (all form fields)
│   │   ├── cargo.types.ts        ← CargoData (cargo & equipment fields)
│   │   ├── master.types.ts       ← ShipmentData root shape
│   │   └── tab.field.types.ts    ← Types for form field mappings (TabFieldEntry)
│   │
│   ├── archetypes/               ← Default data templates (one per transport mode)
│   │   ├── air.template.ts       ← Shared base for ALL Air shipments
│   │   ├── land.template.ts      ← Shared base for ALL Land shipments
│   │   └── sea.template.ts       ← Shared base for ALL Sea shipments
│   │
│   ├── shipment.factory.ts       ← Factory functions + tab resolver + field mapper
│   └── login.factory.ts          ← Login scenario data map
│
├── tests/                        ← Spec files (test cases only — no locators)
│   ├── setup/
│   │   └── auth.setup.ts         ← One-time login → saves session to auth/user.json
│   ├── auth/
│   │   └── login.spec.ts         ← Data-driven login tests (@smoke)
│   └── shipments/
│       └── shipments.spec.ts     ← Shipment E2E test flows
│
├── utils/
│   └── object.utils.ts           ← deepMerge + DeepPartial utility
│
└── auth/
    └── user.json                 ← Saved browser session (auto-generated, git-ignored)
```

---

## 3. Architecture Layers

The framework follows a strict **4-layer architecture**. Each layer has a single responsibility and must never reach into a lower layer's concerns.

```text
┌─────────────────────────────────────────────────────────────┐
│  LAYER 4 – TESTS  (tests/**/*.spec.ts)                      │
│  WHAT to test. Reads like English. Zero locator strings.    │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3 – DATA  (data/)                                    │
│  WHAT data to use. Factories build typed payloads & maps.   │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2 – PAGE OBJECTS  (pages/)                           │
│  HOW to interact with the UI. All locators live here.       │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1 – FIXTURES  (fixtures/index.ts)                    │
│  Wires page objects into Playwright's DI system.            │
└─────────────────────────────────────────────────────────────┘
```

> **Golden Rule:** A test spec must **never** contain a locator string (`locator()`, `getByRole()`, etc.).
> All UI interaction belongs exclusively in the Page Object layer.

---

## 4. Layer 1 – Fixtures

**File:** `fixtures/index.ts`

Playwright fixtures are the dependency injection system. Instead of `new ShipmentsPage(page)` inside every test, we register page objects once and Playwright injects them automatically.

```typescript
export const test = base.extend<Fixtures>({
    loginPage:           async ({ page }, use) => { await use(new LoginPage(page)); },
    dashboardPage:       async ({ page }, use) => { await use(new DashboardPage(page)); },
    shipmentsPage:       async ({ page }, use) => { await use(new ShipmentsPage(page)); },
    shipmentDetailsPage: async ({ page }, use) => { await use(new ShipmentDetailsPage(page)); },
});
```

**How to use in a test:**
```typescript
import { test } from '../../fixtures';

test('example', async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
    // Objects are auto-instantiated and scoped to this test's browser page
});
```

> **Critical:** Playwright enforces **object destructuring** on fixture arguments.
> `async (pages) =>` throws a runtime error. Always use `async ({ dashboardPage, shipmentsPage }) =>`.

---

## 5. Layer 2 – Page Objects

**Directory:** `pages/`

### Class Hierarchy

```text
BasePage (provides core generic methods like `selectByTestId`)
├── LoginPage
├── DashboardPage
├── ShipmentsPage
└── ShipmentDetailsPage
```

### ShipmentsPage – Key API

| Method | What it does |
|---|---|
| `goto()` | Clicks Operations → Shipments, waits for network idle |
| `createNewRegularShipment(data)` | Fills the initial creation form (Type, Customer, Mode) |
| `openShipmentBySerialNo(serialNo)` | Searches the Shipments list and opens the specified record |

### ShipmentDetailsPage – Key API

This page handles the post-creation lifecycle (ID capture, filling details, validation).

| Method | What it does |
|---|---|
| `generateAndCaptureId()` | Clicks Generate, handles modals, captures & returns serialNo |
| `expectDetailTabs(data)` | Asserts all expected tabs are visible (resolver-driven) |
| `expectTabsAbsent(names[])` | Asserts specific tabs are not attached to DOM |
| `fillAllTabs(data)` | Iterates through `resolveTabFieldMap`, filling & saving each tab |
| `validateAllTabs(data)` | Re-opens each tab and asserts fields match expected values |
| `fillSaveAndVerifyTab(...)`| Composed method to run fill → save → verify for one tab |

---

## 6. Layer 3 – Data (Factories + Types + Archetypes)

### The ShipmentData Shape

```text
ShipmentData                          ← master.types.ts
├── details: ShipmentDetailsData      ← form fields (type, mode, customer...)
├── cargo?:  CargoData                ← Cargo & Equipment tab
├── mawb?:   Record<string,unknown>   ← MAWB tab     (Air)
├── hawb?:   Record<string,unknown>   ← HAWB tab     (Air, MAWB & HAWB mode only)
├── waybill?:Record<string,unknown>   ← Waybill tab  (Land)
├── mbl?:    Record<string,unknown>   ← MBL tab      (Sea)
├── hbl?:    Record<string,unknown>   ← HBL tab      (Sea, MB/L & HB/L mode only)
├── trucking?:Record<string,unknown>  ← Trucking tab (Land / Sea)
└── billing?: Record<string,unknown>  ← Cost & Revenues tab (all types)
```

### Valid ShipmentMode Values

| Mode | Transport |
|---|---|
| `MAWB Only` / `MAWB & HAWB` | Air |
| `Waybill` | Land |
| `MB/L Only` / `MB/L & HB/L` | Sea |

### Archetypes — Default Templates

Each transport mode has one archetype file with sensible defaults. Tests only override what differs.

```typescript
// air.template.ts
export const airBaseTemplate: ShipmentData = {
    details: { shipmentType: 'Air Outbound', shipmentMode: 'MAWB Only', ... },
    cargo:   { grossWeight: '100', packageCount: 1, packageType: 'Box', ... },
};
```

### Factory Functions

```typescript
createAirShipment(overrides?)   // deepMerge(airBaseTemplate, overrides)
createLandShipment(overrides?)  // deepMerge(landBaseTemplate, overrides)
createSeaShipment(overrides?)   // deepMerge(seaBaseTemplate, overrides)
```

---

## 7. Layer 4 – Tests (Specs) & Test Flow

**File:** `tests/shipments/shipments.spec.ts`

The test framework follows a **5-step lifecycle** using Playwright's `test.step()` to decouple shipment creation from field validations. This ensures maximum reporting granularity.

### The Standard Test Flow (`runScenario`)

Every standard E2E test runs through these 5 steps:

1. **Step 1 │ Create Shipment**
   - Navigates to Dashboard -> Shipments.
   - Fills initial setup form via `ShipmentsPage.createNewRegularShipment()`.
   - Clicks "Generate" and captures the newly created ID (`serialNo`).

2. **Step 2 │ Assert Tabs**
   - Verifies the correct tabs appeared based on transport type and mode.
   - Also verifies that conditional tabs (e.g. HAWB) are explicitly absent if not expected.

3. **Step 3 │ Fill & Save All Tabs**
   - Navigates through every expected tab.
   - Fills the fields sequentially (inputs, datepickers, comboboxes) and hits "Save".

4. **Step 4 │ Re-open from List**
   - Navigates back to the main Shipments list.
   - Searches for the `serialNo` created in Step 1 and opens it to ensure data persisted into a fresh state.

5. **Step 5 │ Validate Fields**
   - Cycles through all tabs again.
   - Reads every field's value and asserts it strictly matches the data passed from the factory.

### Existing Shipment Validation (`openAndVerifyExistingShipment`)

A secondary scenario flow allows developers to skip creation and validate an existing shipment by setting `EXISTING_SHIPMENT_NO` in `.env`. This is useful for rapid debugging of the validation steps.

### Example Spec Structure

```typescript
test.describe('Air Inbound', () => {
    test.slow();

    test('MAWB only → MAWB tab present, HAWB absent',
        async ({ dashboardPage, shipmentsPage, shipmentDetailsPage }) => {
            await runScenario(
                { dashboardPage, shipmentsPage, shipmentDetailsPage },
                createAirShipment({ details: { shipmentType: 'Air Inbound', shipmentMode: 'MAWB Only' } }),
                ['HAWB'],  // must NOT be in DOM
            );
        });
});
```

---

## 8. Tab Resolution & Field Mapping Logic

**File:** `data/shipment.factory.ts`

### Tab Presence (`resolveExpectedTabs`)
Uses lookup tables to decide which tabs to assert without writing if/else chains:
`shipmentType` → `TRANSPORT_GROUP` → `BASE_TRANSPORT_TABS` + `MODE_EXTRA_TABS`

### Field Mapping (`resolveTabFieldMap`)
A powerful mechanism that translates nested JSON data into Playwright interactions. It outputs a `TabFieldMap` where each key is a tab name, containing an array of `TabFieldEntry` records.

A `TabFieldEntry` dictates:
- `testId`: The data-testid attribute in the UI.
- `value`: The string to fill/assert.
- `interaction`: The control type (`fill`, `combobox`, `datepicker`, `text`).

**Example:**
```typescript
{ testId: 'shippingTermsId', value: 'FOB', interaction: 'combobox' }
```
The `ShipmentDetailsPage` engine reads this map and automatically handles complex UI interactions (like clicking `Edit Dates` before a datepicker) without further coding required in the spec.

---

## 9. Shipment Combinations Matrix

| # | Type | Mode | Tabs Present (conditional) | Absent |
|---|---|---|---|---|
| 1 | Air Inbound | MAWB Only | MAWB | HAWB |
| 2 | Air Inbound | MAWB & HAWB | MAWB, HAWB | — |
| 3 | Air Cross Trade | MAWB Only | MAWB | HAWB |
| 4 | Air Cross Trade | MAWB & HAWB | MAWB, HAWB | — |
| 5 | Air Outbound | MAWB Only | MAWB | HAWB |
| 6 | Air Outbound | MAWB & HAWB | MAWB, HAWB | — |
| 7 | Land Cross Trade | Waybill | Waybill, Trucking | — |
| 8 | Land Domestic | Waybill | Waybill, Trucking | — |
| 9 | Land Inbound | Waybill | Waybill, Trucking | — |
| 10 | Land Outbound | Waybill | Waybill, Trucking | — |
| 11 | Sea Cross Trade | MB/L Only | MBL, Trucking | HBL |
| 12 | Sea Cross Trade | MB/L & HB/L | MBL, HBL, Trucking | — |
| 13 | Sea Domestic | MB/L Only | MBL, Trucking | HBL |
| 14 | Sea Domestic | MB/L & HB/L | MBL, HBL, Trucking | — |
| 15 | Sea Inbound | MB/L Only | MBL, Trucking | HBL |
| 16 | Sea Inbound | MB/L & HB/L | MBL, HBL, Trucking | — |
| 17 | Sea Outbound | MB/L Only | MBL, Trucking | HBL |
| 18 | Sea Outbound | MB/L & HB/L | MBL, HBL, Trucking | — |

> All 18 tests also verify the 3 universal tabs: `Shipment Details`, `Cargo & Equipment`, `Cost & Revenues`

---

## 10. Environment Variables

Copy `.env.example` to `.env` and fill in your values. **Never commit `.env`.**

| Variable | Purpose |
|---|---|
| `BASE_URL` | Full app URL including trailing slash |
| `VALID_EMAIL` | Login email for auth tests |
| `VALID_PASSWORD` | Login password |
| `SETUP_EMAIL` | Email used by `auth.setup.ts` to save session |
| `EXISTING_SHIPMENT_NO` | (Optional) Target ID to run `openAndVerifyExistingShipment` |

---

## 11. How to Run Tests

```bash
# Run ALL tests (setup → auth → shipments)
npx playwright test

# List all discovered tests without running
npx playwright test --list

# Run only shipments
npx playwright test tests/shipments/

# Run a specific describe block
npx playwright test -g "Air Inbound"

# Run only smoke-tagged tests
npx playwright test --grep @smoke

# Open the HTML report
npx playwright show-report

# Override headless setting
npx playwright test --headed
```

---

## 12. How to Add New Shipment Types / Modes

### New ShipmentType (example: `Air Domestic`)

**1. `data/interfaces/shipment.types.ts`** — add to the union:
```typescript
export type ShipmentType =
  | 'Air Domestic'   // ← add
  | 'Air Inbound'
  // ...
```

**2. `data/shipment.factory.ts`** — add to `TRANSPORT_GROUP`:
```typescript
const TRANSPORT_GROUP = {
    'Air Domestic': 'air',  // ← add
    // ...
};
```

**3. `tests/shipments/shipments.spec.ts`** — add a describe block and use `createAirShipment`. Done.

---

### New ShipmentMode (example: `HAWB Only`)

**1. `data/interfaces/shipment.types.ts`** — add to the union:
```typescript
export type ShipmentMode = | 'HAWB Only' | ...
```

**2. `data/shipment.factory.ts`** — add to `MODE_EXTRA_TABS` if it unlocks extra tabs:
```typescript
const MODE_EXTRA_TABS = {
    'HAWB Only': ['HAWB'],  // ← add
};
```

**3.** Add tests in the spec. Done.

---

## 13. How to Add a New Page

```typescript
// 1. Create pages/invoices.page.ts
export class InvoicesPage extends BasePage {
    readonly invoiceTable = this.page.locator('[data-testid="invoice-table"]');
    async goto() { ... }
}

// 2. Register in fixtures/index.ts
type Fixtures = {
    invoicesPage: InvoicesPage;   // ← add
};
export const test = base.extend<Fixtures>({
    invoicesPage: async ({ page }, use) => { await use(new InvoicesPage(page)); },
});

// 3. Use in tests/invoices/invoices.spec.ts
test('example', async ({ dashboardPage, invoicesPage }) => { ... });
```

---

## 14. Naming Conventions

| Item | Pattern | Example |
|---|---|---|
| Page object files | `kebab-case.page.ts` | `shipments.page.ts` |
| Page object classes | `PascalCasePage` | `ShipmentsPage` |
| Spec files | `kebab-case.spec.ts` | `shipments.spec.ts` |
| Factory functions | `create` + transport | `createAirShipment()` |
| Archetype files | `transport.template.ts` | `air.template.ts` |
| Interface files | `scope.types.ts` | `details.types.ts` |
| Type unions | `PascalCase` | `ShipmentType` |
| `test.describe` names | Match UI module exactly | `'Air Inbound'` |
| `test` names | `mode → expected outcome` | `'MAWB only → MAWB tab present, HAWB absent'` |

---

## 15. Known Improvement Areas

| # | Area | Current State | Recommended Fix |
|---|---|---|---|
| 1 | `selectByTestId` fallback | Handles strict checks well but could use a configurable timeout | Add optional timeout parameter for slow dropdowns |
| 2 | Login assertions | Complex if/else inside test body | Move to `loginPage.assertScenario(name)` method |
| 3 | `test.slow()` repetition | Declared in every describe block | Set a global `timeout` in `playwright.config.ts` for shipments project |
| 4 | Reporters | HTML only | Add `list` reporter for CI: `reporter: [['html'], ['list']]` |
| 5 | Tab name literals | Strings in factory and spec | Extract to `TAB_NAMES` const in `shipment.types.ts` |

---

## 16. Standard UI Interaction Patterns

### MUI Autocomplete / Combobox Selection
When interacting with MUI Autocomplete components, always use the following pattern to ensure maximum stability and prevent race conditions. This is the standardized approach used in `BasePage.selectByTestId`.

**The Rule:**
1. Use `fill(value)` directly on the input.
2. **Wait 300ms** to allow MUI's async filter to settle.
3. Click the first option using a **case-insensitive regex**: `getByRole('option', { name: new RegExp(value, 'i') }).first().click()`.

**Avoid:**
- Pressing `ArrowDown` or `Enter` (slow and prone to race conditions).
- Using `exact: true` if the UI text has dynamic formatting (e.g. extra labels or codes).
- Relying on immediate clicks without a settle delay.

---
