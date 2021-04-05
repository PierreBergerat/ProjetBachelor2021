/**
 * 
 * @param {prototype} prototype - the class prototype (passed via CLASSNAME.prototype) to target 
 * @returns - all the methods presents in the prototype
 */
const getMethods = (prototype) => {
  let properties = new Set();
  let currentObj = prototype;
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)));
  return [...properties.keys()].filter(item => typeof prototype[item] === 'function' && !["toString", "constructor"].includes(item));
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
      aspect.apply(target, [originalCode, methodName, args]);
    }
    const returnedValue = originalCode.apply(target, args);
    if (["after", "around"].includes(advice)) {
      aspect.apply(target, args);
    }
    if ("afterReturning" == advice) {
      return aspect.apply(target, [returnedValue]);
    }
    return returnedValue;
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
  check(args[0], args[1], args[2])
  console.log("====Observer====");
  if (this !== window) {
    if (this.constructor.name !== "Object") {
      console.log(`Class : ${this.constructor.name}`);
    }
    else {
      console.log(`Class : ${this.toString()}`);
    }
  }
  console.log(`Function : ${args[0]}`);
  args.shift()
  args.shift()
  console.log(`Arguments received : [${args}]`);
}

/**
 * Example function to be run after the return of another function
 * @param {any} value 
 */
function loggingReturnedValueAspect(value) {
  console.log(`Returned : ${value}`);
}

/**
 * 
 * @param {*} namespaceObject 
 */
function injectNamespace(namespaceObject) {
  for (var name in namespaceObject) {
    var potentialFunction = namespaceObject[name];
    if (Object.prototype.toString.call(potentialFunction) === '[object Function]' && ![
      "check",
      "inject",
      "addLoggingToNamespace",
      "getLoggableFunction",
      "loggingReturnedValueAspect",
      "loggingAspect",
      "replaceMethod",
      "getMethods",
      "injectFunctionPrototype",
      "toString",
      "setInterval",
      "wait",
      "setTimeout"
    ].includes(potentialFunction.name)) {
      replaceMethod(namespaceObject, name, loggingAspect, "before");
      replaceMethod(namespaceObject, name, loggingReturnedValueAspect, "afterReturning")
    }
  }
};

/**
 * 
 */
function startObserver() {
  inject(Test.prototype, loggingAspect, "before")
  inject(Test.prototype, loggingReturnedValueAspect, "afterReturning")
  inject(document, loggingAspect, "before");
  inject(document, loggingReturnedValueAspect, "afterReturning");
  inject(Math, loggingAspect, "before");
  inject(Math, loggingReturnedValueAspect, "afterReturning");
  injectNamespace(globalThis);
}