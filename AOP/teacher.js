var shouldDisplayImplementation = true

/**
 * Check will be able to verify the values/names/code of the current function and to interrupt it or react accordingly to the values read
 * @param {Function} func 
 * @param {String} name 
 * @param {IArguments} args 
 * @returns 
 */
function check(func, name, args) {
    console.log(name + '(' + args + ')');
    if (shouldDisplayImplementation) {
        console.log(func.toString());
    }
    return;
}