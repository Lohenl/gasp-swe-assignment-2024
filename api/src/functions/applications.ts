import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
* @swagger
* /applications:
* 
*   get:
*       summary: Get all applications
*       description: Get all applications registered in the system
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates an application
*       description: Creates an application
*       parameters:
*           - in: body
*             name: application
*             description: JSON details of application
*             schema:
*               type: object
*               required:
*                   - name
*               properties:
*                   applicant_id:
*                       type: string
*                       required: true
*                   scheme_id:
*                       type: string
*                       required: true 
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
