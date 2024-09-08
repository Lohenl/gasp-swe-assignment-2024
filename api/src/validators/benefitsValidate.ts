import Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().max(50),
    description: Joi.string().max(1000),
    amount: Joi.number(),
});

module.exports = function (input) {
    Joi.assert(input, schema);
}
