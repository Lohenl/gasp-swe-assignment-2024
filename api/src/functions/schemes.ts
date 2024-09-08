import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import SchemeModel from "../models/scheme";
import BenefitModel from "../models/benefit";
const validateBody = require('../validators/schemesValidate');

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres'
});

/**
* @swagger
* /schemes:
*   get:
*       summary: Get all schemes / Get scheme details by ID
*       description: Get a specific scheme's details by ID. Omit ID to get all schemes' details registered in system.
*       parameters:
*           - in: query
*             name: id
*             description: ID of the scheme to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates a scheme
*       description: Creates a scheme
*       requestBody:
*           description: Array of member IDs to be included in household
*           required: true
*           content:
*               application/json:
*                   schema:
*                       scheme:
*                           type: object
*                       required:
*                           - name
*                       properties:
*                           name:
*                               type: string
*                           description:
*                               type: string
*                           benefits:
*                               type: array
*                               items:
*                                   type: object
*                                   properties:
*                                       name:
*                                           type: string
*                                       description:
*                                           type: string
*                                       amount:
*                                           type: number
*                   example:
*                       name: "Retrenchment Assistance Scheme"
*                       description: "Scheme to help citizens who are recently retrenched"
*                       benefits:
*                           - name: SkillsFuture Credits
*                             description: Additional SkillsFuture Credits
*                             amount: 3000.00
*                           - name: CDC Vouchers
*                             description: Additional CDC Vouchers
*                             amount: 600.00
*                           - name: School Meal Vouchers
*                             description: Daily school meal vouchers for applicants with children attending primary school 
*                             amount: 5.00
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       summary: Updates a scheme
*       description: Updates a scheme
*       parameters:
*           - in: query
*             name: id
*             required: true
*             description: ID of the scheme to update.
*             schema:
*               type: string
*       requestBody:
*           description: Array of member IDs to be included in household
*           required: true
*           content:
*               application/json:
*                   schema:
*                       scheme:
*                           type: object
*                       required:
*                           - name
*                       properties:
*                           name:
*                               type: string
*                           description:
*                               type: string
*                           benefits:
*                               type: array
*                               items:
*                                   type: object
*                                   properties:
*                                       name:
*                                           type: string
*                                       description:
*                                           type: string
*                                       amount:
*                                           type: number
*                   example:
*                       name: "SGSupport Scheme"
*                       description: "Scheme to help citizens who are recently retrenched"
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       summary: Delete scheme by ID
*       description: Delete a scheme from the system by ID.
*       parameters:
*           - in: query
*             name: id
*             required: true
*             description: ID of the scheme to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*/
export async function schemes(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
            context.debug('id:', request.query.get('id'));
            if (!request.query.get('id')) {
                const schemes = await Scheme.findAll({});
                return { jsonBody: schemes }
            } else {
                Joi.assert(request.query.get('id'), Joi.string().guid());
                const scheme = await Scheme.findByPk(request.query.get('id'));
                return { jsonBody: scheme }
            }

        } else if (request.method === 'POST') {
            const schemeToCreate = await request.json() as any;
            context.debug('schemeToCreate:', schemeToCreate);
            validateBody(schemeToCreate);
            const benefitsToCreate = schemeToCreate.benefits as any[];

            // this is a complex creation, so we will need to use transaction
            // sequelize has a way to create linked 1:N instances
            // reference https://sequelize.org/docs/v6/advanced-association-concepts/creating-with-associations/
            const result = await sequelize.transaction(async t => {
                const createPromises = [];
                // create base scheme class
                const scheme = await Scheme.create({
                    name: schemeToCreate.name,
                    description: schemeToCreate.description,
                }, {
                    include: Benefit,
                    transaction: t,
                });

                // create assigned benefits
                benefitsToCreate.forEach(benefit => {
                    context.debug('benefit:', benefit);
                    createPromises.push(Benefit.create({ ...benefit, SchemeId: scheme.dataValues.id }, { transaction: t }));
                });
                await Promise.allSettled(createPromises);
                return scheme;
            });

            return { jsonBody: result.dataValues }

        } else if (request.method === 'PATCH') {
            context.debug('id:', request.query.get('id'));
            const schemeToUpdate = await request.json() as any;
            context.debug('schemeToUpdate:', schemeToUpdate);
            Joi.assert(request.query.get('id'), Joi.string().guid().required());
            validateBody(schemeToUpdate);

            // get base scheme class
            const scheme = await Scheme.findByPk(request.query.get('id'));
            if (!scheme) {
                return { status: 400, body: 'invalid id provided' }
            }
            scheme.update(schemeToUpdate);
            await scheme.save();

            return { jsonBody: scheme.dataValues }

        } else if (request.method === 'DELETE') {
            context.debug('id:', request.query.get('id'));
            Joi.assert(request.query.get('id'), Joi.string().guid().required());
            const scheme = await Scheme.findByPk(request.query.get('id'));
            if (!scheme) {
                return { status: 400, body: 'invalid id provided' }
            }
            await scheme.destroy();
            return { body: request.query.get('id') }

        }

    } catch (error) {
        context.error('schemes: error encountered:', error);
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('schemes', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: schemes
});
