class Observer {
  /**
   * Instanciates the observer
   * @param {Array.<Object>} objects Objects to be injected
   * @param {Array.<Object>} namespaces Namespaces to be injected
   * @param {Array.<Function>} functions Aspects that will be injected into the above parameters
   * @param {Array.<String>} blacklist Functions that won't be injected
   */
  constructor(objects, namespaces, functions, blacklist) {
    this.objects = objects;
    this.namespaces = namespaces;
    this.functions = functions;
    this.blacklist = blacklist;
    this.blacklist = new Array(...new Set([...this.blacklist, ...["toString", "setInterval", "setTimeout", "clearInterval", "fetch"]])); // Automatically adds some items to the blacklist
  }

  // Based on the method injection example seen in "JavaScript The Definitive Guide Master the Worlds Most-Used Programming Language" by David Flanagan, O'Reilly Media, 2020, p.388
  /**
   * Augments a method with a function
   * @param {prototype} object Object that possesses the to be replaced method
   * @param {String} functionName The method to replace
   * @param {Function} aspect Function to add to the method
   * @param {"before"|"after"|"around"|"afterReturning"} advice Where to add the method.
   * @returns {Object}
   */
  augment(object, functionName, aspect, advice) {
    const original = object[functionName]; // Backup of the original code
    object[functionName] = function () { // Redefinition of the function
      if (["before", "around"].indexOf(advice) > -1) { // If advice is "before" or "around" 
        aspect.apply(object, [original, functionName, [...arguments]]); // Runs the aspect with "object" as "this" value and passes informations such as the original code, the function name and the arguments the function is passed on
      }
      const returnValue = original.apply(this, [...arguments]); // Stores the return value for the original code
      if (["after", "around"].indexOf(advice) > -1) {
        aspect.apply(object, [original, functionName, [...arguments]]); // Same as above
      }
      if (advice === "afterReturning") { // In the case of "afterReturning", the value that will be returned by the injected function needs to be defined in the aspect
        return aspect.apply(object, [returnValue]);
      }
      return returnValue; // If the advice is not "afterReturning", the function will return its original value
    }
  }

  /**
   * Injects every method of a namespace
   * @param {Object} object The namespace whose functions will be augmented
   * @param {Array.<Function>} functions Functions to be injected 
   */
  injectObject(object, functions) {
    for (var name in object) {
      if (Object.prototype.toString.call(object[name]) === '[object Function]' && this.blacklist.indexOf(object[name].name) === -1) {
        for (let _function of functions) {
          this.augment(object, name, _function.aspect, _function.advice)
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
      this.injectObject(_namespace, this.functions)
    }
  }
}