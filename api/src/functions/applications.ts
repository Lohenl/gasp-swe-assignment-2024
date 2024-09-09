import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import ApplicantModel from "../models/applicant";
import SchemeModel from "../models/scheme";
import ApplicationModel from "../models/application";

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
*             name: id
*             description: application ID
*             schema:
*               type: string
*           - in: query
*             name: applicant_id
*             description: ID of applicant to retrieve all applications for
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
*       description: Creates an application, application will always start with a 'Pending Review' outcome
*       parameters:
*           - in: query
*             name: applicant_id
*             required: true
*             description: ID for applicant making the application
*             schema:
*               type: string
*           - in: query
*             name: scheme_id
*             required: true
*             description: ID for scheme the applicant is applying to
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       summary: Updates an application
*       description: Updates an application, allows manual update of application outcome
*       parameters:
*           - in: query
*             name: application_id
*             description: Application ID
*             required: true
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
*           - in: query
*             name: outcome
*             description: Manual update of application outcome
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
        ApplicationModel(sequelize, DataTypes);
        const Applicant = sequelize.models.Applicant;
        const Scheme = sequelize.models.Scheme;
        const Application = sequelize.models.Application;
        // declare M:M relationships - Permission is essentially a junction table
        // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships
        Applicant.belongsToMany(Scheme, { through: Application });
        Scheme.belongsToMany(Applicant, { through: Application });

        // wait for all model syncs to finish
        const syncPromises = [];
        syncPromises.push(Applicant.sync());
        syncPromises.push(Scheme.sync());
        syncPromises.push(Application.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            context.debug('id:', request.query.get('id'));
            context.debug('applicant_id:', request.query.get('applicant_id'));
            context.debug('scheme_id:', request.query.get('scheme_id'));

            if (!request.query.get('id') && !request.query.get('applicant_id') && !request.query.get('scheme_id')) {
                // omit all params to get everything
                const applications = await Application.findAll({});
                if (applications.length == 0) return { status: 404, body: 'no applications found' }
                return { jsonBody: applications }

            } else if (request.query.get('id') && !request.query.get('applicant_id') && !request.query.get('scheme_id')) {
                // getting application by id
                const application = await Application.findByPk(request.query.get('id'));
                if (applications.length == 0) return { status: 404, body: 'no applications found' }
                return { jsonBody: application }

            } else if (!request.query.get('id') && request.query.get('applicant_id') && !request.query.get('scheme_id')) {
                // getting application by applicant_id
                Joi.assert(request.query.get('applicant_id'), Joi.string().guid());
                const applications = await Application.findAll({ where: { ApplicantId: request.query.get('applicant_id') } });
                if (applications.length == 0) return { status: 404, body: 'no applications found' }
                return { jsonBody: applications }

            } else if (!request.query.get('id') && !request.query.get('applicant_id') && request.query.get('scheme_id')) {
                // getting application by scheme_id
                Joi.assert(request.query.get('scheme_id'), Joi.string().guid());
                const applications = await Application.findAll({ where: { SchemeId: request.query.get('scheme_id') } });
                if (applications.length == 0) return { status: 404, body: 'no applications found' }
                return { jsonBody: applications }

            } else {
                return { status: 400, body: 'invalid parameters, provide only one of id, or applicant_id, or scheme_id' }
            }

        } else if (request.method === 'POST') {
            context.debug('applicant_id:', request.query.get('applicant_id'));
            context.debug('scheme_id:', request.query.get('scheme_id'));
            Joi.assert(request.query.get('applicant_id'), Joi.string().guid().required());
            Joi.assert(request.query.get('scheme_id'), Joi.string().guid().required());

            // practically speaking a UI would directly feed the respective IDs to this join table
            // so at best you would only need to check if the IDs exist in the respective tables
            const applicant = await Applicant.findByPk(request.query.get('applicant_id'));
            const scheme = await Scheme.findByPk(request.query.get('scheme_id'));

            if (applicant && scheme) {
                // check for applicant and scheme
                const applicant = await Applicant.findByPk(request.query.get('applicant_id'));
                if (!applicant) return { status: 404, body: 'applicant not found' }
                const scheme = await Scheme.findByPk(request.query.get('scheme_id'));
                if (!scheme) return { status: 404, body: 'scheme not found' }

                // create transaction here (lots of FKs to make)
                const application = await Application.create({
                    outcome: 'Pending Review',
                    ApplicantId: request.query.get('applicant_id'),
                    SchemeId: request.query.get('scheme_id'),
                });
                return { jsonBody: application.dataValues };
            } else {
                return { status: 400, body: 'you need to provide both applicant_id and scheme_id' }
            }

        } else if (request.method === 'PATCH') {
            context.debug('application_id:', request.query.get('application_id'));
            context.debug('applicant_id:', request.query.get('applicant_id'));
            context.debug('scheme_id:', request.query.get('scheme_id'));
            context.debug('outcome:', request.query.get('outcome'));
            Joi.assert(request.query.get('application_id'), Joi.string().guid());
            Joi.assert(request.query.get('applicant_id'), Joi.string().guid());
            Joi.assert(request.query.get('scheme_id'), Joi.string().guid());
            Joi.assert(request.query.get('outcome'), Joi.string());

            const application = await Application.findByPk(request.query.get('application_id'));
            if (!application) {
                return { status: 400, body: 'invalid id provided' }
            }
            const applicant = await Applicant.findByPk(request.query.get('applicant_id'));
            const scheme = await Scheme.findByPk(request.query.get('scheme_id'));
            if (applicant && scheme) {
                application.update({
                    outcome: request.query.get('outcome'),
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
