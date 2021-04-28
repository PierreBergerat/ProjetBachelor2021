class Observer {
  constructor(objects, namespaces, functions, blacklist) {
    this.objects = objects;
    this.namespaces = namespaces;
    this.functions = functions;
    this.blacklist = blacklist;
    this.blacklist = new Array(...new Set([...this.blacklist, ...["toString", "setInterval", "setTimeout", "clearInterval"]]))
  }
  /**
   * Returns the methods of an object's prototype
   * @param {prototype} prototype - the class prototype (passed via CLASSNAME.prototype) to target 
   * @returns - all the methods presents in the prototype
   */
  getMethods = (prototype) => {
    let properties = new Set(), currentObj = prototype;
    do {
      Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    return [...properties.keys()].filter(item => typeof prototype[item] === 'function' && !["toString", "constructor"].includes(item));
  }

  /**
   * Augments a default method with another
   * @param {prototype} target - Object that possesses the to be replaced method
   * @param {Function} methodName - The method to replace
   * @param {Function} aspect - Function to add to the method
   * @param {"before"|"after"|"around"|"afterReturning"} advice - Where to add the method.
   */
  replaceMethod(target, methodName, aspect, advice) {
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
   * Injects a function into another
   * @param {prototype} target - Object that possesses the to be replaced method
   * @param {Function} aspect - Function to add to the method
   * @param {"before"|"after"|"around"|"afterReturning"} advice - Where to add the method
   */
  inject(target, functions) {
    const methods = this.getMethods(target);
    methods.forEach(m => {
      for (let _function of functions) {
        this.replaceMethod(target, m, _function.aspect, _function.advice);
      }
    })
  }

  /**
   * Injects every method of a namespace
   * @param {namespaceObject} namespaceObject - The namespaceObject whose functions will be augmented
   */
  injectNamespace(namespaceObject, functions) {
    for (var name in namespaceObject) {
      var potentialFunction = namespaceObject[name];
      if (Object.prototype.toString.call(potentialFunction) === '[object Function]' && !this.blacklist.includes(potentialFunction.name)) {
        for (let _function of functions) {
          this.replaceMethod(namespaceObject, name, _function.aspect, _function.advice)
        }
      }
    }
  };

  /**
   * Starts the observation of the methods and functions calls
   */
  startObserver() {
    for (let _object of this.objects) {
      this.inject(_object.prototype, this.functions)
    }
    for (let _namespace of this.namespaces) {
      this.injectNamespace(_namespace, this.functions)
    }
  }
}