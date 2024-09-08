const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Financial Assistance Scheme Management System API',
        version: '0.0.0',
        description: 'Backend solution for managing financial assistance schemes for needy individuals and families',
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
