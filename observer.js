class Observer {
  /**
   * Instanciates the observer
   * @param {Array.<Object>} objects - Objects to be injected
   * @param {Array.<Object>} namespaces - Namespaces to be injected
   * @param {Array.<Object>} functions - Aspects that will be injected into the above parameters
   * @param {Array.<String>} blacklist - Functions that won't be injected
   */
  constructor(objects, namespaces, functions, blacklist) {
    this.objects = objects;
    this.namespaces = namespaces;
    this.functions = functions;
    this.blacklist = blacklist;
    this.blacklist = new Array(...new Set([...this.blacklist, ...["toString", "setInterval", "setTimeout", "clearInterval", "fetch"]]))
  }
  /**
   * Adapted version of https://flaviocopes.com/how-to-list-object-methods-javascript/
   * Returns the methods of an object's prototype
   * @param {prototype} prototype - the class prototype (passed via CLASSNAME.prototype) to target 
   * @returns - all the methods presents in the prototype
   */
  getObjectMethods = (prototype) => {
    let properties = new Set(), currentObj = prototype;
    do {
      Object.getOwnPropertyNames(currentObj).map(name => properties.add(name))
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    return [...properties.keys()].filter(key => typeof prototype[key] === 'function' && !["toString", "constructor"].includes(key));
  }

  /**
   * Augments a global function with another
   * Based on the method injection example seen in "JavaScript The Definitive Guide Master the Worlds Most-Used Programming Language" by David Flanagan, O'Reilly Media, 2020, p.388
   * @param {prototype} target - Object that possesses the to be replaced method
   * @param {String} methodName - The method to replace
   * @param {Function} aspect - Function to add to the method
   * @param {"before"|"after"|"around"|"afterReturning"} advice - Where to add the method.
   */
  augmentFunction(target, methodName, aspect, advice) {
    const original = target[methodName]; // Backups the original function for further use
    target[methodName] = (...args) => { // Redefinition of the function as a new function that will run "original" at some point
      if (["before", "around"].includes(advice)) {
        aspect.apply(target, [original, methodName, args]); // Runs the aspect with "target" as the value of "this"
      }
      const returnedValue = original.apply(target, args); // Runs the original function and store its return value
      if (["after", "around"].includes(advice)) {
        aspect.apply(target, [original, methodName, args]);
      }
      if (advice === "afterReturning") {
        return aspect.apply(target, [returnedValue]); // Runs the aspect with the returnedValue as parameter
      }
      return returnedValue;
    }
  }

  /**
   * Augments a method with a function
   * @param {prototype} target - Object that possesses the to be replaced method
   * @param {String} methodName - The method to replace
   * @param {Function} aspect - Function to add to the method
   * @param {"before"|"after"|"around"|"afterReturning"} advice - Where to add the method.
   * 
   * This function is a bit weirder than the previous one since "this" value must be relative to the instance of the object the method is executed by.
   * Nevertheless, the code flow is the same as the one of augmentFunction
   */
  augmentMethod(target, methodName, aspect, advice) {
    const originalCode = target[methodName];
    target[methodName] = function () {
      if (["before", "around"].includes(advice)) {
        aspect.apply(target, [originalCode, methodName, [...arguments]]);
      }
      const returnedValue = originalCode.apply(this, [...arguments]);
      if (["after", "around"].includes(advice)) {
        aspect.apply(target, [originalCode, methodName, [...arguments]]);
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
  injectObject(target, functions) {
    this.getObjectMethods(target).forEach(m => {
      if (this.blacklist.includes(m)) {
        return;
      }
      for (let _function of functions) {
        this.augmentMethod(target, m, _function.aspect, _function.advice);
      }
    })
  }

  /**
   * Injects every method of a namespace
   * @param {namespaceObject} namespace - The namespaceObject whose functions will be augmented
   */
  injectNamespace(namespace, functions) {
    for (var name in namespace) {
      if (Object.prototype.toString.call(namespace[name]) === '[object Function]' && !this.blacklist.includes(namespace[name].name)) {
        for (let _function of functions) {
          this.augmentFunction(namespace, name, _function.aspect, _function.advice)
        }
      }
    }
  }

  /**
   * Starts the observation of the methods and functions calls
   */
  startObserver() {
    for (let _object of this.objects) {
      this.injectObject(_object.prototype, this.functions)
    }
    for (let _namespace of this.namespaces) {
      this.injectNamespace(_namespace, this.functions)
    }
  }
}