import { expect } from '@playwright/test';
import { BasePage } from './base.page';
import { OfferData } from '../data/interfaces/offer.types';

export class OffersPage extends BasePage {
    // -- Locators --
    readonly createNewOfferButton  = this.page.getByRole('button', { name: 'Create New Offer' });
    readonly modeDropdown          = this.page.getByTestId('mode');
    readonly serviceDropdown       = this.page.getByTestId('type');
    readonly createButton          = this.page.getByRole('button', { name: 'Create' });

    // -- Actions --
    async goto() {
        await this.page.goto('/crm/offers');
    }

    async openNewOfferForm() {
        await this.createNewOfferButton.click();
        await expect(this.page.getByRole('dialog')).toBeVisible();
    }

    async createOffer(mode: string, service: string) {
        await this.openNewOfferForm();
        
        // Skip selection if already matches default (Air/Inbound)
        const currentMode = await this.modeDropdown.innerText();
        if (!currentMode.toLowerCase().includes(mode.toLowerCase())) {
            await this.selectByLocator(this.modeDropdown, mode);
        }

        const currentService = await this.serviceDropdown.innerText();
        if (!currentService.toLowerCase().includes(service.toLowerCase())) {
            await this.selectByLocator(this.serviceDropdown, service);
        }

        await this.createButton.click();
        await expect(this.page.getByRole('dialog')).toBeHidden({ timeout: 10000 });
    }

    async createNewOffer(data: OfferData) {
        await this.goto();
        await this.createOffer(data.general.details.mode, data.general.details.type);
    }
}
