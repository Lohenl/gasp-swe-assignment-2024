import Joi = require('joi');

const schema = Joi.object({
    id: Joi.string().guid,
    name: Joi.string().max(50).required(),
    email: Joi.string().max(90).required(),
    updatedAt: Joi.string(),
    createdAt: Joi.string(),
});

module.exports = function (input) {
    Joi.assert(input, schema);
}
