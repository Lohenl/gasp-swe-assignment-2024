import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import UserModel from '../models/user';
import AdminRoleModel from "../models/adminrole";
import PermissionScopeModel from "../models/permissionscope";

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres'
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
*             description: ID of a admin role to set
*             schema:
*               type: string
*           - in: query
*             name: permission_scope_id
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
*             description: ID of a admin role to set
*             schema:
*               type: string
*           - in: query
*             name: admin_role_id
*             description: ID of a admin role to set
*             schema:
*               type: string
*           - in: query
*             name: permission_scope_id
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
        UserModel(sequelize, DataTypes);
        const User = sequelize.models.User;
        await User.sync();

        // wait for all model syncs to finish
        let syncPromises = [];
        syncPromises.push(AdminRole.sync());
        syncPromises.push(PermissionScope.sync());
        await Promise.allSettled(syncPromises);

        const Permission = sequelize.define(
            'Permission', {
            // no non-PK non-FK values
        }
        );


        if (request.method === 'GET') {
            // validation happens here, dont forget joi
            context.log(request.query.get('id'));

            return { jsonBody: {} }

        } else if (request.method === 'POST') {
            // validation happens here, dont forget joi
            context.log(request.query.get('admin_role_id'));
            context.log(request.query.get('permission_scope_id'));

            return { jsonBody: {} }
            
        } else if (request.method === 'PATCH') {
            context.log(request.query.get('permission_id'));
            context.log(request.query.get('admin_role_id'));
            context.log(request.query.get('permission_scope_id'));

            return { jsonBody: {} }
            
        } else if (request.method === 'DELETE') {
            // validation happens here, dont forget joi
            context.log(request.query.get('id'));
            
            return { jsonBody: {} }
            
        }

    } catch (error) {
        context.error('permissions: error encountered:', error);
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('permissions', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: permissions
});
