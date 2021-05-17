var _logs = []; // container for the logs
var _curr = -1; // currently displayed log index
const _displayContainer = document.getElementById('display');
var _actionListeners = new Map();
var _afterListeners = new Map();
var _fullcode = ""
var _currentSolution = 1

class Teacher {

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
            new TArray(
                4,
                4,
                'chessboard',
                [
                    [
                        'isSafe',
                        (that, log) => {
                            that.select(log[1][1], log[1][2], 'red')
                        }
                    ],
                    [
                        'nQueensRecursive',
                        (that, log) => {
                            that.deselect();
                            log[1][_currentSolution].filter(el => {
                                return el != null;
                            }).forEach(el => { that.select(el.rowIndex, el.columnIndex, 'green'); });
                        }
                    ]
                ],
                [
                    [
                        'isSafe',
                        (that, log) => {
                            if (log[3] === true) {
                                that.select(log[1][1], log[1][2], 'green')
                            } else {
                                that.select(log[1][1], log[1][2], 'white')
                            }
                        }
                    ]
                ],
                ["chessboard"])
            _curr++;
        }
        Teacher.updateObjects(_curr, shouldGoForward);
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
        }, 50);
    }
}