import Joi = require('joi');

// TODO: aint got time to figure out all the possible inputs for this..
const schema = Joi.object({
    name: Joi.string().max(50),
    conditions: Joi.object(),
    event: Joi.object(),
});

module.exports = function (input) {
    Joi.assert(input, schema);
}
