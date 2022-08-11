class FlowContainerWrapper {
  constructor(target) {
    this.targetEl = target;
  }

  // Return value in URL parameter definited in data-url-policy-id if available or data-policy-id
  get PolicyId() {
    return this.getUrlParameter(this.targetEl.dataset.urlPolicyId) || this.targetEl.dataset.policyId
  }

  // Return value in URL parameter definited in data-url-api-key if available or data-api-key
  get ApiKey() {
    return this.getUrlParameter(this.targetEl.dataset.urlApiKey) || this.targetEl.dataset.apiKey
  }

  // Return value in URL parameter definited in data-url-company-id if available or data-company-id
  get CompanyId() {
    return this.getUrlParameter(this.targetEl.dataset.urlCompanyId) || this.targetEl.dataset.companyId
  }

  // Return true if data-redirect-on-completion is present and 'true'
  get RedirectOnCompletion() {
    return this.targetEl.dataset.redirectOnCompletion === 'true';
  }

  // Return parameters for DV flow request, grabs static data-dv-param-<name> parameters from element and 
  // merges with result from data-request-params-factory
  async getDvRequestParams() {
    let factoryResult = {};

    if (this.ParameterFactory) {
      factoryResult = await bxi.callFunction(this.ParameterFactory);
    }

    return { ...this.getParamsFromElement(this.targetEl), ...factoryResult };
  }

  // Return true if data-hide-logo is present and 'true'
  get HideLogo() {
    return this.targetEl.dataset.hideLogo === 'true';
  }

  // Return name of function in the function registry to call when a flow successfully completes
  get SuccessCallback() {
    return this.targetEl.dataset.successCallback;
  }

  // Return name of function in the function registry to call when a flow results in an error
  get ErrorCallback() {
    return this.targetEl.dataset.errorCallback;
  }

  // Return name of function in the function registry to call when retreiving parameters to pass along with DV request
  get ParameterFactory() {
    return this.targetEl.dataset.parameterFactory;
  }

  getParamsFromElement(target) {
    return Object.keys(target.dataset)
      .filter(key => key.startsWith('dvParam'))
      .reduce((params, key) => {
        let value = target.dataset[key];
        if (value.includes('::')) {
          const split = value.split('::');
          return { ...params, [split[0]]: split[1]};
        } else {
          return { ...params, [key.replace('dvParam', '')]: value };
        }
      }, {});
  }

  getUrlParameter(key) {
    return new URLSearchParams(window.location.search).get(key);
  }
}

export default FlowContainerWrapper;