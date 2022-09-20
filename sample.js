// You need to return sorted array, not string
// arr: input array
// arrSize: size of array
function sortEvenOdd(arr, arrSize) {

    let evenCount = 0;
    let oddCount = 0;

    for (let i = 0; i < arrSize; i++) {
        if (arr[i] % 2 == 0) {
            evenCount++;
        } else {
            oddCount++;
        }
    }

    let odd = new Array(oddCount);
    let even = new Array(evenCount);
    
    let oddIndex = 0;
    let evenIndex = 0;

    for (let i = 0; i < arrSize; i++) {
        if (arr[i] % 2 == 0) {
            even[evenIndex] = arr[i];
            evenIndex++;
        } else {
           odd[oddIndex] = arr[i];
           oddIndex++;
        }
    }

    odd.sort(function (a, b) { return b - a; });
    even.sort(function (a, b) { return a - b; });

    return odd.concat(even);
}