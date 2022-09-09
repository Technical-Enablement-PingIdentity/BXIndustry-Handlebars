/**
 * Used to generate static bundle to give to trials team, it will handle removing/replacing a couple
 * partials and using alternative settings.json files for removing call to action buttons, remix form,
 * modal (since trials team is using a different method of launch flows) and alternative image locations.
 * 
 * In terminal navigate to this folder and run `node run build`
 */

import fs from 'fs';
import minimist from 'minimist';
import path from 'path';
import { fileURLToPath } from 'url';

import { copyStaticAssets } from './js/assets.js';
import { compileStyles } from './js/styles.js';
import { compileHandlebars } from './js/handlebars.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get bxi repo path and destination folder from command line arguments
const args = minimist(process.argv.slice(2));
const bxiRepoBasePath = args.bxiRepoPath || '';

const config = {
  bxiRepoBasePath: args.bxiRepoPath || '',
  destinationFolder: path.join(__dirname, args.outputPath || ''),
  testBuild: args.testBuild === 'true' || false
};

// Create dist folder if it's absent
if (fs.existsSync(config.destinationFolder)) {
  fs.rmSync(config.destinationFolder, { recursive: true });
}

fs.mkdirSync(config.destinationFolder);

// Get list of verticals dynamically, based on folders in src/pages
config.verticals = fs.readdirSync(path.join(bxiRepoBasePath, 'src/pages'), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== 'generic') // don't care about generic for trials
  .map(dirent => dirent.name);

copyStaticAssets(config);
compileStyles(config);
compileHandlebars(config);

// Move stuff around into the structure we need to push to Gitlab e.g., bx<bxvertical>App/<vertical>/
config.verticals.forEach(vertical => {
  fs.renameSync(`${config.destinationFolder}/${vertical}`, `${config.destinationFolder}/bx${vertical}App`);
});