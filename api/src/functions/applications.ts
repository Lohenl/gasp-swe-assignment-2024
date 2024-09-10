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
*       tags:
*           - Business - Application Management
*       summary: Get all applications / Get applications by scheme or applicant
*       description: Get all applications registered in the system, or by scheme, or by applicant
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
*       tags:
*           - Business - Application Management
*       summary: Creates an application
*       description: Creates an application, application will always start with a 'Pending Review' outcome
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
*       tags:
*           - Business - Application Management
*       summary: Updates an application
*       description: Updates an application, allows manual update of application outcome
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
*           - in: query
*             name: id
*             description: Application ID
*             required: true
*             schema:
*               type: string
*           - in: query
*             name: outcome
*             description: Manual update of application outcome
*             example: Benefits Issued
*             schema:
*               type: string
*
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       tags:
*           - Business - Application Management
*       summary: Deletes application by ID
*       description: Deletes application by ID, though records are usually kept and housekeeping is usually automated - these APIs are strictly for L2 service requests 
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
            const id = request.query.get('id');
            const applicant_id = request.query.get('applicant_id');
            const scheme_id = request.query.get('scheme_id');
            context.debug('id:', id);
            context.debug('applicant_id:', request.query.get('applicant_id'));
            context.debug('scheme_id:', scheme_id);

            if (!id && !applicant_id && !scheme_id) {
                // omit all params to get everything
                const applications = await Application.findAll({});
                if (applications.length == 0) return { status: 404, body: 'no applications found' }
                return { jsonBody: applications }

            } else if (id && !applicant_id && !scheme_id) {
                // getting application by id
                Joi.assert(id, Joi.string().guid());
                const application = await Application.findByPk(id);
                if (!application) return { status: 404, body: 'no application found' }
                if (applications.length == 0) return { status: 404, body: 'no applications found' }
                return { jsonBody: application }

            } else if (!id && applicant_id && !scheme_id) {
                // getting application by applicant_id
                Joi.assert(applicant_id, Joi.string().guid());
                const applicant = await Application.findByPk(applicant_id);
                if (!applicant) return { status: 404, body: 'no applicant found' }
                const applications = await Application.findAll({ where: { ApplicantId: applicant_id } });
                if (applications.length == 0) return { status: 404, body: 'no applications found' }
                return { jsonBody: applications }

            } else if (!id && !applicant_id && scheme_id) {
                // getting application by scheme_id
                Joi.assert(scheme_id, Joi.string().guid());
                const scheme = await Scheme.findByPk(scheme_id);
                if (!scheme) return { status: 404, body: 'no scheme found' }
                const applications = await Application.findAll({ where: { SchemeId: scheme_id } });
                if (applications.length == 0) return { status: 404, body: 'no applications found' }
                return { jsonBody: applications }

            } else {
                return { status: 400, body: 'invalid parameters, provide only one of id, or applicant_id, or scheme_id' }
            }

        } else if (request.method === 'POST') {
            const applicant_id = request.query.get('applicant_id');
            const scheme_id = request.query.get('scheme_id');
            context.debug('applicant_id:', applicant_id);
            context.debug('scheme_id:', scheme_id);
            Joi.assert(applicant_id, Joi.string().guid().required());
            Joi.assert(scheme_id, Joi.string().guid().required());

            // practically speaking a UI would directly feed the respective IDs to this join table
            // so at best you would only need to check if the IDs exist in the respective tables

            if (applicant_id && scheme_id) {
                // check for applicant and scheme
                const applicant = await Applicant.findByPk(applicant_id);
                if (!applicant) return { status: 404, body: 'applicant not found' }
                const scheme = await Scheme.findByPk(scheme_id);
                if (!scheme) return { status: 404, body: 'scheme not found' }

                // create transaction here (lots of FKs to make)
                const application = await Application.create({
                    outcome: 'Pending Review',
                    ApplicantId: applicant_id,
                    SchemeId: scheme_id,
                });
                return { jsonBody: application.dataValues };
            } else {
                return { status: 400, body: 'you need to provide both applicant_id and scheme_id' }
            }

        } else if (request.method === 'PATCH') {
            const id = request.query.get('id');
            context.debug('id:', id);
            context.debug('outcome:', request.query.get('outcome'));
            Joi.assert(id, Joi.string().guid().required());
            Joi.assert(request.query.get('outcome'), Joi.string());

            const application = await Application.findByPk(id);
            if (!application) return { status: 404, body: 'application not found' }
            application.update({ outcome: request.query.get('outcome') });
            return { jsonBody: application.dataValues };

        } else if (request.method === 'DELETE') {
            const id = request.query.get('id');
            context.debug('id:', id);
            Joi.assert(id, Joi.string().guid().required());

            const application = await Application.findByPk(id);
            if (!application) return { status: 404, body: 'application not found' }
            await application.destroy();
            return { body: id }

        }

    } catch (error) {
        context.error('permissions: error encountered:', error);
        if (error?.message?.startsWith('unauthorized')) { return { status: 403, body: error } }
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('applications', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: applications
});
