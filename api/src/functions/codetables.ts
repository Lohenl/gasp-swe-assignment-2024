import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import AdminRoleModel from "../models/adminrole";
import EmploymentStatusModel from "../models/employmentstatus";
import GenderModel from "../models/gender";
import MaritalStatusModel from "../models/maritalstatus";
import PermissionScopeModel from "../models/permissionscope";
import RelationshipModel from "../models/relationship";

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

/**
* @swagger
* /codetables:
* 
*   get:
*       tags:
*           - Code Tables
*       summary: Get all code tables / Get code table by name
*       description: Get a specific code table's details by name. Omit ID to get all code table' details registered in system.
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
*       tags:
*           - Code Tables
*       summary: Adds a codetable entry
*       description: Adds a codetable entry
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
*       tags:
*           - Code Tables
*       summary: Updates a code table
*       description: Updates a code table
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
*       tags:
*           - Code Tables
*       summary: Delete code table entry by code table name and ID
*       description: Delete code table entry by code table name and ID
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
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
        RelationshipModel(sequelize, DataTypes);
        const AdminRole = sequelize.models.AdminRole;
        const EmploymentStatus = sequelize.models.EmploymentStatus;
        const Gender = sequelize.models.Gender;
        const MaritalStatus = sequelize.models.MaritalStatus;
        const PermissionScope = sequelize.models.PermissionScope;
        const Relationship = sequelize.models.Relationship;

        // wait for all model syncs to finish
        const syncPromises = [];
        syncPromises.push(AdminRole.sync());
        syncPromises.push(EmploymentStatus.sync());
        syncPromises.push(Gender.sync());
        syncPromises.push(MaritalStatus.sync());
        syncPromises.push(PermissionScope.sync());
        syncPromises.push(Relationship.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            const table_name = request.query.get('table_name');
            context.debug('table_name:', table_name);
            if (!table_name) {
                const findallPromises = [];
                findallPromises.push(AdminRole.findAll({}));
                findallPromises.push(EmploymentStatus.findAll({}));
                findallPromises.push(Gender.findAll({}));
                findallPromises.push(MaritalStatus.findAll({}));
                findallPromises.push(PermissionScope.findAll({}));
                findallPromises.push(Relationship.findAll({}));
                const allResults = await Promise.allSettled(findallPromises) as any[];
                const jsonBody = {
                    AdminRole: allResults[0].value,
                    EmploymentStatus: allResults[1].value,
                    Gender: allResults[2].value,
                    MaritalStatus: allResults[3].value,
                    PermissionScope: allResults[4].value,
                    Relationship: allResults[5].value,
                };
                return { jsonBody }
            } else {
                Joi.assert(table_name, Joi.string());
                let jsonBody;
                switch (table_name) {
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
                    case 'Relationship':
                        jsonBody = await Relationship.findAll({});
                        break;
                }
                return { jsonBody }
            }

        } else if (request.method === 'POST') {
            const table_name = request.query.get('table_name');
            const code_entry_value = request.query.get('code_entry_value');
            context.debug('table_name:', table_name);
            context.debug('code_entry_value:', code_entry_value);
            Joi.assert(table_name, Joi.string().required());
            Joi.assert(code_entry_value, Joi.string().required());
            let CodeTable;
            switch (table_name) {
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
                case 'Relationship':
                    CodeTable = Relationship;
                    break;
            }
            const codeValue = CodeTable.build({ name: code_entry_value });
            await codeValue.save();
            return { jsonBody: codeValue.dataValues }

        } else if (request.method === 'PATCH') {
            // validation happens here, dont forget joi
            const table_name = request.query.get('table_name');
            const code_entry_id = request.query.get('code_entry_id');
            const code_entry_value = request.query.get('code_entry_value');
            context.debug('table_name:', table_name);
            context.debug('code_entry_id:', code_entry_id);
            context.debug('code_entry_value:', code_entry_value);
            Joi.assert(table_name, Joi.string().required());
            Joi.assert(code_entry_id, Joi.string().required());
            Joi.assert(code_entry_value, Joi.string().required());
            let CodeTable;
            switch (table_name) {
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
                case 'Relationship':
                    CodeTable = Relationship;
                    break;
            }
            const codeValue = await CodeTable.findByPk(code_entry_id);
            if (!codeValue) {
                return { status: 400, body: 'invalid id provided' }
            }
            codeValue.update({ name: code_entry_value });
            await codeValue.save();
            return { jsonBody: codeValue.dataValues }

        } else if (request.method === 'DELETE') {
            const table_name = request.query.get('table_name');
            const code_entry_id = request.query.get('code_entry_id');
            context.debug('table_name:', table_name);
            context.debug('code_entry_id:', code_entry_id);
            Joi.assert(table_name, Joi.string().required());
            Joi.assert(code_entry_id, Joi.string().required());
            let CodeTable;
            switch (table_name) {
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
                case 'Relationship':
                    CodeTable = Relationship;
                    break;
            }
            const codeValue = await CodeTable.findByPk(code_entry_id);
            if (!codeValue) {
                return { status: 400, body: 'invalid id provided' }
            }
            await codeValue.destroy();
            return { body: code_entry_id }
        }

    } catch (error) {
        context.error('codetables: error encountered:', error);
        if (error?.message?.startsWith('unauthorized')) { return { status: 403, body: error } }
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('codetables', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: codetables
});
