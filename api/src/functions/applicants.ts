import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import ApplicantModel from '../models/applicant';
const { DateTime } = require("luxon");

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres'
});

/**
* @swagger
* /applicants:
* 
*   get:
*       summary: Get all applicant details / Get applicant details by ID
*       description: Get a specific applicant's details by ID. Omit ID to get all applicants' details registered in system.
*       parameters:
*           - in: path
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
*       parameters:
*           - in: body
*             name: applicant
*             description: JSON details of applicant to be created
*             schema:
*               type: object
*               required:
*                   - name
*               properties:
*                   name:
*                       type: string
*                   email:
*                       type: string
*                   mobile_no:
*                       type: string
*                   birthdate:
*                       type: date
*                       pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/
*                       example: "1988-05-02"
* 
*   patch:
*       summary: Updates an applicant
*       description: Updates an applicant
*       parameters:
*           - in: path
*             name: id
*             required: true
*             description: ID of the applicant to update.
*             schema:
*               type: string
*           - in: body
*             name: applicant
*             description: JSON details of applicant to update with
*             schema:
*               type: object
*               required:
*                   - name
*               properties:
*                   name:
*                       type: string
*                   email:
*                       type: string
*                   mobile_no:
*                       type: string
*                   birthdate:
*                       type: date
*                       pattern: /([0-9]{4})-(?:[0-9]{2})-([0-9]{2})/
*                       example: "1988-05-02"
* 
*   delete:
*       summary: Delete applicant by ID
*       description: Delete an applicant from the system by ID.
*       parameters:
*           - in: path
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
        const Applicant = sequelize.models.Applicant;

        const applicant = Applicant.build({ name: 'Jane Kwok', email: 'janekwok88@gmail.com', mobile_no: '+6512345678', birth_date: DateTime.fromISO('1988-05-02').toJSDate() });
        return { jsonBody: applicant.dataValues }

    } catch (error) {
        context.error('applicants: error encountered:', error);
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('applicants', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: applicants
});
