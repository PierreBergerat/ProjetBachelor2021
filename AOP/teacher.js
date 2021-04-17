var logs = []; // container for the logs
var curr = -1; // currently displayed log index
const displayContainer = document.getElementById('display');
const algorithm = document.getElementById('algorithm');
var listeners = new Map();


function updateObjects(currentLog) {
    console.log(currentLog[0].split('()')[0]);
    for (let obj of listeners.get(currentLog[0].split('()')[0]) || []) {
        if (obj[0][obj[1]]) {
            obj[0][obj[1]](currentLog)
        } else {
            obj[1].call(obj[0], currentLog)
        }
    }
}

class Array {
    constructor(reference, container, listensTo) {
        this.reference = reference;
        this.container = container
        this.array = document.createElement('table');
        this.display()
        for (let [funcName, func] of listensTo) {
            listeners.get(funcName)?.push([this, func]) || listeners.set(funcName, [[this, func]]);
        }
        listeners.get('swap')?.push([this, 'updateTable']) || listeners.set('swap', [[this, 'updateTable']]);
    }
    display() {
        this.array.classList.add('table');
        let row = document.createElement('tr')
        for (let i in this.reference) {
            let element = document.createElement('td');
            element.innerText = this.reference[i];
            row.appendChild(element);
        }
        this.array.appendChild(row)
        document.getElementById(this.container).appendChild(this.array);
    }
    updateTable(currentLog) {
        this.reference = currentLog[1][0];
        for (let i in this.reference) {
            this.array.children[0].children[i].innerText = this.reference[i]
        }

    }
    highlight(currentLog) {
        [...this.array.children[0].children].forEach(elem => { elem.classList.remove('selected') })
        this.array.children[0].children[currentLog[1][1]].classList.add('selected');
        this.array.children[0].children[currentLog[1][1] + 1].classList.add('selected');
        //console.log(this.array.children)
    }
}

/**
 * Check will be able to verify the values/names/code of the current function and to interrupt it or react accordingly to the values read
 * @param {Function} func - The function that has been called
 * @param {String} name - The name of the function
 * @param {IArguments} args - the function's arguments
 */
function log(func, name, args) {
    if (name && args) {
        logs.push([name.toString() + '()', JSON.parse(JSON.stringify(args)), func.toString()])
    } else {
        for (let i = logs.length - 1; i >= 0; i--) {
            if (logs[i].length != 4) {
                logs[i].push(JSON.parse(JSON.stringify(func)))
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
        new Array([12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 455, 23, 234, 213], 'table', [['swap', 'highlight']])
        curr++;
        algorithm.innerHTML = `<pre>${logs[0][2]}</pre>`
    }
    algorithm.innerHTML = '<pre>' + algorithm.innerHTML
        .replaceAll('<span>', '')
        .replaceAll('</span>', '')
        .replaceAll('<pre>', '')
        .replaceAll('</pre>', '')
        .split(logs[curr][0].replaceAll(')', ''))
        .join(`</pre><span>${logs[curr][0].replaceAll('()', '')}</span><pre>(`) + '</pre>'
    displayContainer.innerHTML = ""
    for (let elem in logs[curr]) {
        let p = document.createElement('pre')
        p.classList.add('m-0')
        switch (elem) {
            case '0':
                p.innerText = "Fonction : "
                break;
            case '1':
                p.innerText = "Arguments : "
                break;
            case '2':
                p.innerText = "Code : "
                break;
            case '3':
                p.innerText = "Retourne : "
                break;
            default:
                break;
        }
        if (elem % 2 != 0) {
            p.innerHTML += JSON.stringify(logs[curr][elem])
        } else {
            p.innerHTML += logs[curr][elem]
        }
        displayContainer.appendChild(p)
        updateObjects(logs[curr])
    }

}
