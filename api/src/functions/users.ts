import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import Joi = require('joi');
import UserModel from '../models/user';
const validateBody = require('../validators/usersValidate');
const { checkAuthorization } = require('../services/authorizationService');

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres',
    logging: false,
});

/**
* @swagger
* /users:
* 
*   get:
*       summary: Get all user details / Get user details by ID
*       description: Get a specific user's details by ID. Omit ID to get all users' details registered in system.
*       parameters:
*           - in: query
*             name: id
*             description: ID of a specific user to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates a user
*       description: Creates a user
*       requestBody:
*           description: JSON details of user to be created
*           required: true
*           content:
*               application/json:
*                   schema:
*                       users:
*                           type: object
*                       required:
*                           - name
*                       properties:
*                           name:
*                               type: string
*                           email:
*                               type: string
*                   example:
*                       name: "Koh Wen Hao"
*                       email: "koh_wen_hao@tech.gov.sg"
*       responses:
*           200:
*               description: Successful response
* 
*   patch:
*       summary: Updates a user
*       description: Updates a user
*       parameters:
*           - in: query
*             name: id
*             required: true
*             description: ID of the user to update.
*             schema:
*               type: string
*       requestBody:
*           description: JSON details of user to be updated
*           required: true
*           content:
*               application/json:
*                   schema:
*                       applicants:
*                           type: object
*                       properties:
*                           name:
*                               type: string
*                           email:
*                               type: string
*                   example:
*                       name: "Koh Wen Hao"
*                       email: "koh_wen_hao@tech.gov.sg"
*       responses:
*           200:
*               description: Successful response
* 
*   delete:
*       summary: Delete user by ID
*       description: Delete a user from the system by ID.
*       parameters:
*           - in: query
*             name: id
*             required: true
*             description: ID of the user to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*/
export async function users(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {

        await sequelize.authenticate();
        UserModel(sequelize, DataTypes);
        const User = sequelize.models.User;
        await User.sync();

        if (request.method === 'GET') {
            await checkAuthorization(request, context);
            context.debug('id:', request.query.get('id'));
            if (!request.query.get('id')) {
                const users = await User.findAll({});
                return { jsonBody: users }
            } else {
                Joi.assert(request.query.get('id'), Joi.string().guid());
                const user = await User.findByPk(request.query.get('id'));
                return { jsonBody: user }
            }

        } else if (request.method === 'POST') {
            const reqBody = await request.json();
            context.debug('reqBody:', reqBody);
            validateBody(reqBody);
            // validation happens here, dont forget joi
            const user = User.build({
                name: reqBody['name'],
                email: reqBody['email'],
            });
            await user.save();
            return { jsonBody: user.dataValues }

        } else if (request.method === 'PATCH') {
            context.debug('id:', request.query.get('id'));
            const updateFields = await request.json();
            context.debug('updateFields:', updateFields);
            Joi.assert(request.query.get('id'), Joi.string().guid().required());
            validateBody(updateFields);
            const user = await User.findByPk(request.query.get('id'));
            if (!user) {
                return { status: 400, body: 'invalid id provided' }
            }
            user.update(updateFields);
            await user.save();
            return { jsonBody: user.dataValues }

        } else if (request.method === 'DELETE') {
            context.debug('id:', request.query.get('id'));
            const user = await User.findByPk(request.query.get('id'));
            Joi.assert(request.query.get('id'), Joi.string().guid().required());
            if (!user) {
                return { status: 400, body: 'invalid id provided' }
            }
            await user.destroy();
            return { body: request.query.get('id') }
        }
    } catch (error) {
        context.error('users: error encountered:', error);
        if (Joi.isError(error)) { return { status: 400, jsonBody: error } }
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('users', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: users
});
