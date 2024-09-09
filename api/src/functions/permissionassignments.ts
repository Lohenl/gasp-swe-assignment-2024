import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import PermissionModel from "../models/permission";
import PermissionAssignmentModel from "../models/permissionassignment";
import UserModel from "../models/user";

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
        PermissionModel(sequelize, DataTypes);
        UserModel(sequelize, DataTypes);
        PermissionAssignmentModel(sequelize, DataTypes);
        const Permission = sequelize.models.Permission;
        const User = sequelize.models.User;
        const PermissionAssignment = sequelize.models.PermissionAssignment;

        // declare M:M relationships - Permission is essentially a junction table
        // reference: https://sequelize.org/docs/v6/core-concepts/assocs/#many-to-many-relationships
        Permission.belongsToMany(User, { through: PermissionAssignment });
        User.belongsToMany(Permission, { through: PermissionAssignment });
        
        // wait for all model syncs to finish
        const syncPromises = [];
        syncPromises.push(Permission.sync());
        syncPromises.push(User.sync());
        syncPromises.push(PermissionAssignment.sync());
        await Promise.allSettled(syncPromises);

        if (request.method === 'GET') {
            const id = request.query.get('id');
            const permission_id = request.query.get('permission_id');
            const user_id = request.query.get('user_id');
            context.debug('id:', id);
            context.debug('permission_id:', permission_id);
            context.debug('user_id:', user_id);

            if (!id && !permission_id && !user_id) {
                // get all permission assignments
                const assignments = await PermissionAssignment.findAll({});
                if (!assignments) return { status: 404, body: 'permission assignment not found' }
                const jsonBody = []
                assignments.forEach(assignment => {
                    jsonBody.push(assignment.dataValues)
                });
                return { jsonBody }

            } else if (id && !permission_id && !user_id) {
                // get assignment by ID
                Joi.assert(id, Joi.string().guid());
                const assignment = await PermissionAssignment.findByPk(id);
                if (!assignment) return { status: 404, body: 'permission assignment not found' }
                return { jsonBody: assignment.dataValues }

            } else if (!id && permission_id && !user_id) {
                // get all assignments by permission
                Joi.assert(permission_id, Joi.string().guid());
                const permission = await Permission.findByPk(permission_id);
                if (!permission) return { status: 404, body: 'permission not found' }
                const assignments = await PermissionAssignment.findAll({ where: { PermissionId: permission_id } });
                const jsonBody = []
                assignments.forEach(assignment => {
                    jsonBody.push(assignment.dataValues)
                });
                return { jsonBody }

            } else if (!id && !permission_id && user_id) {
                // get all assignments by user
                Joi.assert(user_id, Joi.string().guid());
                const user = await User.findByPk(user_id);
                if (!user) return { status: 404, body: 'user not found' }
                const assignments = await PermissionAssignment.findAll({ where: { UserId: user_id } });
                const jsonBody = []
                assignments.forEach(assignment => {
                    jsonBody.push(assignment.dataValues)
                });
                return { jsonBody }

            } else {
                return { status: 400, body: 'invalid params, provide only one of id, permission_id, or user_id, or none at all' }
            }

        } else if (request.method === 'POST') {
            const permission_id = request.query.get('permission_id');
            const user_id = request.query.get('user_id');
            context.debug('permission_id:', permission_id);
            context.debug('user_id:', user_id);
            Joi.assert(permission_id, Joi.string().guid().required());
            Joi.assert(user_id, Joi.string().guid().required());

            // check if user and permission exist
            const user = await User.findByPk(user_id);
            if (!user) return { status: 404, body: 'user not found' }
            const permission = await Permission.findByPk(permission_id);
            if (!permission) return { status: 404, body: 'permission not found' }

            // check if permission has already been assigned
            const existingAssignment = await PermissionAssignment.findOne({
                where: {
                    PermissionId: permission_id,
                    UserId: user_id,
                }
            });
            if (existingAssignment) return { status: 422, body: 'user is already assigned this permission' }

            const newAssignment = await PermissionAssignment.create({
                PermissionId: permission_id,
                UserId: user_id,
            })
            return { jsonBody: newAssignment.dataValues }

        } else if (request.method === 'DELETE') {
            const id = request.query.get('id');
            const permission_id = request.query.get('permission_id');
            const user_id = request.query.get('user_id');
            context.debug('id:', id);
            context.debug('permission_id:', permission_id);
            context.debug('user_id:', user_id);

            if (id && !permission_id && !user_id) {
                // delete assignment by ID
                Joi.assert(id, Joi.string().guid());
                const assignment = await PermissionAssignment.findByPk(id);
                if (!assignment) return { status: 404, body: 'permission assignment not found' }

                await assignment.destroy();
                return { body: id }

            } else if (!id && permission_id && !user_id) {
                // delete all assignments by permission
                Joi.assert(permission_id, Joi.string().guid());
                const permission = await Permission.findByPk(permission_id);
                if (!permission) return { status: 404, body: 'permission not found' }
                const assignments = await PermissionAssignment.findAll({ where: { PermissionId: permission_id } });

                await sequelize.transaction(async t => {
                    const deletePromises = [];
                    assignments.forEach(assignment => {
                        deletePromises.push(assignment.destroy({ transaction: t }))
                    });
                    await Promise.allSettled(deletePromises);
                });
                return { body: permission_id }

            } else if (!id && !permission_id && user_id) {
                // delete all assignments by user
                Joi.assert(user_id, Joi.string().guid());
                const user = await User.findByPk(user_id);
                if (!user) return { status: 404, body: 'user not found' }
                const assignments = await PermissionAssignment.findAll({ where: { UserId: user_id } });

                await sequelize.transaction(async t => {
                    const deletePromises = [];
                    assignments.forEach(assignment => {
                        deletePromises.push(assignment.destroy({ transaction: t }))
                    });
                    await Promise.allSettled(deletePromises);
                });
                return { body: user_id }

            } else {
                return { status: 400, body: 'invalid parameters, provide one of id, permission_id, or user_id' }
            }

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
