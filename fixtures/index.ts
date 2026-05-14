import { test as base, expect } from "@playwright/test"
import { LoginPage } from "../pages/login.page"
import { DashboardPage } from "../pages/dashboard.page"
import { ShipmentsPage } from "../pages/shipments.page"
import { ShipmentEditPage } from "../pages/shipment-edit.page"
type Fixtures = {
    loginPage: LoginPage,
    shipmentsPage: ShipmentsPage,
    dashboardPage: DashboardPage,
    shipmentEditPage: ShipmentEditPage
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

    shipmentEditPage: async ({ page }, use) => {
        await use(new ShipmentEditPage(page))
    }

})

export { expect }