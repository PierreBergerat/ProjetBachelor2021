/**
 * 
 * @param {prototype} prototype - the class prototype (passed via CLASSNAME.prototype) to target 
 * @returns - all the methods presents in the prototype
 */
const getMethods = (prototype) => {
  let properties = new Set();
  let currentObj = prototype;
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(item => typeof prototype[item] === 'function');
}

/**
 * Augments a default method with another
 * @param {prototype} target 
 * @param {Function} methodName 
 * @param {Function} aspect 
 * @param {String} advice 
 */
function replaceMethod(target, methodName, aspect, advice) {
  const originalCode = target[methodName];
  target[methodName] = (...args) => {
    if (["before", "around"].includes(advice)) {
      aspect.apply(target, args);
    }
    const returnedValue = originalCode.apply(target, args);
    if (["after", "around"].includes(advice)) {
      aspect.apply(target, args);
    }
    if ("afterReturning" == advice) {
      return aspect.apply(target, [returnedValue]);
    } else {
      return returnedValue;
    }
  }
}

/**
 * 
 * @param {prototype} target 
 * @param {Function} aspect 
 * @param {String} advice 
 */
function inject(target, aspect, advice) {
  const methods = getMethods(target);
  methods.forEach(m => {
    replaceMethod(target, m, aspect, advice);
  })
}

/**
 * Example function to be run before another
 * @param  {...any} args 
 */
function loggingAspect(...args) {
  console.log("== Calling the logger function ==");
  console.log("Arguments received: " + args);
}

/**
 * Example function to be run after the return of another function
 * @param {any} value 
 */
function printTypeOfReturnedValueAspect(value) {
  console.log("Returned type: " + typeof value);
}

var functionLogger = {};

/**
 * Logs the function calls
 * @param {Function} func 
 * @param {String} name 
 * @returns 
 */
functionLogger.getLoggableFunction = function (func, name) {
  return function () {
    check(func, name, arguments)
    let f = {
      signature: name + func.toString().substring(0, func.toString().indexOf(')') + 1),
      name: name,
      params: {}
    };
    let parameters = func.toString().match(/\(([^)]+)\)/)[1].replaceAll(' ', '').split(',');
    for (var i = 0; i < arguments.length; i++) {
      f['params'][parameters[i]] = arguments[i];
    }

    f['res'] = func.apply(this, arguments);
    console.log(f);
    return f['res']
  }
};

/**
 * 
 * @param {namespaceObject} namespaceObject 
 */
functionLogger.addLoggingToNamespace = function (namespaceObject) {
  for (var name in namespaceObject) {
    var potentialFunction = namespaceObject[name];
    if (Object.prototype.toString.call(potentialFunction) === '[object Function]' && ![
      "check",
      "inject",
      "addLoggingToNamespace",
      "getLoggableFunction",
      "printTypeOfReturnedValueAspect",
      "loggingAspect",
      "replaceMethod",
      "getMethods"
    ].includes(potentialFunction.name)) {
      namespaceObject[name] = functionLogger.getLoggableFunction(potentialFunction, name);
    }
  }
};
