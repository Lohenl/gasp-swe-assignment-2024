# gasp-swe-assignment-2024
Coding Assignment for SWE role in GovTech GASP

# Assignment Checklist
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
- [ ] Backend Logic
    - [ ] Implement
        - [ ] Eslint (airbnb base)
- [ ] Code Quality
    - [ ] Eslint cleanup
    - [ ] SAST (Likely Synk again lol)
- [ ] Documentation
    - [ ] README
    - [ ] Swagger
- [ ] AuthN and AuthZ Integration (hard pressed for time)
    - [ ] Design
    - [ ] Implement APIs
    - [ ] Integrate with codebase
- [ ] Demonstration / Open House
    - [ ] Mock Data
    - [ ] Seed Script
    - [ ] Set Repo to Public

# Local Ports
- 7071: Azure Functions
- 3000: Swagger UI
- 5432: PostgreSQL

# References (organize later)
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
