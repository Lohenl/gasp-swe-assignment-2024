import Joi = require('joi');

const schema = Joi.array().items(Joi.string().guid()).min(1);

module.exports = function (input) {
    Joi.assert(input, schema);
}
