const { getInput } = require('../utils');

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const processProgram = (program) => {
  const result = [...program];
  let currentIndex = 0;

  do {
    currentIndex = performOperation(result, currentIndex);
  } while (currentIndex < result.length && result[currentIndex] !== 99);

  return result;
};

const getIndexJump = (operation) => {
  switch (operation) {
    case 1:
    case 2:
      return 4;
    case 3:
    case 4:
      return 2;
    default:
      throw new Error(`Unsupported index jump for operation "${operation}"`);
  }
};

const performOperation = (program, index) => {
  const operation = program[index];
  const { modes, opNumber } = parseOperation(operation);
  const valueA = getValue(program, index + 1, modes[0]);
  const valueB = getValue(program, index + 2, modes[1]);

  switch (opNumber) {
    case 1:
      program[program[index + 3]] = valueA + valueB;
      break;
    case 2:
      program[program[index + 3]] = valueA * valueB;
      break;
    case 3:
      program[program[index + 1]] = 1;
      break;
    case 4:
      console.log(`Program output: ${program[program[index + 1]]}`);
      break;
    default:
      throw new Error(`Operation "${operation}": not supported`);
  }

  return index + getIndexJump(opNumber);
};

const getValue = (program, index, mode = 0) => {
  const value = program[index];

  if (mode === 0) {
    return program[value];
  }

  return value;
};

const parseOperation = (operation) => {
  const modes = [];

  if ([1, 2, 3, 4].includes(operation)) {
    return { opNumber: operation, modes };
  }

  const opText = `${operation}`;
  const opNumber = parseInt(opText.substring(opText.length - 2));

  for (let i = opText.length - 3; i >= 0; i -= 1) {
    modes.push(parseInt(opText[i], 10));
  }

  return { opNumber, modes };
};

const main = async (inputPath = 'day5/input') => {
  const program = await getInput(inputPath, parseInput);
  processProgram(program);

  return true;
};

module.exports = { main, performOperation, processProgram };
