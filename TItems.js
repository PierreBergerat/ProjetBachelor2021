class TItem {
    constructor(before, after) {
        if (this.constructor === TItem) {
            throw new Error("Abstract classes can't be instantiated.");
        }
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

class TArray extends TItem {
    constructor(x, y, container, beforelisteners, afterlisteners, classes) {
        super(beforelisteners, afterlisteners);
        this.x = x;
        this.y = y;
        this.refMatrix = [];
        this.matrix = document.createElement('table');
        this.matrix.classList.add(classes);
        this.matrix.style.width = `${x * 50}px`;
        for (let i = 0; i < this.y; i++) {
            let row = document.createElement('tr')
            this.refMatrix.push([])
            for (let j = 0; j < this.x; j++) {
                let cell = document.createElement('td');
                row.appendChild(cell)
                console.log(this.refMatrix);
                this.refMatrix[i][j] = 0;
            }
            this.matrix.appendChild(row)
        }
        document.getElementById(container).appendChild(this.matrix);
    }
    select(x, y, color) {
        this.matrix.children[y].children[x].style.backgroundColor = `${color}`;
    }

    deselect() {
        for (let cols of this.matrix.children) {
            for (let cells of cols.children) {
                cells.style.backgroundColor = `white`;
            }
        }
    }

    set(values) {
        for (let value in values) {
            this.matrix.children[Math.floor(value / this.x)].children[value % this.x].innerText = values[value]
            this.refMatrix[Math.floor(value / this.x)][value % this.x] = values[value]
        }
    }
}