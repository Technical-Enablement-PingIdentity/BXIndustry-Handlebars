function registerFunctions() {

  /**
   * Add custom code here to do any logout teardown you need to do
   */
  bxi.logout = () => {
    // Tear-down code here

    // This call should be last
    window.location.assign('../');
  };

  /**
   * You may register functions that you would like to hook into during flow execution here. Functions are called by name passed in the 
   * associated data attribute (e.g. data-success-callback="loginSuccess")
   * 
   * Please note you can pass in a named function (e.g. bxi.registerFunction(function loginSuccess(res) {...}); )
   * or you may pass in a name as string with an anonymous function (e.g. bxi.registerFunction('loginSuccess', (res) => {...}); )
   * Function calls are awaited so async functions and promises are supported!
   * 
   * For success and error callbacks the DV response is passed into your functions as the first (and only) parameter. 
   * Also, from success callbacks, if the element contains the data-redirect-on-completion="true" attribute you may 
   * return an object containing a username key to show that name on the dashboard page (e.g. { username: 'Test User'} )
   * 
   * We provided this file as a centralized location for registering callbacks, however it is purposely exposed on the window.bxi object
   * so you may register callbacks anywhere in your application as long as it's after bxi-davinci.js is loaded (initFunctionRegistry() has been called)
   */

  // bxi.registerFunction(function loginSuccess(response) {
  //   console.log('Great success', response);
  //   return { username: 'Test User' };
  // });

  // bxi.registerFunction('loginError', (error) => {
  //   console.log('Sad panda', error);
  // });
}

// This function is executed in bxi-davinci.js after the function registry is initialized
export default registerFunctions;