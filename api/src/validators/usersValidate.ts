import Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().max(50),
    email: Joi.string().max(90),
});

module.exports = function (input) {
    Joi.assert(input, schema);
}
