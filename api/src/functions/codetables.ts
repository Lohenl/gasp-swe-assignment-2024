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
* /codetables:
* 
*   get:
*       summary: Get all code tables / Get code table by name
*       description: Get a specific code table's details by name. Omit ID to get all code table' details registered in system.
*       parameters:
*           - in: path
*             name: name
*             description: Name of a specific code table to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       summary: Updates a code table
*       description: Updates a code table
*       parameters:
*           - in: path
*             name: name
*             required: true
*             description: Name of the code table to update.
*             schema:
*               type: string
*           - in: body
*             name: codetable
*             description: JSON details of code table to update with
*             schema:
*               type: object
*               required:
*                   - name
*                   - id
*               properties:
*                   name:
*                       type: string
*                   id:
*                       type: string
* 
*   delete:
*       summary: Delete code table entry by code table name and ID
*       description: Delete code table entry by code table name and ID
*       parameters:
*           - in: path
*             name: table_name
*             required: true
*             description: Table name of code to be deleted from.
*             schema:
*                 type: string
*           - in: path
*             name: id
*             required: true
*             description: ID of code to delete.
*             schema:
*                 type: string
*       responses:
*           200:
*               description: Successful response
*/
export async function codetables(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

app.http('codetables', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: codetables
});
