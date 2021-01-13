const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

module.exports = async (path, parser) => {
  const input = await readFile(path, 'utf8');

  return parser(input);
};
