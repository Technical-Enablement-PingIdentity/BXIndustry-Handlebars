function initFunctionRegistry() {
  // Initialize function registry
  window.bxi = {
    ...window.bxi,
    functionRegistry: {},
    // Safe call registry function, console.warn if a function is not present
    callFunction: async (name, params) => {
      const fn = bxi.functionRegistry[name];
      if (fn) {
        return await fn(params);
      } else {
        console.warn(`No function '${name}' was found in the bxi function registry, ensure you have registered it`)
      }
    },
    // Register a function with console.warn if it is done incorrectly, 
    // functions can be registered as a named function or  a string with an anonymous function
    registerFunction: (arg1, arg2) => {
      if (typeof arg1 === 'string') {
        if (typeof arg2 !== 'function') {
          console.warn('When registering a bxi function, if the first argument is a string, second argument must be a function');
        }

        window.bxi.functionRegistry[arg1] = arg2;
      } else if (typeof arg1 === 'function') {
        if (arg1.name) {
          window.bxi.functionRegistry[arg1.name] = arg1;
        } else {
          console.warn('Anonymous functions may not be registered in bxi unless the first parameter provides a name')
        }
      } else {
        console.warn(`Invalid argument type in registerFunction, expected 'string' or 'function'`);
      }
    },
    // Helper function to get a property from an object without caring about case
    getParameterCaseInsensitive: (obj, key) => {
      if (!obj) {
        return null;
      }
  
      const foundKey = Object.keys(obj).find(k =>  k.toLowerCase() === key.toLowerCase());
      return foundKey ? obj[foundKey] : null;
    }
  }
}

export default initFunctionRegistry;