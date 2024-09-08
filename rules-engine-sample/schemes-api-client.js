'use strict'

// hacky objectDB for now, the actual implementation will be baked into the app itself as a service
const applicantData = {
    "1b44bfd4-265a-40d9-bacd-6659c6bbb9db": {
        "id": "1b44bfd4-265a-40d9-bacd-6659c6bbb9db",
        "HouseholdId": null,
        "EmploymentStatusId": 3,
        "MaritalStatusId": 2,
        "GenderId": 2,
        "name": "Jane Kwok",
        "email": "janekwok88@gmail.com",
        "mobile_no": "+6512345678",
        "birth_date": "1988-05-02",
        "createdAt": "2024-09-08T07:56:48.011Z",
        "updatedAt": "2024-09-08T07:56:48.011Z"
    },
    "e6b52c5e-b9d0-468c-9baf-533c1f2f2f80": {
        "id": "e6b52c5e-b9d0-468c-9baf-533c1f2f2f80",
        "HouseholdId": null,
        "EmploymentStatusId": 2,
        "MaritalStatusId": 1,
        "GenderId": 1,
        "name": "Jon Tan",
        "email": "jontanwenghou@gmail.com",
        "mobile_no": "+6587654321",
        "birth_date": "2003-08-08",
        "createdAt": "2024-09-08T07:56:26.140Z",
        "updatedAt": "2024-09-08T08:03:05.292Z"
    }
}

module.exports = {
    getApplicantInformation: (applicantId) => {
        console.log(`client: loading account information for ${applicantId}`);
        return new Promise((resolve, reject) => {
            setImmediate(() => {
                resolve(applicantData[applicantId])
            })
        })
    }
}
