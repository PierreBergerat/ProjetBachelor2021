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