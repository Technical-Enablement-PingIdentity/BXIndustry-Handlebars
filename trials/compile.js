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
const destinationFolder = path.join(__dirname, args.outputPath || '');

// Create dist folder if it's absent
if (fs.existsSync(destinationFolder)) {
  fs.rmSync(destinationFolder, { recursive: true });
}

fs.mkdirSync(destinationFolder);

// Get list of verticals dynamically, based on folders in src/pages
const verticals = fs.readdirSync(path.join(bxiRepoBasePath, 'src/pages'), { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && dirent.name !== 'generic') // don't care about generic for trials
  .map(dirent => dirent.name);

copyStaticAssets(verticals, bxiRepoBasePath, destinationFolder);
compileStyles(verticals, bxiRepoBasePath, destinationFolder);
compileHandlebars(verticals, bxiRepoBasePath, destinationFolder);

// Move stuff around into the structure we need to push to Gitlab e.g., bx<bxvertical>App/<vertical>/
verticals.forEach(vertical => {
  const newDir = `${destinationFolder}/bx${vertical}App`;

  fs.mkdirSync(newDir);
  fs.renameSync(`${destinationFolder}/${vertical}/styles.css`, `${newDir}/styles.css`);
  fs.renameSync(`${destinationFolder}/${vertical}`, `${newDir}/${vertical}`);
});