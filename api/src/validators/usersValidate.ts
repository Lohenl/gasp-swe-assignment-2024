import Joi = require('joi');

const schema = Joi.object({
    id: Joi.string().guid,
    name: Joi.string().max(50),
    email: Joi.string().max(90),
    updatedAt: Joi.string(),
    createdAt: Joi.string(),
});

module.exports = function (input) {
    Joi.assert(input, schema);
}
