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
* /schemes/eligible:
*   get:
*       summary: Get all eligible schemes for given applicant
*       description: Get all schemes that an applicant is eligible to apply for
*       parameters:
*           - in: query
*             name: applicant
*             description: ID of the applicant to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
*/
export async function schemesEligibility(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

        // validation happens here, dont forget joi
        // context.log(request.query.get('id'));
        // if (!request.query.get('id')) {
        //     const schemes = await Scheme.findAll({});
        //     return { jsonBody: schemes }
        // } else {
        //     // validation happens here, dont forget joi
        //     const scheme = await Scheme.findByPk(request.query.get('id'));
        //     return { jsonBody: scheme }
        // }

        return { jsonBody: {} }

    } catch (error) {
        context.error('schemes: error encountered:', error);
        return { status: 500, body: `Unexpected error occured: ${error}` }

    }
};

app.http('schemes-eligiblity', {
    route: 'schemes/eligible',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: schemesEligibility
});
