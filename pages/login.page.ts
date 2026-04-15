import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {

    // -- Locators --
    readonly emailInput = this.page.getByLabel('E-mail');
    readonly passwordInput = this.page.getByLabel('Password')
    readonly loginBtn = this.page.getByRole('button', { name: 'Sign In' })

    readonly successMessage = this.page.getByText('Login Successful')
    readonly globalErrorMessage = this.page.getByText('Invalid Email or Password');
    readonly validationError = this.page.locator('p[class*="_validation_text_81cul_1"]')


    // -- Actions --

    async goto(){
        await this.page.goto('/login')
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(pass: string) {
        await this.passwordInput.fill(pass);
    }

    async passFieldBlur(){
        await this.passwordInput.blur();
    }

    async clickSignIn() {
        await this.loginBtn.click();
    }

    async login(email: string, pass: string) {
        if (email !== undefined) await this.fillEmail(email);
        if (pass !== undefined) await this.fillPassword(pass);

        if (await this.loginBtn.isEnabled()) {
            await this.clickSignIn();
        }
    }


    // -- Assertions --
    async expectSuccess(){
        await expect(this.successMessage).toBeVisible();
    }

    async expectGlobalError(){
        await expect(this.globalErrorMessage).toBeVisible();
    }

    async expectValidationError(msg : string | RegExp){
        await expect(this.validationError.filter({hasText : msg})).toBeVisible();
    }

    async expectLoginButtonEnabled(enabled = true){
        if(enabled){
            await expect(this.loginBtn).toBeEnabled();
        }else{
            await expect(this.loginBtn).toBeDisabled();
        }
    }
}