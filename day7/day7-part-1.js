const { getInput } = require('../utils');

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const processProgram = (program, inputs = []) => {
  const result = [...program];
  const outputs = [];
  const inputStack = [...inputs];
  let currentIndex = 0;

  while (result[currentIndex] !== 99) {
    if (currentIndex >= result.length) {
      throw new Error('Index out of bounds');
    }

    const { nextIndex, output } = performOperation(
      result,
      currentIndex,
      inputStack
    );

    if (output !== undefined) {
      outputs.push(output);
    }

    currentIndex = nextIndex;
  }

  return outputs;
};

const getIndexJump = (operation) => {
  switch (operation) {
    case 1:
    case 2:
    case 7:
    case 8:
      return 4;
    case 3:
    case 4:
      return 2;
    case 5:
    case 6:
      return 3;
    default:
      throw new Error(`Unsupported index jump for operation "${operation}"`);
  }
};

const performOperation = (program, index, inputStack) => {
  const operation = program[index];
  const { modes, opNumber } = parseOperation(operation);
  const valueA = getValue(program, index + 1, modes[0]);
  const valueB = getValue(program, index + 2, modes[1]);
  let address = program[index + 3];
  let nextIndex = index + getIndexJump(opNumber);
  let input;
  let output;

  switch (opNumber) {
    case 1:
      input = valueA + valueB;
      break;
    case 2:
      input = valueA * valueB;
      break;
    case 3:
      address = program[index + 1];
      input = inputStack.shift();

      if (input === undefined) {
        throw new Error('No input values left in stack.');
      }

      break;
    case 4:
      output = program[program[index + 1]];
      break;
    case 5:
      if (valueA !== 0) {
        nextIndex = valueB;
      }

      break;
    case 6:
      if (valueA === 0) {
        nextIndex = valueB;
      }

      break;
    case 7:
      input = valueA < valueB ? 1 : 0;
      break;
    case 8:
      input = valueA === valueB ? 1 : 0;
      break;
    default:
      throw new Error(`Operation "${operation}": not supported`);
  }

  if (input !== undefined) {
    program[address] = input;
  }

  return { nextIndex, output };
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

  if ([1, 2, 3, 4, 5, 6, 7, 8].includes(operation)) {
    return { opNumber: operation, modes };
  }

  const opText = `${operation}`;
  const opNumber = parseInt(opText.substring(opText.length - 2));

  for (let i = opText.length - 3; i >= 0; i -= 1) {
    modes.push(parseInt(opText[i], 10));
  }

  return { opNumber, modes };
};

const getMaxSignal = (program, phases, input = 0) => {
  if (phases.length === 0) {
    return input;
  }

  let maxSignal = -Infinity;

  for (let i = 0; i < phases.length; i += 1) {
    const output = loadAmplifier(program, phases[i], input);
    const partialResult = getMaxSignal(
      program,
      phases.filter((_, index) => index !== i),
      output
    );

    maxSignal = Math.max(maxSignal, partialResult);
  }

  return maxSignal;
};

const loadAmplifier = (program, phase, input) => {
  const outputs = processProgram(program, [phase, input]);

  return outputs[outputs.length - 1];
};

const main = async (inputPath = 'day7/input') => {
  const program = await getInput(inputPath, parseInput);
  const maxSignal = getMaxSignal(program, [0, 1, 2, 3, 4]);

  return maxSignal;
};

module.exports = { main, getMaxSignal };
