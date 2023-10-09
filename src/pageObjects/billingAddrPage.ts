import { expect, type Locator, type Page } from '@playwright/test';

export class BillingAddrPage {
    readonly addrLineOne: Locator;
    readonly addrLineTwo: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly postalCode: Locator;
    readonly continue: Locator;

    private readonly page: Page;
    private readonly selectors = {
        addrLineOne: 'addressLine1',
        addrLineTwo: 'addressLine2',
        city: 'city',
        state: 'state',
        postalCode: 'zip',
        continue: 'continue'
    }

    constructor(page: Page) {
        this.page = page;
        this.addrLineOne = page.getByTestId(this.selectors.addrLineOne);
        this.addrLineTwo = page.getByTestId(this.selectors.addrLineTwo);
        this.city = page.getByTestId(this.selectors.city);
        this.state = page.getByTestId(this.selectors.state);
        this.postalCode = page.getByTestId(this.selectors.postalCode);
        this.continue = page.getByTestId(this.selectors.continue);
    }
}