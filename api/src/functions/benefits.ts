import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import SchemeModel from "../models/scheme";
import BenefitModel from "../models/benefit";
const validateBody = require('../validators/benefitsValidate');

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

/**
* @swagger
* /benefits:
*   get:
*       tags:
*           - Business - Scheme Management
*       summary: Get benefit details by ID / Get benefit details by SchemeId
*       description: Get a specific scheme's details by either ID or all benefit details under a specific Scheme with SchemeId
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
*       tags:
*           - Business - Scheme Management
*       summary: Creates a benefit under a given scheme
*       description: Creates a benefit under a given scheme
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
*       tags:
*           - Business - Scheme Management
*       summary: Updates a benefit
*       description: Updates a benefit
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
*       tags:
*           - Business - Scheme Management
*       summary: Delete benefit by ID
*       description: Delete a benefit from the system by ID.
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
        const syncPromises = [];
        syncPromises.push(Scheme.sync());
        syncPromises.push(Benefit.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            const id = request.query.get('id');
            const scheme_id = request.query.get('scheme_id');
            context.debug('id:', id);
            context.debug('scheme_id:', scheme_id);

            if (id && scheme_id) {
                return { status: 400, body: 'Provide either id or scheme_id, not both' }
            } else if (!id && !scheme_id) {
                return { status: 400, body: 'Provide either id or scheme_id' }
            }

            if (id) {
                Joi.assert(id, Joi.string().guid());
                const benefit = await Benefit.findByPk(id);
                if (!benefit) {
                    return { status: 404, body: 'benefit not found' }
                }
                return { jsonBody: benefit }

            } else if (scheme_id) {
                Joi.assert(scheme_id, Joi.string().guid());
                const scheme = await Scheme.findByPk(scheme_id);
                if (!scheme) {
                    return { status: 404, body: 'scheme not found' }
                }
                const benefits = await Benefit.findAll({ where: { SchemeId: scheme_id } });
                context.debug('benefits', benefits);
                const jsonBody = [];
                benefits.forEach(benefit => {
                    jsonBody.push(benefit.dataValues);
                })
                return { jsonBody }

            }

        } else if (request.method === 'POST') {
            const scheme_id = request.query.get('scheme_id');
            context.debug('scheme_id:', scheme_id);
            const benefitToCreate = await request.json() as object;
            context.debug('benefitToCreate:', benefitToCreate);
            Joi.assert(scheme_id, Joi.string().guid());
            validateBody(benefitToCreate);

            // check if scheme exists
            const scheme = await Scheme.findByPk(scheme_id);
            if (!scheme) {
                return { status: 404, body: 'scheme not found' }
            }

            // do creation
            const benefit = await Benefit.create({ ...benefitToCreate, SchemeId: scheme_id });
            return { jsonBody: benefit.dataValues }

        } else if (request.method === 'PATCH') {
            context.debug('benefit_id:', request.query.get('benefit_id'));
            const benefitToUpdate = await request.json();
            context.debug('benefitToUpdate:', benefitToUpdate);
            Joi.assert(request.query.get('benefit_id'), Joi.string().guid());
            validateBody(benefitToUpdate);

            // check if benefit exists
            const benefit = await Benefit.findByPk(request.query.get('benefit_id'));
            if (!benefit) {
                return { status: 404, body: 'benefit not found' }
            }
            benefit.update(benefitToUpdate);
            await benefit.save();
            return { jsonBody: benefit.dataValues }

        } else if (request.method === 'DELETE') {
            const id = request.query.get('id');
            context.debug('id:', id);
            Joi.assert(id, Joi.string().guid());
            const benefit = await Benefit.findByPk(id);
            if (!benefit) {
                return { status: 404, body: 'benefit not found' }
            }
            await benefit.destroy();
            return { body: id }
        }

    } catch (error) {
        context.error('schemes: error encountered:', error);
        if (error?.message?.startsWith('unauthorized')) { return { status: 403, body: error } }
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('benefits', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: benefits
});
