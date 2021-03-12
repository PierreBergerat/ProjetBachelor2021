class Table {
    constructor(container) {
        this.data = null;
        this.sizeX = 0;
        this.sizeY = 0;
        let buttonContainer = document.createElement('div');
        buttonContainer.setAttribute('id', 'buttonContainer');
        //
        let inputLabel = document.createElement('label');
        inputLabel.setAttribute('class', 'artint-buttons');
        inputLabel.setAttribute('for', 'dataEntryTableFileSelector');
        inputLabel.innerText = 'Charger des données à partir d\'un fichier';
        document.getElementById(container).appendChild(inputLabel);
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'file');
        this.input.setAttribute('id', 'dataEntryTableFileSelector');
        this.input.setAttribute('accept', '.csv, .xml, .tsv');
        this.input.addEventListener("change", (e) => { this.handleFiles(e) }, true);
        this.input.style.display = 'none';
        document.getElementById(container).appendChild(this.input);
        //
        let addColButton = this.createButton("Ajouter une colonne", () => { this.addColTo(this.sizeY) });
        buttonContainer.appendChild(addColButton);
        //
        let addRowButton = this.createButton("Ajouter une ligne", () => { this.addRowTo(this.sizeX) });
        buttonContainer.appendChild(addRowButton);

        //
        let deleteColButton = this.createButton("Supprimer une colonne", () => { this.deleteColFrom(this.sizeY) });
        buttonContainer.appendChild(deleteColButton);

        //
        let deleteRowButton = this.createButton("Supprimer une ligne", () => { this.deleteRowFrom(this.sizeX) });
        buttonContainer.appendChild(deleteRowButton);

        //
        this.table = document.getElementById(container).appendChild(buttonContainer)
        this.table = document.getElementById(container).appendChild(document.createElement('div'));
        this.table.classList.add('artint-table');
    }

    createButton(innerTextValue, onClickCb) {
        let button = document.createElement('span');
        button.setAttribute('class', 'artint-buttons');
        button.innerText = innerTextValue;
        button.addEventListener('click', onClickCb);
        return button
    }

    makeTable = (rows, cols) => {
        this.table.innerHTML = "";
        this.sizeX = rows;
        this.sizeY = cols;
        this.table.style.setProperty('--grid-rows', rows);
        this.table.style.setProperty('--grid-cols', cols);
        for (let c = 0; c < (rows * cols); c++) {
            let cell = document.createElement("input");
            if (c >= cols) {
                cell.setAttribute("col", c % cols);
                cell.setAttribute("row", ~~(c / cols) - 1);
            } else {
                cell.setAttribute("header", (c));
            }
            cell.addEventListener('keydown', this.handleKeys, true);
            cell.addEventListener('contextmenu', (e) => {
                e = e || window.event;
                e.preventDefault();
                let contextMenu = document.createElement("div")
                contextMenu.id = "artintContextualMenu"
                contextMenu.style = `top:${e.pageY - 10}px;left:${e.pageX - 40}px`
                contextMenu.onmouseleave = () => document.getElementById("artintContextualMenu").outerHTML = ''
                let addColButton = document.createElement('p');
                addColButton.innerText = "Ajouter une colonne";
                let addColButtonBefore = document.createElement('p');
                addColButtonBefore.id = "addColButtonBefore";
                addColButtonBefore.classList.add("addColButtonSubMenu")
                addColButtonBefore.innerText = "Ajouter avant";
                addColButtonBefore.style.textAlign = "right";
                addColButtonBefore.addEventListener('click', () => {
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
                    if (e.target.hasAttribute('header')) {
                        this.addRowTo(0);
                    } else {
                        this.addRowTo(Number(e.target.attributes.row.value))
                    }
                })
                let addRowButtonAfter = document.createElement('p');
                addRowButtonAfter.id = "addRowButtonAfter"
                addRowButtonAfter.classList.add("addRowButtonSubMenu")
                addRowButtonAfter.innerText = "Ajouter après";
                addRowButtonAfter.style.textAlign = "right";
                addRowButtonAfter.addEventListener('click', () => {
                    if (e.target.hasAttribute('header')) {
                        this.addRowTo(0);
                    } else {
                        this.addRowTo(Number(e.target.attributes.row.value) + 1)
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
                    let colNumber = -1;
                    if (e.target.hasAttribute("header")) {
                        colNumber = e.target.attributes.header.value
                    } else {
                        colNumber = e.target.attributes.col.value
                    }
                    Array.from(document.querySelectorAll(`[col="${colNumber}"],[header="${colNumber}"]`)).forEach(e => {
                        e.value = ''
                    })
                    document.getElementById("artintContextualMenu").outerHTML = '';
                })
                let emptyRowButton = document.createElement('p')
                emptyRowButton.innerText = "Effacer la ligne"
                emptyRowButton.addEventListener('click', () => {
                    if (e.target.hasAttribute("header")) {
                        return;
                    }
                    let rowNumber = e.target.attributes.row.value;
                    Array.from(document.querySelectorAll(`[row="${rowNumber}"]`)).forEach(e => {
                        e.value = ''
                    })
                    document.getElementById("artintContextualMenu").outerHTML = '';

                })
                let deleteColButton = document.createElement('p')
                deleteColButton.innerText = "Supprimer la colonne"
                let deleteRowButton = document.createElement('p')
                deleteRowButton.innerText = "Supprimer la ligne";
                contextMenu.appendChild(addColButton)
                contextMenu.appendChild(addRowButton)
                contextMenu.appendChild(emptyColButton)
                contextMenu.appendChild(emptyRowButton)
                contextMenu.appendChild(deleteColButton)
                contextMenu.appendChild(deleteRowButton)
                document.body.appendChild(contextMenu)
            }, true)
            this.table.appendChild(cell).className = "artint-grid-item";
        };
    }

    handleKeys(e) {
        e = e || window.event;
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

    addColTo(n) {
        console.log(n);
    }

    addRowTo(n) {
        console.log(n);
    }

    deleteColFrom(n) {
        console.log(n);
    }

    deleteRowFrom(n) {
        console.log(n);
    }

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
                                    chars[++c] = ''; // unescape ""
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
                case 'tsv':
                    this.parseTSV(text);
                    break;
                default: break;
            }
        };
        reader.readAsText(event.target.files[0]);
    };

    getColValues = (col) => {
        if (typeof (col) === 'string') {
            try {
                col = Number(Array.from(document.getElementsByClassName('header')).filter(el => { return el.value == `${col}` })[0].attributes.header.value);
            } catch (err) {
                return null;
            }
        }
        if (typeof (col) === 'number') {
            return Array.from(document.querySelectorAll(`[col="${col}"]`)).map(el => { return isNaN(Number(el.value)) ? el.value : Number(el.value) });
        }
        return null;
    }

    getColSum = (col) => {
        return this.getColValues(col).reduce((a, b) => a + b, 0);
    }

    getColAvg = (col) => {
        let values = this.getColValues(col)
        return (values.reduce((a, b) => a + b, 0)) / values.length;
    }

    getColStdDev = (col) => {
        let values = this.getColValues(col);
        let mean = values.reduce((a, b) => a + b) / values.length;
        return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / values.length);
    }

    getColMin = (col) => {
        return this.getColValues(col).reduce((a, b) => a < b ? a : b);
    }

    getColMax = (col) => {
        return this.getColValues(col).reduce((a, b) => a > b ? a : b);
    }

    getColName = (col) => {
        return Array.from(document.getElementsByClassName('header')).filter(el => { return el.attributes.header.value == `${col}` })[0].value;
    }

    getUniqueValues = (col) => {
        let res = {}
        this.getColValues(col).forEach(el => {
            res[el] = res[el] + 1 || 1;
        })
        return res;
    }

}

