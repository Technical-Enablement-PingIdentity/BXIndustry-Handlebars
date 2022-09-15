import handlebars from 'handlebars';
import fs from 'fs';
import helpers from './helpers.js';

export function initHandlebars(fastify) {
    initHandlebarsHelpers(handlebars);

    // View is a templating manager for fastify
    fastify.register(import('@fastify/view'), {
        engine: {
          handlebars: handlebars,
        },
        options: {
            partials: {
                homeNavButtons: 'src/home-nav-buttons.hbs',
                dashboardButtons: 'src/dashboard-buttons.hbs',
                ...getBrandingPartials(),
                ...getPartialsFromDirectory('src/partials'),
                ...getPartialsFromDirectory('src/partials/icons', 'Icon'),
                ...getPartialsFromDirectory('src/templates', 'Template')
            }
        }
    });
}

/**
 * Register Handlebars helper functions
 * 
 * @param {object} hbs Imported handlebars instance, this needs to be passed because it is used for trials compilation
 */
export function initHandlebarsHelpers(hbs) {
    // Used in company vertical, turns 1 into 01, should handle double digit numbers as well!
    hbs.registerHelper('indexBullet', (value, _) => {
        return `0${(parseInt(value) + 1)}`.slice(-2);
    });

    // If first value is truthy, return that otherwise return default value, used for e.g., setting default fill on icons 
    hbs.registerHelper('valueOrDefault', (value, defaultValue) => {
        return new hbs.SafeString(value || defaultValue);
    });

    hbs.registerHelper('assignParameter', (varName, varValue, options) => {
        if (!options.data.root) {
            options.data.root = {};
        }

        options.data.root[varName] = varValue;
    });
}

/**
 * Gets all partials from a directory and names the partials based on kebab-file-name-case -> camelCase + suffix
 * 
 * e.g., sign-in-email-otp.hbs -> signInEmailOtp<suffix>
 * 
 * @param {string} directory directory to search for .hbs partials
 * @param {string} suffix suffix to use when naming partials
 * @returns Object with key value pairs of partials { [partialName]: '<file-location>' }
 */
export function getPartialsFromDirectory(directory, suffix = '') {
    return fs.readdirSync(directory)
        .reduce((acc, file) => 
            (file.endsWith('.hbs') ? { ...acc,  [`${file.replace('.hbs', '').replace(/-./g, x => x[1].toUpperCase())}${suffix}`]: `${directory}/${file}`} : acc), {});
}

/**
 * 
 * @returns object containing branding partials { ['<vertical>Branding']: '<file-location>'}
 */
function getBrandingPartials() {
    // Generic does not have branding and is filtered out
    return helpers.getVerticals().filter(vertical => vertical !== 'generic').reduce((acc, vertical) => {
       return { ...acc, [`${vertical}Branding`]: `src/pages/${vertical}/branding.hbs` };
    }, {});
}