
import FlowContainerWrapper from '/js/flow-container-wrapper.js';
import initFunctionRegistry from '/js/function-registry.js';
import Logger from '/js/logger.js';
import registerFunctions from '/register-functions.js';

(function () {
  const logger = new Logger(window._env_.BXI_DEBUG_LOGGING === 'true');
  initFunctionRegistry(logger);
  registerFunctions(logger);

  let activeWidget = null;
  let isStaticWidget = false;
  let modal = null;

  const flowTriggers = document.querySelectorAll('[data-dv-flow]');
  flowTriggers.forEach(flowTrigger => {
    logger.log(`Configuring flow trigger ${flowTrigger.dataset.dvFlow} for element`, flowTrigger);
    switch (flowTrigger.dataset.dvFlow) {
      case "modal":
        flowTrigger.addEventListener('click', event => handleDvModalCallback(event.target, 'modal-widgetbox'));
        break;
      case "static":
        isStaticWidget = true;
        launchStaticWidget(flowTrigger);
        break;
      default:
        logger.warn('Invalid flow trigger detected valid values for data-dv-flow are "modal" or "static"');
    }
  });

  async function handleDvModalCallback(target, flowContainerId) {
    const widgetWrapper = new FlowContainerWrapper(target);

    if (!widgetWrapper.PolicyId) {
      throw Error('Policy ID is required to launch a flow.');
    }

    let buttonEventName = target.alt === 'Remix on glitch' ? target.alt : target.innerText;
    buttonEventName = buttonEventName.toLowerCase().split(' ').join('_') + '_clicked';
    
    window.bxi.sendAnalytics?.(buttonEventName);

    await launchFlow(document.getElementById(flowContainerId), widgetWrapper);

    showModal(target.dataset.hideLogo === 'true', widgetWrapper);
  }

  function showModal(hideLogo, widgetWrapper) {
    const modalEl = document.getElementById('dv-modal');
    if (hideLogo) {
      modalEl.classList.add('hide-vertical-logo');
    }

    modal = new bootstrap.Modal(modalEl, {});

    modalEl.addEventListener('hidden.bs.modal', listener);
    modal.show();

    function listener() {
      window.davinci.cleanup(activeWidget);
      widgetWrapper.hideModalError();
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

    logger.log('Launching static flow');

    launchFlow(widgetContainer, widgetWrapper);
  }

  async function launchFlow(flowContainer, widgetWrapper) {
    if (activeWidget) {
      window.davinci.cleanup(activeWidget);
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

    logger.log('Calling token endpoint', tokenEndpoint);

    const tokenResponse = await fetch(tokenEndpoint);
    logger.log('Token response received', tokenResponse)
    const tokenData = await tokenResponse.json();
    logger.log('Token data parsed from response', tokenData);

    if (tokenResponse.status !== 200) {
      widgetWrapper.displayError(tokenData.error || 'An unkown error occured, see glitch server side logs for more details');
      logger.error('Token response was not successful', tokenResponse);
      return;
    }
    
    const parameters = await widgetWrapper.getDvRequestParams();
    logger.log('DaVinci request parameters', parameters);

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
        logger.log('DaVinci flow successful', response);
        if (widgetWrapper.SuccessCallback) {
          logger.log('SuccessCallback exists on widget wrapper');
          await bxi.callFunction(widgetWrapper.SuccessCallback, response);
        }
        
        modal?.hide();   
      },
      errorCallback: async error => {
        logger.error('DaVinci flow was not successful');
        if (widgetWrapper.ErrorCallback) {
          logger.log('ErrorCallback exists on widget wrapper');
          await bxi.callFunction(widgetWrapper.ErrorCallback, error);
        }
      }
    };

    logger.log('Rendering DV widget with request parameters', dvWidgetProps);
    window.davinci.skRenderScreen(flowContainer, dvWidgetProps);

    activeWidget = flowContainer;
  }
})();

