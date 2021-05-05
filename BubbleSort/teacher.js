var _logs = []; // container for the logs
var _curr = -1; // currently displayed log index
const _displayContainer = document.getElementById('display');
const _algorithm = document.getElementById('algorithm');
var _actionListeners = new Map();
var _afterListeners = new Map();
var _fullcode = ""

class Utils {
    /**
     * Returns the index of the first element of the subarray in array
     * @param {Array} array - Array potentially containing subarray
     * @param {Array} subarray - Array that will be look for in array
     * @returns The index of the first element of subarray in array, or -1 if subarray not found.
     */
    static findSubArray(array, subarray) {
        var i = 0, sl = subarray.length, l = array.length + 1 - sl;
        loop: for (; i < l; i++) { // "loop:" is a label that allows us to jump out of the nested loop
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
     * Returns a deep copy of o. Therefore, the returned object won't have any references to o.
     * @param {Object} o - The object to copy
     * @returns a deep copy of o
     */
    static deepCopy(o) {
        return JSON.parse(JSON.stringify(o));
    }
}

/**
 * Is used to implement listeners in any classes extending TItem.
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
        for (let [funcName, func] of beforeAction) {// Adds / Appends an array of form [object, function] to actionListeners
            _actionListeners.get(funcName)?.push([this, func]) || _actionListeners.set(funcName, [[this, func]]);
        }
    }

    setAfterFunction(afterAction) {
        if (!afterAction) {
            return;
        }
        for (let [funcName, func] of afterAction) {
            _afterListeners.get(funcName)?.push([this, func]) || _afterListeners.set(funcName, [[this, func]]);
        }
    }
}

/**
 * 
 */
class TArray extends TItem {
    /**
     * Creates a new TArray and registers its listeners
     * @param {Array} refArray - array of reference for the new TArray
     * @param {HTMLElement} container - where to display the TArray
     * @param {Array.<Array.<String,Function>>} beforeAction - beforeListeners
     * @param {Array.<Array.<String,Function>>} afterAction - afterListeners
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
     * Updates the TArray with new values
     * @param {Array} newArr - new values to update the TArray with
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
     * @param {Array.<Number>} indexes - what indexes of the array to select
     * @param {mixed} color - which color it should be selected with (only supports red for now but more can be added in style.css)
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
        if (indexes.includes(-1)) {
            return
        }
        for (let index of indexes) {
            try {
                items[index].classList.add(className);
            }
            catch (e) {
                console.log(`indexes : ${indexes}`);
                console.log(e);
            }
        }
    }
}

class Teacher {

    static setText(text) {
        _fullcode = text;
        _algorithm.innerHTML = `<pre>${_fullcode}</pre>`;
        _algorithm.innerHTML = '<pre>' + _algorithm.innerHTML
            .replaceAll('<span>', '')
            .replaceAll('</span>', '')
            .replaceAll('<pre>', '')
            .replaceAll('</pre>', '')
            .split("function " + _logs[_curr][0].replaceAll(')', ''))
            .join(`</pre><span>function ${_logs[_curr][0].replaceAll('()', '')}</span><pre>(`) + '</pre>';
        document.getElementById('algorithm').getElementsByTagName('span')[0].scrollIntoView()
    }

    /**
     * Check will be able to verify the values/names/code of the current function and to interrupt it or react accordingly to the values read
     * @param {Function} func - The function that has been called
     * @param {String} name - The name of the function
     * @param {IArguments} args - the function's arguments
     */
    static log(func, name, args) {
        if (name && args) {
            _logs.push([name.toString() + '()', Utils.deepCopy(args), func.toString()]);
        } else {
            for (let i = _logs.length - 1; i >= 0; i--) {
                if (_logs[i].length != 4) {
                    _logs[i].push(Utils.deepCopy(func));
                    break;
                }
            }
        }
    }

    /**
     * Triggers the functions linked to the listeners
     * @param {Number} curr - The index of the currently displayed log
     * @param {Boolean} isGoingForward - Whether display is going forward or backward
     */
    static updateObjects(curr, isGoingForward) {
        if (curr > 0) {
            let lastLog = _logs[curr - 1];
            for (let obj of _afterListeners.get(lastLog[0].split('()')[0]) || []) {
                if (obj[0][obj[1]]) { // if the object calling has the function as a method
                    obj[0][obj[1]](lastLog, isGoingForward); // then it is called as object.method()
                } else { // otherwise the function is called globally and a reference to obj[0] is passed
                    obj[1].call(this, obj[0], lastLog, isGoingForward);
                }
            }
        }
        let currentLog = _logs[curr];
        for (let obj of _actionListeners.get(currentLog[0].split('()')[0]) || []) {
            if (obj[0][obj[1]]) {
                obj[0][obj[1]](currentLog, isGoingForward);
            } else {
                obj[1].call(this, obj[0], currentLog, isGoingForward);
            }
        }
    }

    /**
     * Displays the current log to the screen in a preformated placeholder
     * @param {Boolean} shouldGoForward - Indicates whether the display should show the next or the previous state
     */
    static display(shouldGoForward = true) {
        if (_curr != -1) {
            if (shouldGoForward) {
                _curr < (_logs.length - 1) ? _curr += 1 : _curr;
            } else {
                _curr > 0 ? _curr -= 1 : _curr;
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
                    ]
                ]);
            _curr++;
        }
        Teacher.updateObjects(_curr, shouldGoForward);
        _algorithm.innerHTML = '<pre>' + _algorithm.innerHTML
            .replaceAll('<span>', '')
            .replaceAll('</span>', '')
            .replaceAll('<pre>', '')
            .replaceAll('</pre>', '')
            .split("function " + _logs[_curr][0].replaceAll(')', ''))
            .join(`</pre><span>function ${_logs[_curr][0].replaceAll('()', '')}</span><pre>(`) + '</pre>';
        try {
            document.getElementById('algorithm').getElementsByTagName('span')[0].scrollIntoView()
        } catch (err) { }
        _displayContainer.innerHTML = "";
        for (let elem in _logs[_curr]) {
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
                p.innerHTML += JSON.stringify(_logs[_curr][elem]);
            } else {
                p.innerHTML += _logs[_curr][elem];
            }
            _displayContainer.appendChild(p);
        }
    }

    /**
     * Automatically plays the next log until the end or until the button is pressed again
     * @param {string} id - the id of the start / stop button
     */
    static play(id) {
        id = id.target ? id.target?.id : id;
        let clickHandler = function () {
            shouldRun = false;
        }
        let shouldRun = true;
        let button = document.getElementById(id);
        let textBackup = button.innerText;
        button.innerText = "Stopper la séquence";
        button.removeAttribute("onclick");
        button.removeEventListener('click', Teacher.play);
        button.addEventListener('click', clickHandler, { once: true });

        var intervalId = window.setInterval(function () {
            Teacher.display(true);
            if (_curr == _logs.length - 1 || !shouldRun) {
                clearInterval(intervalId);
                button.innerText = textBackup;
                button.addEventListener('click', Teacher.play);
            }
        }, 500);
    }
}