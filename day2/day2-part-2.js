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

const findNounAndVerb = (program) => {
  for (let i = 0; i <= 99; i += 1) {
    for (let j = 0; j <= 99; j += 1) {
      const currentProgram = [...program];
      currentProgram[1] = i;
      currentProgram[2] = j;

      const [result] = processProgram(currentProgram);

      if (result === 19690720) {
        return {
          noun: i,
          verb: j
        };
      }
    }
  }

  throw new Error('No combination of noun and verb found');
};

const main = async (inputPath = 'day2/input') => {
  const program = await getInput(inputPath, parseInput);
  const { noun, verb } = findNounAndVerb(program);

  // eslint-disable-next-line no-mixed-operators
  return 100 * noun + verb;
};

module.exports = { main, processProgram };
