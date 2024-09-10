# How to Use

## Requirements

### IDE


- Any IDE that works with TypeScript is sufficient. I prefer mine with terminal windows to work off 1 screen, so I've been using **Visual Studio Code**.

- [```git```](https://git-scm.com/downloads) is recommended for cloning this repo and following the guide
- [```Swagger UI```](https://swagger.io/tools/swagger-ui/download/) is handy to test the APIs with, though a local Swagger UI webserver has aready been included to automatically generate the OAI specs, and the UI to test the APIs with.

### Application

- [```Node.js```](https://nodejs.org/en/download/package-manager) needs to be installed

### DB + Viewer

- [```Docker Desktop```](https://www.docker.com/products/docker-desktop/) is recommended in order to use the included PostgreSQL Dockerfile, installing / using your own PostgreSQL server is fine.
- [```pgAdmin```](https://www.pgadmin.org/download/) is nice to have as a DB viewer to view how the data works

## Using the APIs
The REST APIs generally follow the data model, with a few exceptions.

### Business Application
- ```/schemes``` - Financial assistance schemes
    - ```/benefits``` - Benefits available under the schemes
    - ```/scheme/eligible``` - Endpoint for determining schemes that an applicant is eligible for
    - ```/scheme-rules``` - The stored JSON for ```json-web-engine``` that represent Rules Engine configuration  

- ```/applicants``` - People who apply for schemes to receive benefits  
    - ```/household-members``` - Household members registered under each applicant

- ```/applications``` - The representation of an applicant's **application** to the financial assistance scheme 

### User + Authorization Management
- ```/users``` - The users that interact with the system
- ```/permissions``` - The ability for user
    - ```/permission-assignments``` - Representation of a permission assigned to a user

### Auxillary
- ```/codetables``` - "Lookup" tables that store a numerical value that represents a certain text value, like enums. More helpful for UI applications or working with different languages.

## Using the Rules Engine Testbed

A testbed for ```json-web-engine``` is available in the ```rules-engine-sample``` directory. You can explore the source examples with ```npm run example``` and ```npm run microsoft-example```, as well as one implementation of a Schemes Rule with ```npm start```.

You can use this testbed to further develop and explore json rulesets for use in this application.

## Configuration Settings

The environment variables for this project are stored under Azure Functions' ```local.settings.json``` file. A ```local.settings.json.sample``` file is included in this project which you can rename to ```local.settings.json``` to allow the application to run.

## Authorization

In its default settings, authorization has been disabled. You can enable it by going to ```local.settings.json```, and editing the last line from ```"ENABLE_AUTHORIZATION": "false"``` to ```"ENABLE_AUTHORIZATION": "true"``` 

Remember to restart the Node.js application after saving the ```local.settings.json``` file for changes to take effect.

# Guided Tour

This tour will walk you through on how to interact with the different parts of this system ASAP.

- Setting Up
- Using Swagger
- Guided User Story

This guide also assumes you have the following in your machine:
- Git
- Visual Studio Code
- Node with npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Localhost Ports 7071, 5432, 3000 are free

Please google if you don't know or understand - I don't have a lot of time writing all the docs and linking all the guides in this week-long assignment. :c

### Setting Up

1. Open VSCode and clone this repository
2. Press ```F1``` and type/select ```Terminal: Select Default Profile``` 
3. Select ```Git Bash```
    - (If you don't see it, you have not installed Git yet)
4. Open the terminal with ``` Ctrl + ~ ``` (tilde key)
5. Navigate to ```database``` directory with: 
``` 
cd database/
```
6. Build the postgresql image with this command.
    - If you have problems, check if Docker Desktop is on.
```
docker build -t local-postgres-db ./
```
7. Run the image
```
docker run -d --name local-postgresdb-container -p 5432:5432 local-postgres-db
````
8. Now navigate to the ```api``` directory with
```
cd ../api/
```
9. Rename the ```local.settings.json.sample``` file into ```local.settings.json```  
10. Install the NPM dependencies with
```
npm i
```
11. Run the main application with
```
npm start
```
12. Wait till you see a list of functions like so:

![display of ready functions](./img/functions-are-ready.PNG)

13. Press ```Ctrl + Shift + 5``` to split the screen

14. Click on the newly opened terminal, and start the Swagger UI app with
```
npm run swagger
```
15. Wait till you see the following on the console:

![display that swagger is ready](./img/swagger-is-ready.PNG)

16. Open your web browser, and navigate to ```http://localhost:3000/```

![swagger ui](./img/swagger-ui-sample.PNG)

17. Here's a picture of what my screen typically looks like, building on this system: (I use a 2nd screen, and the swagger docs might look different)

![Sample layout](./img/sample-layout.PNG)

### Using Swagger

1. Click on the API that you want to test

![swagger guide](./img/swag-1.PNG)

2. Click on the 'Try is out' button

![swagger guide](./img/swag-2.PNG)

3. Enter the necessary values and click on the 'Execute' button, view the response

![swagger guide](./img/swag-3.PNG)

# Guided User Scenarios

#### Scenario A
In this scenario, you have been tasked to do the following:

1. View all available financal assistance schemes
2. Register a new applicant
3. Check if the applicant is eligible for any schemes
4. Register an application on behalf of the applicant to the financal assistance scheme

#### Scenario B
Later in the day, a new scheme is announced - you have been tasked with:

1. Registering a new scheme
2. Updating the eligility criteria of the scheme
3. Testing the eligility against applicants registered in the system

#### Scenario C
Lastly, you have some system admin work to do:

1. Register a new user
2. Assign permissions to the new user
3. Bonus: Try out authorization

## Scenario A

#### 1. View all available financal assistance schemes

1. Under Business - Scheme Management, look for ```GET /schemes```
2. Execute the function without entering any parameters
3. You will see only 1 scheme registered in the system:

```json
[
  {
    "id": "1bed3b60-2988-4a7e-b47b-3825295a8b10",
    "name": "Retrenchment Assistance Scheme",
    "eligibility_criteria": "...",
    "createdAt": "2024-09-09T06:49:24.596Z",
    "updatedAt": "2024-09-09T21:27:25.136Z"
  }
]
```

#### 2. Register a new applicant

1. Under Business - Applicant Management, look for ```POST /applicants```
2. Replace the sample with the following JSON and execute the function

```json
{
  "name": "Agnes Tan Peh Wen",
  "email": "agtanpw99@gmail.com",
  "mobile_no": "+6562353535",
  "birth_date": "1999-11-09",
  "EmploymentStatusId": 1,
  "MaritalStatusId": 2,
  "GenderId": 2,
  "household": [
    {
      "name": "James Jerome Kwek Rui Hao",
      "birth_date": "1998-11-01",
      "EmploymentStatusId": 2,
      "MaritalStatusId": 2,
      "GenderId": 1,
      "RelationshipId": 2
    }
  ]
}
```
3. You will get the following response similar to the one below. Make sure to copy the ```id``` value, in this example below it is ```0b49aa6a-8a8d-4a66-bd29-f5af454abc40```

```json
{
  "id": "0b49aa6a-8a8d-4a66-bd29-f5af454abc40",
  "name": "Agnes Tan Peh Wen",
  "email": "agtanpw99@gmail.com",
  "mobile_no": "+6562353535",
  "birth_date": "1999-11-09",
  "EmploymentStatusId": 1,
  "MaritalStatusId": 2,
  "GenderId": 2,
  "updatedAt": "2024-09-09T23:26:15.442Z",
  "createdAt": "2024-09-09T23:26:15.442Z"
}
```

#### 3. Check if the applicant is eligible for any schemes

1. Under Business - Applicant Management, look for ```GET /schemes/eligible```
2. Paste the ```id``` you haave copied into the ```id``` field under the Parameters sectopn, and execute the function
3. You should see the 1 scheme show up (it is currently set to be available for unemployed females), similar to this response below:
```json
[
  {
    "id": "1bed3b60-2988-4a7e-b47b-3825295a8b10",
    "name": "Retrenchment Assistance Scheme",
    "eligibility_criteria": "{\"name\":\"unemployed-female\",\"conditions\":{\"all\":[{\"fact\":\"applicant-details\",\"path\":\"$.GenderId\",\"operator\":\"equal\",\"value\":2},{\"fact\":\"applicant-details\",\"path\":\"$.EmploymentStatusId\",\"operator\":\"equal\",\"value\":1}]},\"event\":{\"type\":\"unemployed-male\",\"params\":{\"message\":\"Applicant is an unemployed female\"}}}",
    "description": "Scheme to help citizens who are recently retrenched",
    "createdAt": "2024-09-09T06:49:24.596Z",
    "updatedAt": "2024-09-09T22:02:49.496Z",
    "Benefits": [
      {
        "id": "b6fdfc27-f9b9-41d9-9ca8-31e7156d8fab",
        "name": "SkillsFuture Credits",
        "amount": "3000",
        "description": "Additional SkillsFuture Credits",
        "createdAt": "2024-09-09T06:49:24.646Z",
        "updatedAt": "2024-09-09T06:49:24.646Z",
        "SchemeId": "1bed3b60-2988-4a7e-b47b-3825295a8b10"
      },
      {
        "id": "56bd2e05-4208-4194-b822-5da8ce4d2a6a",
        "name": "CDC Vouchers",
        "amount": "600",
        "description": "Additional CDC Vouchers",
        "createdAt": "2024-09-09T06:49:24.646Z",
        "updatedAt": "2024-09-09T06:49:24.646Z",
        "SchemeId": "1bed3b60-2988-4a7e-b47b-3825295a8b10"
      },
      {
        "id": "1f77d974-2e85-41fd-961f-ccd4536cff28",
        "name": "School Meal Vouchers",
        "amount": "5",
        "description": "Daily school meal vouchers for applicants with children attending primary school",
        "createdAt": "2024-09-09T06:49:24.647Z",
        "updatedAt": "2024-09-09T06:49:24.647Z",
        "SchemeId": "1bed3b60-2988-4a7e-b47b-3825295a8b10"
      },
      {
        "id": "25d67480-2d69-45f8-8f14-94e32d9e2e31",
        "name": "CPF Medisave Account Top Up",
        "amount": "600",
        "description": "Top up to CPF Medisave Account",
        "createdAt": "2024-09-09T06:52:15.199Z",
        "updatedAt": "2024-09-09T06:52:15.199Z",
        "SchemeId": "1bed3b60-2988-4a7e-b47b-3825295a8b10"
      }
    ]
  }
]
```


4. (Optional) You can try using other ```id```s to check, such as ```027d9a40-b8cc-4ab3-a831-c232f2617c1f``` for Joe Linder, a self-employed male

#### 4. Register an application on behalf of the applicant to the financal assistance scheme

1. Under Business - Application Management, look for ```POST /applications```
2. Use Agnes' ```id``` for the ```applicant_id``` field, and ```1bed3b60-2988-4a7e-b47b-3825295a8b1``` (the default scheme id) for the ```scheme_id``` field, then execute the function.
3. You should see a response that looks similar to the one below:
```json
{
  "id": "a1463d59-52fe-4587-85a3-f3c1381cbb74",
  "outcome": "Pending Review",
  "ApplicantId": "0b49aa6a-8a8d-4a66-bd29-f5af454abc40",
  "SchemeId": "1bed3b60-2988-4a7e-b47b-3825295a8b10",
  "updatedAt": "2024-09-09T23:43:52.991Z",
  "createdAt": "2024-09-09T23:43:52.991Z"
}
```
Congratulations, you have finished Scenario A.

## Scenario B

#### 1. Registering a new scheme

1. Under Business - Scheme Management, look for ```POST /schemes```
2. Replace the example value with the following, and execute the function

```json
{
  "name": "SGWork Scheme",
  "description": "Scheme to help the self-employed",
  "benefits": [
    {
      "name": "U-Save Credits",
      "description": "Additional U-Save Credits",
      "amount": 800
    }
  ]
}
```
3. The response should show look like the below - make sure to copy the ```id``` field like what you did for Agnes earlier
```json
{
  "id": "471f81c9-959f-46bd-8af4-4276c82ac559",
  "name": "SGWork Scheme",
  "description": "Scheme to help the self-employed",
  "updatedAt": "2024-09-09T23:49:18.102Z",
  "createdAt": "2024-09-09T23:49:18.102Z",
  "eligibility_criteria": null
}
```

#### 2. Updating the eligility criteria of the scheme

1. Under Business - Scheme Management, look for ```POST /scheme-rules```
2. Replace the example with the following JSON
```json
{
  "name": "self-employed",
  "conditions": {
    "all": [
      {
        "fact": "applicant-details",
        "path": "$.EmploymentStatusId",
        "operator": "equal",
        "value": 3
      }
    ]
  },
  "event": {
    "type": "self-employed",
    "params": {
      "message": "Applicant is self-employed"
    }
  }
}
```
3. You will get the following response similar to the one below:
```json
{
  "id": "471f81c9-959f-46bd-8af4-4276c82ac559",
  "name": "SGWork Scheme",
  "eligibility_criteria": "{\"name\":\"self-employed\",\"conditions\":{\"all\":[{\"fact\":\"applicant-details\",\"path\":\"$.EmploymentStatusId\",\"operator\":\"equal\",\"value\":3}]},\"event\":{\"type\":\"self-employed\",\"params\":{\"message\":\"Applicant is self-employed\"}}}",
  "description": "Scheme to help the self-employed",
  "createdAt": "2024-09-09T23:49:18.102Z",
  "updatedAt": "2024-09-09T23:52:54.275Z"
}
```

#### 3. Testing the eligility against applicants registered in the system

1. The scheme should show up for self-employed applicants, here's a few ids available for testing against ```POST /schemes/eligible```

- ```c5c697d0-31c9-4386-ac6a-09ebb9ff3c42``` : female, self-employed
- ```cac1c073-6e00-4878-99d4-8cc79b62ea97``` : male, employed
- ```c7eae7bd-ebfb-4da5-bb8d-a6a4f63e27e3``` : female, unemployed

2. (Optional) play around with different eligibility_criteria, adding more schemes and applicants then modifying them 

## Scenario C

#### 1. Register a new user

1. Under System Admin, look for ```POST /users```
2. Replace the example with the JSON below and execute the function
```json
{
  "name": "Faizal Ibrahim bin Mohamed Noor",
  "email": "faizal_ibrahim@tech.gov.sg"
}
```
3. You should get a similar reponse to the one below, take note of his ```id``` - in this example it is ```665e4478-0e01-46af-b60b-9def6d4d531a```
```json
{
  "id": "665e4478-0e01-46af-b60b-9def6d4d531a",
  "name": "Faizal Ibrahim bin Mohamed Noor",
  "email": "faizal_ibrahim@tech.gov.sg",
  "updatedAt": "2024-09-10T00:12:49.172Z",
  "createdAt": "2024-09-10T00:12:49.172Z"
}
```

#### 2. Assign permissions to the new user

1. Under System Admin, look for ```POST /permission-assignments```
2. Enter ```6fe1107b-90a0-4bc2-a6d7-b2bc6c433534``` into the permission_id field, which represents the Applicant Contributor permission
3. Enter the ```id``` into the user_id field
4. Execute the function, the result would look like below - now Faizal can view, register, update and remove applicants, but will be prevented from doing anything else, until he is assigned more permissions
```json
{
  "id": "23b88344-3756-4b49-9967-40953ab84451",
  "PermissionId": "6fe1107b-90a0-4bc2-a6d7-b2bc6c433534",
  "UserId": "665e4478-0e01-46af-b60b-9def6d4d531a",
  "updatedAt": "2024-09-10T00:22:22.783Z",
  "createdAt": "2024-09-10T00:22:22.783Z"
}
```

#### 3. Bonus: Try out authorization

1. Go to ```local.settings.json``` and change the last line from:

```json
    "ENABLE_AUTHORIZATION": "false"
```

to

```json
    "ENABLE_AUTHORIZATION": "true"
```

2. **Restart Azure Functions:** Go to the terminal where Azure Functions was running (where you last ran ```npm start``` and not ```npm run swagger```), and press ```Ctrl + C``` to terminate the process. Enter ```npm start``` again to start Azure functions again.

3. Using Faizal's ```id``` from earlier, we can put it in the ```authz_user_id``` field to simulate an authenticated request, where Faizal has logged into his corporate account and is running the application.

4. You should be able to run any ```/applicants``` endpoint just fine, but as soon as you try to ```GET /users```, you will see that the request has been rejected with HTTP error 403.
