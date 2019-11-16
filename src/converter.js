

/**
 * Converts a string to emojis.
 * @param {string} toConvert the string to convert to emoji
 */
async function convert(toConvert) {

    
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python',["./conversion.py", toConvert]);

  return new Promise((resolve, reject) => {
    pythonProcess.stdout.on('data', (data) => {
      resolve(data);
    });

  });
}

module.exports.convert = convert;