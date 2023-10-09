import { expect, type Locator, type Page } from '@playwright/test';

export class PaymentMethodPage {
    readonly title: Locator;
    readonly startTreatment: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;

    private readonly page: Page;
    private readonly selectors = {
        startTreatment: 'startTreatment',
        title: 'h3:text-is("Payment Method")',
        firstName: 'firstName',
        lastName: 'lastName'
    }

    constructor(page: Page) {
        this.page = page;
        this.title = this.page.locator(this.selectors.title);
        this.startTreatment = this.page.getByTestId(this.selectors.startTreatment);
        this.firstName = this.page.getByTestId(this.selectors.firstName);
        this.lastName = this.page.getByTestId(this.selectors.lastName);
    }
}