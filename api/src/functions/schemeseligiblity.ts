import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import { Engine } from 'json-rules-engine';
import Joi = require('joi');
import SchemeModel from "../models/scheme";
import BenefitModel from "../models/benefit";
import ApplicantModel from "../models/applicant";

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres'
});

/**
* @swagger
* /schemes/eligible:
*   get:
*       summary: Get all eligible schemes for given applicant
*       description: Get all schemes that an applicant is eligible to apply for
*       parameters:
*           - in: query
*             name: id
*             required: true
*             description: ID of the applicant to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
*/
export async function schemesEligibility(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // declare 1:N Relationship
        // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-many-relationships
        await sequelize.authenticate();
        SchemeModel(sequelize, DataTypes);
        BenefitModel(sequelize, DataTypes);
        ApplicantModel(sequelize, DataTypes);
        const Scheme = sequelize.models.Scheme;
        const Benefit = sequelize.models.Benefit;
        const Applicant = sequelize.models.Applicant;
        Scheme.hasMany(Benefit, { onDelete: 'cascade' }); // deletes any benefits associated with this scheme when its deleted
        Benefit.belongsTo(Scheme);

        // wait for all model syncs to finish
        let syncPromises = [];
        syncPromises.push(Scheme.sync());
        syncPromises.push(Benefit.sync());
        syncPromises.push(Applicant.sync());
        await Promise.allSettled(syncPromises);

        context.debug('id:', request.query.get('id'));
        Joi.assert(request.query.get('id'), Joi.string().guid().required());
        const applicant = await Applicant.findByPk(request.query.get('id'))
        if (!applicant) {
            return { status: 400, body: 'invalid ID provided' }
        }

        // get all schemes, also eagerly load associated benefits
        const schemes = await Scheme.findAll({ include: Benefit });
        if (!schemes) {
            return { status: 500, body: 'no schemes loaded in system' }
        }

        let evaluatedSchemes = [];
        let eligibleSchemes = [];
        let engine = new Engine();

        // load applicant details into rules engine as facts
        engine.addFact('applicant-details', () => {
            return applicant.dataValues;
        });

        // load all defined scheme conditions into the rules engine
        schemes.forEach(scheme => {
            let savedRule = scheme.dataValues.eligibility_criteria;
            if (savedRule) {
                evaluatedSchemes.push(scheme);
                engine.addRule(JSON.parse(savedRule));
            }
        });

        // run rules engine for result
        let facts = { applicantId: request.query.get('id') }
        let engineResults = await engine.run(facts);
        engineResults.results.forEach((result, index) => {
            // TODO: test assumption that rules are evaluated in the order of adding to engine
            context.debug('condition name:', result.name, ', result:', result.result);
            // if rule engine determines eligible, add to list of eligible schemes
            if (result.result) {
                eligibleSchemes.push(evaluatedSchemes[index]);
            }
        });

        // TODO: do json transformation here
        let jsonBody = eligibleSchemes;
        return { jsonBody }

    } catch (error) {
        context.error('schemes: error encountered:', error);
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('schemes-eligiblity', {
    route: 'schemes/eligible',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: schemesEligibility
});
