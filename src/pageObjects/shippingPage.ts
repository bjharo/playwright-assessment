import { expect, type Locator, type Page } from '@playwright/test';

export class ShippingPage {
    readonly addrLineOne: Locator;
    readonly addrLineTwo: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly postalCode: Locator;
    readonly billingShippingToggle: Locator;
    readonly continue: Locator;

    private readonly page: Page;
    private readonly selectors = {
        addrLineOne: 'addressLine1',
        addrLineTwo: 'addressLine2',
        city: 'city',
        state: 'state',
        postalCode: 'zip',
        billingShippingToggle: 'input.PrivateSwitchBase-input',
        continue: 'continue'
    }

    constructor(page: Page) {
        this.page = page;
        this.addrLineOne = page.getByTestId(this.selectors.addrLineOne);
        this.addrLineTwo = page.getByTestId(this.selectors.addrLineTwo);
        this.city = page.getByTestId(this.selectors.city);
        this.state = page.getByTestId(this.selectors.state);
        this.postalCode = page.getByTestId(this.selectors.postalCode);
        this.billingShippingToggle = page.getByTestId(this.selectors.billingShippingToggle);
        this.continue = page.getByTestId(this.selectors.continue);
    }
}