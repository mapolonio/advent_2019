const { getInput } = require('../utils');
const { IntcodeComputer } = require('./day9-part-1');

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const main = async (inputPath = 'day9/input') => {
  const program = await getInput(inputPath, parseInput);
  const computer = new IntcodeComputer(program);

  computer.write(2);

  const outputs = await computer.run();

  return outputs;
};

module.exports = { IntcodeComputer, main };
