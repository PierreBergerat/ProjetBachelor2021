var shouldDisplayImplementation = true
var logs = []

/**
 * Check will be able to verify the values/names/code of the current function and to interrupt it or react accordingly to the values read
 * @param {Function} func 
 * @param {String} name 
 * @param {IArguments} args 
 * @returns 
 */
function check(func, name, args) {
    if (shouldDisplayImplementation) {
        logs.push([func, name, args, func.toString()])
        return
    }
    logs.push([func, name, args])
    return
}

function display() {
    for (let log of logs) {
        for(let elem of log){
            let p = document.createElement("p");
            p.innerText = elem
            document.body.appendChild(p);
        }
    }
    return true
}