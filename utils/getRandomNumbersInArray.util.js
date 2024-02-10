function getRandomNumbersInArray(length, arrayLength) {
    if (length > (arrayLength - 1)) {
        throw new Error("La taille du tableau demandé est plus grande que la longueur de l'array.");
    }

    const uniqueNumbers = new Set();

    while (uniqueNumbers.size < length) {
        const randomNumber = Math.floor(Math.random() * (arrayLength - 1));
        uniqueNumbers.add(randomNumber);
    }

    return Array.from(uniqueNumbers);
}

module.exports = getRandomNumbersInArray;