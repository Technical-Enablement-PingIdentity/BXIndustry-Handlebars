/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

// Bring in .env file (happens automatically in glitch but not when running locally)
import 'dotenv/config';

// NodeJS imports
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

// External libraries
import Fastify from 'fastify';
import fetch from 'node-fetch';

// Internal js files
import helpers from './resources/helpers.js';
import { initHandlebars } from './resources/handlebars.js';

// Initialize variables that are no longer available by default in Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize internal variables
const bxiEnvVars = helpers.getBxiEnvironmentVariables();
const verticals = helpers.getVerticals();

// Require the fastify framework and instantiate it
const fastify = Fastify({
  // Set this to true for detailed logging
  logger: false,
});

// Setup our static files (images and SCSS)
fastify.register(import('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});
 
initHandlebars(fastify);

/**
 * Our home page route
 *
 * Redirects to the default vertical (if set in environment variables) or falls back on company
 */
fastify.get('/', function (_, reply) {
  const defaultVertical = process.env.BXI_ACTIVE_VERTICAL;
  reply.redirect(`/${helpers.isValidVertical(defaultVertical) ? defaultVertical : 'company'}`);
});

fastify.get('/.well-known/security.txt', function (_, reply) {
  reply.redirect(`http://www.pingidentity.com/.well-known/security.txt`);
});

fastify.get('/dvtoken', async function (request, reply) {
  // Allow for apiKey and companyId overrides to come from front end, even though it's not encouraged
  const apiKey = request?.query.apiKey || process.env.BXI_API_KEY;
  const companyId = request?.query.companyId || process.env.BXI_COMPANY_ID;

  const dvBaseUrl = `${process.env.BXI_API_URL}/`;
  const dvSdkTokenBaseUrl = `${process.env.BXI_SDK_TOKEN_URL}/v1`;

  const tokenRequest = {
    method: 'GET',
    headers: {
      'X-SK-API-KEY': apiKey // Header key is case sensative in DaVinci V2
    }
  };

  const tokenResponse = await fetch(`${dvSdkTokenBaseUrl}/company/${companyId}/sdktoken`, tokenRequest); // Endpoint is case sensitive in Davinci V2
  const parsedResponse = await tokenResponse.json();

  if (!parsedResponse.success) {
    console.error('An error Occured');
    console.error('Parsed Response', parsedResponse);
    console.error('Raw', tokenResponse);
    return reply.code(500).send({error: `An error occured getting DaVinci token. See Glitch server logs for more details, code: ${parsedResponse.httpResponseCode}, message: '${parsedResponse.message}'.`});
  }

  reply.send({
    token: parsedResponse.access_token,
    companyId: companyId,
    apiRoot: dvBaseUrl
  });
});

fastify.get('/verticals', (_, reply) => {
  return reply.view('src/pages/verticals.hbs', verticals.map(vertical => {
    const settings = helpers.getSettingsFile(vertical).settings;
    return { 
      name: settings.title, 
      logo: settings.images.dialog_logo || settings.images.logo,
      home: `/${vertical}`,
      dashboard: vertical !== 'generic' ? `/${vertical}/dashboard` : '',
      dialogExamples: vertical !== 'generic'? `/${vertical}/dialog-examples` : '',
    };
  }));
});

verticals.forEach(vertical => {
  // Vertical Home Page
  fastify.get(`/${vertical}`, async function (_, reply) {
    return reply.view(`src/pages/${vertical}/index.hbs`, await getViewParams(vertical));
  });

  // Vertical Dashboard Page
  fastify.get(`/${vertical}/dashboard`, async function (request, reply) {
    return reply.view(`src/pages/${vertical}/dashboard.hbs`, await getViewParams(vertical, request.query));
  });

  // Redirect old /admin urls to dashboard
  fastify.get(`/${vertical}/admin`, function (_, reply) {
    reply.redirect(`/${vertical}/dashboard`);
  });
});

// Redirect 404s to base url rather than throwing errors
fastify.setNotFoundHandler((_, reply) => {
  reply.redirect('/');
});

async function getViewParams(vertical, queryParams) {
  let params = helpers.getSettingsFile(vertical);

  // Grab username out of URL parameters if it's present
  // we only care about it if it's used on a dashboard page
  if (queryParams?.username && params?.settings?.dashboard) {
    params.settings.dashboard.username = queryParams.username
  }

  params.env = bxiEnvVars;
  return params;
}

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT || 5000, host: '0.0.0.0' },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }

    console.log(`Your app is listening on ${address}`);
    fastify.log.info(`server listening on ${address}`);
  }
);