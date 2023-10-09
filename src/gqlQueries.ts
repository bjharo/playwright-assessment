import { APIRequestContext, expect } from "@playwright/test";
import { Timeslot } from "./timeslot";

export default class GqlQueries {
    static readonly providerStatesQuery: string = `query statesByProviderTreatment {
        statesByProviderTreatment: provider_provider_treatment(distinct_on: state, where: {
          treatment: {
            short_id: {
              _eq: "weightloss"
            }
          },
          _and: [
            {
              state: {
                _neq: "test"
              }
            }
          ]
        })
        {
          state
        }
      }`;

    static readonly timeslotsQuery = (state: string, minDate: string, maxDate: string, treatmentShortId: string, language: string) => `query availableTimeslots {
        availableTimeslots: appointment_capped_available_appointment_slots(
            where: {
              start_time: {
                _gt: "${minDate}", 
                _lt: "${maxDate}"
              }, 
              state: {
                _eq: "${state}"
              }, 
              treatment_object: {
                short_id: {
                  _eq: "${treatmentShortId}"
                }
              },
              language: {
                _eq: "${language}"
              },
              provider: {
                _and: {
                  id: {
                    _is_null: false
                  }
                }
              }
            }
            order_by: {
              start_time: asc    
            }
          ) {
            startTime: start_time
            endTime: end_time
            provider {
              displayName: display_name
            },
            language,
            state,
            treatment
          }
        }`;

    static async getProviderStates(request: APIRequestContext): Promise<string[]> {
        const response = await request.post(`${process.env.GRAPHQL_API_URL}`, {
          data: {
              query: this.providerStatesQuery
          }
        });

        expect(response.ok(), 'The response from the API was not a successful one.').toBeTruthy();
        
        const jsonData = await response.json();
        return jsonData.data.statesByProviderTreatment.map(s => s.state);
    }

    static async getStateTimeslotsIds(request: APIRequestContext, state: string, minDate: Date, maxDate: Date, language: string, treatment: string): Promise<Timeslot[]> {
        const response = await request.post(`${process.env.GRAPHQL_API_URL}`, {
          data: {
              query: GqlQueries.timeslotsQuery(state, minDate.toISOString(), maxDate.toISOString(), treatment, language)
          }
        });

        expect(response.ok(), 'The response from the API was not a successful one.').toBeTruthy();
        
        const jsonData = await response.json();
        return jsonData.data.availableTimeslots.map(s => new Timeslot(new Date(s.startTime), new Date(s.endTime), s.startTime, s.provider.displayName));
    }
}