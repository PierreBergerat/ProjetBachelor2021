/**
 * Mandatory. Point of entry to the program
 */
const run = () => {
    var arrayToSort = [12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 4891, 455, 23, 234, 213]
    bubble_Sort(arrayToSort)
}

/**
 * Sorts using bubble sort algorithm
 * @param {Array[Number]} array - the array to sort
 * @returns a sorted copy of a
 */
function bubble_Sort(array) {
    var hasSwapped;
    var n = array.length - 1;
    var sortedArray = array;
    do {
        hasSwapped = false;
        for (var i = 0; i < n; i++) {
            if (isSmaller(sortedArray[i], sortedArray[i + 1])) {
                swap(sortedArray, i)
                hasSwapped = true;
            }
        }
        n--;
    } while (hasSwapped);
    return sortedArray;
}

/**
 * Returns true if a is smaller than b. Definitely here for demonstration purposes
 * @param {Number} a - first operand
 * @param {Number} b - second operand
 * @returns a boolean indicating whether a is smaller than b
 */
function isSmaller(a, b) {
    return a < b;
}

/**
 * Swaps the item at position i with the item at position i+1 in a
 * @param {Array} a - Array whose elements will be swaped
 * @param {Number} i - Index of the first element to be swapped
 * @returns a with the ith and i+1th items swapped
 */
function swap(a, i) {
    var temp = a[i];
    a[i] = a[i + 1];
    a[i + 1] = temp;
    return a
}