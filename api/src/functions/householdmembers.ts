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
*       tags:
*           - Business - Applicant Management
*       summary: Get household members by applicant ID / Get household member by ID
*       description: Get all household members registered under an applicant, or get a specific household member's details by household member ID
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
*           - in: query
*             name: id
*             description: household member ID
*             schema:
*               type: string
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
*       tags:
*           - Business - Applicant Management
*       summary: Adds a household member
*       description: Adds a household member to the specified applicant
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
*           - in: query
*             name: applicant_id
*             required: true
*             description: applicant ID
*             schema:
*               type: string
*       requestBody:
*           description: Details of household member
*           required: true
*           content:
*               application/json:
*                   schema:
*                       household-member:
*                           type: object
*                       properties:
*                           name:
*                               type: string
*                               example: Aloysius Kwok Geng Hao
*                           email:
*                               type: string
*                               example: akwok87@gmail.com
*                           mobile_no:
*                               type: string
*                               example: +6588888888
*                           birth_date:
*                               type: string
*                               example: 1987-01-08
*                           EmploymentStatusId:
*                               type: number
*                               example: 3
*                           MaritalStatusId:
*                               type: number
*                               example: 2
*                           GenderId:
*                               type: number
*                               example: 1
*                           RelationshipId:
*                               type: number
*                               example: 2
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       tags:
*           - Business - Applicant Management
*       summary: Updates a household member
*       description: Updates a household member
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
*           - in: query
*             name: id
*             description: household member ID
*             schema:
*               type: string
*       requestBody:
*           description: Details of household member
*           required: true
*           content:
*               application/json:
*                   schema:
*                       household-member:
*                           type: object
*                       properties:
*                           name:
*                               type: string
*                               example: Aloysius Kwok Geng Hao
*                           email:
*                               type: string
*                               example: akwok87@gmail.com
*                           mobile_no:
*                               type: string
*                               example: +6511111111
*                           birth_date:
*                               type: string
*                               example: 1987-01-08
*                           EmploymentStatusId:
*                               type: number
*                               example: 1
*                           MaritalStatusId:
*                               type: number
*                               example: 2
*                           GenderId:
*                               type: number
*                               example: 1
*                           RelationshipId:
*                               type: number
*                               example: 2
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       tags:
*           - Business - Applicant Management
*       summary: Delete household member by ID
*       description: Deletes a household member from the system by ID.
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
*           - in: query
*             name: id
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
            const id = request.query.get('id');
            const applicant_id = request.query.get('applicant_id');
            context.debug('id:', id);
            context.debug('applicant_id:', applicant_id);

            if (id && applicant_id) {
                return { status: 400, body: 'Provide either id or applicant_id, not both' }
            } else if (!id && !applicant_id) {
                return { status: 400, body: 'Provide either id or applicant_id' }
            }

            if (applicant_id) {
                Joi.assert(applicant_id, Joi.string().guid());
                const applicant = await Applicant.findByPk(applicant_id);
                if (!applicant) return { status: 404, body: 'applicant not found' }

                const householdMembers = await HouseholdMember.findAll({ where: { ApplicantId: applicant_id } });
                const jsonBody = [];
                householdMembers.forEach(member => {
                    jsonBody.push(member.dataValues);
                })
                return { jsonBody }

            } else if (id) {
                Joi.assert(id, Joi.string().guid());
                const householdMember = await HouseholdMember.findByPk(id);
                if (!householdMember) {
                    return { status: 404, body: 'household member not found' }
                }
                return { jsonBody: householdMember.dataValues }
            }

        } else if (request.method === 'POST') {
            const applicant_id = request.query.get('applicant_id');
            context.debug('applicant_id:', applicant_id);
            Joi.assert(applicant_id, Joi.string().guid().required());
            const reqBody = await request.json() as object;
            context.debug('reqBody:', reqBody);
            validateBody(reqBody);

            // check if applicant exists
            const applicant = Applicant.findByPk(applicant_id);
            if (!applicant) {
                return { status: 404, body: 'applicant not found' }
            }

            // do creation
            const householdMember = await HouseholdMember.create({ ...reqBody, ApplicantId: applicant_id });
            return { jsonBody: householdMember.dataValues }

        } else if (request.method === 'PATCH') {
            const id = request.query.get('id');
            context.debug('id:', id);
            const reqBody = await request.json();
            context.debug('reqBody:', reqBody);
            Joi.assert(id, Joi.string().guid().required());
            validateBody(reqBody);

            // check if household member exists
            const householdMember = await HouseholdMember.findByPk(id);
            if (!householdMember) {
                return { status: 404, body: 'household member not found' }
            }
            householdMember.update(reqBody);
            await householdMember.save();
            return { jsonBody: householdMember.dataValues }

        } else if (request.method === 'DELETE') {
            const id = request.query.get('id');
            context.debug('id:', id);
            Joi.assert(id, Joi.string().guid());
            const householdMember = await HouseholdMember.findByPk(id);
            if (!householdMember) {
                return { status: 404, body: 'household member not found' }
            }
            await householdMember.destroy();
            return { body: id }
        }

    } catch (error) {
        context.error('household-members: error encountered:', error);
        if (error?.message?.startsWith('unauthorized')) { return { status: 403, body: error } }
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('household-members', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: householdMembers
});
