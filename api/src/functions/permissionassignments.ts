import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import AdminRoleModel from "../models/adminrole";
import PermissionScopeModel from "../models/permissionscope";
import PermissionModel from "../models/permission";

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

/**
* @swagger
* /permission-assignments:
* 
*   get:
*       summary: Get all assignments / Get assignment by ID / Permission / User 
*       description: Get permission assignment by ID, or get all permission assignment's details by Permission / User, otherwise get all permission assignments registered in system.
*       parameters:
*           - in: query
*             name: id
*             description: ID of a specific assignment to retrieve.
*             schema:
*               type: string
*           - in: query
*             name: permission_id
*             description: ID of permission to retrive all permission assignments with
*             schema:
*               type: string
*           - in: query
*             name: user_id
*             description: ID of user to retrive all permission assignments with
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates a permission assignment
*       description: Creates a permission assignment
*       parameters:
*           - in: query
*             name: permission_id
*             required: true
*             description: ID of a permission to assign to user
*             schema:
*               type: string
*           - in: query
*             name: user_id
*             required: true
*             description: ID of user to assign a permission to
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       summary: Deletes permission assignment by ID / Deletes all permission assignments for a given permission or user 
*       description: Deletes permission by ID / Deletes all permission assignments for a given permission or user 
*       parameters:
*           - in: query
*             name: id
*             required: true
*             description: ID of the permission to delete.
*             schema:
*               type: string
*           - in: query
*             name: permission_id
*             required: true
*             description: ID of a permission to assign to user
*             schema:
*               type: string
*           - in: query
*             name: user_id
*             required: true
*             description: ID of user to assign a permission to
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*/
export async function permissionAssignments(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        await sequelize.authenticate();
        AdminRoleModel(sequelize, DataTypes);
        PermissionScopeModel(sequelize, DataTypes);
        PermissionModel(sequelize, DataTypes)
        const AdminRole = sequelize.models.AdminRole;
        const PermissionScope = sequelize.models.PermissionScope;
        const Permission = sequelize.models.Permission;

        // declare M:M relationships - Permission is essentially a junction table
        // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships
        AdminRole.belongsToMany(PermissionScope, { through: Permission });
        PermissionScope.belongsToMany(AdminRole, { through: Permission });

        // wait for all model syncs to finish
        const syncPromises = [];
        syncPromises.push(AdminRole.sync());
        syncPromises.push(PermissionScope.sync());
        syncPromises.push(Permission.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            context.debug('id:', request.query.get('id'));
            Joi.assert(request.query.get('id'), Joi.string().guid());
            if (!request.query.get('id')) {
                const permissions = await Permission.findAll({});
                return { jsonBody: permissions }
            } else {
                const permission = await Permission.findByPk(request.query.get('id'));
                return { jsonBody: permission }
            }

        } else if (request.method === 'POST') {
            // validation happens here, dont forget joi
            context.debug('admin_role_id:', request.query.get('admin_role_id'));
            context.debug('permission_scope_id:', request.query.get('permission_scope_id'));
            Joi.assert(request.query.get('admin_role_id'), Joi.string().guid().required());
            Joi.assert(request.query.get('permission_scope_id'), Joi.string().guid().required());

            // practically speaking a UI would directly feed the respective IDs to this join table
            // so at best you would only need to check if the IDs exist in the respective tables
            const adminRole = await AdminRole.findByPk(request.query.get('admin_role_id'));
            const permissionScope = await PermissionScope.findByPk(request.query.get('permission_scope_id'));
            if (adminRole && permissionScope) {
                const permission = Permission.build({
                    AdminRoleId: request.query.get('admin_role_id'),
                    PermissionScopeId: request.query.get('permission_scope_id'),
                });
                await permission.save();
                return { jsonBody: permission.dataValues };
            } else {
                return { status: 400, body: 'invalid ID(s) provided for admin_role_id and/or permission_scope_id' }
            }

        } else if (request.method === 'DELETE') {
            context.debug('id:', request.query.get('id'));
            Joi.assert(request.query.get('id'), Joi.string().guid().required());
            const permission = await Permission.findByPk(request.query.get('id'));
            if (!permission) {
                return { status: 400, body: 'invalid id provided' }
            }
            await permission.destroy();
            return { body: request.query.get('id') }
        }

    } catch (error) {
        context.error('permissions: error encountered:', error);
        if (error?.message?.startsWith('unauthorized')) { return { status: 403, body: error } }
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('permission-assignments', {
    methods: ['GET', 'POST', 'DELETE'],
    authLevel: 'anonymous',
    handler: permissionAssignments
});
