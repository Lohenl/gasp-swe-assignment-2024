import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import SchemeModel from "../models/scheme";
import BenefitModel from "../models/benefit";
const validateBody = require('../validators/schemeRulesValidate');

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

/**
* @swagger
* /scheme-rules:
*   get:
*       summary: Get scheme rules by scheme ID
*       description: Get a specific scheme's details by scheme ID.
*       parameters:
*           - in: query
*             required: true
*             name: scheme_id
*             description: ID of the scheme
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates a scheme rule for a specified scheme
*       description: Creates a scheme rule for a specified scheme
*       parameters:
*           - in: query
*             name: scheme_id
*             required: true
*             description: ID of the scheme to update.
*             schema:
*               type: string
*       requestBody:
*           description: JSON Object representing json-rules-engine scheme rule (Refer to README instead for premade examples)
*           required: true
*           content:
*               application/json:
*                   schema:
*                       schemeRule:
*                           type: object
*                       properties:
*                           name:
*                               type: string
*                               name: "employed-male-scheme"
*                           conditions:
*                               type: object
*                               properties:
*                                   "any":
*                                       type: array
*                                       items:
*                                           type: object
*                                           properties:
*                                               fact:
*                                                   type: string
*                                                   example: applicant-details
*                                               operator:
*                                                   type: string
*                                                   example: equal
*                                               value:
*                                                   type: {}
*                                                   example: 1
*                                               path:
*                                                   type: string
*                                                   example: "$.GenderId"
*                                   "all":
*                                       type: array
*                                       items:
*                                           type: object
*                                           properties:
*                                               fact:
*                                                   type: string
*                                                   example: applicant-details
*                                               operator:
*                                                   type: string
*                                                   example: equal
*                                               value:
*                                                   type: {}
*                                                   example: 1
*                                               path:
*                                                   type: string
*                                                   example: "$.GenderId"
*                           event:
*                               type: object
*                               properties:
*                                   type:
*                                       type: string
*                                       example: "eligible"
*                                   params:
*                                       type: object
*                                       properties:
*                                           message:
*                                               type: string
*                                               example: "Applicant is eligible for the scheme"
*                   example:
*                       name: employed-male-scheme
*                       conditions:
*                           all:
*                               - fact: applicant-details
*                                 path: "$.GenderId"
*                                 operator: equal
*                                 value: 1
*                               - fact: applicant-details
*                                 path: "$.EmploymentStatusId"
*                                 operator: in
*                                 value:
*                                   - 2
*                                   - 3
*                       event:
*                           "type": eligible
*                           "params":
*                               message: Applicant is eligible for CPF Medisave Benefit
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       summary: Updates a scheme rule for a specified scheme
*       description: Updates a scheme rule for a specified scheme
*       parameters:
*           - in: query
*             name: scheme_id
*             required: true
*             description: ID of the scheme to update.
*             schema:
*               type: string
*       requestBody:
*           description: JSON Object representing json-rules-engine scheme rule (Refer to README instead for premade examples)
*           required: true
*           content:
*               application/json:
*                   schema:
*                       schemeRule:
*                           type: object
*                       properties:
*                           name:
*                               type: string
*                               name: "employed-male-scheme"
*                           conditions:
*                               type: object
*                               properties:
*                                   "any":
*                                       type: array
*                                       items:
*                                           type: object
*                                           properties:
*                                               fact:
*                                                   type: string
*                                                   example: applicant-details
*                                               operator:
*                                                   type: string
*                                                   example: equal
*                                               value:
*                                                   type: {}
*                                                   example: 1
*                                               path:
*                                                   type: string
*                                                   example: "$.GenderId"
*                                   "all":
*                                       type: array
*                                       items:
*                                           type: object
*                                           properties:
*                                               fact:
*                                                   type: string
*                                                   example: applicant-details
*                                               operator:
*                                                   type: string
*                                                   example: equal
*                                               value:
*                                                   type: {}
*                                                   example: 1
*                                               path:
*                                                   type: string
*                                                   example: "$.GenderId"
* 
*                           event:
*                               type: object
*                               properties:
*                                   type:
*                                       type: string
*                                       example: "eligible"
*                                   params:
*                                       type: object
*                                       properties:
*                                           message:
*                                               type: string
*                                               example: "Applicant is eligible for the scheme"
*                   example:
*                       name: unemployed-male-scheme
*                       conditions:
*                           all:
*                               - fact: applicant-details
*                                 path: "$.GenderId"
*                                 operator: equal
*                                 value: 1
*                               - fact: applicant-details
*                                 path: "$.EmploymentStatusId"
*                                 operator: equal
*                                 value: 1
*                       event:
*                           "type": eligible
*                           "params":
*                               message: Applicant is eligible for CPF Medisave Benefit
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       summary: Delete scheme rule by scheme ID
*       description: Delete a scheme rule from the system by scheme ID.
*       parameters:
*           - in: query
*             name: scheme_id
*             required: true
*             description: ID of the scheme to delete scheme rule from.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*/
export async function schemeRules(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // declare 1:N Relationship
        // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-many-relationships
        await sequelize.authenticate();
        SchemeModel(sequelize, DataTypes);
        BenefitModel(sequelize, DataTypes);
        const Scheme = sequelize.models.Scheme;
        const Benefit = sequelize.models.Benefit;
        Scheme.hasMany(Benefit, { onDelete: 'cascade' }); // deletes any benefits associated with this scheme when its deleted
        Benefit.belongsTo(Scheme);

        // wait for all model syncs to finish
        const syncPromises = [];
        syncPromises.push(Scheme.sync());
        syncPromises.push(Benefit.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            context.debug('scheme_id:', request.query.get('scheme_id'));
            Joi.assert(request.query.get('scheme_id'), Joi.string().guid().required());
            const scheme = await Scheme.findByPk(request.query.get('scheme_id'));
            if (!scheme) {
                return { status: 404, body: 'scheme not found' }
            }
            if (!scheme.dataValues.eligibility_criteria) {
                return { status: 404, body: 'rule is not defined for the given scheme' }
            }
            return { jsonBody: JSON.parse(scheme.dataValues.eligibility_criteria) }

        } else if (request.method === 'POST' || request.method === 'PATCH') {
            context.debug('scheme_id:', request.query.get('scheme_id'));
            const schemeRuleToUpdate = await request.json() as any;
            context.debug('schemeRuleToUpdate:', schemeRuleToUpdate);
            Joi.assert(request.query.get('scheme_id'), Joi.string().guid().required());
            validateBody(schemeRuleToUpdate);
            // stringify the JSON structure for persistence
            const schemeRuleStringified = JSON.stringify(schemeRuleToUpdate);
            const scheme = await Scheme.findByPk(request.query.get('scheme_id'));
            if (!scheme) {
                return { status: 404, body: 'scheme not found' }
            }
            if (request.method === 'POST' && (scheme.dataValues.eligibility_criteria !== null)) {
                return { status: 422, body: 'scheme rule is already declared, please use HTTP PATCH method to update' }
            }
            scheme.update({ eligibility_criteria: schemeRuleStringified });
            await scheme.save();
            return { jsonBody: scheme.dataValues }

        } else if (request.method === 'DELETE') {
            context.debug('scheme_id:', request.query.get('scheme_id'));
            Joi.assert(request.query.get('scheme_id'), Joi.string().guid().required());
            const scheme = await Scheme.findByPk(request.query.get('scheme_id'));
            if (!scheme) {
                return { status: 404, body: 'scheme not found' }
            }
            scheme.update({ eligibility_criteria: null });
            await scheme.save();
            return { body: request.query.get('scheme_id') }
        }
    } catch (error) {
        context.error('schemes: error encountered:', error);
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('scheme-rules', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: schemeRules
});
