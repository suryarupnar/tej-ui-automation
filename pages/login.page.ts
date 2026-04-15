import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class LoginPage extends BasePage {

    // -- Locators --
  


    // -- Actions --
    async goto() {
        return this.page.goto('/login');
    }
   
    async login(email: string, pass: string) {
        await this.page.fill('#email', email);
        await this.page.fill('#password', pass);
        await this.page.click('#loginButton');
    }

    // -- Assertions --
  
}