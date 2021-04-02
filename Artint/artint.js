/*
Artint.js
JavaScript framework aiming to help people design and explaining artifical intelligence algorithm
IMPORTANT : None of the CSS is added programmatically, which means the style.css can be customized in order to tweak the final look.
            However, one shouldn't alter the "grid-template-rows" and "grid-template-columns" settings in artint-table except if such act is done
            for testing 
*/

class Table {
    /**
     * 
     * @constructor Creates a new table
     * @param {string} container - the id of a div which will contain the table
     * The table is a way to input data into the algorithm.
     * The table can be created and filled manually via the buttons and the manual writing of any values
     * The table can be created and filled automatically via the upload of a CSV file containing the data
     * The user can navigate through the data using the arrow keys of the keyboard
     * A right click event on one of the cells will display a contextual menu allowing the adding, deleting or cleaning of a row/column
     * A column can be sorted via a right click on its header.
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
    /**
     * The Utils class contains useful static functions of multiple types, which mean the class doesn't need any instanciation to be used.
     * The methods can be accessed via "Utils.NAME_OF_THE_METHOD(@param)".
     */

    /**
     * Creates an html "button" (it is a clickable span)
     * @param {String} innerTextValue - The value the button should display
     * @param {Function} onClickCb  - a function indicating what the button should do when clicked
     * @returns The newly created button as an HTMLElement
     */
    static createButton(innerTextValue, onClickCb) {
        let button = document.createElement('span');
        button.setAttribute('class', 'artint-buttons');
        button.innerText = innerTextValue;
        button.addEventListener('click', onClickCb);
        return button
    }

    /**
     * Rounds a number to the desired precision
     * @param {Number} val - The number to round 
     * @param {Number} nth - How many significant figures the result should have
     * Example : rounded(3.141592654, 3) => 3.141
     * @returns The rounded number
     */
    static rounded = (val, nth) => {
        if (nth < 0 || typeof (nth) !== 'number') {
            return val
        }
        return Math.floor(val * 10 ** nth) / 10 ** nth
    }

    /**
     * Allows the display of the entropy Formula as a string as it can be useful to see what number are put in and how they interact
     * @param {Array[Number]|Number} arr - Array of numbers representing a subset of the entire set of data or number indicating the size of said subset 
     * @param {Number} size - Size of the entire set
     * @returns a String describing the formula with variables replaced by the params of the function
     */
    static entropyFormula = (arr, size) => {
        if (arr.constructor === Array) {
            return ('(-' + arr.length + '/' + size + ') * Math.log2(' + arr.length + '/' + size + ') - (' + (size - arr.length) + '/' + size + ') * Math.log2(' + (size - arr.length) + '/' + size + ') ~= ' + ((-arr.length / size) * Math.log2(arr.length / size) - ((size - arr.length) / size) * Math.log2((size - arr.length) / size)))
        } else if (typeof (arr) === 'number') {
            return ('(-' + arr + '/' + size + ') * Math.log2(' + arr + '/' + size + ') - (' + (size - arr) + '/' + size + ') * Math.log2(' + (size - arr) + '/' + size + ') ~= ' + ((-arr / size) * Math.log2(arr / size) - ((size - arr) / size) * Math.log2((size - arr) / size)))
        }

    }

    /**
     * Applies the entropy formula to a subset given a set
     * @param {Array[Number]|Number} arr - Array of numbers representing a subset of the entire set of data or number indicating the size of said subset
     * @param {Number} size - Size of the entire set
     * @returns a Number containing the result of the formula (or null if arr is not an array or a number)
     */
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
     * Returns the average value of an Array of Numbers
     * @param {Array[Number]} arr  - the array whose average value will be computed
     * @returns a Number representing the average value of arr
     */
    static avg = (arr) => {
        return (arr.reduce((a, b) => a + b, 0)) / arr.length;
    }

    /**
     * Returns the standard deviation of an Array of Numbers
     * @param {Array[Number]} arr - the array whose standard deviation will be computed
     * @returns a Number representing the standard deviation of arr
     */
    static stdDev = (arr) => {
        let mean = arr.reduce((a, b) => a + b) / arr.length;
        return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / arr.length);
    }

    /**
     * Returns the unique values of an Array of any type
     * @param {Array[Number]} arr - the array whose unique values will be computed
     * @returns the unique values of arr
     */
    static uniqueValues = (arr) => {
        let res = {}
        arr.forEach(el => {
            res[el] = res[el] + 1 || 1;
        })
        return res;
    }

    /**
     * Returns the sum of the elements contained in an Array of Numbers
     * @param {Array[Number]} arr - the array whose sum will be computed
     * @returns the sum of the elements of arr
     */
    static sum(arr) {
        return arr.reduce((a, b) => a + b, 0);
    }

    /**
     * Returns the max value of an Array of Numbers
     * @param {Array[Number]} arr - the array whose max value will be retrieved
     * @returns the maximum value contained in arr
     */
    static max(arr) {
        return arr.reduce((a, b) => a > b ? a : b);
    }

    /**
     * Returns the max value of an Array of Numbers
     * @param {Array[Number]} arr - the array whose minimal value will be retrieved
     * @returns the minimal value contained in arr
     */
    static min(arr) {
        return arr.reduce((a, b) => a < b ? a : b);
    }

}

class Card {
    /**
     * @constructor Creates a new "Card" which is a way to display information on the screen
     * @param {String} container - id of the HTML container in which the card will be put
     * The card is a way to display information onto the page.
     * It has a title, a subtitle and one or many description points, whose contents are completely free.
     * different HTML tags, elements, or styling can be inputed in order to get the expected output.
     */
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

    /**
     * Sets the card title
     * @param {String} title - the new title of the card
     */
    setTitle = (title) => {
        this.title.innerText = title;
    }

    /**
     * Sets the card subtitle
     * @param {String} subtitle - the new subtitle of the card
     */
    setSubtitle = (subtitle) => {
        this.subtitle.innerText = subtitle;
    }

    /**
     * Sets the card description
     * @param {String} description - the new description of the card
     */
    setDescription = (description) => {
        this.description.innerHTML = description;
    }

    /**
     * Adds a new "bullet point" to the description (doesn't remove any previous element)
     * @param {String} description
     * This method supports the use of custom "HTML tags" such as <red> or <h_yellow>.
     * Those allow the user to add colors to the text they are showing in order to get more focus
     */
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

    /**
     * Removes the n last elements of the description. Can be used as a way to show loops or algorithm choices
     * @param {Number} n - the number of elements to be removed
     * @returns a Boolean indicating whether all element have been correctly removed (true) or if n was too big (false)
     */
    removeNthLastDescription = (n) => {
        for (let i = n; i > 0; i--) {
            if (!this.description.children.length) {
                return false
            }
            this.description.lastChild.remove()
        }
        return true
    }

}

class Algorithm {
    /**
     * @constructor Creates a new Algorithm
     * @param {String} name - The name of the new algorithm
     * The Algorithm class is the core of any project made with the framework. It is the controller that will handle data,
     * display of information and user actions.
     * An algorithm has one or many Tasks which have one or many actions.
     * A task can be seen as one big operation that will need one or more smaller operations to be fulfilled.
     * However, the granularity of those is implementation free and can be decided by the user. This way, a considerable but known calculus can be
     * reduced to one task with one action, since the said calculus isn't what the user wants to show/prove.
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
     * Adds a table to the algorithm
     * @param {String} container - The id of the HTML container that will contain the table
     */
    createTable = (container) => {
        this.table = new Table(container);
    }

    /**
     * Creates the buttons needed to interact with the algorithm.
     * @param {String} container - The id of the HTML container that will contain the buttons
     */
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
     * Adds a new task to the algorithm
     * @param {Task} task - the task to be added
     */
    addTask = (task) => {
        this.tasks.push(task);
    }

    /**
     * Plays and displays the next action/task of the algorithm
     * @returns false if all actions and tasks have been played, true if the operation succeeded
     */
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

    /**
     * Goes back one step (action or task)
     * @returns false upon failure (Action 0 of Task 0), true upon success
     */
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

    /**
     * Plays every action of the current task in order to get to the next task
     * @returns void
     */
    nextTask = () => {
        if (this.currentTask == this.tasks.length - 1) {
            return;
        }
        for (let action = this.currentAction; action <= this.tasks[this.currentTask].actions.length; action++) {
            this.next();
        }
    }

    /**
     * Allows the user to display information in the description part of the card
     * @param {String} msg - the message to be displayed. Can contain HTML tags, functions, etc.
     * Ex : <red><p>This is very important</p></red> // will display the message "this is very important" as a paragraph with red font color
     */
    display = (msg) => {
        this.card.addDescription(msg)
    }

}

class Task {
    /**
     * @constructor creates a new task
     * @param {String} name - the name of the task. Serves as title and will be displayed in the card
     * @param {String} description - the description of the task. Serves as subtitle and will be displayed in the card
     * @param {Array[Function]|Function} actions - Function(s) that will be played sequentially during the execution of the algorithm
     * A task can be seen as a box containing multiple actions. Those actions are functions that will be played during the execution of the
     * algorithm. However, each actions doesn't have to be atomic. An action can do many operations or just one based on what the user needs.
     * It is also possible to create an actions that adds more actions to the current task, which can be used during loops for example.
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

    /**
     * Adds an action to the task 
     * @param {Function} action - the action to be added
     */
    addAction = (action) => {
        this.actions.push(action)
    }
}