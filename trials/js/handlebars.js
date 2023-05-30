import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import deepmerge from 'deepmerge';
import { getPartialsFromDirectory, initHandlebarsHelpers } from '../../resources/handlebars.js';
import { htmlManipulations } from '../html-manipulations.js';

export function compileHandlebars({bxiRepoBasePath, testBuild, verticals, destinationFolder}) {
  console.info('Compiling handlebars templates...');
  registerPartials(bxiRepoBasePath, testBuild);
  registerBrandingPartials(verticals, bxiRepoBasePath);
  initHandlebarsHelpers(Handlebars, bxiRepoBasePath);

  console.info('All partials registered');

  verticals.forEach(vertical => {
    registerVerticalPartials(vertical);

    console.info('Generating html files for ' + vertical);
    const indexTemplateStr = fs.readFileSync(path.join(bxiRepoBasePath, `src/pages/${vertical}/index.hbs`)).toString('utf8');
    const dashboardTemplateStr = fs.readFileSync(path.join(bxiRepoBasePath, `src/pages/${vertical}/dashboard.hbs`)).toString('utf8');

    const indexTemplate = Handlebars.compile(indexTemplateStr);
    const dashboardTemplate = Handlebars.compile(dashboardTemplateStr);

    const verticalSettings = JSON.parse(fs.readFileSync(path.join(bxiRepoBasePath, `src/pages/${vertical}/settings.json`)));
    const verticalOverrides = JSON.parse(fs.readFileSync(`settings/${vertical}.json`));

    // Merge overrides onto vertical settings for CTA buttons, image locations, etc
    // Ensure arrays in trials settings override the default bxi arrays rather than concating them 
    const viewData = deepmerge(verticalSettings, verticalOverrides, { arrayMerge: (_, overrideArray) => overrideArray });

    let indexCompiled = indexTemplate(viewData);
    let dashboardCompiled = dashboardTemplate(viewData);

    // No function registry in trials, so preventing js errors from these calls
    indexCompiled = htmlManipulations(indexCompiled); //.replace('onload="bxi.pageLoad()" ', '');
    dashboardCompiled = htmlManipulations(dashboardCompiled); //.replace('onload="bxi.pageLoad()" ', '');

    const indexFile = `${destinationFolder}/${vertical}/index.html`;
    fs.writeFileSync(indexFile, indexCompiled);
    console.info(`Successfully created ${vertical} home page ${indexFile}`);

    const dashboardFile = `${destinationFolder}/${vertical}/dashboard.html`;
    fs.writeFileSync(dashboardFile, dashboardCompiled);
    console.info(`Successfully created ${vertical} dashboard page ${dashboardFile}`);
  });
}

function registerPartials(bxiRepoPath, testBuild) {
  console.info('Registering handlebars partials');
  // variables contains .env variables, not relevant for trials
  Handlebars.registerPartial('variables', '');
  
  // modal contains modal and bxi-davinci.js loading, not relevant for trials
  Handlebars.registerPartial('modal', '');

  // remix contains verticals shortcut icon and remix button, needs to be removed for trials
  Handlebars.registerPartial('remix', '');

  let headTemplate = '{{> @partial-block}}';

  // Test build adds stylesheet into templates for easier testing (trials pulls this file in via React)
  if (testBuild) {
    headTemplate += '\n<link rel="stylesheet" href="styles.css" />\n';
  }

  // head needs to pass through the branding partial declared on each page
  Handlebars.registerPartial('head', headTemplate);

  console.info('Static partials registered, registering icons');

  const iconPartials = getPartialsFromDirectory(path.join(bxiRepoPath, 'src/partials/icons'), 'Icon');
  for (let key in iconPartials) {
    Handlebars.registerPartial(key, fs.readFileSync(iconPartials[key]).toString('utf8'));
    console.info(`Icon partial registered: ${key} from ${iconPartials[key]}`);
  }
}

function registerBrandingPartials(verticals, bxiRepoPath) {
  verticals.forEach(vertical => {
    const partialName = `${vertical}Branding`;
    const partialPath = path.join(bxiRepoPath, `src/pages/${vertical}/branding.hbs`);
    Handlebars.registerPartial(partialName, fs.readFileSync(partialPath).toString('utf8'));

    console.info(`Branding partial registered: ${partialName} from ${partialPath}`);
  });
}

function registerVerticalPartials(vertical) {
  Handlebars.unregisterPartial('homeNavButtons');
  Handlebars.unregisterPartial('dashboardButtons');

  const verticalHomeFile = `./partials/${vertical}/home-buttons.hbs`;
  const verticalDashboardFile = `./partials/${vertical}/dashboard-buttons.hbs`;

  if (fs.existsSync(verticalHomeFile)) {
    Handlebars.registerPartial('homeNavButtons', fs.readFileSync(verticalHomeFile).toString('utf8'));
  } else {
    Handlebars.registerPartial('homeNavButtons', fs.readFileSync('./partials/home-buttons.hbs').toString('utf8'));
  }

  if (fs.existsSync(verticalDashboardFile)) {
    Handlebars.registerPartial('dashboardButtons', fs.readFileSync(verticalDashboardFile).toString('utf8'));
  } else {
    Handlebars.registerPartial('dashboardButtons', fs.readFileSync('./partials/dashboard-buttons.hbs').toString('utf8'));
  }
}