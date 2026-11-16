# BXIndustry-Handlebars
Bugbounty POC by @nvk0x

# Installation<a name="installation"></a>

Since Glitch announced it was shutting down in July 2025 normal usage includes running it locally. We recommend setting up the project through the cloning button on the main production site for easy `.env` setup.

## Local Set Up<a name="local-set-up"></a>

Required software:

- Git (Recommended, alternatively you can download the repository zip file)
- NodeJS (see `.nvmrc` at the root of the project for the officially supported version, other versions may work fine)
- Code Editor (such as Visual Studio Code)

```sh
git clone git@github.com:Technical-Enablement-PingIdentity/BXIndustry-Handlebars.git # or download the zip file from the repository and unzip it to the location of your choosing
cd BXIndustry-Handlebars
npm install
# Generate .env file
npm run dev
```

Once you have downloaded the repo, create a `.env` file in the root of the repo and copy the contents of textarea on the final screen of the cloning flow. Alternatively you can use `.env-oidc` or `.env-widget` as a starting point and update the values as need to point to your PingOne environment.
