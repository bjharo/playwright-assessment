import { expect, type Locator, type Page } from '@playwright/test';

export class ContactDetailsPage {
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly emailAddress: Locator;
    readonly birthDate: Locator;
    readonly phone: Locator;
    readonly birthSex: Locator;
    readonly preferredGender: Locator;
    readonly firstNameError: Locator;
    readonly continue: Locator;

    private readonly page: Page;
    private readonly selectors = {
        firstName: 'firstName',
        lastName: 'lastName',
        emailAddress: 'email',
        birthdate: 'dob',
        phone: 'phoneNumber',
        birthSex: 'sex',
        preferredGender: 'preferredPronouns',
        continue: 'continue'
    }

    constructor(page: Page) {
        this.page = page;
        this.firstName = this.page.getByTestId(this.selectors.firstName);
        this.lastName = this.page.getByTestId(this.selectors.lastName);
        this.emailAddress = this.page.getByTestId(this.selectors.emailAddress);
        this.birthDate = this.page.getByTestId(this.selectors.birthdate);
        this.phone = this.page.getByTestId(this.selectors.phone);
        this.birthSex = this.page.getByTestId(this.selectors.birthSex);
        this.preferredGender = this.page.getByTestId(this.selectors.preferredGender);
        this.continue = this.page.getByTestId(this.selectors.continue);
        this.firstNameError = this.page.locator('label.Mui-error').filter({ hasText: 'Legal first name' });
    }
}