import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
const { Sequelize, Model, DataTypes } = require('sequelize');

/**
* @swagger
* /applicants:
*   get:
*       summary: Get a resource
*       description: Get a specific resource by ID. (Placeholder description)
*       parameters:
*           - in: path
*             name: id
*             required: true
*             description: ID of the resource to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
*/
export async function applicants(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    // TODO: testing singleton, to turn into a module for DRY

    const sequelize = new Sequelize(process.env['PGDATABASE'], process.env['PGUSER'], process.env['PGPASSWORD'], {
        host: process.env['PGHOST'],
        dialect: 'postgres'
    });

    class Applicant extends Model { }

    Applicant.init(
        {
            name: DataTypes.TEXT,
            favoriteColor: {
                type: DataTypes.TEXT,
                defaultValue: 'green',
            },
            age: DataTypes.INTEGER,
            cash: DataTypes.INTEGER,
        },
        {
            // Other model options go here
            sequelize, // We need to pass the connection instance
            modelName: 'Applicant', // We need to choose the model name
        },
    );

    try {
        await sequelize.authenticate();
        context.log('Connection has been established successfully.');
        await sequelize.sync({ force: true });
        context.log('Sync done.');


        context.log('Applicant === sequelize.models.Applicant:', Applicant === sequelize.models.Applicant);
        const jane = sequelize.models.Applicant.build({ name: 'Jane' });
        console.log(jane instanceof Applicant); // true
        console.log(jane.name); // "Jane"

    } catch (error) {
        context.error('Unable to connect to the database:', error);
    }

    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'applicant';

    return { body: `Hello, ${name}!` };
};

app.http('applicants', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: applicants
});
