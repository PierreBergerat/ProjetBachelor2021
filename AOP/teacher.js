var logs = []
var curr = 0
var isFirstTimeDisplayed = true
const displayContainer = document.getElementById('display')
/**
 * Check will be able to verify the values/names/code of the current function and to interrupt it or react accordingly to the values read
 * @param {Function} func 
 * @param {String} name 
 * @param {IArguments} args 
 * @returns 
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
    return
}

function display(shouldGoForward = true) {
    if (!isFirstTimeDisplayed) {
        if (shouldGoForward) {
            curr < (logs.length - 1) ? curr += 1 : curr;
        } else {
            curr > 0 ? curr -= 1 : curr;
        }
    } else {
        isFirstTimeDisplayed = false;
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
