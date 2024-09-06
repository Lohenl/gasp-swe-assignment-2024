const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.0.0',
        description: 'My API Description',
    },
    servers: [
        {
            url: 'http://localhost:7071/api',
            description: 'Development server (local)',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./src/functions/*.ts'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
