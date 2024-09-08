import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import ApplicantModel from "../models/applicant";
import SchemeModel from "../models/scheme";

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

/**
* @swagger
* /applications:
* 
*   get:
*       summary: Get all applications / Get applications by scheme or applicant
*       description: Get all applications registered in the system, or by scheme, or by applicant
*       parameters:
*           - in: query
*             name: applicant_id
*             description: ID of application to retrieve all applications for
*             schema:
*               type: string
*           - in: query
*             name: scheme_id
*             description: ID of scheme to retrieve all applications for
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates an application
*       description: Creates an application
*       parameters:
*           - in: query
*             name: applicant_id
*             description: ID for applicant making the application
*             schema:
*               type: string
*           - in: query
*             name: scheme_id
*             description: ID for scheme the applicant is applying to
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       summary: Updates an application
*       description: Updates an application
*       parameters:
*           - in: query
*             name: application_id
*             description: Application ID
*             schema:
*               type: string
*           - in: query
*             name: applicant_id
*             description: ID for applicant making the application
*             schema:
*               type: string
*           - in: query
*             name: scheme_id
*             description: ID for scheme the applicant is applying to
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       summary: Deletes application by ID
*       description: Deletes application by ID, though records are usually kept and housekeeping is usually automated - these APIs are strictly for L2 service requests 
*       parameters:
*           - in: query
*             name: id
*             required: true
*             description: ID of the application to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*/
export async function applications(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        await sequelize.authenticate();
        ApplicantModel(sequelize, DataTypes);
        SchemeModel(sequelize, DataTypes);
        const Applicant = sequelize.models.Applicant;
        const Scheme = sequelize.models.Scheme;

        // declare M:M relationships - Permission is essentially a junction table
        // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships
        const Application = sequelize.define('Application', {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            outcome: {
                type: DataTypes.STRING, // ought to be a codetable, and ought to be expanded into workflow entities
            }
        })
        Applicant.belongsToMany(Scheme, { through: Application });
        Scheme.belongsToMany(Applicant, { through: Application });

        // wait for all model syncs to finish
        const syncPromises = [];
        syncPromises.push(Applicant.sync());
        syncPromises.push(Scheme.sync());
        syncPromises.push(Application.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            context.debug('applicant_id:', request.query.get('applicant_id'));
            context.debug('scheme_id:', request.query.get('scheme_id'));
            Joi.assert(request.query.get('applicant_id'), Joi.string().guid());
            Joi.assert(request.query.get('scheme_id'), Joi.string().guid());
            if (!request.query.get('id')) {
                const applications = await Application.findAll({});
                return { jsonBody: applications }
            } else {
                const application = await Application.findByPk(request.query.get('id'));
                return { jsonBody: application }
            }

        } else if (request.method === 'POST') {
            context.debug('applicant_id:', request.query.get('applicant_id'));
            context.debug('scheme_id:', request.query.get('scheme_id'));
            Joi.assert(request.query.get('applicant_id'), Joi.string().guid());
            Joi.assert(request.query.get('scheme_id'), Joi.string().guid());

            // practically speaking a UI would directly feed the respective IDs to this join table
            // so at best you would only need to check if the IDs exist in the respective tables
            const applicant = await Applicant.findByPk(request.query.get('applicant_id'));
            const scheme = await Scheme.findByPk(request.query.get('scheme_id'));
            if (applicant && scheme) {
                // create transaction here (lots of FKs to make)
                const application = await Application.create({
                    ApplicantId: request.query.get('applicant_id'),
                    SchemeId: request.query.get('scheme_id'),
                });
                return { jsonBody: application.dataValues };
            } else {
                return { status: 400, body: 'invalid ID(s) provided for applicant_id and/or scheme_id' }
            }

        } else if (request.method === 'PATCH') {
            context.debug('application_id:', request.query.get('application_id'));
            context.debug('applicant_id:', request.query.get('applicant_id'));
            context.debug('scheme_id:', request.query.get('scheme_id'));
            Joi.assert(request.query.get('application_id'), Joi.string().guid());
            Joi.assert(request.query.get('applicant_id'), Joi.string().guid());
            Joi.assert(request.query.get('scheme_id'), Joi.string().guid());

            const application = await Application.findByPk(request.query.get('application_id'));
            if (!application) {
                return { status: 400, body: 'invalid id provided' }
            }
            const applicant = await Applicant.findByPk(request.query.get('applicant_id'));
            const scheme = await Scheme.findByPk(request.query.get('scheme_id'));
            if (applicant && scheme) {
                application.update({
                    ApplicantId: request.query.get('applicant_id'),
                    SchemeId: request.query.get('scheme_id'),
                });
                return { jsonBody: application.dataValues };
            } else {
                return { status: 400, body: 'invalid ID(s) provided for admin_role_id and/or permission_scope_id' }
            }

        } else if (request.method === 'DELETE') {
            context.debug('application_id:', request.query.get('application_id'));
            Joi.assert(request.query.get('application_id'), Joi.string().guid());
            const application = await Application.findByPk(request.query.get('application_id'));
            if (!application) {
                return { status: 400, body: 'invalid id provided' }
            }
            await application.destroy();
            return { body: request.query.get('application_id') }

        }

    } catch (error) {
        context.error('permissions: error encountered:', error);
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('applications', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: applications
});
