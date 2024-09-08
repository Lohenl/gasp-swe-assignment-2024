import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import AdminRoleModel from "../models/adminrole";
import EmploymentStatusModel from "../models/employmentstatus";
import GenderModel from "../models/gender";
import MaritalStatusModel from "../models/maritalstatus";
import PermissionScopeModel from "../models/permissionscope";

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
*           - in: query
*             name: code_entry_value
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
*             name: table_name
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
        AdminRoleModel(sequelize, DataTypes);
        EmploymentStatusModel(sequelize, DataTypes);
        GenderModel(sequelize, DataTypes);
        MaritalStatusModel(sequelize, DataTypes);
        PermissionScopeModel(sequelize, DataTypes);
        const AdminRole = sequelize.models.AdminRole;
        const EmploymentStatus = sequelize.models.EmploymentStatus;
        const Gender = sequelize.models.Gender;
        const MaritalStatus = sequelize.models.MaritalStatus;
        const PermissionScope = sequelize.models.PermissionScope;

        // wait for all model syncs to finish
        const syncPromises = [];
        syncPromises.push(AdminRole.sync());
        syncPromises.push(EmploymentStatus.sync());
        syncPromises.push(Gender.sync());
        syncPromises.push(MaritalStatus.sync());
        syncPromises.push(PermissionScope.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            context.debug('table_name:', request.query.get('table_name'));
            if (!request.query.get('table_name')) {
                const findallPromises = [];
                findallPromises.push(AdminRole.findAll({}));
                findallPromises.push(EmploymentStatus.findAll({}));
                findallPromises.push(Gender.findAll({}));
                findallPromises.push(MaritalStatus.findAll({}));
                findallPromises.push(PermissionScope.findAll({}));
                const allResults = await Promise.allSettled(findallPromises) as any[];
                const jsonBody = {
                    AdminRole: allResults[0].value,
                    EmploymentStatus: allResults[1].value,
                    Gender: allResults[2].value,
                    MaritalStatus: allResults[3].value,
                    PermissionScope: allResults[4].value,
                };
                return { jsonBody }
            } else {
                Joi.assert(request.query.get('table_name'), Joi.string());
                let jsonBody;
                switch (request.query.get('table_name')) {
                    case 'AdminRole':
                        jsonBody = await AdminRole.findAll({});
                        break;
                    case 'EmploymentStatus':
                        jsonBody = await EmploymentStatus.findAll({});
                        break;
                    case 'Gender':
                        jsonBody = await Gender.findAll({});
                        break;
                    case 'MaritalStatus':
                        jsonBody = await MaritalStatus.findAll({});
                        break;
                    case 'PermissionScope':
                        jsonBody = await PermissionScope.findAll({});
                        break;
                }
                return { jsonBody }
            }

        } else if (request.method === 'POST') {
            // validation happens here, dont forget joi
            context.debug('table_name:', request.query.get('table_name'));
            context.debug('code_entry_value:', request.query.get('code_entry_value'));
            Joi.assert(request.query.get('table_name'), Joi.string().required());
            Joi.assert(request.query.get('code_entry_value'), Joi.string().required());
            let CodeTable;
            switch (request.query.get('table_name')) {
                case 'AdminRole':
                    CodeTable = AdminRole;
                    break;
                case 'EmploymentStatus':
                    CodeTable = EmploymentStatus;
                    break;
                case 'Gender':
                    CodeTable = Gender;
                    break;
                case 'MaritalStatus':
                    CodeTable = MaritalStatus;
                    break;
                case 'PermissionScope':
                    CodeTable = PermissionScope;
                    break;
            }
            const codeValue = CodeTable.build({ name: request.query.get('code_entry_value') });
            await codeValue.save();
            return { jsonBody: codeValue.dataValues }

        } else if (request.method === 'PATCH') {
            // validation happens here, dont forget joi
            context.debug('table_name:', request.query.get('table_name'));
            context.debug('code_entry_id:', request.query.get('code_entry_id'));
            context.debug('code_entry_value:', request.query.get('code_entry_value'));
            Joi.assert(request.query.get('table_name'), Joi.string().required());
            Joi.assert(request.query.get('code_entry_id'), Joi.string().required());
            Joi.assert(request.query.get('code_entry_value'), Joi.string().required());
            let CodeTable;
            switch (request.query.get('table_name')) {
                case 'AdminRole':
                    CodeTable = AdminRole;
                    break;
                case 'EmploymentStatus':
                    CodeTable = EmploymentStatus;
                    break;
                case 'Gender':
                    CodeTable = Gender;
                    break;
                case 'MaritalStatus':
                    CodeTable = MaritalStatus;
                    break;
                case 'PermissionScope':
                    CodeTable = PermissionScope;
                    break;
            }
            const codeValue = await CodeTable.findByPk(request.query.get('code_entry_id'));
            if (!codeValue) {
                return { status: 400, body: 'invalid id provided' }
            }
            codeValue.update({ name: request.query.get('code_entry_value') });
            await codeValue.save();
            return { jsonBody: codeValue.dataValues }

        } else if (request.method === 'DELETE') {
            context.debug('table_name:', request.query.get('table_name'));
            context.debug('code_entry_id:', request.query.get('code_entry_id'));
            Joi.assert(request.query.get('table_name'), Joi.string().required());
            Joi.assert(request.query.get('code_entry_id'), Joi.string().required());
            let CodeTable;
            switch (request.query.get('table_name')) {
                case 'AdminRole':
                    CodeTable = AdminRole;
                    break;
                case 'EmploymentStatus':
                    CodeTable = EmploymentStatus;
                    break;
                case 'Gender':
                    CodeTable = Gender;
                    break;
                case 'MaritalStatus':
                    CodeTable = MaritalStatus;
                    break;
                case 'PermissionScope':
                    CodeTable = PermissionScope;
                    break;
            }
            const codeValue = await CodeTable.findByPk(request.query.get('code_entry_id'));
            if (!codeValue) {
                return { status: 400, body: 'invalid id provided' }
            }
            await codeValue.destroy();
            return { body: request.query.get('code_entry_id') }
        }

    } catch (error) {
        context.error('codetables: error encountered:', error);
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('codetables', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: codetables
});
