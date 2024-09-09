import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import ApplicantModel from '../models/applicant';
import EmploymentstatusModel from "../models/employmentstatus";
import MaritalStatusModel from "../models/maritalstatus";
import GenderModel from "../models/gender";
import RelationshipModel from "../models/relationship";
import HouseholdMemberModel from "../models/householdmember";
const { DateTime } = require("luxon");
const validateBody = require('../validators/applicantsValidate');
const validateHouseholdMember = require('../validators/householdmembersValidate');

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

/**
* @swagger
* /applicants:
* 
*   get:
*       summary: Get all applicant details / Get applicant details by ID
*       description: Get a specific applicant's details by ID. Omit ID to get all applicants' details registered in system.
*       parameters:
*           - in: query
*             name: id
*             description: ID of a specific applicant to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates an applicant
*       description: Creates an applicant
*       requestBody:
*           description: JSON details of applicant to be created
*           required: true
*           content:
*               application/json:
*                   schema:
*                       applicants:
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
*                           EmploymentStatusId:
*                               type: number
*                           MaritalStatusId:
*                               type: number
*                           GenderId:
*                               type: number
*                   example:
*                       name: "Jane Kwok"
*                       email: "janekwok88@gmail.com"
*                       mobile_no: "+6512345678"
*                       birth_date: "1988-05-02"
*                       EmploymentStatusId: 3
*                       MaritalStatusId: 2
*                       GenderId: 2
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       summary: Updates an applicant
*       description: Updates an applicant
*       parameters:
*           - in: query
*             name: id
*             required: true
*             description: ID of the applicant to update.
*             schema:
*               type: string
*       requestBody:
*           description: JSON details of applicant to be updated
*           required: true
*           content:
*               application/json:
*                   schema:
*                       applicants:
*                           type: object
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
*                           EmploymentStatusId:
*                               type: number
*                           MaritalStatusId:
*                               type: number
*                           GenderId:
*                               type: number
*                   example:
*                       name: "Jon Tan"
*                       email: "jontanwenghou@gmail.com"
*                       mobile_no: "+6587654321"
*                       birth_date: "2003-08-08"
*                       EmploymentStatusId: 2
*                       MaritalStatusId: 1
*                       GenderId: 1
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       summary: Delete applicant by ID
*       description: Delete an applicant from the system by ID.
*       parameters:
*           - in: query
*             name: id
*             required: true
*             description: ID of the applicant to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
*/
export async function applicants(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        await sequelize.authenticate();
        ApplicantModel(sequelize, DataTypes); // interesting how this works
        EmploymentstatusModel(sequelize, DataTypes);
        MaritalStatusModel(sequelize, DataTypes);
        GenderModel(sequelize, DataTypes);
        RelationshipModel(sequelize, DataTypes);
        HouseholdMemberModel(sequelize, DataTypes);
        const Applicant = sequelize.models.Applicant;
        const EmploymentStatus = sequelize.models.EmploymentStatus;
        const MaritalStatus = sequelize.models.MaritalStatus;
        const Gender = sequelize.models.Gender;
        const HouseholdMember = sequelize.models.HouseholdMember;
        Applicant.hasOne(EmploymentStatus);
        Applicant.hasOne(MaritalStatus);
        Applicant.hasOne(Gender);
        Applicant.hasMany(HouseholdMember, { onDelete: 'cascade' });
        EmploymentStatus.belongsToMany(Applicant, { through: 'ApplicantEmploymentStatus' });
        MaritalStatus.belongsToMany(Applicant, { through: 'ApplicantMaritalStatus' });
        Gender.belongsToMany(Applicant, { through: 'ApplicantGender' });
        HouseholdMember.belongsTo(Applicant);

        // wait for all model syncs to finish
        const syncPromises = [];
        syncPromises.push(Applicant.sync());
        syncPromises.push(EmploymentStatus.sync());
        syncPromises.push(MaritalStatus.sync());
        syncPromises.push(Gender.sync());
        syncPromises.push(HouseholdMember.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            context.debug('id:', request.query.get('id'));
            if (!request.query.get('id')) {
                const applicants = await Applicant.findAll({});
                return { jsonBody: applicants }
            } else {
                Joi.assert(request.query.get('id'), Joi.string().guid());
                const applicant = await Applicant.findByPk(request.query.get('id'));
                return { jsonBody: applicant }
            }

        } else if (request.method === 'POST') {
            const reqBody = await request.json() as any;
            context.debug('reqBody:', reqBody);
            validateBody(reqBody);
            const householdMembersToCreate = reqBody.householdMembers as any[];
            householdMembersToCreate.forEach(member => {
                validateHouseholdMember(member);
            });

            // create transaction here (lots of FKs to make)
            const result = await sequelize.transaction(async t => {
                const createPromises = [];
                const applicant = await Applicant.create({
                    name: reqBody['name'],
                    email: reqBody['email'],
                    mobile_no: reqBody['mobile_no'],
                    birth_date: DateTime.fromISO(reqBody['birth_date']).toJSDate(),
                    EmploymentStatusId: reqBody['EmploymentStatusId'],
                    MaritalStatusId: reqBody['MaritalStatusId'],
                    GenderId: reqBody['GenderId'],
                }, {
                    include: [EmploymentStatus, MaritalStatus, Gender, HouseholdMember],
                    transaction: t
                });

                // create assigned householdMembers
                householdMembersToCreate.forEach(member => {
                    context.debug('householdMember: ', member);
                    createPromises.push(HouseholdMember.create({
                        ...member,
                        ApplicantId: applicant.dataValues.id
                    }, {
                        transaction: t
                    }));
                });
                await Promise.allSettled(createPromises);
                return applicant;
            })

            return { jsonBody: result.dataValues }

        } else if (request.method === 'PATCH') {
            context.debug('id:', request.query.get('id'));
            const updateFields = await request.json();
            context.debug('updateFields:', updateFields);
            Joi.assert(request.query.get('id'), Joi.string().guid().required());
            validateBody(updateFields);
            const applicant = await Applicant.findByPk(request.query.get('id'));
            if (!applicant) {
                return { status: 400, body: 'invalid id provided' }
            }
            // create transaction here (lots of FKs to make)
            const result = await sequelize.transaction(async t => {
                const applicant = await Applicant.findByPk(request.query.get('id'), { transaction: t });
                applicant.update(updateFields);
                return applicant;
            });
            return { jsonBody: result.dataValues }

        } else if (request.method === 'DELETE') {
            context.debug('id:', request.query.get('id'));
            Joi.assert(request.query.get('id'), Joi.string().guid());
            const applicant = await Applicant.findByPk(request.query.get('id'));
            if (!applicant) {
                return { status: 400, body: 'invalid id provided' }
            }
            await applicant.destroy();
            return { body: request.query.get('id') }
        }

    } catch (error) {
        context.error('applicants: error encountered:', error);
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('applicants', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: applicants
});
