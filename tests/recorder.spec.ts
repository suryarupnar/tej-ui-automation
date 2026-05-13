import { test, expect } from '@playwright/test';

test("", async({page})=>{

 await page.goto('https://tejffqa.nimapinfotech.in/login');
 await page.getByTestId('lineOfBusinessId').click();
 await page.getByRole('option', { name: 'Freight Forwarding' }).click();
 await page.getByTestId('shippingTermsId').click();
 await page.getByRole('option', { name: 'FCA' }).click();

 await page.getByTestId('tempCargoDetails.0.grossWeight').click();
 await page.getByRole('button', { name: 'Add Dimensions' }).click();
 await page.getByRole('heading', { name: 'New Cargo' }).getByRole('button').click();
 await page.getByRole('button', { name: 'Add Cargo' }).click();
 await page.getByTestId('tempCargoDetails.0.commodityType').click();
 await page.getByTestId('tempCargoDetails.0.commodityType').press('ScrollLock');
 
});
