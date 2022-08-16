import handlebars from 'handlebars';
import fs from 'fs';
import helpers from './helpers.js';

export function initHandlebars(fastify) {
    handlebars.registerHelper('indexBullet', (value, _) => {
        return `0${(parseInt(value) + 1)}`;
    });

    handlebars.registerHelper('valueOrDefault', (value, defaultValue) => {
        return new handlebars.SafeString(value || defaultValue);
    });

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
 * 
 * @param {string} directory directory to search for .hbs partials
 * @param {string} suffix suffix to use when naming partials
 * @returns Object with key value pairs of partials { [partialName]: '<file-location>' }
 */
function getPartialsFromDirectory(directory, suffix = '') {
    return fs.readdirSync(directory)
        .reduce((acc, file) => 
            (file.endsWith('.hbs') ? { ...acc,  [`${file.replace('.hbs', '').replace(/-./g, x => x[1].toUpperCase())}${suffix}`]: `${directory}/${file}`} : acc), {});
}

function getBrandingPartials() {
    // Generic does not have branding and is filtered out
    return helpers.getVerticals().filter(vertical => vertical !== 'generic').reduce((acc, vertical) => {
       return { ...acc, [`${vertical}Branding`]: `src/pages/${vertical}/branding.hbs` };
    }, {});
}