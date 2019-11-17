// this module exports a function that converts from a string to its matching emoji.
import { spawn } from "child_process";

/**
 * Converts the sentence to the emoji version.
 * @param {string} sentence the sentence to convert
 * @param {Object} dictionary the dictionary of emojis and their names
 */
export async function convertSentence(sentence, dictionary) {

  const words = sentence.split(" ");

  // map to words
  const converted = words.map((word) => takeBest(word, dictionary));

  const resolved = await Promise.all(converted);

  // get rid of words that are undefined.
  let result = "";
  for (const word of resolved) {
    if (word) {
      result += `${word} `;
    }
  }

  return result;
}

/**
 * given a word, if the best edit distance is zero, return.
 * otherwise, for each synonym, compute edit distance. 
 * if the min of synonyms' edit distance is better (less than) the original, return new emoji. 
 * else return original.
 * @param {string} word the word to convert
 * @param {Object} dictionary the dictionary of emojis and their names
 */
async function takeBest(word, dictionary) {

  // lemmatize the word
  // if word is empty or undefined, then use the original.
  let lemmatized = await lemmatize(word);
  if (lemmatized === undefined || lemmatized === "") {
    lemmatized = word;
  }

  // the edit of the distance of the actual word
  const best = convert(lemmatized, dictionary);

  // if best is zero, return.
  if (best.minDistance === 1) {
    return best.emoji;
  }

  // otherwise, for each synonym compute the edit distance (keeping the min).
  const synonymsList = await synonyms(lemmatized);
  console.log(synonymsList);
  for (const synonym of synonymsList) {
    const synDist = convert(synonym, dictionary);
    if (synDist.minDistance === 1) {
      return synDist.emoji;
    }
  }

  // return the best.
  return word;
}

/**
 * Returns a Promise resolved with the lemmatized sentence.
 * @param {string} sentence the sentence to convert
 * @returns a promise resolved with the lemmatized sentence.
 */
function lemmatize(sentence) {

  // downcases the sentence
  sentence = sentence.toLowerCase();
  
  // spawn the python process
  const pythonProcess = spawn('python3', ["src/lemmatization.py", `\"${sentence}\"`]);
  
  // return a promise, resolved with the converted result.
  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on('data', (data) => {
      
      // resolve with the result, split by spaces, as an array.
      resolve(data);
    });
  });
}

/**
 * Retrieves the synonyms of a word
 * @param {string} word the word 
 * @returns a promise resolved with an array of the synonyms of the word.
 */
function synonyms(word) {
  word = String(word);

  // downcases the sentence
  word = word.toLowerCase();
  
  // spawn the python process
  const pythonProcess = spawn('python3', ["src/synonyms.py", `\"${word}\"`]);
  
  // return a promise, resolved with the converted result.
  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on('data', (data) => {
      
      // resolve with the result, split by spaces, as an array.
      resolve(JSON.parse(data));
    });
  });
}

/**
 * Produces an object with the minimum edit distance found in the dictionary, along with the emoji result.
 * @param {string} toConvert the string to convert to emoji
 * @param {Object} dictionary the dictionary object, contains properties "keys" and "values" that map to arrays.
 * @returns an object containing the minimum edit distance, along with the emoji.
 */
function convert(toConvert, dictionary) {

  // the keys/values of the dictionary. keys[i] -> values[i]
  const keys = dictionary.keys;
  const values = dictionary.values;

  // keep the word with the shortest edit distance.
  let bestEmoji = "";
  let minDistance = Infinity;

  // find the emoji with the min distance between its name and toConvert.
  for (let i = 0; i < keys.length; i += 1) {

    // for each word in the dictionary, compute the edit distance.
    let distance = editDistance(String(toConvert), keys[i]);

    // if it's less than the min, store the corresponding emoji.
    if (distance < minDistance) {
      bestEmoji = values[i];
      minDistance = distance;
    }
  }

  // return the best emoji.
  return {
    minDistance: minDistance,
    emoji: bestEmoji
  };
}

/**
 * Computes the Levenshtein edit distance between two words.
 * From https://gist.github.com/andrei-m/982927
 * @param {string} a the first word
 * @param {string} b the second word
 */
function editDistance(a, b) {
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};