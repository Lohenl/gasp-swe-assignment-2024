// reference: https://www.npmjs.com/package/json-rules-engine/

// client for making asynchronous requests to an api, database, etc
const apiClient = require('./schemes-api-client')

/**
 * Setup a new engine
 */
const { Engine } = require('json-rules-engine')
let engine = new Engine();

// define schema rules here (this will be json definition saved into DB)
let schemeRule = {
    name: 'employed-male-scheme',
    // this sample rule evaluates if 1), applicant is male, and 2), either employed/self-employed
    conditions: {
        all: [{ // applicant is male (refer to code tables)
            fact: 'applicant-details',
            operator: 'equal',
            value: 1,
            path: '$.GenderId' // access the 'GenderId' property of "applicant-details"
        }, {
            fact: 'applicant-details',
            operator: 'in',
            value: [2, 3], // 'status' can be employed or self-employed
            path: '$.EmploymentStatusId' // access the 'status' property of "account-information"
        }]
    },
    event: {
        type: 'eligible',
        params: {
            message: 'Applicant is eilgible for the scheme'
        }
        // in our implementation the event would be to update the eligiblity value in the Application table
    }
}
console.log(schemeRule); // prints to console to copy into swagger UI for API calls
engine.addRule(schemeRule);

/**
 * Define facts the engine will use to evaluate the conditions above.
 * Facts may also be loaded asynchronously at runtime; see the advanced example below
 */
engine.addFact('applicant-details', (params, almanac) => {
    return almanac.factValue('applicantId').then(applicantId => {
        console.log('applicantId:', applicantId);
        // double calls because im too tired to tidy up thenables now
        apiClient.getApplicantInformation(applicantId).then(info => {
            console.log('info:', info);
        });
        return apiClient.getApplicantInformation(applicantId);
    })
})

// define fact(s) known at runtime
// let facts = { applicantId: '1b44bfd4-265a-40d9-bacd-6659c6bbb9db' } // this user is not eligible
let facts = { applicantId: 'e6b52c5e-b9d0-468c-9baf-533c1f2f2f80' } // this user is eligible

// Run the engine to evaluate
engine
    .run(facts)
    .then((response) => {
        // console.log(response.results);
        response.results.forEach(result => {
            // access your condition name and results here - you can evaluate multiple rules at once if wanted
            console.log('condition name:', result.name, ', result:', result.result)
        });
        response.events.map(event => console.log(event.params.message))
    })

/*
* Output: (if applicable)
*
* Applicant is eilgible for the scheme
*/
