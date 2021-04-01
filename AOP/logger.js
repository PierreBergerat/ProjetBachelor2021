var functionLogger = {};

/**
 *
 *
 * @param func The function to add logging to.
 * @param name The name of the function.
 *
 * @return A function that will perform logging and then call the function. 
 */
functionLogger.getLoggableFunction = function (func, name) {
    return function () {
        let f = {
            signature: name + func.toString().substring(0, func.toString().indexOf(')') + 1),
            name: name,
            params: {}
        };
        let parameters = func.toString().match(/\(([^)]+)\)/)[1].split(',')
        for (var i = 0; i < arguments.length; i++) {
            f['params'][parameters[i]] = arguments[i];
        }

        f['res'] = func.apply(this, arguments);
        console.log(f);
        //if (f['res'] === true) { return false }
        return f['res']
    }
};

/**
 * After this is called, all direct children of the provided namespace object that are 
 * functions will log their name as well as the values of the parameters passed in.
 *
 * @param namespaceObject The object whose child functions you'd like to add logging to.
 */
functionLogger.addLoggingToNamespace = function (namespaceObject) {
    for (var name in namespaceObject) {
        var potentialFunction = namespaceObject[name];

        if (Object.prototype.toString.call(potentialFunction) === '[object Function]') {
            namespaceObject[name] = functionLogger.getLoggableFunction(potentialFunction, name);
        }
    }
};
functionLogger.addLoggingToNamespace(window);
