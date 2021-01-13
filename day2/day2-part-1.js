const { getInput } = require('../utils');

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const processProgram = (program) => {
  const result = [...program];
  let currentIndex = 0;

  do {
    const { operation, address1, address2, destination } = getProgramData(
      result,
      currentIndex
    );

    result[destination] = performOperation(
      operation,
      result[address1],
      result[address2]
    );

    currentIndex += 4;
  } while (currentIndex < result.length && result[currentIndex] !== 99);

  return result;
};

const getProgramData = (program, fromIndex) => {
  const [operation, address1, address2, destination] = program.slice(fromIndex);

  return {
    operation,
    address1,
    address2,
    destination
  };
};

const performOperation = (operation, valueA, valueB) => {
  switch (operation) {
    case 1:
      return valueA + valueB;
    case 2:
      return valueA * valueB;
    default:
      throw new Error(`Operation "${operation}": not supported`);
  }
};

const main = async (inputPath = 'day2/input') => {
  const program = await getInput(inputPath, parseInput);
  program[1] = 12;
  program[2] = 2;

  return processProgram(program)[0];
};

module.exports = { main, processProgram };
