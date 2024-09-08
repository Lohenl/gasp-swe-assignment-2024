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
*           description: JSON Object representing json-rules-engine scheme rule
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: object
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
*           description: JSON Object representing json-rules-engine scheme rule
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: object
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
        let syncPromises = [];
        syncPromises.push(Scheme.sync());
        syncPromises.push(Benefit.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            // validation happens here, dont forget joi
            context.log(request.query.get('scheme_id'));
            const scheme = await Scheme.findByPk(request.query.get('scheme_id'));
            return { jsonBody: scheme.dataValues.eligibility_criteria }

        } else if (request.method === 'POST' || request.method === 'PATCH') {
            // validation happens here, dont forget joi
            context.log(request.query.get('scheme_id'));
            const schemeRuleToUpdate = await request.json() as any;
            context.log('schemeRuleToUpdate:', schemeRuleToUpdate);
            // stringify the JSON structure for persistence
            const schemeRuleStringified = JSON.stringify(schemeRuleToUpdate);
            const scheme = await Scheme.findByPk(request.query.get('scheme_id'));
            if (!scheme) {
                return { status: 400, body: 'invalid scheme_id provided' }
            }
            if (request.method === 'POST' && (scheme.dataValues.eligibility_criteria !== null)) {
                return { status: 400, body: 'scheme rule is already declared, please use HTTP PATCH method to update' }
            }
            scheme.update({ eligibility_criteria: schemeRuleStringified });
            await scheme.save();
            return { jsonBody: scheme.dataValues }

        } else if (request.method === 'DELETE') {
            // validation happens here, dont forget joi
            context.log(request.query.get('scheme_id'));
            const scheme = await Scheme.findByPk(request.query.get('scheme_id'));
            if (!scheme) {
                return { status: 400, body: 'invalid scheme_id provided' }
            }
            scheme.update({ eligibility_criteria: null });
            await scheme.save();
            return { body: request.query.get('scheme_id') }

        }

    } catch (error) {
        context.error('schemes: error encountered:', error);
        return { status: 500, body: `Unexpected error occured: ${error}` }

    }
};

app.http('scheme-rules', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: schemeRules
});
