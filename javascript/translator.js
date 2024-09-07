
const DECODE_LETTERS = {
    "O.....": "a",
    "O.O...": "b",
    "OO....": "c",
    "OO.O..": "d",
    "O..O..": "e",
    "OOO...": "f",
    "OOOO..": "g",
    "O.OO..": "h",
    ".OO...": "i",
    ".OOO..": "j",
    "O...O.": "k",
    "O.O.O.": "l",
    "OO..O.": "m",
    "OO.OO.": "n",
    "O..OO.": "o",
    "OOO.O.": "p",
    "OOOOO.": "q",
    "O.OOO.": "r",
    ".OO.O.": "s",
    ".OOOO.": "t",
    "O...OO": "u",
    "O.O.OO": "v",
    ".OOO.O": "w",
    "OO..OO": "x",
    "OO.OOO": "y",
    "O..OOO": "z",
    "......": " "
};

const CAPITAL_FOLLOWS = ".....O";
const NUMBER_FOLLOWS = ".O.OOO";

const ENCODE_LETTERS = {};
for (const key in DECODE_LETTERS) {
    ENCODE_LETTERS[DECODE_LETTERS[key]] = key;
}
const DECODE_NUMBERS = {
    "O.....": "1",
    "O.O...": "2",
    "OO....": "3",
    "OO.O..": "4",
    "O..O..": "5",
    "OOO...": "6",
    "OOOO..": "7",
    "O.OO..": "8",
    ".OO...": "9",
    ".OOO..": "0",
    "......": " "
};
const ENCODE_NUMBERS = {};
for (const key in DECODE_NUMBERS) {
    ENCODE_NUMBERS[DECODE_NUMBERS[key]] = key;
}

function decode(braille) {
    let english = "";
    let isCapitalFollows = false;
    let isNumberFollows = false;

    for (let i = 0 ; i < braille.length ; i += 6) {
        const symbol = braille.substr(i, 6);
        let translation;

        if (symbol === CAPITAL_FOLLOWS) {
            isCapitalFollows = true;
            continue;
        }
        if (symbol === NUMBER_FOLLOWS) {
            isNumberFollows = true;
            continue;
        }

        if (isNumberFollows) {
            translation = DECODE_NUMBERS[symbol];
            if (translation === " ") {
                isNumberFollows = false;
            }
        } else {
            translation = DECODE_LETTERS[symbol];
            if (translation === undefined) {
                console.error(`Unrecognized Braille symbol: ${symbol}`);
                return ''; // Handle error gracefully or return empty result
            }

            if (isCapitalFollows) {
                translation = translation.toUpperCase();
                isCapitalFollows = false;
            }
        }

        english += translation;
    }

    return english;
}

function encodeWord(word) {
    let braille = "";
    let isNumberFollows = false;

    for (let j = 0; j < word.length; j++) {
        const c = word.substr(j, 1);

        if (c >= '0' && c <= '9') {
            if (!isNumberFollows) {
                braille += NUMBER_FOLLOWS;
                isNumberFollows = true;
            }
            braille += ENCODE_NUMBERS[c];
        } else if (c === ' ') {
            isNumberFollows = false;
            braille += ENCODE_LETTERS[c];
        } else if (c >= 'a' && c <= 'z') {
            braille += ENCODE_LETTERS[c];
        } else {
            braille += CAPITAL_FOLLOWS;
            braille += ENCODE_LETTERS[c.toLowerCase()];
        }
    }
    return braille;
}

function encode(words) {
    let braille = "";
    for (let i in words) {
        if (i != 0) {
            braille += ENCODE_LETTERS[" "]; // Adding space between words
        }
        braille += encodeWord(words[i]);
    }
    return braille;
}

function main(argv) {
    // Check if input is Braille (contains '.' characters)
    if (argv.length === 1 && argv[0].indexOf('.') >= 0) {
        console.log(decode(argv[0]));
    } else {
        console.log(encode(argv));
    }
}

// Run the main function with command-line arguments
main(process.argv.slice(2));
