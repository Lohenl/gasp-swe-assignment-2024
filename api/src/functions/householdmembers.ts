import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import ApplicantModel from "../models/applicant";
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
        const Applicant = sequelize.models.Applicant;

        // declare 1:N Relationship
        // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-many-relationships
        const Household = sequelize.define('Household',
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                }
            }
        );
        Household.hasMany(Applicant);
        Applicant.belongsTo(Household);

        // wait for all model syncs to finish
        const syncPromises = [];
        syncPromises.push(Household.sync());
        syncPromises.push(Applicant.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            // validation happens here, dont forget joi
            context.debug('id:', request.query.get('id'));
            if (!request.query.get('id')) {
                const households = await Household.findAll({});
                return { jsonBody: households }
            } else {
                Joi.assert(request.query.get('id'), Joi.string().guid());
                const household = await Household.findByPk(request.query.get('id'));
                return { jsonBody: household }
            }

        } else if (request.method === 'POST') {
            // validation happens here, dont forget joi
            const memberIdArray = await request.json();
            context.debug('memberIdArray:', memberIdArray);
            validateBody(memberIdArray);

            // validate that all ids exist
            // find each applicant by PK
            // having any null values show up means that there are invalid IDs
            const findPromises = [];
            (memberIdArray as any).forEach(memberId => {
                findPromises.push(Applicant.findByPk(memberId));
            });
            const results = await Promise.allSettled(findPromises);
            context.debug('results:', results);
            const householdMembers = [];
            results.forEach((result) => {
                householdMembers.push((result as any).value);
            })
            context.debug('householdMembers:', householdMembers);
            context.debug('householdMembers.includes(null):', householdMembers.includes(null));
            const isValid = !householdMembers.includes(null);

            // once all validated, save to DB
            if (isValid) {
                // time for a sequelize transaction
                const result = await sequelize.transaction(async t => {
                    const household = await Household.create({}, { transaction: t });
                    const updatePromises = [];
                    householdMembers.forEach(member => {
                        updatePromises.push(member.update({ HouseholdId: household.dataValues.id }, { transaction: t }));
                    });
                    await Promise.allSettled(updatePromises);
                    return household;
                });
                return { jsonBody: result }
            } else {
                return { body: 'invalid applicant ID(s) provided' }
            }

        } else if (request.method === 'PATCH') {
            context.debug('id:', request.query.get('id'));
            const memberIdArray = await request.json();
            context.debug('memberIdArray:', memberIdArray);
            Joi.assert(request.query.get('id'), Joi.string().guid().required());
            validateBody(memberIdArray);

            // check that household exists
            const household = await Household.findByPk(request.query.get('id'));
            if (!household) {
                return { status: 400, body: 'invalid applicant ID(s) provided' }
            }

            // validate that all ids exist
            // find each applicant by PK
            // having any null values show up means that there are invalid IDs
            const findPromises = [];
            (memberIdArray as any).forEach(memberId => {
                findPromises.push(Applicant.findByPk(memberId));
            });
            const results = await Promise.allSettled(findPromises);
            context.debug('results:', results);
            const householdMembers = [];
            results.forEach((result) => {
                householdMembers.push((result as any).value);
            })
            context.debug('householdMembers:', householdMembers);
            context.debug('householdMembers.includes(null):', householdMembers.includes(null));
            const isValid = !householdMembers.includes(null);

            // once all validated, save to DB
            if (isValid) {
                // time for a sequelize transaction
                const result = await sequelize.transaction(async t => {

                    const household = await Household.findByPk(request.query.get('id'), { transaction: t });

                    // find all applicants who have this existing id
                    const existingHouseholdMembers = await Applicant.findAll({ where: { HouseholdId: household.dataValues.id }, transaction: t });

                    const transactionPromises = [];
                    // compare both existingHouseholdMembers and householdMembers
                    // determine a list of members to be removed from household
                    existingHouseholdMembers.forEach(existingMember => {
                        // remove if existing member is not in the newer household members list
                        // reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
                        const isInUpdatedHousehold = householdMembers.some(householdMember => householdMember.dataValues.id === existingMember.dataValues.id);
                        if (!isInUpdatedHousehold) {
                            transactionPromises.push(existingMember.update({ HouseholdId: null }, { transaction: t }));
                        }
                    });

                    // now we can update all the applicants without worrying about update errors
                    householdMembers.forEach(member => {
                        transactionPromises.push(member.update({ HouseholdId: request.query.get('id') }, { transaction: t }));
                    })
                    // perform the necessary updates in the transaction
                    await Promise.allSettled(transactionPromises);
                    return household;
                });
                return { jsonBody: result }
            } else {
                return { status: 400, body: 'invalid applicant ID(s) provided' }
            }


        } else if (request.method === 'DELETE') {
            context.debug('id:', request.query.get('id'));
            Joi.assert(request.query.get('id'), Joi.string().guid());

            const household = await Household.findByPk(request.query.get('id'));
            if (!household) {
                return { status: 400, body: 'invalid household ID' };
            }

            // make transaction
            await sequelize.transaction(async t => {
                // delete HouseholdId from all matching applicants
                // delete household
                const matchingApplicants = await Applicant.findAll({ where: { HouseholdId: request.query.get('id'), transaction: t } });
                matchingApplicants.forEach(applicant => {
                    applicant.update({ HouseholdId: null }, { transaction: t });
                });

            });
            return { body: request.query.get('id') }
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
