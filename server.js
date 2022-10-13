/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

// Bring in .env file (happens automatically in glitch but not when running locally)
import 'dotenv/config';

// NodeJS imports
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// External libraries
import Fastify from 'fastify';
import fetch from 'node-fetch';

// Internal js files
import helpers from './resources/helpers.js';
import { initHandlebars } from './resources/handlebars.js';
import Logger from './public/js/logger.js';

// Initialize variables that are no longer available by default in Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize internal variables
const bxiEnvVars = helpers.getBxiEnvironmentVariables();
const verticals = helpers.getVerticals();

const debug = process.env.BXI_DEBUG_LOGGING === 'true';

const logger = new Logger(debug);

// Require the fastify framework and instantiate it
const fastify = Fastify({
  // Set this to true for detailed logging
  logger: debug,
  ignoreTrailingSlash: true
});

// Setup our static files (images and SCSS)
fastify.register(import('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});
 
initHandlebars(fastify);

// Our home page route
// Redirects to the default vertical (if set in environment variables) or falls back on generic
fastify.get('/', function (_, reply) {
  const defaultVertical = process.env.BXI_ACTIVE_VERTICAL;
  const redirectVertical = helpers.isValidVertical(defaultVertical) ? defaultVertical : 'generic';

  logger.log(`Root hit, defined default vertical is: '${defaultVertical}' redirecting to: '${redirectVertical}'`);
  reply.redirect(`/${redirectVertical}`);
});

fastify.get('/.well-known/security.txt', function (_, reply) {
  logger.log(`/.well-known/securtiy.txt was hit, redirecting ping identity's version`);
  reply.redirect(`http://www.pingidentity.com/.well-known/security.txt`);
});

// Get a dv token from the server, we do this in server.js as a security best practice so 
// API Keys don't need to be exposed on the front-end
fastify.get('/dvtoken', async function (request, reply) {
  // Allow for apiKey and companyId overrides to come from front end, even though it's not encouraged
  const apiKey = request?.query.apiKey || process.env.BXI_API_KEY;
  const companyId = request?.query.companyId || process.env.BXI_COMPANY_ID;

  const dvBaseUrl = `${process.env.BXI_API_URL}/`;
  const dvSdkTokenBaseUrl = `${process.env.BXI_SDK_TOKEN_URL}/v1`;

  const tokenRequest = {
    method: 'GET',
    headers: {
      'X-SK-API-KEY': apiKey
    }
  };

  const tokenResponse = await fetch(`${dvSdkTokenBaseUrl}/company/${companyId}/sdktoken`, tokenRequest); // Endpoint is case sensitive in Davinci V2
  const parsedResponse = await tokenResponse.json();

  if (!parsedResponse.success) {
    logger.error('An error Occured');
    logger.error('Parsed Response', parsedResponse);
    logger.error('Raw', tokenResponse);
    return reply.code(500).send({error: `An error occured getting DaVinci token. See Glitch server logs for more details, code: ${parsedResponse.httpResponseCode}, message: '${parsedResponse.message}'.`});
  }

  logger.log('Successfully retreived sdktoken for DaVinci', parsedResponse);

  reply.send({
    token: parsedResponse.access_token,
    companyId: companyId,
    apiRoot: dvBaseUrl
  });
});

fastify.get('/docs', (request, reply) => {
  const vertical = request.query.vertical || 'company';
  const icons = fs.readdirSync('src/partials/icons').map(file => file.replace('.hbs', ''));
  return reply.view('src/docs/index.hbs', {
    selectedVertical: vertical,
    verticals: verticals,
    brandingPartial: () => `${vertical}Branding`,
    icons: icons.map(icon => ({ icon: icon, partial: icon + 'Icon'}))
  });
});

// Set up shortcuts endpoints, shows all verticals with applicable links
fastify.get('/shortcuts', (_, reply) => {
  const viewParams = verticals.map(vertical => {
    const settings = helpers.getSettingsFile(vertical).settings;
    return { 
      name: settings.title, 
      logo: settings.images.dialog_logo || settings.images.logo,
      home: `/${vertical}`,
      dashboard: vertical !== 'generic' ? `/${vertical}/dashboard` : '',
      dialogExamples: vertical !== 'generic'? `/${vertical}/dialog-examples` : '',
    };
  });

  logger.log('/shortcuts endpoint hit, sending view data', viewParams);
  return reply.view('src/pages/shortcuts.hbs', viewParams);
});

// Generic does not have dashboard or dialog-examples page
helpers.getVerticals().forEach(vertical => {
  // Vertical Home Page
  fastify.get(`/${vertical}`, function (_, reply) {
    const viewParams = getViewParams(vertical);
    logger.log(`/${vertical} hit, sending home page view data`, viewParams);
    return reply.view(`src/pages/${vertical}/index.hbs`, viewParams);
  });

  // Generic does not have dashboard or dialog examples pages
  if (vertical === 'generic') {
    return;
  }

  // Vertical Dashboard Page
  fastify.get(`/${vertical}/dashboard`, function (_, reply) {
    const viewParams = getViewParams(vertical);
    logger.log(`/${vertical}/dashboard hit, sending dashboard page view data`, viewParams);
    return reply.view(`src/pages/${vertical}/dashboard.hbs`, viewParams);
  });

  // Vertical Dialog Examples Page
  fastify.get(`/${vertical}/dialog-examples`, function (_, reply) {
    const settings = helpers.getSettingsFile(vertical).settings;
    const viewParams = { 
      vertical, 
      brandingPartial: () => `${vertical}Branding`,
      dialogLogo: settings.images.dialog_logo,
      favicon: settings.images.favicon || '/generic/favicon.ico',
      appleTouchIcon: settings.images.apple_touch_icon || '/generic/apple-touch-icon.png',
    };
    logger.log(`/${vertical}/dialog-examples hit, sending view data`, viewParams);
    return reply.view(`src/pages/dialog-examples.hbs`, viewParams);
  });

  // Redirect old /admin urls to dashboard
  fastify.get(`/${vertical}/admin`, function (_, reply) {
    logger.log(`/${vertical}/admin hit, redirecting to dashboard instead`)
    reply.redirect(`/${vertical}/dashboard`);
  });
});

// Just in case /generic/dashboard is hit, redirect to generic
fastify.get('/generic/dashboard', (_, reply) => {
  logger.log(`/generic/dashboard hit, redirecting to /generic since this doesn't exist`);
  reply.redirect('/generic');
});

// Redirect 404s to base url rather than throwing errors
fastify.setNotFoundHandler((_, reply) => {
  logger.log('Invalid url, redirecting to root');
  reply.redirect('/');
});

// Combine settings.json with environment parameters to be passed to handlebars templates/front-end
// Please note .env parameters are manually whitelisted in resources/handlebars.js for security reasons
function getViewParams(vertical) {
  let params = helpers.getSettingsFile(vertical);
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
