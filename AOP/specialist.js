const run = () => {
    var arrayToSort = [12, 345, 4, 546, 122, 84, 98, 64, 9, 1, 3223, 455, 23, 234, 213]
    bubble_Sort(arrayToSort)
    inject(Test.prototype, loggingAspect, "before")
    inject(Test.prototype, printTypeOfReturnedValueAspect, "afterReturning")
    var t = new Test()
    t.greets()
}

bubble_Sort = (a) => {
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

isSmaller = (a, b) => {
    return a < b;
}

class Test {
    greets() {
        console.log("Hi");
    }
}