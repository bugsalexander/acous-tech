

/**
 * Converts a string to emojis.
 * @param {string} toConvert the string to convert to emoji
 * @returns a promise, resolved with the converted emoji string.
 */
export function convert(toConvert) {

  // the emoji converter can only convert lowercase strings.
  const lowercase = toConvert.toLowerCase();

  return "this is test data, replace it later!";
  // create the child python process, and pipe it some input.
  // const spawn = require("child_process").spawn;
  // const pythonProcess = spawn('python3',["./conversion.py", lowercase]);

  // // return a promise, resolved with the output of the child process.
  // return new Promise((resolve, reject) => {
  //   pythonProcess.stdout.on('data', (data) => {
  //     resolve(data);
  //   });
  // });
}