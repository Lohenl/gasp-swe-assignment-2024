import Joi = require('joi');

const benefitsScheme = Joi.object({
    name: Joi.string().max(50),
    description: Joi.string().max(1000),
    amount: Joi.number(),
});

const schema = Joi.object({
    name: Joi.string().max(50),
    description: Joi.string().max(1000),
    benefits: Joi.array().items(benefitsScheme),
});

module.exports = function (input) {
    Joi.assert(input, schema);
}
