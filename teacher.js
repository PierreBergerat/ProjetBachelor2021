var logs = []; // container for the logs
var curr = -1; // currently displayed log index
const displayContainer = document.getElementById('display');
const algorithm = document.getElementById('algorithm');
var actionListeners = new Map();
var afterListeners = new Map();

class Utils {
    /**
     * 
     * @param {*} array 
     * @param {*} subarray 
     * @returns 
     */
    static findSubArray(array, subarray) {
        var i = 0, sl = subarray.length, l = array.length + 1 - sl;
        loop: for (; i < l; i++) {
            for (var j = 0; j < sl; j++) {
                if (array[i + j] !== subarray[j]) {
                    continue loop;
                }
            }
            return i;
        }
        return -1;
    }

    /**
     * 
     * @param {*} o 
     * @returns 
     */
    static deepCopy(o) {
        return JSON.parse(JSON.stringify(o));
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
 * 
 * @param {*} curr 
 * @param {*} isGoingForward 
 */
function updateObjects(curr, isGoingForward) {
    if (curr > 0) {
        lastLog = logs[curr - 1];
        for (let obj of afterListeners.get(lastLog[0].split('()')[0]) || []) {
            if (obj[0][obj[1]]) {
                obj[0][obj[1]](lastLog, isGoingForward);
            } else {
                obj[1].call(this, obj[0], lastLog, isGoingForward);
            }
        }
    }
    currentLog = logs[curr];
    for (let obj of actionListeners.get(currentLog[0].split('()')[0]) || []) {
        if (obj[0][obj[1]]) {
            obj[0][obj[1]](currentLog, isGoingForward);
        } else {
            obj[1].call(this, obj[0], currentLog, isGoingForward);
        }
    }
}

/**
 * 
 */
class TItem {
    constructor(before, after) {
        this.setBeforeFunction(before);
        this.setAfterFunction(after);
    }

    setBeforeFunction(beforeAction) {
        if (!beforeAction) {
            return;
        }
        for (let [funcName, func] of beforeAction) {
            actionListeners.get(funcName)?.push([this, func]) || actionListeners.set(funcName, [[this, func]]);
        }
    }

    setAfterFunction(afterAction) {
        if (!afterAction) {
            return;
        }
        for (let [funcName, func] of afterAction) {
            afterListeners.get(funcName)?.push([this, func]) || afterListeners.set(funcName, [[this, func]]);
        }
    }

    runBeforeFunction(beforeAction) {
        for (let [funcName, func] of beforeAction) {
            actionListeners.get(funcName)?.push([this, func]) || actionListeners.set(funcName, [[this, func]]);
        }
    }

    runAfterFunction(afterAction) {
        for (let [funcName, func] of afterAction) {
            afterListeners.get(funcName)?.push([this, func]) || afterListeners.set(funcName, [[this, func]]);
        }
    }
}

/**
 * 
 */
class TArray extends TItem {
    /**
     * 
     * @param {*} refArray 
     * @param {*} container 
     * @param {*} beforeAction 
     * @param {*} afterAction 
     */
    constructor(refArray, container, beforeAction, afterAction) {
        super(beforeAction, afterAction);
        this.refArray = refArray;
        this.screenArray = document.createElement('table');
        let row = document.createElement('tr');
        for (let i in this.refArray) {
            let element = document.createElement('td');
            element.innerText = this.refArray[i];
            row.appendChild(element);
        }
        this.screenArray.appendChild(row);
        document.getElementById(container).appendChild(this.screenArray);
        this.screenArray.classList.add('table');
    }

    /**
     * 
     * @param {*} newArr 
     */
    updateArray(newArr) {
        this.refArray = newArr;
        let values = this.screenArray.getElementsByTagName('td');
        for (let i in this.refArray) {
            values[i].innerText = this.refArray[i];
        }
    }

    /**
     * 
     */
    displayArray() {
        console.log("Mon array est beau : " + this.refArray);
    }

    /**
     * 
     * @param {*} indexes 
     * @param {*} color 
     */
    select(indexes, color) {
        let className = color ? `selected-${color}` : 'selected';
        Array.from(this.screenArray.querySelectorAll("[class^=selected]")).forEach(elem => {
            elem.classList.remove('selected', 'selected-red');
        });
        let items = this.screenArray.getElementsByTagName('td');
        if (typeof indexes === 'number') {
            indexes = [indexes];
        }
        for (let index of indexes) {
            items[index].classList.add(className);
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
        new TArray([12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 4891, 455, 23, 234, 213],
            'table',
            [
                [
                    'swap', (that, log) => {
                        that.select([log[1][1], log[1][1] + 1], 'red');
                    }
                ],
                [
                    'isSmaller', (that, log) => {
                        let index = Utils.findSubArray(that.refArray, log[1]);
                        if (index == -1) {
                            index = Utils.findSubArray(that.refArray, Utils.deepCopy(log[1]).reverse());
                            that.select([index, index + 1]);
                        } else {
                            that.select([index, index + 1]);
                        }
                    }
                ]
            ],
            [
                [
                    'swap', (that, log) => { that.updateArray(log[3]) }
                ],
                [
                    'isSmaller', 'displayArray'
                ]
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

/**
 * 
 * @param {*} id 
 */
function play(id) {
    id = id.target ? id.target?.id : id;
    let clickHandler = function () {
        shouldRun = false;
    }
    let shouldRun = true;
    let button = document.getElementById(id);
    let textBackup = button.innerText;
    button.innerText = "Stopper la séquence";
    button.removeAttribute("onclick");
    button.removeEventListener('click', play);
    button.addEventListener('click', clickHandler);

    var intervalId = window.setInterval(function () {
        display(true);
        if (curr == logs.length - 1 || !shouldRun) {
            clearInterval(intervalId);
            button.removeEventListener('click', clickHandler);
            button.innerText = textBackup;
            button.addEventListener('click', play);
        }
    }, 500);
}