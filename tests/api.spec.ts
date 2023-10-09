import { test, expect } from '@playwright/test';
import GqlQueries from '../src/gqlQueries';
import { expect as chaiExpect } from 'chai';

// this assumes that specific states are the valid ones
test('api only returns valid states', async ({ request }) => {
    const validStates: readonly string[] = ['california','colorado','florida','georgia','illinois',
                                            'maryland','massachusetts','newhampshire','texas','utah',
                                            'virginia','washington'];

    const actualStates = await GqlQueries.getProviderStates(request);

    expect(actualStates.sort(), 'The states returned by the api were not correct.').toStrictEqual(validStates);
});

// this does not verify that each timeslot returned is unique but only that they fit within
// the parameters of the query
test('api returns timeslots based on query variables', async ({ request }) => {
    const minDate = new Date();
    const maxDate = new Date();
    const state = 'illinois';
    const language = 'en-US';
    const treatment = 'weightloss';

    minDate.setDate(minDate.getDate() + 2);
    maxDate.setDate(maxDate.getDate() + 13);

    const response = await request.post(`${process.env.GRAPHQL_API_URL}`, {
        data: {
            query: GqlQueries.timeslotsQuery(state, minDate.toISOString(), maxDate.toISOString(), treatment, language)
        }
    });

    expect(response.ok(), 'The response from the API was not a successful one.').toBeTruthy();

    const jsonData = await response.json();

    for (var slot of jsonData.data.availableTimeslots) {
        chaiExpect(new Date(slot.startTime)).to.be.greaterThanOrEqual(minDate).and.to.be.lessThanOrEqual(maxDate);

        const expectedEndTime = new Date(slot.startTime);
        expectedEndTime.setTime(expectedEndTime.getTime() + 15 * 60000);

        chaiExpect(new Date(slot.endTime)).eql(expectedEndTime);

        expect(slot.state).toBe(state);
        expect(slot.language).toBe(language);
        expect(slot.treatment).toBe(treatment);
    }
})

test('invalid state returns no timelots', async ({ request }) => {
    const minDate = new Date();
    const maxDate = new Date();
    const state = 'indiana';
    const language = 'en-US';
    const treatment = 'weightloss';

    minDate.setDate(minDate.getDate() + 2);
    maxDate.setDate(maxDate.getDate() + 13);

    const response = await request.post(`${process.env.GRAPHQL_API_URL}`, {
        data: {
            query: GqlQueries.timeslotsQuery(state, minDate.toISOString(), maxDate.toISOString(), treatment, language)
        }
    });

    expect(response.ok(), 'The response from the API was not a successful one.').toBeTruthy();

    const jsonData = await response.json();

    expect(jsonData.data.availableTimeslots.length).toBe(0);
});

test('max data after min date returns no timelots', async ({ request }) => {
    const minDate = new Date();
    const maxDate = new Date();
    const state = 'california';
    const language = 'en-US';
    const treatment = 'weightloss';

    minDate.setDate(minDate.getDate() + 2);
    maxDate.setDate(maxDate.getDate() - 1);

    const response = await request.post(`${process.env.GRAPHQL_API_URL}`, {
        data: {
            query: GqlQueries.timeslotsQuery(state, minDate.toISOString(), maxDate.toISOString(), treatment, language)
        }
    });

    expect(response.ok(), 'The response from the API was not a successful one.').toBeTruthy();

    const jsonData = await response.json();

    expect(jsonData.data.availableTimeslots.length).toBe(0);
});