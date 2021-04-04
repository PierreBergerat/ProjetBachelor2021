/**
 * Mandatory. Point of entry to the program
 */
const run = () => {
    var arrayToSort = [12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 455, 23, 234, 213]
    bubble_Sort(arrayToSort)
    var t = new Test()
    t.greets()
}

/**
 * Sorts using bubble sort algorithm
 * @param {Array[Number]} a - the array to sort
 * @returns a sorted copy of a
 */
function bubble_Sort(a) {
    var swapp;
    var n = a.length - 1;
    var x = a;
    do {
        swapp = false;
        for (var i = 0; i < n; i++) {
            if (isSmaller(x[i], x[i + 1])) {
                var temp = x[i];
                x[i] = x[i + 1];
                x[i + 1] = temp;
                swapp = true;
            }
        }
        n--;
    } while (swapp);
    return x;
}

/**
 * Returns true if a is smaller than b. Definitely here for demonstration purposes
 * @param {Number} a 
 * @param {Number} b 
 * @returns 
 */
function isSmaller(a, b) {
    return a < b;
}

/**
 * Test class. Also here for demonstration
 */
class Test {
    /**
     * Logs a friendly message
     */
    greets() {
        console.log("Hi");
    }
}