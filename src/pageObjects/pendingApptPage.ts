import { expect, type Locator, type Page } from '@playwright/test';

export class PendingApptPage {
    readonly pendingApptTime: Locator;
    readonly pendingApptDate: Locator;
    readonly pendingApptProvider: Locator;
    readonly continue: Locator;

    private readonly page: Page;
    private readonly selectors = {
        pendingApptTime: 'pending-appointment-time',
        pendingApptDate: 'pending-appointment-date',
        pendingApptProvider: 'pending-appointment-provider',
        continue: 'continue'
    }

    constructor(page: Page) {
        this.page = page;
        this.pendingApptTime = this.page.getByTestId(this.selectors.pendingApptTime);
        this.pendingApptDate = this.page.getByTestId(this.selectors.pendingApptDate);
        this.pendingApptProvider = this.page.getByTestId(this.selectors.pendingApptProvider);
        this.continue = this.page.getByTestId(this.selectors.continue);
    }
}