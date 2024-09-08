import Joi = require('joi');

const schema = Joi.object({
    name: Joi.string().max(50),
    email: Joi.string().max(90),
    mobile_no: Joi.string().max(31),
    birth_date: Joi.string(),
    GenderId: Joi.number(),
    MaritalStatusId: Joi.number(),
    EmploymentStatusId: Joi.number(),
});

module.exports = function (input) {
    Joi.assert(input, schema);
}
