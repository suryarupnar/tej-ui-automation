import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ShipmentData } from '../data/interfaces/master.types';

export class ShipmentsPage extends BasePage {

    // -- Locators --

    readonly combobox = this.page.getByTestId('service-autocomplete-input'); 

    // Navigation
    readonly operationsTab     = this.page.getByRole('link', { name: 'Operations' });
    readonly shipmentsTab      = this.page.getByRole('link', { name: 'Shipment List-View' });

    // New Shipment form trigger
    readonly newShipmentButton        = this.page.getByRole('button', { name: 'New Shipment' });
    readonly newRegularShipmentOption = this.page.getByRole('menuitem', { name: 'New Regular Shipment' });

    // Form action buttons
    readonly createButton   = this.page.getByRole('button', { name: 'Create' });

    // -- Actions --

    async goto() {
        // Using direct navigation is more stable than clicking through animated menus
        await this.page.goto('/operations/shipments');
    }

    async openShipmentBySerialNo(serialNo: string) {
        await this.goto();

        const searchInput = this.page
            .getByPlaceholder(/search/i)
            .or(this.page.getByRole('searchbox'))
            .first();

        await searchInput.fill(serialNo);
        await this.page.keyboard.press('Enter');

        // Locate the shipment card that contains the serial number text
        // and click the clickable container.
        await this.page
            .locator('div')
            .filter({ hasText: serialNo })
            .locator('xpath=ancestor::div[contains(@class, "card") or @cursor="pointer"]')
            .first()
            .click();

        // Wait for the detail page to finish loading data
        await this.page.locator('text=Loading Data...').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {});
    }

    // Open the "New Regular Shipment" form dialog

    async openNewRegularShipmentForm() {
        await this.newShipmentButton.click();
        await this.newRegularShipmentOption.click();
        // Wait for the dialog to be visible
        await expect(this.page.getByRole('dialog')).toBeVisible();
    }

    // Fill the form using a ShipmentData object, then submit.
    // The method accepts a fully-typed ShipmentData so every test scenario
    // passes its own data without touching the page object itself.

    async fillNewShipmentForm(data: ShipmentData) {
        await this.selectByTestId('service-autocomplete-input', data.details.shipmentType);
        await this.selectByTestId('shipment-documents-select',  data.details.shipmentMode);
        await this.selectByTestId('operational-status-select',  data.details.shipmentStatus);
        await this.selectByTestId('documentation-user-select',  data.details.customer);
        await this.selectByTestId('operations-user-select',     data.details.agent);
        await this.selectByTestId('sales-user-select',          data.details.user);
        await this.selectByTestId('clearance-job-number-select',data.details.clearanceJobNumber);
        await this.selectByTestId('secondary-services-select',  data.details.secondaryServices);
    }

    // Submit the form
    async submitNewShipmentForm(): Promise<void> {
        await this.createButton.click();
    }

    // COMPOSED ACTION – Full end-to-end: open → fill → submit
    // Most tests should call this single method.

    async createNewRegularShipment(data: ShipmentData): Promise<void> {
        await this.openNewRegularShipmentForm();
        await this.fillNewShipmentForm(data);
        await this.submitNewShipmentForm();
        
        // Wait for the creation dialog to disappear before returning
        await expect(this.page.getByRole('dialog')).toBeHidden({ timeout: 30000 });
    }
}
