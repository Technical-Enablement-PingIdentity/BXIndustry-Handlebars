import fs from 'fs';
import crypto from 'crypto';

let verticals;

/**
 * Returns an object with all whitelisted (within this function) environment variables that can be used 
 * in handlebars template {{env.<variable-name}} or front-end window._env_['<variable-name>']
 * 
 * @returns Object with environment variables in { [key]: value }
 */
function getBxiEnvironmentVariables() {
    const bxiEnvVars = {};

    // These will be available in the front end on window._env_[<variable-name>]
    const whitelist = [
        // 'BXI_API_URL', // Uncomment if needed
        // 'BXI_API_KEY', // Uncomment if needed (not recommended for security reasons)
        // 'BXI_COMPANY_ID', // Uncomment if needed (not recommended for security reasons)
        'BXI_DV_JS_URL', 
        'BXI_LOGIN_POLICY_ID',
        'BXI_REGISTRATION_POLICY_ID',
        'BXI_DASHBOARD_POLICY_ID',
        'BXI_GENERIC_POLICY_ID',
        'BXI_REMIX_POLICY_ID',
        'BXI_SHOW_REMIX_BUTTON',
        'BXI_GLITCH_REMIX_PROJECT',
        'BXI_DEBUG_LOGGING',
    ];

    Object.keys(process.env).forEach(env => { 
        if (whitelist.includes(env)) {
            bxiEnvVars[env] = process.env[env];
        }
    });

    if (bxiEnvVars['BXI_SHOW_REMIX_BUTTON'] !== 'true') {
        // Handlebars apparently doesn't process booleans in if helpers,
        // if we delete the variable the remix button will not be displayed.
        delete bxiEnvVars['BXI_SHOW_REMIX_BUTTON'];
    }

    return bxiEnvVars;
}

/**
 * Returns a list of all verticals build based on directories in src/pages, this is cached
 * if adding a new vertical server.js needs to be restarted, this should be uncommon
 * 
 * @returns List of all verticals
 */
function getVerticals() {
    if (verticals) {
        return verticals;
    }

    verticals = fs.readdirSync('src/pages', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    return verticals;
}

function isValidVertical(vertical) {
    return getVerticals().includes(vertical);
}

/**
 * Returns a file at the provided location, but calculates the file's sha1 and adds it as url
 * parameter to bust caching, used so if user makes changes to the file the new file will picked up
 * without restarting server
 * 
 * @param {string} fileLocation 
 * @returns {Promise} - file that has been imported
 */
function importWithCacheBusting(fileLocation) {
    const fileBuffer = fs.readFileSync(fileLocation);
    const fileHash = crypto.createHash('sha1');
    fileHash.update(fileBuffer);

    return import(`${fileLocation}?sha1=${fileHash.digest('base64')}`);
}

/**
 * Get a vertical's settings.json file, if we can ever use import for this, make sure to use
 * cache busting above or user's changes won't be picked up without restarting the server
 * 
 * @param {string} vertical
 * @returns 
 */
function getSettingsFile(vertical) {
    const settingsFile = `./src/pages/${vertical}/settings.json`;
  
    // Generic vertical doesn't have a settings file (or an admin page, so don't care about username)
    if (fs.existsSync(settingsFile)) {
       return JSON.parse(fs.readFileSync(settingsFile));
    }

    return {};
}

export default {
    getBxiEnvironmentVariables: getBxiEnvironmentVariables,
    getVerticals: getVerticals,
    isValidVertical: isValidVertical,
    importWithCacheBusting: importWithCacheBusting,
    getSettingsFile: getSettingsFile,
}