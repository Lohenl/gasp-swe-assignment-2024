import Joi = require('joi');

const benefitsScheme = Joi.object({
    name: Joi.string().max(50).required(),
    description: Joi.string().max(1000),
    amount: Joi.number(),
});

const schema = Joi.object({
    id: Joi.string().guid,
    name: Joi.string().max(50).required(),
    description: Joi.string().max(1000),
    benefits: Joi.array().items(benefitsScheme),
    updatedAt: Joi.string(),
    createdAt: Joi.string(),
});

module.exports = function (input) {
    Joi.assert(input, schema);
}
