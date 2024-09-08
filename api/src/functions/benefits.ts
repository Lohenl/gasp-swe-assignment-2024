import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import SchemeModel from "../models/scheme";
import BenefitModel from "../models/benefit";
const validateJSON = require('../validators/benefitsValidate');

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres'
});

/**
* @swagger
* /benefits:
*   get:
*       summary: Get benefit details by ID / Get benefit details by SchemeId
*       description: Get a specific scheme's details by either ID or all benefit details under a specific Scheme with SchemeId
*       parameters:
*           - in: query
*             name: id
*             description: ID of the benefit to retrieve.
*             schema:
*               type: string
*           - in: query
*             name: scheme_id
*             description: ID of the scheme to retrieve all benefits under.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates a benefit under a given scheme
*       description: Creates a benefit under a given scheme
*       parameters:
*           - in: query
*             name: scheme_id
*             description: ID of the scheme to create a benefit under.
*             required: true
*             schema:
*               type: string
*       requestBody:
*           description: Benefit Details
*           required: true
*           content:
*               application/json:
*                   schema:
*                       benefit:
*                           type: object
*                       properties:
*                           name:
*                               type: string
*                           description:
*                               type: string
*                           amount:
*                               type: number
*                   example:
*                       name: "CPF Medisave Account Top Up"
*                       description: "Top up to citizen's CPF Medisave Account"
*                       amount: 600.00
*                       
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       summary: Updates a benefit
*       description: Updates a benefit
*       parameters:
*           - in: query
*             name: benefit_id
*             description: ID of the benefit to update
*             schema:
*               type: string
*       requestBody:
*           description: Benefit Details
*           required: true
*           content:
*               application/json:
*                   schema:
*                       benefit:
*                           type: object
*                       properties:
*                           name:
*                               type: string
*                           description:
*                               type: string
*                           amount:
*                               type: number
*                   example:
*                       name: "CPF Ordinary Account Top Up"
*                       description: "Top up to citizen's CPF Ordinary Account"
*                       amount: 500.00
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       summary: Delete benefit by ID
*       description: Delete a benefit from the system by ID.
*       parameters:
*           - in: query
*             name: id
*             required: true
*             description: ID of the benefit to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*/
export async function benefits(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // declare 1:N Relationship
        // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-many-relationships
        await sequelize.authenticate();
        SchemeModel(sequelize, DataTypes);
        BenefitModel(sequelize, DataTypes);
        const Scheme = sequelize.models.Scheme;
        const Benefit = sequelize.models.Benefit;
        Scheme.hasMany(Benefit);
        Benefit.belongsTo(Scheme);

        // wait for all model syncs to finish
        let syncPromises = [];
        syncPromises.push(Scheme.sync());
        syncPromises.push(Benefit.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            context.debug('id:', request.query.get('id'));
            context.debug('schema_id:', request.query.get('scheme_id'));
            Joi.assert(request.query.get('id'), Joi.string().guid());
            Joi.assert(request.query.get('scheme_id'), Joi.string().guid());

            if (request.query.get('id') && request.query.get('scheme_id')) {
                return { status: 400, body: 'Provide either id or scheme_id, not both' }
            } else if (!request.query.get('id') && !request.query.get('scheme_id')) {
                return { status: 400, body: 'Provide either id or scheme_id' }
            }

            if (request.query.get('id')) {
                const benefit = await Benefit.findByPk(request.query.get('id'));
                return { jsonBody: benefit }

            } else if (request.query.get('scheme_id')) {
                const benefits = await Benefit.findAll({ where: { SchemeId: request.query.get('scheme_id') } });
                context.debug('benefits', benefits);
                let jsonBody = [];
                benefits.forEach(benefit => {
                    jsonBody.push(benefit.dataValues);
                })
                return { jsonBody }

            }

        } else if (request.method === 'POST') {
            context.debug('scheme_id:', request.query.get('scheme_id'));
            const benefitToCreate = await request.json() as Object;
            context.debug('benefitToCreate:', benefitToCreate);
            Joi.assert(request.query.get('schema_id'), Joi.string().guid());
            validateJSON(benefitToCreate);

            // check if scheme exists
            const scheme = Scheme.findByPk(request.query.get('scheme_id'));
            if (!scheme) {
                return { status: 400, body: 'invalid scheme_id provided' }
            }

            // do creation
            const benefit = await Benefit.create({ ...benefitToCreate, SchemeId: request.query.get('scheme_id') });
            return { jsonBody: benefit.dataValues }

        } else if (request.method === 'PATCH') {
            context.debug('benefit_id:', request.query.get('benefit_id'));
            const benefitToUpdate = await request.json();
            context.debug('benefitToUpdate:', benefitToUpdate);
            Joi.assert(request.query.get('benefit_id'), Joi.string().guid());
            validateJSON(benefitToUpdate);

            // check if benefit exists
            const benefit = await Benefit.findByPk(request.query.get('benefit_id'));
            if (!benefit) {
                return { status: 400, body: 'invalid benefit_id provided' }
            }
            benefit.update(benefitToUpdate);
            await benefit.save();
            return { jsonBody: benefit.dataValues }

        } else if (request.method === 'DELETE') {
            context.debug('id:', request.query.get('id'));
            Joi.assert(request.query.get('id'), Joi.string().guid());
            const benefit = await Benefit.findByPk(request.query.get('id'));
            if (!benefit) {
                return { status: 400, body: 'invalid id provided' }
            }
            await benefit.destroy();
            return { body: request.query.get('id') }
        }

    } catch (error) {
        context.error('schemes: error encountered:', error);
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('benefits', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: benefits
});
