var logs = [] // container for the logs
var curr = -1 // currently displayed log index
const displayContainer = document.getElementById('display')
/**
 * Check will be able to verify the values/names/code of the current function and to interrupt it or react accordingly to the values read
 * @param {Function} func - The function that has been called
 * @param {String} name - The name of the function
 * @param {IArguments} args - the function's arguments
 */
function log(func, name, args) {
    if (name && args) {
        logs.push([name.toString() + '()', args.toString(), func.toString()])
    } else {
        for (let i = logs.length - 1; i >= 0; i--) {
            if (logs[i].length != 4) {
                logs[i].push(func.toString())
                break;
            }
        }

    }
}

/**
 * Displays the current log to the screen in a preformated placeholder
 * @param {Boolean} shouldGoForward - Indicates whether the display should show the next or the previous state
 */
function display(shouldGoForward = true) {
    if (curr != -1) {
        if (shouldGoForward) {
            curr < (logs.length - 1) ? curr += 1 : curr;
        } else {
            curr > 0 ? curr -= 1 : curr;
        }
    } else {
        curr++;
    }
    displayContainer.innerHTML = ""
    for (let elem in logs[curr]) {
        let p = document.createElement('pre')
        switch (elem) {
            case '0':
                console.log(elem);
                p.innerText = "Fonction : "
                break;
            case '1':
                console.log(elem);
                p.innerText = "Arguments : "
                break;
            case '2':
                console.log(elem);
                p.innerText = "Code : "
                break;
            case '3':
                console.log(elem);
                p.innerText = "Retourne : "
                break;
            default:
                break;
        }
        p.innerText += logs[curr][elem]
        displayContainer.appendChild(p)
    }
}
