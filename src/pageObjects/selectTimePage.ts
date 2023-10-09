import { expect, type Locator, type Page } from '@playwright/test';

export class SelectTimePage {
    readonly logo: Locator;
    readonly title: Locator;

    private readonly page: Page;
    private readonly selectors = {
        logo: 'img[alt = "Henry Logo"]',
        title: 'h2:text-is("Next Available Time")'
    }

    constructor(page: Page) {
        this.page = page;
        this.logo = this.page.locator(this.selectors.logo);
        this.title = this.page.locator(this.selectors.title);
    }

    getTimeslot(date: string): Locator {
        return this.page.getByTestId(date);
    }

    async selectTimeSlot(date: string) {
        const slotLocator = this.getTimeslot(date);
        await slotLocator.click();
    }
}