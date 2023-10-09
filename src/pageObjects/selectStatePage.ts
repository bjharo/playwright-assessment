import { expect, type Locator, type Page } from '@playwright/test';

export class SelectStatePage {
    readonly logo: Locator;
    readonly title: Locator;
    readonly otherState: Locator;

    private readonly page: Page;
    private readonly selectors = {
        logo: 'img[alt = "Henry Logo"]',
        title: 'h2:text-is("Schedule your Appointment!")',
        otherState: 'otherstate'
    }

    constructor(page: Page) {
        this.page = page;
        this.logo = this.page.locator(this.selectors.logo);
        this.title = this.page.locator(this.selectors.title);
        this.otherState = this.page.getByTestId(this.selectors.otherState);
    }

    async isLoaded() {
        await expect(this.title, 'The title on the select state page was not displayed or correct.').toBeVisible();
        await expect(this.otherState, 'The other state button on the select state page was not displayed.').toBeVisible();
    }

    getState(state: string): Locator {
        return this.page.getByTestId(state);
    }

    async selectState(state: string) {
        var stateLocator = this.getState(state);
        await stateLocator.click();
    }
}