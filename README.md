# Zamvu API: Your Savannah Of Property Management Insight

**Zamvu (v1), is an API that can be utilize to manage property. In summary, it is a property management system** <br><br>
_This document servers as a reference for developers intergrating with the Zamvu API_

### Table of Contents

[Installation Guide](#Installation) <br>
[Usage](#Usage) <br>
[Authors](#Authors)

## Base URL

[YOUR_API_BASE_URL]/api/v1

## Installation

**Prequisite**: _You need to have Nodejs installed (this project is compiled with node version v20.11.0 and npm v10.2.4_

1. Clone repo and cd into api directory
2. Install needed packages with npm. Run <br>
   `npm install`

3. Run your server locally with(you can change script name in package.json in the scripts property): <br>
   `npm run server`

4. Connect to you server using an http client such as [Postman](https://www.postman.com/downloads/)

## Usage

Zamvu exposes several enpoints to create property, add tenants to a given property, delete a tenant, delete a property, etc. <br>
**Note:** _Most of the endpoints that provide CRUD functionality require authentication. Zamvu provides a session-token based authentication_ <br>

**The data standard format is in json format. Server reponds with JSON and expects JSON in its body for [unsafe](https://www.rfc-editor.org/rfc/rfc9110.html#name-common-method-properties) methods such as POST, PUT, etc**

### Status Codes

The API returns standard HTTP status codes to indicate the outcome of requests. Here are some common codes:

- 200 OK: Request successful
- 400 Bad Request: Invalid request syntax or validation errors
- 401 Unauthorized: Access denied due to missing or invalid JWT token
- 403 Forbidden: Insufficient permissions to access the resource
- 404 Not Found: Requested resource (e.g., user, property) not found
- 500 Internal Server Error: Unexpected error on the server

### Property Endpoints:

| Method | URL               | Description             | Fields                                                                                                                                                                                                         | Requires Auth |
| ------ | ----------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| POST   | `/properties`     | Create a new property   | **`propertyName*`**: `String` <br> **`address*:`** `String` <br> **`type*:`** `String(apartment, Main house)` <br> **`description*:`** `String(brief info about property)` <br> **`numberOfRooms*:`** `String` | Yes           |
| GET    | `/properties`     | Get all properties      | N/A                                                                                                                                                                                                            | Yes           |
| DELETE | `/properties/:id` | Delete a property by ID | N/A                                                                                                                                                                                                            | Yes           |

### User Endpoints:

| Method | URL         | Description                                                  | Fields                                                                                                           | Requires Auth |
| ------ | ----------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ------------- |
| POST   | `/users`    | Create a new account                                         | **`username*`**: `String` <br> **`email*:`** `String` <br> **`password*:`** `String(min: 8 chars max: 32 chars)` | Yes           |
| DELETE | `/users/me` | Delete a your account and every data associated with it      | **`email*:`** `String`                                                                                           | Yes           |
| PATCH  | `/users`    | Update existing fileds (Provide at least on field to update) | **`username`**: `String` <br> **`password`**: `String(min: 8 chars max: 32 chars)        `                       | Yes           |

### Auth Endpoints:

| Method | URL            | Description                                      | Fields                                                                            | Requires Auth |
| ------ | -------------- | ------------------------------------------------ | --------------------------------------------------------------------------------- | ------------- |
| POST   | `/auth`        | login and obtain a session token                 | **`email*:`** `String` <br> **`password*:`** `String(min: 8 chars max: 32 chars)` | No            |
| GET    | `/auth/status` | Get the authentication status of a user          | N/A                                                                               | No            |
| POST   | `/auth/logout` | Logout and invalidate the current session token) | N/A                                                                               | Yes           |

### Tenant Endpoints

| Method | URL                    | Description                                | Fields                                                                                                                                                                                              | Requires Auth |
| ------ | ---------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| POST   | `/tenants`             | Add a new tenant                           | **`name*`**: `String` <br> **`email*:`** `String` <br> **`phone*:`** `String` <br> **`propertyId*:`** `String` **`leaseStartDate*:`** `String(YYYY-MM-DD)` **`leaseEndDate:`** `String(YYYY-MM-DD)` | Yes           |
| GET    | `/tenants/:propertyId` | Get all tenants associated with a property | N/A                                                                                                                                                                                                 | Yes           |
| DELETE | `/tenants/:tenantId`   | Delete a tenant by ID                      | N/A                                                                                                                                                                                                 | Yes           |

## Authors

This project is built and manitained by:<br>

- [Samson Kabiru](https://github.com/sam-fsd) - email: samchiira@outlook.com <br>
- [Charles Otonda](https://github.com/Otonda1) - email: charlesotonda@gmail.com
