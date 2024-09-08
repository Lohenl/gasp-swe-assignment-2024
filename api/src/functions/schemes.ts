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
*       summary: Creates a scheme (Benefits needs fixing)
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
*                           email:
*                               type: string
*                           mobile_no:
*                               type: string
*                           birth_date:
*                               type: date
*                               example: "1988-05-02"
*                   example:
*                       name: "Jane Kwok"
*                       email: "janekwok88@gmail.com"
*                       mobile_no: "+6512345678"
*                       birth_date: "1988-05-02"
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       summary: Updates a scheme (Benefits needs fixing)
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
*                           email:
*                               type: string
*                           mobile_no:
*                               type: string
*                           birth_date:
*                               type: date
*                               example: "1988-05-02"
*                   example:
*                       name: "Jane Kwok"
*                       email: "janekwok88@gmail.com"
*                       mobile_no: "+6512345678"
*                       birth_date: "1988-05-02"
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
export async function schemes(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

            return { jsonBody: {} }

        } else if (request.method === 'POST') {
            // validation happens here, dont forget joi
            const schemeToCreate = await request.json();
            context.log('schemeToCreate:', schemeToCreate);
            return { jsonBody: {} }

        } else if (request.method === 'PATCH') {
            // validation happens here, dont forget joi
            context.log(request.query.get('id'));
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

app.http('schemes', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: schemes
});
