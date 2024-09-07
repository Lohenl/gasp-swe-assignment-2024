import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
* @swagger
* /households:
*   get:
*       summary: Get all households / Get household details by ID
*       description: Get a specific household's details by ID. Omit ID to get all households' details registered in system.
*       parameters:
*           - in: path
*             name: id
*             description: ID of the household to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates a household
*       description: Creates a household
*       parameters:
*           - in: body
*             name: household
*             description: Array of member IDs to be created
*             required: true
*             schema:
*               type: array
*               items:
*                   type: string
*               example: ["str1", "str2", "str3"]
* 
*   patch:
*       summary: Updates a household
*       description: Updates a household
*       parameters:
*           - in: path
*             name: id
*             required: true
*             description: ID of the household to update.
*             schema:
*               type: string
*           - in: body
*             name: scheme
*             description: Array of member IDs to be created
*             schema:
*               type: array
*               items:
*                   type: string
*               example: ["str1", "str2", "str3"]
* 
*   delete:
*       summary: Delete household by ID
*       description: Delete a household from the system by ID.
*       parameters:
*           - in: path
*             name: id
*             required: true
*             description: ID of the household to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
*/
export async function households(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'scheme finder';

    return { body: `Hello, ${name}!` };
};

app.http('households', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: households
});
