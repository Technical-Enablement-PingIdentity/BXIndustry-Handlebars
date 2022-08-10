import handlebars from 'handlebars';
import fs from 'fs';

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
                ...getPartialsFromDirectory('src/partials'),
                ...getPartialsFromDirectory('src/partials/icons', 'Icon'),
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
            (file.endsWith('.hbs') ? { ...acc,  [`${file.replace('.hbs', '')}${suffix}`]: `${directory}/${file}`} : acc), {});
}