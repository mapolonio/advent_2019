const { getInput } = require('../utils');

class Signal {
  constructor(signal, extensionFactor = 1) {
    this.signal = signal;
    this.extensionFactor = extensionFactor;
  }

  get(index) {
    return this.signal[index % this.signal.length];
  }

  getMessage(offset) {
    let message = '';

    for (let i = offset; i < offset + 8; i += 1) {
      message += this.get(i);
    }

    return message;
  }

  get length() {
    return this.signal.length * this.extensionFactor;
  }

  get offset() {
    return parseInt(this.signal.slice(0, 7).join(''), 10);
  }
}

const parseInput = (input) => {
  return input.split('').map((n) => parseInt(n, 10));
};

const fft = (signal, phases, offset) => {
  let result = signal;

  for (let i = 0; i < phases; i += 1) {
    result = processSignal(result, offset);
  }

  return result;
};

const processSignal = (signal, offset = 0) => {
  const result = [];

  for (let i = signal.length - 1; i >= offset; i -= 1) {
    calcOutputSignalAt(signal, i, result);
  }

  return new Signal(result);
};

const calcOutputSignalAt = (signal, row, result) => {
  if (row > signal.length / 2) {
    result[row] = signal.get(row) + (result[row + 1] || 0);
    result[row] = result[row] % 10;

    return;
  }

  let sum = 0;
  let col = row;
  let nonZeroValues = 0;
  let multiplier = 1;
  const nonZeroBandSize = row + 1;

  while (col < signal.length) {
    sum += signal.get(col) * multiplier;
    nonZeroValues += 1;

    if (nonZeroValues === nonZeroBandSize) {
      col += nonZeroBandSize + 1;
      nonZeroValues = 0;
      multiplier *= -1;
    } else {
      col += 1;
    }
  }

  result[row] = Math.abs(sum) % 10;
};

const main = async (inputPath = 'day16/input') => {
  const input = await getInput(inputPath, parseInput);
  const signal = new Signal(input, 10000);
  const { offset } = signal;
  const result = fft(signal, 100, offset);

  return result.getMessage(offset);
};

module.exports = { main, processSignal, Signal };
