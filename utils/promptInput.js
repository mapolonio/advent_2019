const readline = require('readline');

module.exports = (promptMessage) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(promptMessage, (input) => {
      rl.close();

      return resolve(input);
    });
  });
};
