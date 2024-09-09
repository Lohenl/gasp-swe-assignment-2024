# gasp-swe-assignment-2024

Financial Assistance Scheme Management System developed in NodeJS on Azure Functions

Coding Assignment for SWE role in GovTech GASP

## Features

Core Stuff:
- Schemes Management
- Rules Engine integration for Schemes Eligibility
- Applicant / Application Management
- User Management
- Authorization Management

Nice-to-haves:
- Local Swagger integration to test APIs
- Rules Engine testbed to test JSON-based rules
- Dockerized PostgreSQL for easy setup

## Default Local Ports Used (move elsewhere)
- 7071: Azure Functions
- 3000: Swagger UI
- 5432: PostgreSQL

## Docs

**If you are in a rush**, you can go right to the [Guided Tour](./docs/how-to-use.md#guided-tour) instead!

### Table of Contents

- [Overview](./docs/overview.md)
    - [Tech Stack](./docs/overview.md#tech-stack)
        - [Application](./docs/overview.md#application)
        - [Rules Engine](./docs/overview.md#rules-engine)
        - [Database](./docs/overview.md#database)
    - [Data Design](./docs/overview.md#data-design)
    
- [How To Use](./docs/how-to-use.md)
    - [Requirements](./docs/how-to-use.md#requirements)
        - [IDE](./docs/how-to-use.md#ide)
        - [Application](./docs/how-to-use.md#application)
        - DB + Viewer
    - [Using the APIs](./docs/how-to-use.md#using-the-apis)
    - [Guided Tour](./docs/how-to-use.md#guided-tour)

## Assignment Checklist
- [x] Scaffold project
    - [x] API
    - [x] Database
    - [x] Docs (Note: Might need to bake into /api instead, later)
- [x] Readings
    - [x] Recap on DB best practices
    - [x] Swagger Workflow
- [x] DB Design
    - [x] Schema Design
    - [x] PostgreSQL Local Setup
    - [x] Swagger to Functions Integration
    - [x] ORM/ODM Integration (sequelize)
    - [x] Local E2E shakedown
    - [x] Build Models in API (Note: all FKs and Pure RTables are made in Function for now - no time)
- [x] API Design
    - [x] Requirements recap
    - [x] Swagger Specs
    - [x] Scaffold
- [x] Backend Logic
    - [x] Implement
        - [x] applicants
        - [x] codetables
        - [x] users
        - [x] permissions (the first FKs to make)
        - [x] households
        - [x] schemes basic CRUD
        - [x] benefits CRUD 
        - [x] applicant code tables integration (API + Model FKs)
        - [x] rules engine integration (the tedious and complex one)
            - [x] schemes-rules API
            - [x] actually using json-rules-engine
        - [x] schemes eligible API
            - [x] develop 1 test case (male employed/self-employed)
            - [x] document test case (update swagger docs)
        - [x] applications (need to simplify the model, no time)
        - [x] Eslint (airbnb base)
    - [x] Build validators with joi
    - [x] Integrate Rules Engine
        - [x] Update /schemes/eligible API
        - [x] make use of eligibility_criteria to Schemes model
- [x] Code Quality
    - [x] Eslint cleanup
    - [x] Testing
    - [x] SAST (Synk again lol)
- [x] Missed Out on First Pass
    - [x] Applicant relationships in Households
        - [x] Revisit DB Diagram
        - [x] Build Models
        - [x] Update Functions
        - [x] Test Regression urgh
    - [x] Application Outcome - just 1 extra field because I simplified
    - [x] Update application API CU to include outcome
- [x] AuthN and AuthZ Integration
    - [x] Design the approach
    - [x] Make permission into a module
    - [x] Build permission assignments CRUD APIs
    - [x] Build authorization service using Permissions and Users
    - [x] Implement authorization layer in APIs
    - [x] Integrate with codebase
        - [x] Extra Swagger header to mimic authenticated user
- [ ] Documentation
    - [ ] README
    - [x] Swagger
- [ ] Demonstration / Open House
    - [ ] Mock Data
    - [ ] Seed Script
    - [ ] Set Repo to Public

## References (organize later)
- [Azure Function Core Tools](https://github.com/Azure/azure-functions-core-tools/blob/v4.x/README.md#windows)
- [Azure Function Typescript Setup](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?tabs=windows%2Cazure-cli%2Cbrowser&pivots=nodejs-model-v4)
- [Azure Function Typescript Local Dev](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-typescript)
- [DB Normalization](https://www.youtube.com/watch?v=GFQaEYEc8_8)
- [PostgreSQL Container Setup](https://dev.to/andre347/how-to-easily-create-a-postgres-database-in-docker-4moj)
- [Sequelize Start Guide](https://sequelize.org/docs/v6/getting-started/)
- [PostgreSQL Seeding](https://dev.to/studio_hungry/how-to-seed-a-postgres-database-with-node-384i)
- [Reference Repo for DB Seeding](https://github.com/molebox/seed-postgres-database-tutorial/blob/main/src/config.js)
- [(Education) Azure Functions](https://learn.microsoft.com/en-us/azure/developer/javascript/how-to/develop-serverless-apps?tabs=v4-ts)
- [Swagger Getting Started](https://swagger.io/tools/open-source/getting-started/)
- [(Education) Swagger Overview](https://medium.com/@samuelnoye35/simplifying-api-development-in-node-js-with-swagger-a5021ac45742)
- [Swagger UI Dev Setup](https://swagger.io/docs/open-source-tools/swagger-ui/development/setting-up/)
- [Azure Functions v4 TypeScript](https://johnnyreilly.com/migrating-azure-functions-node-js-v4-typescript)
- [Swagger Associations (Foreign Keys)](https://sequelize.org/docs/v6/core-concepts/assocs/)
- [Sequelize - Model Querying Basics](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)
- [Sequelize - 1:N Concepts](https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-many-relationships)
- [Sequelize - M:N Concepts](https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/)
- [Sequelize - Transactions](https://sequelize.org/docs/v6/other-topics/transactions/)
- [JSON Rules Engine - Simpler explanation, but outdated](https://www.npmjs.com/package/json-rules-engine/v/1.0.0-beta9)
- [JSON Rules Engine](https://www.npmjs.com/package/json-rules-engine)
- [HTTP 422](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422)
