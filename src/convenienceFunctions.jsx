// A set of potentially useful functions


//randomly shuffles an array
export const shuffle = (unshuffled) => {
    const new_array = unshuffled.map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);
    return new_array;

}

//a function computing the mode of an array
export const mostCommon = (arr) => {

    let arr_copy = arr.map((i) => {
        return (i)
    })
    return arr_copy.sort((a, b) =>
        arr_copy.filter(v => v === a).length
        - arr_copy.filter(v => v === b).length
    ).pop();
}

//computes the number of elements in an array, if one eliminated the duplicates
const sizeUnique = (array) => {
    return ([...new Set(array)].length)
}

//order elements in an array by their frequencies
export const orderByFrequency = (arr) => {
    let arr_copy = arr.map((i) => {
        return (i)
    });
    let arr_to_fill = Array.from(Array(sizeUnique(arr_copy)).keys());
    return (arr_to_fill.map((i) => {
        let mode = mostCommon(arr_copy);
        arr_copy = arr_copy.filter((a) => a != mode);
        return (mode);
    }))

}

// sample a random integer between min and max
export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// scalar multiplication on a vector
export const mult = (scalar, vector) => {
    return (vector.map((i) => i * scalar))
};

// vector addition
export const add = (vector1, vector2) => {
    return (vector1.map((e, i) => e + vector2[i])
    )
}

// a map function that works for objects
export const objectMap = (obj, fn) =>
Object.fromEntries(
    Object.entries(obj).map(
    ([k, v], i) => [k, fn(v, k, i)]
    )
)

// filter the NaNs from an array
export const filterNaN = (array) => {
    return array.filter(item => !Number.isNaN(item));
}

// compute the sum of elements in an array
export const sum = (array) => {
    return array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

// return n copies of an array
export const rep = (arr, n) => {
    return Array.from({ length: n }, () => arr).flat();
}