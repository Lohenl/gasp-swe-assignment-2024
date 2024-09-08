import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import ApplicantModel from "../models/applicant";
import HouseholdMemberModel from "../models/householdmember";
const validateBody = require('../validators/householdmembersValidate');

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

/**
* @swagger
* /household-members:
*   get:
*       summary: Get household members by applicant ID
*       description: Get a specific household's details by applicant ID.
*       parameters:
*           - in: query
*             name: applicant_id
*             description: applicant ID
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Adds a household member
*       description: Adds a household member to the specified applicant
*       parameters:
*           - in: query
*             name: applicant_id
*             description: applicant ID
*             schema:
*               type: string
*       requestBody:
*           description: Details of household member
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
*       summary: Updates a household member
*       description: Updates a household member
*       parameters:
*           - in: query
*             name: household_member_id
*             description: household member ID
*             schema:
*               type: string
*       requestBody:
*           description: Details of household member
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
*       summary: Delete household member by ID
*       description: Deletes a household member from the system by ID.
*       parameters:
*           - in: query
*             name: household_member_id
*             required: true
*             description: ID of the household member to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
*/
export async function householdMembers(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        await sequelize.authenticate();
        ApplicantModel(sequelize, DataTypes);
        HouseholdMemberModel(sequelize, DataTypes);
        const Applicant = sequelize.models.Applicant;
        const HouseholdMember = sequelize.models.HouseholdMember;
        // declare 1:N Relationship
        // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-many-relationships
        Applicant.hasMany(HouseholdMember, { onDelete: 'cascade' });
        HouseholdMember.belongsTo(Applicant);

        // wait for all model syncs to finish
        const syncPromises = [];
        syncPromises.push(HouseholdMember.sync());
        syncPromises.push(Applicant.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            context.debug('applicant_id:', request.query.get('applicant_id'));
            Joi.assert(request.query.get('applicant_id'), Joi.string().guid());

            return { jsonBody: {} }

        } else if (request.method === 'POST') {
            const reqBody = await request.json();
            context.debug('reqBody:', reqBody);
            validateBody(reqBody);

            return { jsonBody: {} }

        } else if (request.method === 'PATCH') {
            context.debug('household-member-id:', request.query.get('household-member-id'));
            const reqBody = await request.json();
            context.debug('reqBody:', reqBody);
            Joi.assert(request.query.get('household'), Joi.string().guid().required());
            validateBody(reqBody);

            return { jsonBody: {} }

        } else if (request.method === 'DELETE') {
            context.debug('household_member_id:', request.query.get('household_member_id'));
            Joi.assert(request.query.get('household_member_id'), Joi.string().guid());

            return { jsonBody: {} }

        }

    } catch (error) {
        context.error('household-members: error encountered:', error);
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('household-members', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: householdMembers
});
