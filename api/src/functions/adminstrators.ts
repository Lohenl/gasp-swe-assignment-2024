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
* /administrators:
* 
*   get:
*       summary: Get all administrator details / Get administrator details by ID
*       description: Get a specific administrator's details by ID. Omit ID to get all administrators' details registered in system.
*       parameters:
*           - in: path
*             name: id
*             description: ID of a specific administrator to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates an administrator
*       description: Creates an administrator
*       parameters:
*           - in: body
*             name: administrator
*             description: JSON details of administrator to be created
*             schema:
*               type: object
*               required:
*                   - name
*               properties:
*                   name:
*                       type: string
*                   email:
*                       type: string
* 
*   patch:
*       summary: Updates an adminstrator
*       description: Updates an adminstrator
*       parameters:
*           - in: path
*             name: id
*             required: true
*             description: ID of the adminstrator to update.
*             schema:
*               type: string
*           - in: body
*             name: adminstrator
*             description: JSON details of adminstrator to update with
*             schema:
*               type: object
*               required:
*                   - name
*               properties:
*                   name:
*                       type: string
*                   email:
*                       type: string
* 
*   delete:
*       summary: Delete adminstrator by ID
*       description: Delete an adminstrator from the system by ID.
*       parameters:
*           - in: path
*             name: id
*             required: true
*             description: ID of the adminstrator to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
* /administrators/permissions:
* 
*   get:
*       summary: Get permission details of all administrators / Get permission details of administrator by ID
*       description: Get a specific adminstrator's permission details by ID. Omit ID to get all administrators' permission details registered in system.
*       parameters:
*           - in: path
*             name: id
*             description: ID of the applicant to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Adds permissions to an administrator (Needs refinement)
*       description: Adds permissions to an administrator, pass an empty object to clear permissions
*       parameters:
*           - in: body
*             name: administrator
*             description: JSON details of administrator to be created
*             schema:
*               type: array
*               items:
*                   name:
*                       type: object
* 
*/
export async function administrators(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

app.http('administrators', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: administrators
});
