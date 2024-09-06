import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
* @swagger
* /applicants:
*   get:
*       summary: Get a resource
*       description: Get a specific resource by ID.
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
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name}!` };
};

app.http('applicants', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: applicants
});
