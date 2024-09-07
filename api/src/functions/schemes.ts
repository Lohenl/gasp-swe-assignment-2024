import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
* @swagger
* /schemes:
*   get:
*       summary: Get all schemes / Get scheme details by ID
*       description: Get a specific scheme's details by ID. Omit ID to get all schemes' details registered in system.
*       parameters:
*           - in: path
*             name: id
*             description: ID of the scheme to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
*   post:
*       summary: Creates a scheme (Benefits needs fixing)
*       description: Creates a scheme
*       parameters:
*           - in: body
*             name: scheme
*             description: JSON details of scheme to be created
*             schema:
*               type: object
*               required:
*                   - name
*               properties:
*                   name:
*                       type: string
*                   description:
*                       type: string
* 
*   patch:
*       summary: Updates a scheme (Benefits needs fixing)
*       description: Updates a scheme
*       parameters:
*           - in: path
*             name: id
*             required: true
*             description: ID of the scheme to update.
*             schema:
*               type: string
*           - in: body
*             name: scheme
*             description: JSON details of scheme to update with
*             schema:
*               type: object
*               required:
*                   - name
*               properties:
*                   name:
*                       type: string
* 
*   delete:
*       summary: Delete scheme by ID
*       description: Delete a scheme from the system by ID.
*       parameters:
*           - in: path
*             name: id
*             required: true
*             description: ID of the scheme to delete.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
* 
* /schemes/eligible:
*   get:
*       summary: Get all eligible schemes for given applicant
*       description: Get all schemes that an applicant is eligible to apply for
*       parameters:
*           - in: path
*             name: applicant
*             description: ID of the applicant to retrieve.
*             schema:
*               type: string
*       responses:
*           200:
*               description: Successful response
*/
export async function schemes(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'scheme finder';

    return { body: `Hello, ${name}!` };
};

app.http('schemes', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: schemes
});
