import Joi = require('joi');

// TODO: aint got time to figure out all the possible inputs for this..
const schema = Joi.object({
    id: Joi.string().guid,
    name: Joi.string().max(50),
    conditions: Joi.object(),
    event: Joi.object(),
    updatedAt: Joi.string(),
    createdAt: Joi.string(),
});

module.exports = function (input) {
    Joi.assert(input, schema);
}
