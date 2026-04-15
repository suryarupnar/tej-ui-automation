import { test as base, expect } from "@playwright/test"
import { LoginPage } from "../pages/login.page"
import { StorePage } from "../pages/store.page"

type Fixtures = {
    loginPage: LoginPage,
    storePage: StorePage
}

export const test = base.extend<Fixtures>({

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page))
    },

    storePage: async ({ page }, use) => {
        await use(new StorePage(page))
    }
})

export { expect }