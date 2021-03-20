class Table {
    /**
     * 
     * @constructor
     * @param {string} container 
     */
    constructor(container) {
        this.sortBy = -1;
        this.data = [[]];
        this.loading = false
        this.rows = 0;
        this.cols = 0;
        let buttonContainer = document.createElement('div');
        buttonContainer.setAttribute('id', 'buttonContainer');
        this.inputLabel = document.createElement('label');
        this.inputLabel.setAttribute('class', 'artint-buttons');
        this.inputLabel.setAttribute('for', 'dataEntryTableFileSelector');
        this.inputLabel.innerText = 'Charger des données à partir d\'un fichier';
        document.getElementById(container).appendChild(this.inputLabel);
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'file');
        this.input.setAttribute('id', 'dataEntryTableFileSelector');
        this.input.setAttribute('accept', '.csv, .xml, .tsv');
        this.input.addEventListener("change", (e) => { this.handleFiles(e) }, true);
        this.input.style.display = 'none';
        document.getElementById(container).appendChild(this.input);
        let addColButton = this.createButton("Ajouter une colonne", () => { this.addColTo(this.cols) });
        buttonContainer.appendChild(addColButton);
        let addRowButton = this.createButton("Ajouter une ligne", () => { this.addRowTo(this.rows) });
        buttonContainer.appendChild(addRowButton);
        let deleteColButton = this.createButton("Supprimer une colonne", () => { this.deleteColFrom(this.cols - 1) });
        buttonContainer.appendChild(deleteColButton);
        let deleteRowButton = this.createButton("Supprimer une ligne", () => { this.deleteRowFrom(this.rows - 1) });
        buttonContainer.appendChild(deleteRowButton);
        this.table = document.getElementById(container).appendChild(buttonContainer)
        this.table = document.getElementById(container).appendChild(document.createElement('div'));
        this.table.classList.add('artint-table');
    }

    /**
     * 
     * @param {*} innerTextValue 
     * @param {*} onClickCb 
     * @returns 
     */
    createButton(innerTextValue, onClickCb) {
        let button = document.createElement('span');
        button.setAttribute('class', 'artint-buttons');
        button.innerText = innerTextValue;
        button.addEventListener('click', onClickCb);
        return button
    }

    setSize = (rows, cols) => {
        this.rows = rows;
        this.cols = cols;
        this.table.style.setProperty('--grid-rows', rows);
        this.table.style.setProperty('--grid-cols', cols);
    }

    /**
     * 
     * @param {*} rows 
     * @param {*} cols 
     */
    makeTable = (rows, cols) => {
        this.table.innerHTML = "";
        this.setSize(rows, cols)
        for (let c = 0; c < (rows * cols); c++) {
            let cell = document.createElement("input");
            if (c >= cols) {
                cell.setAttribute("col", c % cols);
                cell.setAttribute("row", ~~(c / cols) - 1);
            } else {
                cell.setAttribute("header", (c));
            }
            this.table.appendChild(cell).className = "artint-grid-item"
        };
        this.table.addEventListener('keydown', this.handleKeys, true)
        this.table.addEventListener('contextmenu', (e) => { this.showContextMenu(e) }, true);
        this.table.addEventListener('input', (e) => { this.logChangesIntoData(e) }, true);
    }

    logChangesIntoData(e) {
        e = e || window.event;
        if (e.target.tagName !== 'INPUT') {
            return;
        }
        if (e.target.hasAttribute('header')) {
            this.data[0][Number(e.target.attributes.header.value)] = e.target.value
        } else {
            this.data[Number(e.target.attributes.row.value) + 1][Number(e.target.attributes.col.value)] = e.target.value
        }
    }

    showContextMenu(e) {
        e = e || window.event;
        if (e.target.tagName !== 'INPUT') {
            return;
        }
        e.preventDefault();
        if (e.target.hasAttribute('header')) {
            let col = e.target.attributes.header.value
            if (this.sortBy == col) {
                this.data = [this.data[0]].concat(this.data.filter((c, r) => { return r != 0 }).sort((a, b) => { return a[col] < b[col] }));
                this.sortBy = -1;
            } else {
                this.data = [this.data[0]].concat(this.data.filter((c, r) => { return r != 0 }).sort((a, b) => { return a[col] > b[col] }));
                this.sortBy = col;
            }
            this.fillTable(this.data);
            return
        }
        try { document.getElementById("artintContextualMenu").remove(); } catch (err) { }
        let contextMenu = document.createElement("div")
        contextMenu.id = "artintContextualMenu"
        contextMenu.classList.add("artintContextualMenu")
        contextMenu.style = `top:${e.pageY - 10}px;left:${e.pageX - 40}px`
        contextMenu.onmouseleave = () => document.getElementById("artintContextualMenu").remove()
        let addColButton = document.createElement('p');
        addColButton.innerText = "Ajouter une colonne";
        let addColButtonBefore = document.createElement('p');
        addColButtonBefore.id = "addColButtonBefore";
        addColButtonBefore.classList.add("addColButtonSubMenu")
        addColButtonBefore.innerText = "Ajouter avant";
        addColButtonBefore.style.textAlign = "right";
        addColButtonBefore.addEventListener('click', () => {
            document.getElementById("artintContextualMenu").remove();
            if (e.target.hasAttribute('header')) {
                this.addColTo(Number(e.target.attributes.header.value));
            } else {
                this.addColTo(Number(e.target.attributes.col.value));
            }
        })
        let addColButtonAfter = document.createElement('p');
        addColButtonAfter.id = "addColButtonAfter"
        addColButtonAfter.classList.add("addColButtonSubMenu")
        addColButtonAfter.innerText = "Ajouter après";
        addColButtonAfter.style.textAlign = "right";
        addColButtonAfter.addEventListener('click', () => {
            document.getElementById("artintContextualMenu").remove()
            if (e.target.hasAttribute('header')) {
                this.addColTo(Number(e.target.attributes.header.value) + 1);
            } else {
                this.addColTo(Number(e.target.attributes.col.value) + 1);
            }
        })
        addColButton.addEventListener('click', () => {
            Array.from(document.getElementsByClassName("addRowButtonSubMenu")).forEach(e => { e.remove() })
            let tmp = document.getElementsByClassName("addColButtonSubMenu");
            if (tmp.length) {
                Array.from(tmp).forEach(e => { e.remove() });
            } else {
                contextMenu.insertBefore(addColButtonAfter, addColButton.nextSibling);
                contextMenu.insertBefore(addColButtonBefore, addColButton.nextSibling);
            }
        })
        let addRowButton = document.createElement('p');
        addRowButton.innerText = "Ajouter une ligne";
        let addRowButtonBefore = document.createElement('p');
        addRowButtonBefore.id = "addRowButtonBefore";
        addRowButtonBefore.classList.add("addRowButtonSubMenu")
        addRowButtonBefore.innerText = "Ajouter avant";
        addRowButtonBefore.style.textAlign = "right";
        addRowButtonBefore.addEventListener('click', () => {
            document.getElementById("artintContextualMenu").remove();
            if (e.target.hasAttribute('header')) {
                this.addRowTo(1);
            } else {
                this.addRowTo(Number(e.target.attributes.row.value) + 1)
            }
        })
        let addRowButtonAfter = document.createElement('p');
        addRowButtonAfter.id = "addRowButtonAfter"
        addRowButtonAfter.classList.add("addRowButtonSubMenu")
        addRowButtonAfter.innerText = "Ajouter après";
        addRowButtonAfter.style.textAlign = "right";
        addRowButtonAfter.addEventListener('click', () => {
            document.getElementById("artintContextualMenu").remove();
            if (e.target.hasAttribute('header')) {
                this.addRowTo(1);
            } else {
                this.addRowTo(Number(e.target.attributes.row.value) + 2)
            }
        })
        addRowButton.addEventListener('click', () => {
            Array.from(document.getElementsByClassName("addColButtonSubMenu")).forEach(e => { e.remove() })
            let tmp = document.getElementsByClassName("addRowButtonSubMenu");
            if (tmp.length) {
                Array.from(tmp).forEach(e => { e.remove() });
            } else {
                contextMenu.insertBefore(addRowButtonAfter, addRowButton.nextSibling);
                contextMenu.insertBefore(addRowButtonBefore, addRowButton.nextSibling);
            }
        })
        let emptyColButton = document.createElement('p')
        emptyColButton.innerText = "Effacer la colonne";
        emptyColButton.addEventListener('click', () => {
            document.getElementById("artintContextualMenu").remove();
            let colNumber = -1;
            if (e.target.hasAttribute("header")) {
                colNumber = e.target.attributes.header.value
            } else {
                colNumber = e.target.attributes.col.value
            }
            let itemIndex = colNumber
            this.data.forEach(ligne => { ligne[colNumber] = '' })
            let elem = this.table.children[itemIndex]
            while (elem) {
                elem.value = ''
                itemIndex = Number(itemIndex) + this.cols
                elem = this.table.children[itemIndex]
            }
        })
        let emptyRowButton = document.createElement('p')
        emptyRowButton.innerText = "Effacer la ligne"
        emptyRowButton.addEventListener('click', () => {
            document.getElementById("artintContextualMenu").remove();
            if (e.target.hasAttribute("header")) {
                return;
            }
            for (let i = 0; i < this.cols; i++) {
                this.data[Number(e.target.attributes.row.value)][i] = ''
                this.table.children[e.target.attributes.row.value * this.cols + this.cols + i].value = ''
            }
        })
        let deleteColButton = document.createElement('p')
        deleteColButton.innerText = "Supprimer la colonne"
        deleteColButton.addEventListener('click', () => {
            document.getElementById("artintContextualMenu").remove();
            if (e.target.hasAttribute('header')) {
                this.deleteColFrom(Number(e.target.attributes.header.value));
            } else {
                this.deleteColFrom(Number(e.target.attributes.col.value))
            }
        })
        let deleteRowButton = document.createElement('p')
        deleteRowButton.innerText = "Supprimer la ligne";
        deleteRowButton.addEventListener('click', () => {
            document.getElementById("artintContextualMenu").remove();
            if (e.target.hasAttribute("header")) {
                return;
            } else {
                this.deleteRowFrom(Number(e.target.attributes.row.value) + 1)
            }
        })
        contextMenu.appendChild(addColButton)
        contextMenu.appendChild(addRowButton)
        contextMenu.appendChild(emptyColButton)
        contextMenu.appendChild(emptyRowButton)
        contextMenu.appendChild(deleteColButton)
        contextMenu.appendChild(deleteRowButton)
        document.body.appendChild(contextMenu)
    }


    /**
     * 
     * @param {*} e 
     * @returns 
     */
    handleKeys(e) {
        e = e || window.event;
        if (e.target.tagName !== 'INPUT') {
            return;
        }
        let sourceX = -1, sourceY = -1;
        let target = null;
        if (e.ctrlKey) {
            switch (e.keyCode) {
                case 37:
                    e.preventDefault();
                    if (e.target.selectionStart - 1 >= 0) {
                        e.target.setSelectionRange(e.target.selectionStart - 1, e.target.selectionEnd - 1);
                        e.selectionDirection = "backward";
                    }
                    break
                case 39:
                    e.preventDefault();
                    if (e.target.selectionStart + 1 <= e.target.value.length) {
                        e.target.setSelectionRange(e.target.selectionStart + 1, e.target.selectionEnd + 1);
                        e.selectionDirection = "forward";
                    }
                    break;
                default: break;
            }
            return;
        }
        if (e.target.hasAttribute("col") && e.target.hasAttribute("row")) {
            sourceX = Number(e.target.attributes.col.value), sourceY = Number(e.target.attributes.row.value);
        } else {
            if (e.target.hasAttribute("header")) {
                sourceX = Number(e.target.attributes.header.value);
            } else {
                return;
            }
        }
        switch (e.keyCode) {
            case 37:
                e.preventDefault();
                target = document.querySelector(`[col="${sourceX - 1}"][row="${sourceY}"]`);
                if (!target) {
                    target = document.querySelector(`[header="${sourceX - 1}"]`);
                }
                break;
            case 38:
                e.preventDefault();
                target = document.querySelector(`[col="${sourceX}"][row="${sourceY - 1}"]`);
                break;
            case 39:
                e.preventDefault();
                target = document.querySelector(`[col="${sourceX + 1}"][row="${sourceY}"]`);
                if (!target) {
                    target = document.querySelector(`[header="${sourceX + 1}"]`);
                }
                break;
            case 40:
                e.preventDefault();
                target = document.querySelector(`[col="${sourceX}"][row="${sourceY + 1}"]`);
                break;
            default:
                return;
        }
        if (target) {
            target.focus();
        } else if (e.keyCode == 38 && sourceY == 0) {
            document.querySelector(`[header="${sourceX}"]`).focus();
        }
    }

    /**
     * 
     * @param {*} n 
     */
    addColTo(n) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].splice(n, 0, '')
        }
        this.makeTable(this.data.length, this.data[0].length);
        this.fillTable(this.data);
    }

    /**
     * 
     * @param {*} n 
     */
    addRowTo(n) {
        if (this.data.length && !this.data[0].length) {
            return;
        }
        this.data.splice(n, 0, Array(this.data[0].length).fill(''))
        this.makeTable(this.data.length, this.data[0].length);
        this.fillTable(this.data);
    }

    /**
     * 
     * @param {*} n 
     */
    deleteColFrom(n) {
        if (this.data.length && !this.data[0].length) {
            return
        }
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].splice(n, 1)
        }
        this.makeTable(this.data.length, this.data[0].length);
        this.fillTable(this.data);
    }

    /**
     * 
     * @param {*} n 
     */
    deleteRowFrom(n) {
        if (this.data.length <= 1 || !this.data[0].length) {
            return;
        }
        this.data.splice(n, 1);
        this.makeTable(this.data.length, this.data[0].length);
        this.fillTable(this.data);
    }

    /**
     * 
     * @param {*} data 
     */
    fillTable = (data) => {
        let rowSize = data[0].length;
        data = data.flat();
        let cells = Array.from(document.getElementsByClassName("artint-grid-item"));
        for (let i = 0; i < cells.length; i++) {
            if (i < rowSize) {
                cells[i].classList.add('header');
            }
            cells[i].value = data[i];
        }
    }

    CSV = {
        /**
         * 
         * @param {*} csv 
         * @param {*} reviver 
         * @returns 
         */
        parse: function (csv, reviver) {
            reviver = reviver || function (r, c, v) { return v; };
            var chars = csv.split(''), c = 0, cc = chars.length, start, end, table = [], row;
            while (c < cc) {
                table.push(row = []);
                while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {
                    start = end = c;
                    if ('"' === chars[c]) {
                        start = end = ++c;
                        while (c < cc) {
                            if ('"' === chars[c]) {
                                if ('"' !== chars[c + 1]) {
                                    break;
                                }
                                else {
                                    chars[++c] = '';
                                }
                            }
                            end = ++c;
                        }
                        if ('"' === chars[c]) {
                            ++c;
                        }
                        while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) {
                            ++c;
                        }
                    } else {
                        while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) {
                            end = ++c;
                        }
                    }
                    row.push(reviver(table.length - 1, row.length, chars.slice(start, end).join('')));
                    if (',' === chars[c]) {
                        ++c;
                    }
                }
                if ('\r' === chars[c]) {
                    ++c;
                }
                if ('\n' === chars[c]) {
                    ++c;
                }
            }
            return table;
        }
    };

    XML = {
        /**
         * 
         * @param {*} xml 
         */
        parse: function (xml) {

        }
    }

    /**
     * 
     * @param {*} event 
     */
    handleFiles(event) {
        let fileType = event.target.value.split('.').pop().toLowerCase();
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            switch (fileType) {
                case 'csv':
                    this.data = this.CSV.parse(text);
                    this.makeTable(this.data.length, this.data[0].length);
                    this.fillTable(this.data);
                    break;
                case 'xml':
                    this.parseXML(text);
                    break;
                default:
                    break;
            }
        };
        reader.readAsText(event.target.files[0]);
    };

    /**
     * 
     * @param {*} col 
     * @returns 
     */
    getColValues = (col, shouldIncludeHeaders = true) => {
        if (typeof (col) === 'string') {
            if (shouldIncludeHeaders) {
                return this.filterData((element, x, y) => { return x == this.data[0].indexOf(col) })
            }
            return this.filterData((element, x, y) => { return y != 0 && x == this.data[0].indexOf(col) })
        }
        if (typeof (col) === 'number') {
            if (shouldIncludeHeaders) {
                return this.filterData((element, x, y) => { return x == col })
            }
            return this.filterData((element, x, y) => { return y != 0 && x == col })
        }
        return null;
    }

    /**
     * 
     * @param {*} col 
     * @returns 
     */
    getColName = (col) => {
        return this.data[0][col]
    }

    getColByName = (colName) => {
        return this.data[0].indexOf(colName)
    }

    /**
     * 
     * @returns 
     */
    getNumberCols = () => {
        return this.cols;
    }

    /**
     * 
     * @returns 
     */
    getNumberRows = () => {
        return this.rows;
    }

    /**
     * 
     * @returns 
     */
    getTotalCellsNumber = () => {
        return this.rows * this.cols;
    }

    /**
     * 
     * @param {*} where 
     * @returns 
     */
    filterData = (where) => {
        let res = []
        this.data.forEach((row, indexRow) => { row.forEach((_, indexCol) => { if (where(this.data[indexRow][indexCol], indexCol, indexRow)) { res.push({ x: indexCol, y: indexRow, value: this.data[indexRow][indexCol] }) } }) })
        return res
    }
}

class Utils {

    static rounded = (val, nth) => {
        if (nth < 0 || typeof (nth) !== 'number') {
            return val
        }
        return Math.floor(val * 10 ** nth) / 10 ** nth
    }

    static calculateEntropy = (arr, size) => {
        console.log('(-' + arr.length + '/' + size + ') * Math.log2(' + arr.length + '/' + size + ') - (' + (size - arr.length) + '/' + size + ') * Math.log2(' + (size - arr.length) + '/' + size + ') ~= ' + ((-arr.length / size) * Math.log2(arr.length / size) - ((size - arr.length) / size) * Math.log2((size - arr.length) / size)));
        return (-arr.length / size) * Math.log2(arr.length / size) - ((size - arr.length) / size) * Math.log2((size - arr.length) / size)
    }

    /**
     * 
     * @param {*} arr 
     * @returns 
     */
    static avg = (arr) => {
        return (arr.reduce((a, b) => a + b, 0)) / arr.length;
    }

    /**
     * 
     * @param {*} arr 
     * @returns 
     */
    static stdDev = (arr) => {
        let mean = arr.reduce((a, b) => a + b) / arr.length;
        return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / arr.length);
    }

    /**
     * 
     * @param {*} arr 
     * @returns 
     */
    static uniqueValues = (arr) => {
        let res = {}
        arr.forEach(el => {
            res[el] = res[el] + 1 || 1;
        })
        return res;
    }

    /**
     * 
     * @param {*} arr 
     * @returns 
     */
    static sum(arr) {
        return arr.reduce((a, b) => a + b, 0);
    }

    /**
     * 
     * @param {*} arr 
     * @returns 
     */
    static max(arr) {
        return arr.reduce((a, b) => a > b ? a : b);
    }

    /**
     * 
     * @param {*} arr 
     * @returns 
     */
    static min(arr) {
        return arr.reduce((a, b) => a < b ? a : b);
    }
}

class Algorithm {
    /**
     * 
     * @param {*} name 
     */
    constructor(name) {
        this.name = name;
        this.tasks = [];
        this.table = null;
    }

    /**
     * 
     * @param {*} container 
     */
    createTable = (container) => {
        this.table = new Table(container);
    }

    /**
     * 
     * @param {*} nom 
     */
    addTask = (task) => {
        this.tasks.push(task);
    }

    /**
     * 
     * @returns 
     */
    playNextTask = () => {
        if (this.tasks.length > 0) {
            let task = this.tasks.shift()
            return task.play(task.actions)
        }
    }

    display = (msg, lvl = 1) => {
        lvl = lvl <= 0 ? 1 : lvl + 1;
        let tab = ''
        for (let i = 0; i < lvl; i++) {
            tab += '\t'
        }
        console.log(tab + msg);
    }

}

/**
 * 
 */
class Task {
    /**
     * 
     * @param {*} name 
     */
    constructor(name, description, actions) {
        this.name = name;
        this.description = description;
        if (!actions) {
            throw new Error('\"actions\" parameter is mandatory in \"Task\" constructor')
        }
        if (actions.constructor === Array) {
            this.actions = actions
        } else if (actions instanceof Function) {
            this.actions = [actions]
        } else {
            throw new Error('\"actions\" parameter should be of type Array[Function] or Function, here : ' + actions.constructor.name)
        }
        this.returnedValues = []
    }

    play = (funcArr, param = null) => {
        if (!funcArr.length) {
            return param
        }
        let func = funcArr.shift()
        return this.play(funcArr, func(param))
    }
}
