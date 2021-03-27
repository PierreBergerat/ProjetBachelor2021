class Table {
    /**
     * 
     * @constructor Creates a new table
     * @param {string} container - the id of a div which will contain the table
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
        this.input.setAttribute('accept', '.csv');
        this.input.addEventListener("change", (e) => { this.handleFiles(e) }, true);
        this.input.style.display = 'none';
        document.getElementById(container).appendChild(this.input);
        let addColButton = Utils.createButton("Ajouter une colonne", () => { this.addColTo(this.cols) });
        buttonContainer.appendChild(addColButton);
        let addRowButton = Utils.createButton("Ajouter une ligne", () => { this.addRowTo(this.rows) });
        buttonContainer.appendChild(addRowButton);
        let deleteColButton = Utils.createButton("Supprimer une colonne", () => { this.deleteColFrom(this.cols - 1) });
        buttonContainer.appendChild(deleteColButton);
        let deleteRowButton = Utils.createButton("Supprimer une ligne", () => { this.deleteRowFrom(this.rows - 1) });
        buttonContainer.appendChild(deleteRowButton);
        this.table = document.getElementById(container).appendChild(buttonContainer)
        this.table = document.getElementById(container).appendChild(document.createElement('div'));
        this.table.classList.add('artint-table');
    }

    /**
     * Sets the size of the table (data structure)
     * @param {Number} rows - The number of rows the table should have once set 
     * @param {Number} cols - The number of cols the table should have once set
     */
    setSize = (rows, cols) => {
        this.rows = rows;
        this.cols = cols;
        this.table.style.setProperty('--grid-rows', rows);
        this.table.style.setProperty('--grid-cols', cols);
    }

    /**
     * Creates the table per se, creating each cells needed to fill a table of size rows*cols (html wise)
     * @param {*} rows - The number of rows the table should have once set 
     * @param {*} cols - The number of cols the table should have once set
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

    /**
     * Stores changes made in the html (user input) into the data structure
     * @param {Event} e 
     * @returns 
     */
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

    /**
     * Creates and displays the contextual menu (right-click menu)
     * @param {Event} e 
     * @returns 
     */
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
     * Handles key input made in the table
     * @param {Event} e 
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
     * Adds a column to the nth position of the table then refreshes the display
     * @param {Number} n - the position of the column to be added
     */
    addColTo(n) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].splice(n, 0, '')
        }
        this.makeTable(this.data.length, this.data[0].length);
        this.fillTable(this.data);
    }

    /**
     * Adds a row to the nth position of the table then refreshes the display
     * @param {Number} n - the position of the row to be added
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
     * Removes the nth col of the table then refreshes the display
     * @param {Number} n - the position of the column to be removed
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
     * Removes the nth row of the table then refreshes the display
     * @param {Number} n - the position of the row to be removed 
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
     * Fills an already created table with parsed data
     * @param {Array[Array]} data - Parsed data (coming from CSV.parse)
     */
    fillTable = (data) => {
        let rowSize = data[0].length;
        data = data.flat();
        let cells = this.table.children;
        for (let i = 0; i < cells.length; i++) {
            if (i < rowSize) {
                cells[i].classList.add('header');
            }
            cells[i].value = data[i];
        }
    }

    CSV = {
        /**
         * Parses CSV data
         * @param {String} csv - data (in csv form) to be parsed 
         * @param {Function} [filter=function (r, c, v) { return v; }] - Optionnal "reviver" function  that can be run after parsing
         * @returns the parsed data in an Array of Array
         */
        parse: function (csv, filter) {
            filter = filter || function (r, c, v) { return v; };
            var chars = csv.split(''), currChar = 0, nbChars = chars.length, start, end, table = [], row;
            while (currChar < nbChars) {
                table.push(row = []);
                while (currChar < nbChars && '\r' !== chars[currChar] && '\n' !== chars[currChar]) {
                    start = end = currChar;
                    if ('"' === chars[currChar]) {
                        start = end = ++currChar;
                        while (currChar < nbChars) {
                            if ('"' === chars[currChar]) {
                                if ('"' !== chars[currChar + 1]) {
                                    break;
                                }
                                else {
                                    chars[++currChar] = '';
                                }
                            }
                            end = ++currChar;
                        }
                        if ('"' === chars[currChar]) {
                            ++currChar;
                        }
                        while (currChar < nbChars && '\r' !== chars[currChar] && '\n' !== chars[currChar] && ',' !== chars[currChar]) {
                            ++currChar;
                        }
                    } else {
                        while (currChar < nbChars && '\r' !== chars[currChar] && '\n' !== chars[currChar] && ',' !== chars[currChar]) {
                            end = ++currChar;
                        }
                    }
                    row.push(filter(table.length - 1, row.length, chars.slice(start, end).join('')));
                    if (',' === chars[currChar]) {
                        ++currChar;
                    }
                }
                if ('\r' === chars[currChar]) {
                    ++currChar;
                }
                if ('\n' === chars[currChar]) {
                    ++currChar;
                }
            }
            return table;
        }
    };

    /**
     * Handles the upload of a file when the according field is triggered by the user
     * @param {Event} event 
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
                default:
                    alert('L\'extension de fichier n\'est pas valable. Veuillez n\'utiliser que des fichiers CSV.')
                    break;
            }
        };
        reader.readAsText(event.target.files[0]);
    };

    /**
     * 
     * @param {Number} col - The column index whose values should be returned
     * @param {Boolean} [shouldIncludeHeaders=true] - Indicated whether the headers should be included in the returned value 
     * @returns The values stored in col
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
     * @param {Number} col - The column index whose name should be returned
     * @returns The name of the col
     */
    getColName = (col) => {
        return this.data[0][col]
    }

    /**
     * 
     * @param {String} colName - The name of the column whose index should be returned
     * @returns The index of the column indicated by colName
     */
    getColByName = (colName) => {
        return this.data[0].indexOf(colName)
    }

    /**
     * 
     * @returns The number of cols the table has
     */
    getNumberCols = () => {
        return this.cols;
    }

    /**
     * 
     * @returns The number of rows the table has
     */
    getNumberRows = () => {
        return this.rows;
    }

    /**
     * 
     * @returns The total number of cells the table has
     */
    getTotalCellsNumber = () => {
        return this.rows * this.cols;
    }

    /**
     * Removes all selected cells
     */
    deselectAll = () => {
        if (this.selected) {
            this.selected.forEach(cell => { this.table.children[cell.y * algo.table.cols + cell.x].style.boxShadow = `none`; });
        }
        this.selected = []
    }

    /**
     * Select the html cells corresponding to the cells present in cellArr (result from filterData)
     * @param {Array[cell]} cellArr - Array of cell created with the filterData function
     * @param {String} [color=green] - CSS color of the selection
     * @param {Boolean} [shouldDeselect=true] - Indicates whether already selected files should be deselected or not
     */
    selectWhere = (cellArr, color = 'green', shouldDeselect = true) => {
        if (this.selected && shouldDeselect) {
            this.selected.forEach(cell => { this.table.children[cell.y * algo.table.cols + cell.x].style.boxShadow = `none`; });
            this.selected.length = 0;
        }
        cellArr.forEach(cell => { this.table.children[cell.y * algo.table.cols + cell.x].style.boxShadow = `inset 0px 0px 10px 1px ${color}`; });
        if (this.selected) {
            this.selected = [...this.selected, ...cellArr]
        }
        else { this.selected = cellArr }
    }

    /**
     * 
     * @param {Function} where - Function that has 3 params indicating a cell value, its column index and its row index. The return value is a filter of the params.
     * Each param has to be included in the function signature but doesn't have to be used in said function (see below)
     * Example of where value (ES6) : (e,x,y) => {return e == 'value' && x == 0 && y != 0} //Returns the cells having a value "value", a column index of 0 (first column) and a row index not equals to 0 (not a header)
     * Example of where value (old JS) : function(e,x,y){return y == 0} //Returns all headers
     * 
     * Others :
     * (e,x,y) => {return e.includes("value")} //Returns all cells whose value contains "value"
     * (e,x,y) => {return x != y} //Returns all cells which indexes are not the same for columns and rows
     * @returns an array of cells objects with their positions and value as attributes
     */
    filterData = (where) => {
        let res = []
        this.data.forEach((row, indexRow) => { row.forEach((_, indexCol) => { if (where(this.data[indexRow][indexCol], indexCol, indexRow)) { res.push({ x: indexCol, y: indexRow, value: this.data[indexRow][indexCol] }) } }) })
        return res
    }
}

class Utils {

    static createButton(innerTextValue, onClickCb) {
        let button = document.createElement('span');
        button.setAttribute('class', 'artint-buttons');
        button.innerText = innerTextValue;
        button.addEventListener('click', onClickCb);
        return button
    }

    static rounded = (val, nth) => {
        if (nth < 0 || typeof (nth) !== 'number') {
            return val
        }
        return Math.floor(val * 10 ** nth) / 10 ** nth
    }

    static entropyFormula = (arr, size) => {
        if (arr.constructor === Array) {
            return ('(-' + arr.length + '/' + size + ') * Math.log2(' + arr.length + '/' + size + ') - (' + (size - arr.length) + '/' + size + ') * Math.log2(' + (size - arr.length) + '/' + size + ') ~= ' + ((-arr.length / size) * Math.log2(arr.length / size) - ((size - arr.length) / size) * Math.log2((size - arr.length) / size)))
        } else if (typeof (arr) === 'number') {
            return ('(-' + arr + '/' + size + ') * Math.log2(' + arr + '/' + size + ') - (' + (size - arr) + '/' + size + ') * Math.log2(' + (size - arr) + '/' + size + ') ~= ' + ((-arr / size) * Math.log2(arr / size) - ((size - arr) / size) * Math.log2((size - arr) / size)))
        }

    }

    static calculateEntropy = (arr, size) => {
        if (arr.constructor === Array) {
            console.log('(-' + arr.length + '/' + size + ') * Math.log2(' + arr.length + '/' + size + ') - (' + (size - arr.length) + '/' + size + ') * Math.log2(' + (size - arr.length) + '/' + size + ') ~= ' + ((-arr.length / size) * Math.log2(arr.length / size) - ((size - arr.length) / size) * Math.log2((size - arr.length) / size)));
            return (-arr.length / size) * Math.log2(arr.length / size) - ((size - arr.length) / size) * Math.log2((size - arr.length) / size)
        } else if (typeof (arr) === 'number') {
            console.log('(-' + arr + '/' + size + ') * Math.log2(' + arr + '/' + size + ') - (' + (size - arr) + '/' + size + ') * Math.log2(' + (size - arr) + '/' + size + ') ~= ' + ((-arr / size) * Math.log2(arr / size) - ((size - arr) / size) * Math.log2((size - arr) / size)));
            return (-arr / size) * Math.log2(arr / size) - ((size - arr) / size) * Math.log2((size - arr) / size)
        } return null
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

    static mean(arr) {
        return arr.reduce((a, b) => a + b) / arr.length;
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

class Card {
    constructor(container) {
        this.container = document.getElementById(container);
        this.card = document.createElement('div');
        this.titleContainer = document.createElement('div');
        this.title = document.createElement('p');
        this.title.classList.add('artint-title');
        this.subtitleContainer = document.createElement('div');
        this.subtitle = document.createElement('p');
        this.subtitle.classList.add('artint-subtitle');
        this.descriptionContainer = document.createElement('div');
        this.description = document.createElement('ol');
        this.description.classList.add('artint-description');
        this.descriptionContainer.appendChild(this.description);
        this.subtitleContainer.appendChild(this.subtitle);
        this.titleContainer.appendChild(this.title);
        this.card.appendChild(this.titleContainer);
        this.card.appendChild(this.subtitleContainer);
        this.card.appendChild(this.descriptionContainer);
        this.container.appendChild(this.card);
    }
    setTitle = (title) => {
        this.title.innerText = title;
    }

    setSubtitle = (subtitle) => {
        this.subtitle.innerText = subtitle;
    }

    setDescription = (description) => {
        this.description.innerHTML = description;
    }

    addDescription = (description) => {
        description = description.toString()
            .replaceAll("<red>", "<div class=\"artint-red artint-inline\">").replaceAll("</red>", "</div>")
            .replaceAll("<orange>", "<div class=\"artint-orange artint-inline\">").replaceAll("</orange>", "</div>")
            .replaceAll("<yellow>", "<div class=\"artint-yellow artint-inline\">").replaceAll("</yellow>", "</div>")
            .replaceAll("<green>", "<div class=\"artint-green artint-inline\">").replaceAll("</green>", "</div>")
            .replaceAll("<blue>", "<p class=\"artint-blue artint-inline\">").replaceAll("</blue>", "</div>")
            .replaceAll("<h_red>", "<div class=\"artint-highlight-red artint-inline\">").replaceAll("</h_red>", "</div>")
            .replaceAll("<h_orange>", "<div class=\"artint-highlight-orange artint-inline\">").replaceAll("</h_orange>", "</div>")
            .replaceAll("<h_yellow>", "<div class=\"artint-highlight-yellow artint-inline\">").replaceAll("</h_yellow>", "</div>")
            .replaceAll("<h_green>", "<div class=\"artint-highlight-green artint-inline\">").replaceAll("</h_green>", "</div>")
            .replaceAll("<h_blue>", "<div class=\"artint-highlight-blue artint-inline\">").replaceAll("</h_blue>", "</div>");
        this.description.innerHTML += `<li>${description}</li>`;
    }

    removeNthLastDescription = (n) => {
        for (let i = n; i > 0; i--) {
            if (!this.description.children.length) {
                return
            }
            this.description.lastChild.remove()
        }
    }

}

class Algorithm {
    /**
     * 
     * @param {*} name 
     */
    constructor(params) {
        if (!params['name']) {
            console.error('\"name\" parameter is mandatory in \"Algorithm\" constructor');
            return;
        }
        this.cardsStates = [];
        this.valuesStates = [];
        this.selectedStates = [];
        this.name;
        this.tasks = [];
        this.currentTask = 0;
        this.currentAction = 0;
        this.currentValues = {}
        this.card;
        this.table;
        this.explanations;
        for (let param in params) {
            switch (param) {
                case 'name':
                    this.name = params[param];
                    break;
                case 'tableContainer':
                    this.createTable(params[param]);
                    break;
                case 'explanationContainer':
                    this.createExplanations(params[param]);
                    this.card = new Card(params[param]);
                    break;
                default:
                    console.warn(`Unknown parameter in \"Algorithm\" constructor : ${param}`);
                    break;
            }
        }
    }

    /**
     * 
     * @param {*} container 
     */
    createTable = (container) => {
        this.table = new Table(container);
    }

    createExplanations = (container) => {
        this.explanations = document.getElementById(container);
        this.startButton = Utils.createButton("Démarrer les explications", () => { if (this.table.cols > 0 && this.table.rows > 1) { artintRun(); this.resetButton = Utils.createButton("Réinitialiser", () => { while (this.previous()) { }; this.table.deselectAll(); }); this.explanations.insertBefore(this.resetButton, this.startButton); this.startButton.remove(); } });
        this.previousButton = Utils.createButton("Reculer d'une étape", () => { this.previous() });
        this.nextButton = Utils.createButton("Avancer d'une étape", () => { this.next() });
        this.explanations.appendChild(this.startButton);
        this.explanations.appendChild(this.previousButton);
        this.explanations.appendChild(this.nextButton);
    }

    /**
     * 
     * @param {*} nom 
     */
    addTask = (task) => {
        this.tasks.push(task);
    }


    next = () => {
        if (!this.tasks[this.currentTask]) {
            return false;
        }
        this.cardsStates.push([this.card.title.innerText, this.card.subtitle.innerText, this.card.description.innerHTML])
        if (this.currentValues) {
            this.valuesStates.push(this.currentValues);
        }
        let tmp = this.card.title.innerHTML;
        this.card.setTitle(this.tasks[this.currentTask].name)
        this.card.setSubtitle(this.tasks[this.currentTask].description)
        if (tmp != this.card.title && this.currentAction == 0) {
            this.card.setDescription('');
        }
        this.currentValues = { ...this.currentValues, ...(this.tasks[this.currentTask].actions[this.currentAction](this.currentValues)) };
        if (this.currentAction == this.tasks[this.currentTask].actions.length - 1) {
            this.currentTask++;
            this.currentAction = 0;
            return true
        }
        if (this.currentAction == this.tasks[this.currentTask].actions.length - 1 && this.currentTask == this.tasks.length - 1) {
            return false
        }
        this.currentAction++;
        return true;
    }

    previous = () => {
        if (this.currentTask == 0 && this.currentAction == 0) {
            return false
        }
        if (this.currentAction == 0) {
            this.currentTask--;
            this.currentAction = this.tasks[this.currentTask].actions.length - 1;
        } else {
            this.currentAction--;
        }
        this.currentValues = this.valuesStates.pop() || {}
        if (this.cardsStates.length) {
            let previous = this.cardsStates.pop();
            this.card.setTitle(previous[0])
            this.card.setSubtitle(previous[1])
            this.card.setDescription(previous[2])
        }
        return true;
    }

    nextTask = () => {
        if (this.currentTask == this.tasks.length - 1) {
            return;
        }
        for (let action = this.currentAction; action <= this.tasks[this.currentTask].actions.length; action++) {
            this.next();
        }
    }

    display = (msg) => {
        this.card.addDescription(msg)
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
    }
    addAction = (action) => {
        this.actions.push(action)
    }
}