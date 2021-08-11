const myFavoriteArtistList = [
    "Against the Current",
    "BTS",
    "Taylor Swift",
    "Fall Out Boy",
    "Ed Sheeran",
    "K/DA",
    "IU",
    "Jada Facer",
    "All Time Low",
    "ENHYPEN",
    "Tomorrow x Together",
    "SEVENTEEN",
    "Imagine Dragons",
    "Shawn Mendes",
    "LEC",
    "Halsey",
    "Lauv",
    "Lu Han", 
    "ONE OK ROCK",
    "BLACKPINK",
    "We the Kings",
    "The Chainsmokers"
]

// Taken from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleCapsArray(array) {
    let shuffled = array.map((item) => item.toUpperCase());
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function addHTMLFormatting(array) {
    let newArr = [];

    for(let i = 0; i < array.length; i++) {
        let color = i % 2 === 0 ? "purple" : "white";
        newArr.push(`<span class="${color}">${array[i].replace(/\s+/g, '')}</span>`)
    }

    return newArr.join("");
}

const randomArr = shuffleCapsArray(myFavoriteArtistList)
const randomString = addHTMLFormatting(randomArr);

document.getElementById('backgroundArtists').innerHTML += randomString;