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
*                   example:
*                       name: "Jon Tan"
*                       email: "jontanwenghou@gmail.com"
*                       mobile_no: "+6587654321"
*                       birth_date: "2003-08-08"
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
        const Applicant = sequelize.models.Applicant;
        await Applicant.sync();

        if (request.method === 'GET') {
            if (!request.query.get('id')) {
                const applicants = await Applicant.findAll({});
                return { jsonBody: applicants }
            } else {
                // validation happens here, dont forget joi
                const applicant = await Applicant.findByPk(request.query.get('id'));
                return { jsonBody: applicant }
            }

        } else if (request.method === 'POST') {
            const reqBody = await request.json();
            // validation happens here, dont forget joi
            const applicant = Applicant.build({
                name: reqBody['name'],
                email: reqBody['email'],
                mobile_no: reqBody['mobile_no'],
                birth_date: DateTime.fromISO(reqBody['birth_date']).toJSDate()
            });
            await applicant.save();
            return { jsonBody: applicant.dataValues }

        } else if (request.method === 'PATCH') {
            const updateFields = await request.json();
            // validation happens here, dont forget joi
            const applicant = await Applicant.findByPk(request.query.get('id'));
            applicant.update(updateFields);
            await applicant.save();
            return { jsonBody: applicant.dataValues }

        } else if (request.method === 'DELETE') {
            // validation happens here, dont forget joi
            const applicant = await Applicant.findByPk(request.query.get('id'));
            await applicant.destroy();
            return { body: request.query.get('id') }
        }

    } catch (error) {
        context.error('applicants: error encountered:', error);
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('applicants', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: applicants
});
