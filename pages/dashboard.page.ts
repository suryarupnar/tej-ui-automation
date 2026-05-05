import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {

    // -- Actions --
    async goto() {
        await this.page.goto("/dashboard");
    }
}