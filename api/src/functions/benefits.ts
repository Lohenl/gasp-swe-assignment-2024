import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import SchemeModel from "../models/scheme";
import BenefitModel from "../models/benefit";

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
*             description: ID of the scheme to retrieve all benefits under.
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
*                       name: "CPF Medisave Account Top Up"
*                       description: "Top up to citizen's CPF Medisave Account"
*                       amount: 600.00
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
            // validation happens here, dont forget joi
            context.log(request.query.get('id'));
            context.log(request.query.get('scheme_id'));

            return { jsonBody: {} }

        } else if (request.method === 'POST') {
            // validation happens here, dont forget joi
            context.log(request.query.get('scheme_id'));
            const schemeToCreate = await request.json();
            context.log('schemeToCreate:', schemeToCreate);
            return { jsonBody: {} }

        } else if (request.method === 'PATCH') {
            // validation happens here, dont forget joi
            context.log(request.query.get('scheme_id'));
            const schemeToCreate = await request.json();
            context.log('schemeToCreate:', schemeToCreate);
            return { jsonBody: {} }

        } else if (request.method === 'DELETE') {
            // validation happens here, dont forget joi
            context.log(request.query.get('id'));
            return { jsonBody: {} }

        }

    } catch (error) {
        context.error('schemes: error encountered:', error);
        return { status: 500, body: `Unexpected error occured: ${error}` }

    }
};

app.http('benefits', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: benefits
});
