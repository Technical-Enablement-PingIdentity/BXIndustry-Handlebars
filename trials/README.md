# Introduction

This directory contains the code we use to generate static assets for use in PingOne for trials. It copies the following from the BXIndustry-Handlebars (bxi) repository into a directory defined when running the `compile.js` file.

- Images and any other static content contained in `public/<vertical>` from the bxi repo
- Compiled SCSS from bxi repo and Bootstrap 5.2 scoped to `.bxi` (see `scoped-bootstrap.scss`)
- Compiled handlebars template for index and dashboard in `src/pages/<vertical>` from the bxi repo

# Usage

In a terminal, navigate to this project's location (e.g., from the root of BXIndustry-Handlebars `cd trials`). Then run:
1. `npm install`
2. `npm run build`

The resulting dist folder can be zipped and provided to trials team, or checked into the Gitlab repo we're using.

# Notes

Before porting all verticals into BXIndustry-Handlebars is complete, it will likely be necessary to add some configuration in this folder. 

## Settings overrides

Hopefully, any overrides necessary to generate the static HTML files for trials can be done through a `<vertical>.json` file in the `settings` folder. This JSON file is merged on top of the default vertical `settings.json` file from the bxi repo during Handlebars compilation, so CTA buttons can be cleared, image locations can be modified and any other necessesary changes can be made. **Note: arrays in these settings override files will completely override arrays in the bxi settings.json file, they won't be concatinated.**

## SCSS overrides

Generally speaking we should be keeping as much styling as possible in the main BXI repository. However background-images MUST be in CSS and need to be vertical specific to prevent bundles from blowing up on the P1 side. This could technically be used later on if tweaks in BXI to get around ui-library are getting out of hand, but at this time it's not recommended.

## DaVinci buttons

Trials has different default buttons than bxi, these are located in this folder under partials.

## Advanced usage

Should it become necessary in the future to customize the BXIndustry-Handlebars repo location or the distributable output location, you can change those locations in the `package.json` file in the build script or just run the `compile.js` file manually. Syntax would be `node compile.js --bxiRepoPath '<bxi-repo-location>' --outputPath './<output-dir>'`.

## Other notes

This folder has a couple js import dependencies on the base bxi repo, see `js/handlebars.js`. Basically it uses shared functions with bxi to set up icon partials and necessary helpers, keeping the logic for those registrations in one place.

Most of the information necessary for which verticals need to be compiled is gleaned from the directories in `src/pages` (minus generic). This should allow everything to just work when we add new verticals aside from `settings.json` overrides mentioned previously.