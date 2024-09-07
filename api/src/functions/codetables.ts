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
*           - in: query
*             name: table_name
*             description: Name of a specific code table to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Adds a codetable entry
*       description: Adds a codetable entry
*       parameters:
*           - in: query
*             name: table_name
*             description: Name of code table to add an entry to.
*             required: true
*             schema:
*               type: string
*           - in: query
*             name: code_entry_value
*             description: Value of code entry to be added to code table
*             required: true
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
*           - in: query
*             name: table_name
*             required: true
*             description: Name of the code table to update.
*             schema:
*               type: string
*           - in: query
*             name: code_entry_id
*             required: true
*             description: ID of code entry to update.
*             schema:
*               type: string
*           - in: code_entry_value
*             name: value
*             description: New value of code entry
*             required: true
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       summary: Delete code table entry by code table name and ID
*       description: Delete code table entry by code table name and ID
*       parameters:
*           - in: query
*             name: code_table_name
*             required: true
*             description: Table name of code to be deleted from.
*             schema:
*                 type: string
*           - in: query
*             name: code_entry_id
*             required: true
*             description: ID of code table entry to delete.
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
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: codetables
});
