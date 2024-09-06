import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
* @swagger
* /applications:
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
export async function applications(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'application seeker';

    return { body: `Hello, ${name}!` };
};

app.http('applications', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: applications
});
