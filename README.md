# Introduction

BXIndustry (permenant url TBD) is a unique demo in that it allows demo-ers to bootstrap DaVinci demonstrations! It allows demo-ers to tailor the skins to highlight a number of DaVinci flows that they have developed or will be developing. There are many different industry verticals which can be cloned and adapted on Glitch to tailor to your prospect or customer for a more personalized demo in the field. 
 
The following verticals are available in Glitch for you to remix:
1. [Company](<tbd>/company)

With BXIndustry, you can choose a vertical you would like to use, build your workflows and forms in DaVinci, and update the settings.json file to change page content such as text and images. HTML templates are available for different modal forms for use in DaVinci (e.g., **src/components/AuthDialogExamples**).

**Note: Flows are now customized in BXI via HTML data attributes for simplicity, please see the documentation on bxi-davinci.js for more information.**

# Getting Started

## Environment

To start with BXIndustry, you must have the following .env variables:

```sh
BXI_API_KEY=
BXI_API_URL=
BXI_SDK_TOKEN_URL=
BXI_DV_JS_URL=
BXI_COMPANY_ID=
BXI_LOGIN_POLICY_ID=
BXI_REGISTRATION_POLICY_ID=
BXI_DASHBOARD_POLICY_ID=
BXI_ACTIVE_VERTICAL=
BXI_REMIX_POLICY_ID=
```

**Note: changing environment variables will cause your project to restart**

## Installation

You can stick to just running your project in glitch if you'd like! However, you can also run the project locally. To do so, clone the repo to your computer by navigating to the glitch project, clicking Tools > Import / Export, and copying your projects Git URL. To do this you will need Git, NodeJS and a code editor installed on your laptop. The current recommended node version is 16.14.2. 

If everything mentioned above is set up on your computer run the following:

```sh
git clone <git-url>
cd <glitch-project-name>
npm install
npm run start
```

Once you have downloaded the repo, make sure you have an `.env` file in the root of the repo and copy the contents of the same file from the Glitch interface into that file.

**Note: if you would like to push changes you make on your computer back up to Glitch you will need to follow this article**
[Push Code to Glitch](https://glitch.happyfox.com/kb/article/85-how-do-i-push-code-that-i-created-locally-to-my-project-on-glitch/)

## Standard Flows (New with v2.5)

BXIndustry now comes with standard authentication and registration flows!

Registration will ask for a valid email and password. Successful completion of registration will register the user into our PingOne environment, enable MFA for the user, and enroll the provided email as an MFA device.

Authentication will ask for the previously registered email and password, then prompt the user to complete MFA with the enrolled PingOne MFA email device. Successful completion of authentication will land the user on the /dashboard page of the vertical they are on and display their username.

## Remixing

To remix BXIndustry, scroll to the bottom of the page on any vertical and click the **Remix on Glitch** button.
During the remixing process, you can modify all DaVinci API values or leave them as-is to use the default settings.

**Note: The remix form will pre-populate the default authentication and registration flows. These values can be modified to import your own custom flows or leave them as-is to use the default settings.**

The default vertical should be one value from the list:

- company


## An (IMPORTANT!!) Note on Versioning

We recommend making as many changes in DaVinci workflows as you can because there is no easy upgrade path to new BXI versions in your existing remixes when we release new features and bug fixes. Furthur customizations to BXI can typically be done in a small subset of files to make porting to new remixes easier.

Notable files for customizations include:
- `src/pages/<vertical>/settings.json` - Simple content changes may be made in this file
- `src/pages/<vertical>/index.hbs` - root page of your vertical (e.g. <hostname>/company), contains home page HTML and CSS variables used for branding
- `src/pages/<vertical>/dashboard.hbs` - dashboard page for your vertical (e.g. <hostname>/company/dashboard), contains dashboard HTML and CSS variables used for branding
- `src/pages/<vertical>/customizations.scss` - SCSS file where you can make CSS customizations beyond simple branding/content changes
- `public/register-functions.js` - register callback functions that can be run during various stages of flow execution (see bxi-davinci.js for more information)
- `src/home-nav-buttons.hbs` - collection of buttons displayed in the top nav of each vertical, by default these are hooked up to flow policies defined in your .env file
- `src/dashboard-buttons.hbs` - collection of buttons displayed in the top of the dashboard content section of each vertical, there are no defaults, however examples have been left commented out in the file for reference

## Another (IMPORTANT!!) Note on CSS

We recommend that you try to stick with the default templates provided in the dialog examples noted below when putting HTML
in DaVinci. It is not recommended to import CSS libraries or do other extensive styling in DaVinci because those
styles can bleed out of your flows to the entire BXIndustry site when a flow is loaded. 

If you must apply custom styles please try to scope them via specific IDs (`#element-id {...}`) or classes (`.element-class {...}`) to prevent your styles from affecting your site.

**Note: bootstrap 5.2 is now used in BXIndustry! So you may use any of the css classes available in bootstrap in your flows. See the [Bootstrap Documentation](https://getbootstrap.com/docs/5.2/layout/grid/) for more information.**

## Switching the Verticals
**Note: not included yet**
Use the gear icon in the bottom right corner to open the “shortcut” page for all the verticals.

## HTML Templates for DaVinci
**Note: not included yet**
HTML templates are available for different modal forms (e.g., src/components/AuthDialogExamples).

To see the preview, add  **/dialog_examples** to the vertical url.
For example:
- [/manufacturing/dialog_examples][BXMde]
- [/airlines/dialog_examples][BXAde]
- ...


## Vertical Settings

Each vertical has an independent **settings.json** file.
For example:
- src/pages/airlines/settings.json
- src/pages/education/settings.json
- ...

Settings files provide the ability to make quick changes for vertical text and images.

`"title": "BXManufacturing"` - This is the project name which displays in the head of the page.

Color and other branding options are now located at the top of each index/dashboard page.

```css
    <style>
      :root {
        --primary-color: #A71E23;
        --secondary-color: #280A04;
        ...
      }
    </style>
```

Buttons to launch DaVinci flows are now located in src/home-nav-buttons.hbs and are customized with HTML data attributes instead of through the settings.json files.

## Images

You can add pictures in two ways:
- CDN URL
- file name (extension included) - will be delivered from internal **public/<vertical>** folder, if you'd like to add/update images, you can add them to that folder and reference them in the associated settings.json file

The `common_images` section includes basic pictures for the specific vertical (favicon and logo).

```json
  "common_images": {
    "favicon": "/<vertical>/favicon.ico",
    "apple_touch_icon": "/<vertical>/apple-touch-icon.png",
    "logo": "/<vertical>/logo.png",
    "dialog_logo": "/<vertical>/auth-dialog-logo.png"
  },
```

If you would like to remove an image because you have rebranded, you can just set the image property to an empty string, e.g. to remove the logo from dialogs:

```json
  "common_images": {
    ...
    "dialog_logo": "",
  }
```

**Note: there is now a data attribute to hide dialog logos as well! See bxi-davinci.js documentation for more info.**

## Dashboard Page

To enable the static Dashboard DaVinci flow for all verticals, the .env file should have a value for BXI_DASHBOARD_POLICY_ID, and it will be loaded on each vertical at page load.

Similarly, DV Buttons are available on the dashboard page as well, these can be uncommented and customized in the src/dashboard-buttons.hbs file.

The Dashboard section in the file includes the `"user_name"` key, which will be displayed in the dashboard page header. **Note: this can be set dynamically a couple different ways, continue reading for more information!**

### Simulate logout

Currently logout redirects the user up to the current vertical home page, if you need to add any tear-down logic like clearing session data there is now a function in public/register-functions.js called bxi.logout where you can add tear-down logic. Be sure to add code before the window.location.assign call or it will be ignored.

## Simulate being logged in after Login or Registration

There is now an option to simulate a user being logged into the dashboard after completing successful login or registration. The DV flow being used must return a successful JSON response including an additonalProperties.username property in order for this to work. Please find more information on this in the bxi-davinci.js documentation section below.

## bxi-davinci.js Documentation

With the new version of BXI, it is easier to further customize where and how you launch flows! Default configurations are now plain HTML in the src/home-nav-buttons.hbs and src/dashboard-buttons.hbs file. These are in a centralized location so they can be used in all verticals!

**Note: It is not recommended to include company id or api key in your front-end HTML or JavaScript for security reasons. Try to keep all of your flow policies in the same DaVinci Environment and Application and set the appropriate values in the .env file. That being said data attributes for overriding api key and company id are provided for edge cases.**

You can manually configure html elements to load flows by applying the following attributes to any element:

|Attribute|Description|Default Value|Required|
|------|------|:------:|:------:|
|`data-dv-flow`|How your flow will be loaded on the page, value options are 'static' or 'modal'|-|Yes|
|`data-policy-id`|Policy ID that will be used to invoke your flow (not recommended)|-|Yes (unless data-url-policy-id is used)|
|`data-company-id`|Company ID that will be used to invoke your flow (not recommended)|BXI_COMPANY_ID from .env|
|`data-api-key`|API Key that will be used to invoke your flow|BXI_API_KEY from .env|
|`data-hide-logo`|If "true" the vertical logo on the resulting modal will be hidden|"false"|
|`data-url-policy-id`|If set, will look for the policy ID in a URL parameter of the same name|-|
|`data-url-company-id`|If set, will look for the company ID in a URL parameter of the same name|-|
|`data-url-api-key`|If set, will look for the api key in a URL parameter of the same name|-|
|`data-dv-param-<name>`|These will be passed to DaVinci as parameters of the request, see more about usage below|-|
|`data-success-callback`|Success callback that is called from the function registry when a flow returns a success response|-|
|`data-error-callback`|Error callback that is called from the function registry when a flow returns an error response|-|
|`data-parameter-factory`|The return object from this function will be merged with any data-dv-param attributes and sent in the parameters property of the DaVinci flow request|-|

**Note: Static flows are loaded on page load, and they use the HTML element the attribute is included on as a container to display the widget. For best results, we recommend using a <div> element for this.**

**Note: Modal flows are loaded when the HTML element the attribute is included on is clicked. For best results, we recommend using a <button> element for this.**

### Additional Information on data-dv-param

To pass parameters in the DaVinci request that is sent when the flow is loaded, use data-dv-param-<name> attributes. You can use as many of these attributes as you need on an element. The parameter name that is sent to DaVinci is inferred in a couple ways. It will remove data-dv-param- and the rest of the name will be used as the parameter name in PascalCase. To customize the parameter name (e.g. as a different casing) you can do so by adding the parameter name in front of two colons before the value. See last example below.

### Examples
**Simple Modal**

This example adds a login button that launches policy id xxx and uses the API and Company IDs included in the .env file.

```html
  <button data-dv-flow="modal" data-policy-id="xxx">Log In</button>
```

**Static Widget**

This example looks for a url parameter called "profilePolicyId" (case sensitive) and uses the value as the policy id to load the flow on page load. The flow loads in this element since it's static, so position it on the page where you'd like the flow to be.

```html
  <div data-dv-flow="static" data-url-policy-id="profilePolicyId"></div>
```

**Param Usage**

This example will result in parameters that are sent to DaVinci with the flow start request. The resulting JSON that is sent to DV is below the HTML example.

```html
  <div data-dv-flow="modal" data-policy-id="xxx" data-dv-param-first-name="John" data-dv-param-last-name="lastName::Smith"></div>
```

```json
{
  "FirstName": "John",
  "lastName": "Smith"
}
```
**Note: you may use data-dv-parms in conjunction with a data-parameter-factory callback function. The callback function is given priority over the data-dv-param attributes if any duplicate properties are encountered.**

### Additional Information on callbacks

Currently there are three places you can inject callback functions during DaVinci flow execution:
- prior to the request being send to davinci.js for dynamically retrieving flow parameters
- flow successCallback
- flow errorCallback

In order to use these, ensure you have registered a function in public/register-functions.js and that the value in data-success-callback, data-error-callback or data-parameter-factory on your flow trigger HTML control matches a function name in the registry. Asyncronous functions in the registry work as well!

Technically you may register a function anywhere after initFunctionRegistery() is called in the bxi-davinci.js file, however we recommend they are added to the public/register-functions.js file so they are in a centralized location and are easy to port over to a new remix if we release new features you'd like to have.

To register a function you must provide the function with a name, you can do that using a string value and an anonymous function, or just passing a named function

```javscript
bxi.registerFunction('callbackName', () => {...}); // Anonymous function usage
bxi.registerFunction(function callbackName() {...}); // Named function usage

// Either of these usages can also be asyncronous and will be awaited when they are used
bxi.registerFunction('callbackName', async () => {...}); // Anonymous function usage
bxi.registerFunction(async function callbackName() {...}); // Named function usage
```

To use a registry function add the name of the registered function (case sensative) to the appropriate data attribute on the HTML control

```html
<button data-dv-flow="modal" data-policy-id="xxx" data-success-callback="callbackName">Log In</button>
```

When using a parameter factory function, you must return an object that will be merged with any data-dv-params present on your HTML element

**Note: the factory result will override data-dv-params if any duplicate properties are present**

```javascript
bxi.registerFunction(function loginParams() { 
   return { FirstName: 'Fred', LastName: 'Tester' };
});

// HTML Usage
// <button data-dv-flow="modal" data-policy-id="xxx" data-parameter-factory="loginParams">Log In</button>
```

## DV Dialogs HTML Structure for Inheriting the Main Style of the Site
**Note: not included yet**
To visit the dialog examples page:
- enter https://demo.bxindustry.org/dashboard
- click on "Dialog Examples" link

Click on the "Dialog Elements" button to preview all the elements below:
```html
<!-- dialog header -->
<div class="dialog-content-header dialog-content__header">
  <h6 class="dialog-content-header__title">Dialog Header</h6>
</div>

<div class="dialog-container">
  <div class="dialog-form">

<!-- wide input -->
    <div class="form-group dialog-form__form-group">
      <label class="form-group__label">Input label</label>
      <input class="form-group__input"/>
      <p class="form-group__hint dialog-link">color marked bottom label</p>
    </div>

<!-- narrow input -->
    <div class="form-group dialog-form__form-group dialog-form__form-group--xs">
      <label class="form-group__label">Input label</label>
      <input class="form-group__input" type="text"/>
    </div>

<!-- text block -->
    <p class="dialog-form-message">
      Text - no bottom space
    </p>

<!-- wide select -->
    <div class="form-group dialog-form__form-group">
      <label class="form-group__label">Input label</label>
      <select class="form-group__input">
        <option>Option1</option>
        <option>Option2</option>
      </select>
    </div>

<!-- narrow select -->
    <div class="form-group dialog-form__form-group dialog-form__form-group--xs">
      <label class="form-group__label">Input label</label>
      <select class="form-group__input">
        <option>Option1</option>
        <option>Option2</option>
      </select>
    </div>

<!-- text block with bottom space -->
    <p class="dialog-form-message dialog-form-message--mb_5">
      Text line<br/>
      + bottom space
    </p>

<!-- block picker with svg icons -->
    <div class="auth-flow-picker dialog-form__flow-picker">
      <div class="auth-flow-item auth-flow-picker__item">
        <div class="auth-flow-item__side">
          <p class="auth-flow-item__title">Email me a one time passcode on:</p>
          <p class="auth-flow-item__info">iel***@bxindustry.com</p>
        </div>
        <div class="auth-flow-item__side">
          <svg fill="none" height="18" viewbox="0 0 22 18" width="22" xmlns="http://www.w3.org/2000/svg">
            <rect height="16" rx="1" stroke-width="2" stroke="#D6DDE9" width="20" x="1" y="1"/>
          </svg>
        </div>
      </div>
      <div class="auth-flow-item auth-flow-picker__item">
        <div class="auth-flow-item__side">
          <p class="auth-flow-item__title">Text me a one-time passcode on:</p>
          <p class="auth-flow-item__info">8***5678</p>
        </div>
        <div class="auth-flow-item__side">
          <svg fill="none" height="25" viewbox="0 0 24 25" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10"/>
            <circle cx="10" cy="10" r="10" fill="red"/>
          </svg>
        </div>
      </div>
    </div>

<!-- submit button -->
    <button class="dialog-form__submit-button button button--md">Submit</button>

<!-- social icons login -->
    <div class="dialog-socials dialog-form__socials-block">
      <p class="dialog-socials__title">Or log in with:</p>
      <ul class="socials dialog-socials__socials-list">
        <li class="socials__item">
          <span class="icon-button icon-button--md icon-button--outlined dialog-social dialog-social--fb">
            <svg fill="none" height="21" viewbox="0 0 10 21" width="10" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.1913 21H6.3913V10.4087H9.31304L9.58696 6.84783H6.3913C6.3913 6.84783 6.3913 5.47826 6.3913 4.83913C6.3913 4.01739 6.57391 3.65217 7.39565 3.65217C8.03478 3.65217 9.67826 3.65217 9.67826 3.65217V0C9.67826 0 7.30435 0 6.75652 0C3.65217 0 2.1913 1.36957 2.1913 4.01739C2.1913 6.3 2.1913 6.84783 2.1913 6.84783H0V10.4087H2.1913V21Z" fill="#000"/>
            </svg>
          </span>
        </li>
        <li class="socials__item">
          <span class="icon-button icon-button--md icon-button--outlined dialog-social dialog-social--in">
            <svg fill="none" height="20" viewbox="0 0 19 20" width="19" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.30002 6.40002H0.400024V19.1H4.30002V6.40002Z" fill="#000"/>
              <path d="M2.3 4.7C3.6 4.7 4.6 3.6 4.6 2.4C4.6 1.2 3.6 0 2.3 0C1 0 0 1.1 0 2.3C0 3.5 1 4.7 2.3 4.7Z" fill="#000"/>
              <path d="M10.6 12.4C10.6 10.6 11.4 9.50002 13 9.50002C14.4 9.50002 15.1 10.5 15.1 12.4C15.1 14.2 15.1 19.1 15.1 19.1H19C19 19.1 19 14.5 19 11C19 7.60002 17.1 5.90002 14.4 5.90002C11.7 5.90002 10.6 8.00002 10.6 8.00002V6.40002H6.79999V19.1H10.6C10.6 19.1 10.6 14.4 10.6 12.4Z" fill="#000"/>
            </svg>
          </span>
        </li>
        <li class="socials__item">
          <span class="icon-button icon-button--md icon-button--outlined dialog-social dialog-social--apple">
            <svg fill="none" height="20" viewbox="0 0 18 20" width="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.2118 19.1946C13.1143 20.2474 11.9033 20.0833 10.7491 19.5869C9.52201 19.0805 8.40019 19.0485 7.10423 19.5869C5.49035 20.2754 4.6338 20.0753 3.66183 19.1946C-1.82577 13.6104 -1.01579 5.10388 5.22103 4.78364C6.73366 4.8637 7.79271 5.61027 8.68368 5.67232C10.008 5.40611 11.2756 4.64353 12.6931 4.74361C14.3961 4.87971 15.6697 5.54422 16.5202 6.73913C13.0171 8.82071 13.8473 13.3842 17.0649 14.6652C16.421 16.3364 15.5948 17.9877 14.2098 19.2086L14.2118 19.1946ZM8.56219 4.72359C8.39817 2.24171 10.4332 0.200152 12.7741 0C13.096 2.86218 10.1416 5.00381 8.56219 4.72359Z" fill="#000"/>
            </svg>
          </span>
        </li>
      </ul>
    </div>

<!-- footer message -->
    <div class="dialog-form__footer">
      <p class="dialog-footer-description">
        Footer message
        <span class="dialog-footer-description__link">
          Footer link
        </span>
      </p>
    </div>
  </div>
</div>
```

[BXMde]: <https://bxindustry-v1.glitch.me/manufacturing/dialog_examples>
[BXAde]: <https://bxindustry-v1.glitch.me/airlines/dialog_examples>
