const { getInput } = require('../utils');

const PATTERN = Object.freeze([0, 1, 0, -1]);

const parseInput = (input) => {
  return input.split('').map((n) => parseInt(n, 10));
};

const fft = (signal, phases) => {
  let result = [...signal];

  for (let i = 0; i < phases; i += 1) {
    result = processSignal(result);
  }

  return result;
};

const processSignal = (signal) => {
  const result = [];
  const multiplierMatrix = buildMultiplierMatrix(signal.length);

  for (let i = 0; i < signal.length; i += 1) {
    result.push(calcOutputSignalAt(signal, i, multiplierMatrix));
  }

  return result;
};

const calcOutputSignalAt = (signal, row, multiplierMatrix) => {
  let sum = 0;

  for (let col = 0; col < signal.length; col += 1) {
    sum += signal[col] * multiplierMatrix[row][col];
  }

  sum = `${sum}`;

  return parseInt(sum.charAt(sum.length - 1), 10);
};

const buildMultiplierMatrix = (length) => {
  const result = [];

  for (let rowNumber = 1; rowNumber <= length; rowNumber += 1) {
    const currentRow = [];
    let isFirst = true;
    let patternIndex = 0;
    let currentRepetition = 0;

    while (currentRow.length < length) {
      const patternNumber = PATTERN[patternIndex % PATTERN.length];

      if (!isFirst) {
        currentRow.push(patternNumber);
      }

      currentRepetition += 1;

      if (currentRepetition === rowNumber) {
        patternIndex += 1;
        currentRepetition = 0;
      }

      isFirst = false;
    }

    result.push(currentRow);
  }

  return result;
};

const main = async (inputPath = 'day16/input') => {
  const signal = await getInput(inputPath, parseInput);
  const result = fft(signal, 100);

  return result.slice(0, 8).join('');
};

module.exports = { buildMultiplierMatrix, main, processSignal };
