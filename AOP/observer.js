const getMethods = (obj) => {
  let properties = new Set();
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(item => typeof obj[item] === 'function');
}

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

function inject(target, aspect, advice) {
  const methods = getMethods(target);
  methods.forEach(m => {
    replaceMethod(target, m, aspect, advice);
  })
}

function loggingAspect(...args) {
  console.log("== Calling the logger function ==");
  console.log("Arguments received: " + args);
}

function printTypeOfReturnedValueAspect(value) {
  console.log("Returned type: " + typeof value);
}

var functionLogger = {};

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
