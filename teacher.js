var logs = []; // container for the logs
var curr = -1; // currently displayed log index
const displayContainer = document.getElementById('display');
const algorithm = document.getElementById('algorithm');
var actionListeners = new Map();
var afterListeners = new Map();

/**
 * 
 * @param {*} curr 
 */
function updateObjects(curr, isGoingForward) {
    if (curr > 0) {
        lastLog = logs[curr - 1];
        for (let obj of afterListeners.get(lastLog[0].split('()')[0]) || []) {
            if (obj[0][obj[1]]) {
                obj[0][obj[1]](lastLog, isGoingForward);
            } else {
                obj[1].call(obj[0], lastLog, isGoingForward);
            }
        }
    }
    currentLog = logs[curr];
    for (let obj of actionListeners.get(currentLog[0].split('()')[0]) || []) {
        if (obj[0][obj[1]]) {
            obj[0][obj[1]](currentLog, isGoingForward);
        } else {
            obj[1].call(obj[0], currentLog, isGoingForward);
        }
    }
}

/**
 * 
 */
class Item {
    constructor(container, listensTo, AfterActions) {
        this.container = container;
        for (let [funcName, func] of listensTo) {
            actionListeners.get(funcName)?.push([this, func]) || actionListeners.set(funcName, [[this, func]]);
        }
        for (let [funcName, func] of AfterActions) {
            afterListeners.get(funcName)?.push([this, func]) || afterListeners.set(funcName, [[this, func]]);
        }
    }
}

/**
 * 
 */
class TeacherArray extends Item {
    constructor(referenceArray, container, listensTo, AfterActions) {
        super(container, listensTo, AfterActions);
        this.referenceArray = referenceArray;
        this.array = document.createElement('table');
        this.display();
    }

    /**
     * 
     */
    display() {
        this.array.classList.add('table');
        let row = document.createElement('tr');
        for (let i in this.referenceArray) {
            let element = document.createElement('td');
            element.innerText = this.referenceArray[i];
            row.appendChild(element);
        }
        this.array.appendChild(row);
        document.getElementById(this.container).appendChild(this.array);
    }

    /**
     * 
     * @param {*} currentLog 
     */
    updateTable(currentLog) {
        this.referenceArray = currentLog[3];
        for (let i in this.referenceArray) {
            this.array.children[0].children[i].innerText = this.referenceArray[i];
        }
    }

    /**
     * 
     * @param {*} currentLog 
     */
    swapHighlight(currentLog) {
        [...this.array.children[0].children].forEach(elem => { elem.classList.remove('selected'); elem.classList.remove('selected-red') });
        this.array.children[0].children[currentLog[1][1]].classList.add('selected');
        this.array.children[0].children[currentLog[1][1] + 1].classList.add('selected');
    }

    isSmallerHighlight(currentLog, isGoingForward) {
        [...this.array.children[0].children].forEach(elem => { elem.classList.remove('selected'); elem.classList.remove('selected-red') });
        let values = [...this.array.children[0].children].map(x => { return x.innerText });
        let log = JSON.parse(JSON.stringify(currentLog))
        if (!isGoingForward) {
            log[1].reverse();
        }
        for (let i = 0; i < values.length; i++) {
            if (values[i] == log[1][0] && values[i + 1] == log[1][1]) {
                this.array.children[0].children[i].classList.add('selected-red');
                this.array.children[0].children[i + 1].classList.add('selected-red');
                return
            }
        }
        log[1].reverse();
        for (let i = 0; i < values.length; i++) {
            if (values[i] == log[1][0] && values[i + 1] == log[1][1]) {
                this.array.children[0].children[i].classList.add('selected-red');
                this.array.children[0].children[i + 1].classList.add('selected-red');
                return
            }
        }
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
        logs.push([name.toString() + '()', JSON.parse(JSON.stringify(args)), func.toString()]);
    } else {
        for (let i = logs.length - 1; i >= 0; i--) {
            if (logs[i].length != 4) {
                logs[i].push(JSON.parse(JSON.stringify(func)));
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
    } else {// Init
        new TeacherArray([12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 4891, 455, 23, 234, 213],
            'table',
            [
                ['swap', 'swapHighlight'],
                ['isSmaller', 'isSmallerHighlight']
            ],
            [
                ['swap', 'updateTable'],
                ['isSmaller', 'updateTable']
            ]);
        curr++;
        algorithm.innerHTML = `<pre>${logs[0][2]}</pre>`;
    }
    updateObjects(curr, shouldGoForward);
    algorithm.innerHTML = '<pre>' + algorithm.innerHTML
        .replaceAll('<span>', '')
        .replaceAll('</span>', '')
        .replaceAll('<pre>', '')
        .replaceAll('</pre>', '')
        .split(logs[curr][0].replaceAll(')', ''))
        .join(`</pre><span>${logs[curr][0].replaceAll('()', '')}</span><pre>(`) + '</pre>';
    displayContainer.innerHTML = "";
    for (let elem in logs[curr]) {
        let p = document.createElement('pre');
        p.classList.add('m-0');
        switch (elem) {
            case '0': p.innerText = "Fonction : "; break;
            case '1': p.innerText = "Arguments : "; break;
            case '2': p.innerText = "Code : "; break;
            case '3': p.innerText = "Retourne : "; break;
            default: break;
        }
        if (elem % 2 != 0) {
            p.innerHTML += JSON.stringify(logs[curr][elem]);
        } else {
            p.innerHTML += logs[curr][elem];
        }
        displayContainer.appendChild(p);
    }
}

function play() {
    var intervalId = window.setInterval(function () {
        display(true);
        if (curr == logs.length - 1) {
            clearInterval(intervalId);
        }
    }, 500);
}