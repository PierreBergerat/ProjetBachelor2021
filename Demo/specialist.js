/**
 * Class that represents queen position on the chessboard.
 */
class QueenPosition {
    /**
     * @param {number} rowIndex
     * @param {number} columnIndex
     */
    constructor(rowIndex, columnIndex) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }

    /**
     * @return {number}
     */
    get leftDiagonal() {
        // Each position on the same left (\) diagonal has the same difference of
        // rowIndex and columnIndex. This fact may be used to quickly check if two
        // positions (queens) are on the same left diagonal.
        // @see https://youtu.be/xouin83ebxE?t=1m59s
        return this.rowIndex - this.columnIndex;
    }

    /**
     * @return {number}
     */
    get rightDiagonal() {
        // Each position on the same right diagonal (/) has the same
        // sum of rowIndex and columnIndex. This fact may be used to quickly
        // check if two positions (queens) are on the same right diagonal.
        // @see https://youtu.be/xouin83ebxE?t=1m59s
        return this.rowIndex + this.columnIndex;
    }

    toString() {
        return `${this.rowIndex},${this.columnIndex}`;
    }
}

/**
 * @param {QueenPosition[]} queensPositions
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @return {boolean}
 */
function isSafe(queensPositions, rowIndex, columnIndex) {
    // New position to which the Queen is going to be placed.
    const newQueenPosition = new QueenPosition(rowIndex, columnIndex);

    // Check if new queen position conflicts with any other queens.
    for (let queenIndex = 0; queenIndex < queensPositions.length; queenIndex += 1) {
        const currentQueenPosition = queensPositions[queenIndex];

        if (
            // Check if queen has been already placed.
            currentQueenPosition
            && (
                // Check if there are any queen on the same column.
                newQueenPosition.columnIndex === currentQueenPosition.columnIndex
                // Check if there are any queen on the same row.
                || newQueenPosition.rowIndex === currentQueenPosition.rowIndex
                // Check if there are any queen on the same left diagonal.
                || newQueenPosition.leftDiagonal === currentQueenPosition.leftDiagonal
                // Check if there are any queen on the same right diagonal.
                || newQueenPosition.rightDiagonal === currentQueenPosition.rightDiagonal
            )
        ) {
            // Can't place queen into current position since there are other queens that
            // are threatening it.
            return false;
        }
    }

    // Looks like we're safe.
    return true;
}

/**
 * @param {QueenPosition[][]} solutions
 * @param {QueenPosition[]} previousQueensPositions
 * @param {number} queensCount
 * @param {number} rowIndex
 * @return {boolean}
 */
function nQueensRecursive(solutions, previousQueensPositions, queensCount, rowIndex) {
    // Clone positions array.
    const queensPositions = [...previousQueensPositions].map((queenPosition) => {
        return !queenPosition ? queenPosition : new QueenPosition(
            queenPosition.rowIndex,
            queenPosition.columnIndex,
        );
    });

    if (rowIndex === queensCount) {
        // We've successfully reached the end of the board.
        // Store solution to the list of solutions.
        solutions.push(queensPositions);

        // Solution found.
        return true;
    }

    // Let's try to put queen at row rowIndex into its safe column position.
    for (let columnIndex = 0; columnIndex < queensCount; columnIndex += 1) {
        if (isSafe(queensPositions, rowIndex, columnIndex)) {
            // Place current queen to its current position.
            queensPositions[rowIndex] = new QueenPosition(rowIndex, columnIndex);

            // Try to place all other queens as well.
            nQueensRecursive(solutions, queensPositions, queensCount, rowIndex + 1);

            // BACKTRACKING.
            // Remove the queen from the row to avoid isSafe() returning false.
            queensPositions[rowIndex] = null;
        }
    }

    return false;
}

/**
 * @param {number} queensCount
 * @return {QueenPosition[][]}
 */
function nQueens(queensCount) {
    // Init NxN chessboard with zeros.
    // const chessboard = Array(queensCount).fill(null).map(() => Array(queensCount).fill(0));

    // This array will hold positions or coordinates of each of
    // N queens in form of [rowIndex, columnIndex].
    const queensPositions = Array(queensCount).fill(null);

    /** @var {QueenPosition[][]} solutions */
    const solutions = [];

    // Solve problem recursively.
    nQueensRecursive(solutions, queensPositions, queensCount, 0);

    return solutions;
}


function run(){
    nQueens(4)
}

// /**
//  * BubbleSort example
//  * Mandatory. Point of entry to the program
//  */
//  const run = () => {
//     var arrayToSort = [12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 4891, 455, 23, 234, 213]
//     bubble_Sort(arrayToSort)
// }

// /**
//  * Sorts using bubble sort algorithm
//  * @param {Array[Number]} array - the array to sort
//  * @returns a sorted copy of a
//  */
// function bubble_Sort(array) {
//     var hasSwapped;
//     var n = array.length - 1;
//     var sortedArray = array;
//     do {
//         hasSwapped = false;
//         for (var i = 0; i < n; i++) {
//             if (isSmaller(sortedArray[i], sortedArray[i + 1])) {
//                 swap(sortedArray, i)
//                 hasSwapped = true;
//             }
//         }
//         n--;
//     } while (hasSwapped);
//     return sortedArray;
// }

// /**
//  * Returns true if a is smaller than b. Definitely here for demonstration purposes
//  * @param {Number} a - first operand
//  * @param {Number} b - second operand
//  * @returns a boolean indicating whether a is smaller than b
//  */
// function isSmaller(a, b) {
//     return a < b;
// }

// /**
//  * Swaps the item at position i with the item at position i+1 in a
//  * @param {Array} a - Array whose elements will be swaped
//  * @param {Number} i - Index of the first element to be swapped
//  * @returns a with the ith and i+1th items swapped
//  */
// function swap(a, i) {
//     var temp = a[i];
//     a[i] = a[i + 1];
//     a[i + 1] = temp;
//     return a
// }
