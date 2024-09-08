import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import AdminRoleModel from "../models/adminrole";
import PermissionScopeModel from "../models/permissionscope";

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
*   patch:
*       summary: Updates a permission
*       description: Updates a permission
*       parameters:
*           - in: query
*             name: permission_id
*             required: true
*             description: ID of a admin role to set
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
        const AdminRole = sequelize.models.AdminRole;
        const PermissionScope = sequelize.models.PermissionScope;

        // declare M:M relationships - Permission is essentially a junction table
        // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships
        const Permission = sequelize.define('Permission',
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                }
            }
        );
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

        } else if (request.method === 'PATCH') {
            context.debug('permission_id:', request.query.get('permission_id'));
            context.debug('admin_role_id:', request.query.get('admin_role_id'));
            context.debug('permission_scope_id:', request.query.get('permission_scope_id'));
            Joi.assert(request.query.get('permission_id'), Joi.string().guid().required());
            Joi.assert(request.query.get('admin_role_id'), Joi.string().guid().required());
            Joi.assert(request.query.get('permission_scope_id'), Joi.string().guid().required());

            const permission = await Permission.findByPk(request.query.get('permission_id'));
            if (!permission) {
                return { status: 400, body: 'invalid id provided' }
            }
            const adminRole = await AdminRole.findByPk(request.query.get('admin_role_id'));
            const permissionScope = await PermissionScope.findByPk(request.query.get('permission_scope_id'));
            if (adminRole && permissionScope) {
                permission.update({
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
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('permissions', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: permissions
});
