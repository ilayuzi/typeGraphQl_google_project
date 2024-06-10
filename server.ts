import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { config } from 'dotenv';
import { google } from 'googleapis';
import "reflect-metadata";
import { ContactResolver } from './src/services/contacts/contactsResolvers';
import { CalendarResolver } from './src/services/calendar/calendarResolvers';
import mercurius from 'mercurius'
import { buildSchema } from 'type-graphql';

config()

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI; // The URI where Google will redirect the user after they grant or deny permission. This URI must be registered in the Google Cloud Console.

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const buildGraphQLSchema = async () => {
  const schema = await buildSchema({
      resolvers: [ContactResolver, CalendarResolver],
      validate: false,

  });
  return schema;
};

// Fastify instance
const app: FastifyInstance =  fastify() // require('fastify')({ logger: true });

// Route to initiate OAuth 2.0 flow
app.get('/auth', async (request: FastifyRequest, reply: FastifyReply) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/contacts.readonly'],
    });
    reply.redirect(authUrl);
});

// This route handles the callback from Google after the user authorizes the application.
app.get('/oauth2callback', async (request: FastifyRequest, reply: FastifyReply) => {
  try{  
    const query = request.query as any; // Cast request.query to any to handle the type issue
    const code = query.code as string; // The authorization code returned by Google in the query string.
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens); // Sets the obtained tokens on the OAuth2Client instance for making authenticated requests.
    reply.redirect("http://localhost:3000/graphiql"); // Redirects to the GraphiQL interface after successful authentication.
  }
  catch (error){
      app.log.error(error);
      reply.status(500).send('Authentication failed');
    }

});


// Register Mercurius with Fastify
buildGraphQLSchema().then(schema => {
  app.register(mercurius, {
    schema: schema,
    context: () => ({ oAuth2Client }),
    graphiql: true // Enables the GraphiQL interface for testing GraphQL queries.
  });
});


// Start the server
app.listen({ port: 3000, host: '127.0.0.1' }, (err, address) => {
  if (err) {
      app.log.error(err);
      process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});

