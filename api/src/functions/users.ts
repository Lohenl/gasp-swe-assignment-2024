import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Sequelize, DataTypes } from 'sequelize';
import UserModel from '../models/user';

const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
    host: process.env['PGHOST'],
    dialect: 'postgres'
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
*                       name: "Loh En Liang"
*                       email: "loh_en_liang@tech.gov.sg"
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
*                       name: "Loh En Liang"
*                       email: "loh_en_liang@cpf.gov.sg"
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
            if (!request.query.get('id')) {
                const users = await User.findAll({});
                return { jsonBody: users }
            } else {
                // validation happens here, dont forget joi
                const user = await User.findByPk(request.query.get('id'));
                return { jsonBody: user }
            }

        } else if (request.method === 'POST') {
            const reqBody = await request.json();
            // validation happens here, dont forget joi
            const user = User.build({
                name: reqBody['name'],
                email: reqBody['email'],
            });
            await user.save();
            return { jsonBody: user.dataValues }

        } else if (request.method === 'PATCH') {
            const updateFields = await request.json();
            // validation happens here, dont forget joi
            const user = await User.findByPk(request.query.get('id'));
            user.update(updateFields);
            await user.save();
            return { jsonBody: user.dataValues }

        } else if (request.method === 'DELETE') {
            // validation happens here, dont forget joi
            const user = await User.findByPk(request.query.get('id'));
            if (!user) {
                return { status: 400, body: 'invalid id provided' }
            }
            await user.destroy();
            return { body: request.query.get('id') }
        }

    } catch (error) {
        context.error('users: error encountered:', error);
        return { status: 500, body: `Unexpected error occured: ${error}` }
    }
};

app.http('users', {
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    authLevel: 'anonymous',
    handler: users
});
