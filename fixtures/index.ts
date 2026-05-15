import { test as base, expect } from "@playwright/test"
import { LoginPage } from "../pages/login.page"
import { DashboardPage } from "../pages/dashboard.page"
import { ShipmentsPage } from "../pages/shipments.page"
import { ShipmentDetailsPage } from "../pages/shipment-details.page"
import { OffersPage } from "../pages/offers.page"
import { OfferDetailsPage } from "../pages/offer-details.page"

type Fixtures = {
    loginPage: LoginPage,
    shipmentsPage: ShipmentsPage,
    dashboardPage: DashboardPage,
    shipmentDetailsPage: ShipmentDetailsPage,
    offersPage: OffersPage,
    offerDetailsPage: OfferDetailsPage
}

export const test = base.extend<Fixtures>({

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    },

    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page))
    },

    shipmentsPage: async ({ page }, use) => {
        await use(new ShipmentsPage(page))
    },

    shipmentDetailsPage: async ({ page }, use) => {
        await use(new ShipmentDetailsPage(page))
    },

    offersPage: async ({ page }, use) => {
        await use(new OffersPage(page))
    },

    offerDetailsPage: async ({ page }, use) => {
        await use(new OfferDetailsPage(page))
    }

})

export { expect }