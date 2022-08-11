import FlowContainerWrapper from '/js/flow-container-wrapper.js';
import initFunctionRegistry from '/js/function-registry.js';
import registerFunctions from '/register-functions.js';


(function () {
  initFunctionRegistry();
  registerFunctions();

  let activeWidget = null;
  let isStaticWidget = false;
  let modal = null;

  const flowTriggers = document.querySelectorAll('[data-dv-flow]');
  flowTriggers.forEach(flowTrigger => {
    switch (flowTrigger.dataset.dvFlow) {
      case "modal":
        flowTrigger.addEventListener('click', event => handleDvModalCallback(event.target, 'modal-widgetbox'));
        break;
      case "static":
        isStaticWidget = true;
        launchStaticWidget(flowTrigger);
        break;
      default:
        console.warn('Invalid flow trigger detected valid values for data-dv-flow are "modal" or "static"');
    }
  });

  async function handleDvModalCallback(target, flowContainerId) {
    const widgetWrapper = new FlowContainerWrapper(target);

    if (!widgetWrapper.PolicyId) {
      throw Error('Policy ID is required to launch a flow.');
    }

    let buttonEventName = target.alt === 'Remix on glitch' ? target.alt : target.innerText;
    buttonEventName = buttonEventName.toLowerCase().split(' ').join('_') + '_clicked';
    
    window.bxi.sendAnalytics(buttonEventName);

    await launchFlow(document.getElementById(flowContainerId), widgetWrapper);

    showModal(target.dataset.hideLogo === 'true');
  }

  function showModal(hideLogo) {
    const modalEl = document.getElementById('dv-modal');
    if (hideLogo) {
      modalEl.classList.add('hide-vertical-logo');
    }

    modal = new bootstrap.Modal(modalEl, {});

    modalEl.addEventListener('hidden.bs.modal', listener);
    modal.show();

    function listener() {
      window.singularkey.cleanup(activeWidget);
      activeWidget = null;
      modal = null;
      modalEl.removeEventListener('hidden.bs.modal', listener);

      if (hideLogo) {
        modalEl.classList.remove('hide-vertical-logo');
      }

      if (isStaticWidget) {
        launchStaticWidget();
      }
    }
  }

  function launchStaticWidget(widgetContainer) {
    if (!widgetContainer) {
      widgetContainer = document.querySelector('[data-dv-flow="static"]');
    }

    const widgetWrapper = new FlowContainerWrapper(widgetContainer);

    if (!widgetWrapper.PolicyId) {
      throw Error('Policy ID is required to launch a flow.');
    }

    launchFlow(widgetContainer, widgetWrapper);
  }

  async function launchFlow(flowContainer, widgetWrapper) {
    if (activeWidget) {
      window.singularkey.cleanup(activeWidget);
      activeWidget = null;
    }

    let tokenEndpoint = '/dvtoken';

    const urlParams = {
      apiKey: widgetWrapper.ApiKey,
      companyId: widgetWrapper.CompanyId,
    };

    tokenEndpoint += Object.values(urlParams).find(key => key !== undefined) 
      ? `?${new URLSearchParams(Object.keys(urlParams).reduce((acc, key) => urlParams[key] ? {...acc, [key]: urlParams[key]} : acc, {}))}`
      : '';

    const tokenResponse = await fetch(tokenEndpoint);
    const tokenData = await tokenResponse.json();
    const parameters = await widgetWrapper.getDvRequestParams();

    const dvWidgetProps = {
      config: {
        method: 'runFlow',
        apiRoot: tokenData.apiRoot,
        accessToken: tokenData.token,
        companyId: tokenData.companyId,
        policyId: widgetWrapper.PolicyId,
        parameters,
      },
      useModal: false,
      successCallback: async response => {
        let username;
        if (widgetWrapper.SuccessCallback) {
          const result = await bxi.callFunction(widgetWrapper.SuccessCallback, response);
          username = getParameterCaseInsensitive(result, 'username');
        }
        
        if (widgetWrapper.RedirectOnCompletion) {
          let url = location.pathname + '/dashboard';
          username = username || getParameterCaseInsensitive(response.additionalProperties, 'username');

          if (username) {
            url +=`?username=${username}`;
          }

          window.location.assign(url);
        } else {
          modal?.hide();
        }      
      },
      errorCallback: async error => {
        if (widgetWrapper.ErrorCallback) {
          await bxi.callFunction(widgetWrapper.ErrorCallback, error);
        }
      }
    };

    window.singularkey.skRenderScreen(flowContainer, dvWidgetProps);

    activeWidget = flowContainer;
  }

  function getParameterCaseInsensitive(obj, key) {
    if (!obj) {
      return null;
    }

    const foundKey = Object.keys(obj).find(k =>  k.toLowerCase() === key.toLowerCase());
    return foundKey ? obj[foundKey] : null;
  }
})();

