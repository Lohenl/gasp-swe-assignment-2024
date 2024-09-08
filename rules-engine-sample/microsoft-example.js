const { Engine } = require('json-rules-engine')

// example client for making asynchronous requests to an api, database, etc
const apiClient = require('./account-api-client')

/**
 * Setup a new engine
 */
let engine = new Engine()

/**
 * Rule for identifying microsoft employees taking pto on christmas
 *
 * the account-information fact returns:
 *  { company: 'XYZ', status: 'ABC', ptoDaysTaken: ['YYYY-MM-DD', 'YYYY-MM-DD'] }
 */
let microsoftRule = {
    conditions: {
        all: [{
            fact: 'account-information',
            operator: 'equal',
            value: 'microsoft',
            path: '$.company' // access the 'company' property of "account-information"
        }, {
            fact: 'account-information',
            operator: 'in',
            value: ['active', 'paid-leave'], // 'status' can be active or paid-leave
            path: '$.status' // access the 'status' property of "account-information"
        }, {
            fact: 'account-information',
            operator: 'contains', // the 'ptoDaysTaken' property (an array) must contain '2016-12-25'
            value: '2016-12-25',
            path: '$.ptoDaysTaken' // access the 'ptoDaysTaken' property of "account-information"
        }]
    },
    event: {
        type: 'microsoft-christmas-pto',
        params: {
            message: 'current microsoft employee taking christmas day off'
        }
    }
}
engine.addRule(microsoftRule)

/**
 * 'account-information' fact executes an api call and retrieves account data, feeding the results
 * into the engine.  The major advantage of this technique is that although there are THREE conditions
 * requiring this data, only ONE api call is made.  This results in much more efficient runtime performance
 * and fewer network requests.
 */
engine.addFact('account-information', function (params, almanac) {
    console.log('loading account information...')
    return almanac.factValue('accountId')
        .then((accountId) => {
            return apiClient.getAccountInformation(accountId)
        })
})

// define fact(s) known at runtime
let facts = { accountId: 'lincoln' }
engine
    .run(facts)
    .then(({ events }) => {
        console.log(facts.accountId + ' is a ' + events.map(event => event.params.message))
    })

/*
 * OUTPUT:
 *
 * loading account information... // <-- API call is made ONCE and results recycled for all 3 conditions
 * lincoln is a current microsoft employee taking christmas day off
 */