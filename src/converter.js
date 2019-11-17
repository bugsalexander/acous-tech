// this module exports a function that converts from a string to its matching emoji.
import { spawn } from "child_process";

/**
 * Converts a sentence of space-separated words to emojis, including lemmatization.
 * @param {string} sentence the sentence to convert
 * @param {Object} dictionary the dictionary object, contaisn properties "keys" and "values" that map to arrays.
 */
export function convertSentence(sentence, dictionary) {

  // downcases the sentence
  sentence = sentence.toLowerCase();
  
  // spawn the python process
  const pythonProcess = spawn('python3', ["src/lemmatization.py", `\"${sentence}\"`]);
  
  // return a promise, resolved with the converted result.
  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on('data', (data) => {
  
      // for each word, convert to emoji.
      let result = "";
      for (const word of String(data).split(" ")) {
        result += `${convert(word, dictionary)} `;
      }

      // resolve with the result.
      resolve(result);
    });
  });
}

/**
 * Converts a string to emojis.
 * @param {string} toConvert the string to convert to emoji
 * @param {Object} dictionary the dictionary object, contains properties "keys" and "values" that map to arrays.
 * @returns a promise, resolved with the converted emoji string.
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
    let distance = editDistance(toConvert, keys[i]);

    // if it's less than the min, store the corresponding emoji.
    if (distance < minDistance) {
      bestEmoji = dictionary.values[i];
      minDistance = distance;
    }
  }
  // return the best emoji only if its 0.
  if (minDistance  === 0) {
    return bestEmoji;
  }
  
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