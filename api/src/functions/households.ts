import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import ApplicantModel from "../models/applicant";

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres'
});

/**
* @swagger
* /households:
*   get:
*       summary: Get all households / Get household details by ID
*       description: Get a specific household's details by ID. Omit ID to get all households' details registered in system.
*       parameters:
*           - in: path
*             name: id
*             description: ID of the household to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates a household
*       description: Creates a household
*       requestBody:
*           description: Array of member IDs to be included in household
*           required: true
*           content:
*               application/json:
*                   schema:
*                       type: array
*                       items:
*                           type: string* 
*                   example: ["2d055c48-912c-41e1-a831-3fc3c066f9ea","8943bca7-d676-42ab-b173-d139aba8a0bf"]
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       summary: Updates a household
*       description: Updates a household
*       parameters:
*           - in: path
*             name: id
*             required: true
*             description: ID of the household to update.
*             schema:
*               type: string
*           - in: body
*             name: scheme
*             description: Array of member IDs to be created
*             schema:
*               type: array
*               items:
*                   type: string
*               example: ["2d055c48-912c-41e1-a831-3fc3c066f9ea","8943bca7-d676-42ab-b173-d139aba8a0bf"]
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       summary: Delete household by ID
*       description: Delete a household from the system by ID.
*       parameters:
*           - in: path
*             name: id
*             required: true
*             description: ID of the household to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
*/
export async function households(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
        let syncPromises = [];
        syncPromises.push(Household.sync());
        syncPromises.push(Applicant.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            // validation happens here, dont forget joi
            context.log(request.query.get('id'));
            if (!request.query.get('id')) {
                const households = await Household.findAll({});
                return { jsonBody: households }
            } else {
                const household = await Household.findByPk(request.query.get('id'));
                return { jsonBody: household }
            }

        } else if (request.method === 'POST') {
            // validation happens here, dont forget joi
            const memberIdArray = await request.json();
            context.log('memberIdArray:', memberIdArray);

            // validate that all ids exist
            // find each applicant by PK
            // having any null values show up means that there are invalid IDs
            let findPromises = [];
            (memberIdArray as any).forEach(memberId => {
                findPromises.push(Applicant.findByPk(memberId));
            });
            const results = await Promise.allSettled(findPromises);
            // context.log('results:', results);
            let householdMembers = [];
            results.forEach((result) => {
                householdMembers.push((result as any).value);
            })
            // context.log('householdMembers:', householdMembers);
            // context.log('householdMembers.includes(null)', householdMembers.includes(null));
            let isValid = !householdMembers.includes(null);

            // once all validated, save to DB
            if (isValid) {
                // time for a sequelize transaction
                const result = await sequelize.transaction(async t => {
                    const household = await Household.create({}, { transaction: t });
                    // TODO: I'm stuck here
                    // let updatePromises = [];
                    // householdMembers.forEach(member => {
                    //     updatePromises.push(member.update({ HouseholdId: household.dataValues.id }, { transaction: t }));
                    //     updatePromises.push(member.save());
                    // });
                    // await Promise.allSettled(updatePromises);
                    return household;
                });
                return { jsonBody: result }

            } else {
                return { body: 'invalid applicant ID(s) provided' }

            }


        } else if (request.method === 'PATCH') {
            // validation happens here, dont forget joi
            context.log(request.query.get('id'));
            const memberIdArray = await request.json();
            return { jsonBody: {} }

        } else if (request.method === 'DELETE') {
            // validation happens here, dont forget joi
            context.log(request.query.get('id'));
            return { jsonBody: {} }

        }

    } catch (error) {
        context.error('households: error encountered:', error);
        return { status: 500, body: `Unexpected error occured: ${error}` }

    }
};

app.http('households', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: households
});
