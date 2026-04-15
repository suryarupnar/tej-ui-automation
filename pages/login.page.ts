import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {

    // -- Locators --
  
    readonly emailInput = this.page.getByLabel("Email ID")
    readonly passwordInput = this.page.getByLabel("Password")
    readonly loginButton = this.page.getByRole('button',{name: "Sign in"})


    // -- Actions --
    async goto() {
        return this.page.goto('/login');
    }
   
    async login(email: string, pass: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
    }

    // -- Assertions --

    async expectSuccess() {
        await expect(this.page.getByText("Login Successful")).toBeVisible();
    }
  
    async expectValidationError(message: string) {
        await expect(this.page.getByText(message)).toBeVisible();
    }

    async passFieldBlur() {
        return this.passwordInput.blur();
    }

    async expectLoginButtonEnabled(enabled: boolean) {
        if (enabled) {
            await expect(this.loginButton).toBeEnabled();
        } else {
            await expect(this.loginButton).toBeDisabled();
        }

    }
    async expectGlobalError() {
        await expect(this.page.getByText("Invalid email or password")).toBeVisible();
    }
}