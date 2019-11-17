

/**
 * Converts a string to emojis.
 * @param {string} toConvert the string to convert to emoji
 * @returns a promise, resolved with the converted emoji string.
 */
export function convert(toConvert) {

  // the emoji converter can only convert lowercase strings.
  const lowercase = String.toLowerCase(toConvert);

  // create the child python process, and pipe it some input.
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python',["./conversion.py", lowercase]);

  // return a promise, resolved with the output of the child process.
  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on('data', (data) => {
      resolve(data);
    });
  });
}