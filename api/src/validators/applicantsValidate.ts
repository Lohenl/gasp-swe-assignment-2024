import Joi = require('joi');

const schema = Joi.object({
    id: Joi.string().guid,
    name: Joi.string().max(50).required(),
    email: Joi.string().max(90),
    mobile_no: Joi.string().max(31),
    birth_date: Joi.string().required(),
    GenderId: Joi.number().required(),
    MaritalStatusId: Joi.number().required(),
    EmploymentStatusId: Joi.number().required(),
    updatedAt: Joi.string(),
    createdAt: Joi.string(),
});

module.exports = function (input) {
    Joi.assert(input, schema);
}
