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
* /permissions:
* 
*   get:
*       summary: Get all permissions / Get permission by ID
*       description: Get a specific permission's details by ID. Omit ID to get all permissions' details registered in system.
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
*           - in: query
*             name: id
*             description: ID of a specific permission to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates a permission
*       description: Creates a permission
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
*           - in: query
*             name: admin_role_id
*             required: true
*             description: ID of a admin role to set
*             schema:
*               type: string
*           - in: query
*             name: permission_scope_id
*             required: true
*             description: ID of permission scope to set
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       summary: Deletes permission by ID
*       description: Deletes permission by ID
*       parameters:
*           - in: header
*             name: authz_user_id
*             description: (For Demo) Put user_id here to simulate an authenticated user, for authorization checks
*             schema:
*               type: string
*           - in: query
*             name: id
*             required: true
*             description: ID of the permission to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*/
export async function permissions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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
            const id = request.query.get('id');
            context.debug('id:', id);
            if (!request.query.get('id')) {
                const permissions = await Permission.findAll({});
                return { jsonBody: permissions }
            } else {
                Joi.assert(id, Joi.string().guid());
                const permission = await Permission.findByPk(id);
                if (permission) return { status: 404, body: 'permission not found' }
                return { jsonBody: permission }
            }

        } else if (request.method === 'POST') {
            const admin_role_id = request.query.get('admin_role_id');
            const permission_scope_id = request.query.get('permission_scope_id');
            context.debug('admin_role_id:', admin_role_id);
            context.debug('permission_scope_id:', permission_scope_id);

            // practically speaking only numbers will be fed to the backend
            // we are using code tables
            Joi.assert(admin_role_id, Joi.number().required());
            Joi.assert(permission_scope_id, Joi.number().required());
            const adminRole = await AdminRole.findByPk(admin_role_id);
            if (!adminRole) return { status: 404, body: 'admin role not found' }
            const permissionScope = await PermissionScope.findByPk(permission_scope_id);
            if (!permissionScope) return { status: 404, body: 'permission scope not found' }

            // check if permission has already been defined before
            const existingPermission = await Permission.findOne({
                where: {
                    AdminRoleId: admin_role_id,
                    PermissionScopeId: permission_scope_id,
                }
            })
            if (existingPermission) return { status: 422, body: 'permission already exists' }

            const permission = Permission.build({
                AdminRoleId: admin_role_id,
                PermissionScopeId: permission_scope_id,
            });
            await permission.save();
            return { jsonBody: permission.dataValues };

        } else if (request.method === 'DELETE') {
            const id = request.query.get('id');
            context.debug('id:', id);
            Joi.assert(id, Joi.string().guid().required());
            const permission = await Permission.findByPk(id);
            if (!permission) return { status: 404, body: 'permission not found' }
            await permission.destroy();
            return { body: id }
        }

    } catch (error) {
        context.error('permissions: error encountered:', error);
        if (error?.message?.startsWith('unauthorized')) { return { status: 403, body: error } }
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('permissions', {
    methods: ['GET', 'POST', 'DELETE'],
    authLevel: 'anonymous',
    handler: permissions
});
