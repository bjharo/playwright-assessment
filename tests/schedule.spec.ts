import { test, expect } from '@playwright/test';
import { SelectStatePage } from '../src/pageObjects/selectStatePage';
import { SelectTimePage } from '../src/pageObjects/selectTimePage';
import { ContactDetailsPage } from '../src/pageObjects/contactDetailsPage';
import { ShippingPage } from '../src/pageObjects/shippingPage';
import { PaymentMethodPage } from '../src/pageObjects/paymentMethodPage';
import { PendingApptPage } from '../src/pageObjects/pendingApptPage';
import GqlQueries from '../src/gqlQueries'
import { faker } from '@faker-js/faker/locale/en_US';

let validStates: string[];

test.beforeAll(async ({ request }) => {
  validStates = await GqlQueries.getProviderStates(request);
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('schedule appt with same shipping and billing address', async ({ page, request }) => {
  const selectStatePage = new SelectStatePage(page);
  const selectTimePage = new SelectTimePage(page);
  const pendingApptPage = new PendingApptPage(page);
  const contactDetailsPage = new ContactDetailsPage(page);
  const shippingPage = new ShippingPage(page);
  const paymentMethodPage = new PaymentMethodPage(page);
  const minDate = new Date();
  const maxDate = new Date();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const stateId = 'illinois';
  const stateName = 'Illinois';

  minDate.setDate(minDate.getDate() + 2);
  maxDate.setDate(maxDate.getDate() + 13);

  const timeslot = (await GqlQueries.getStateTimeslotsIds(request, stateId, minDate, maxDate, 'en-US', 'weightloss'))[0]

  await selectStatePage.selectState(stateId);
  await selectTimePage.selectTimeSlot(timeslot.startTimeDataId);

  await expect(pendingApptPage.pendingApptProvider, 'The pending appointment page did not display the proper provider name.').toHaveText(timeslot.provider);

  await pendingApptPage.continue.click();
  await contactDetailsPage.firstName.fill(firstName);
  await contactDetailsPage.lastName.fill(lastName);
  await contactDetailsPage.emailAddress.fill(faker.internet.email(firstName, lastName));
  await contactDetailsPage.birthDate.fill('05011980');
  await contactDetailsPage.phone.fill(faker.phone.number());
  await contactDetailsPage.birthSex.selectOption('M');
  await contactDetailsPage.preferredGender.selectOption('they/them');
  await contactDetailsPage.continue.click();
  await shippingPage.addrLineOne.fill(faker.location.streetAddress());
  await shippingPage.addrLineTwo.fill(faker.location.secondaryAddress());
  await shippingPage.city.fill(faker.location.city());
  await shippingPage.postalCode.fill(faker.location.zipCode());

  await expect(shippingPage.state, 'The shipping page did not default to populating the chose state in the state field.').toHaveValue(stateName);

  await shippingPage.continue.click();

  await expect(paymentMethodPage.firstName, 'The payment method page did not default to having the first name field populated with the name from contact details.').toHaveValue(firstName);
  await expect(paymentMethodPage.lastName, 'The payment method page did not default to having the last name field populated with the name from contact details.').toHaveValue(lastName);
});

test('only valid states are shown', async ({ page }) => {
  const selectStatePage = new SelectStatePage(page);
  
  for (let state of validStates) {
    await expect.soft(selectStatePage.getState(state), `${state} was not listed on the page.`).toBeVisible();
  }
});

test('invalid states are not shown', async ({ page }) => {
  const selectStatePage = new SelectStatePage(page);
  const allStates: readonly string[] = ['alabama','alaska','arizona','arkansas','california','colorado','connecticut','delaware',
                                            'florida','georgia','hawaii','idaho','illinois','indiana','iowa','kansas','kentucky','louisiana',
                                            'maine','maryland','massachusetts','michigan','minnesota','mississippi','missouri','montana',
                                            'nebraska','nevada','newhampshire','newjersey','newmexico','newyork','northcarolina',
                                            'northdakota','ohio','oklahoma','oregon','pennsylvania',
                                            'rhodeisland','southcarolina','southdakota','tennessee','texas','utah','vermont',
                                            'virginia','washington','westvirginia','wisconsin','wyoming'];
  const invalidStates = allStates.filter(s => !new Set(validStates).has(s))
                                         
  // verify page is fully loaded before verifying that elements do not exist
  await selectStatePage.isLoaded();

  for (let state of invalidStates) {
    await expect.soft(selectStatePage.getState(state), `${state} was listed on the page but should not have been.`).toBeHidden();
  }
});

test('correct timeslots are displayed for a state and the current time', async ({ page, request }) => {
  const selectStatePage = new SelectStatePage(page);
  const selectTimePage = new SelectTimePage(page);
  const minDate = new Date();
  const maxDate = new Date();
  const state = 'illinois';

  // based on what I have seen manually, slots are provided from 2 to 13 days out. 
  // this is, of course, an assumption which should be backed by requirements
  minDate.setDate(minDate.getDate() + 2);
  maxDate.setDate(maxDate.getDate() + 13);

  const expectedTimeslots: string[] = (await GqlQueries.getStateTimeslotsIds(request, state, minDate, maxDate, 'en-US', 'weightloss')).map(t => t.startTimeDataId);

  await selectStatePage.selectState(state);

  for (let slot of expectedTimeslots) {
    await expect.soft(selectTimePage.getTimeslot(slot), `Could not find a timeslot starting at ${slot} for ${state}.`).toBeVisible();
  }
});

test.skip('schedule appt with different shipping and billing addresses', async ({ page }) => {});
test.skip('contact details required fields', async ({ page }) => {});
test.skip('shipping address required fields', async ({ page }) => {});
test.skip('billing address required fields', async ({ page }) => {});
