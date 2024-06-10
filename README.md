# typeGraphQl_google_project

### Task: Integrating Google APIs with Backend Authentication and Data Fetching

Develop a GraphQL Federation architecture that interfaces with Google APIs. This backend system should authenticate using Google tokens and fetch user data from Google Calendar and Google People APIs.

#### Technologies:

* Node.js, TypeScript, Fastify, Mercurius, JWT, Google OAuth 2.0.

#### Task Description:

1. Setup and Configuration

    * Initialize a Node.js project with TypeScript and install all the necessary dependencies.

    * Register your application with Google Cloud Console .

2. Authentication Token Retrieval (Hint)

    * Utilize the Google OAuth 2.0 Playground or a similar tool to obtain an access token for testing purposes. This token will be used to simulate an authenticated user in backend requests.

3. Backend Token Validation

    * Implement a mechanism in your backend to validate the Google access token. Use Google's token info endpoint or a library to check the token's validity when received in API requests.

4. Fetching Data from Google APIs

    * Create two subgraphs in your GraphQL service: one for Google Calendar API and another for Google People API.

    * Ensure the service can request and receive data from Google APIs using the validated access tokens.

5. Schema Federation and Gateway Setup

    * Define GraphQL schemas for your services, federate them, and set up a unified gateway with Mercurius.

6. Sequence Diagram Requirement

    * Provide sequence diagrams for the following flows:

    * Obtaining and validating the Google access token.

    * Backend service interactions with Google Calendar and Google People APIs.

#### Deliverables:

  * Source code for the services and gateway setup.

* Documentation with setup instructions, usage examples, and sequence diagrams for both authentication and API data fetching flows.

### instructions to run the code
create .env file with the variables: ACCESS_TOKEN, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI.
you should copy these variables from google console cloud.

use npm install 

use npm run
