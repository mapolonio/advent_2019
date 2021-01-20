const { Writable } = require('stream');
const { getInput } = require('../utils');

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

class Amplifier extends Writable {
  constructor({ program }) {
    super({ objectMode: true });

    this.program = [...program];
    this.currentIndex = 0;
    this.inputStack = [];
    this.lastOutput = undefined;
  }

  _write(value, encoding, callback) {
    this.inputStack.push(value);
    callback();
  }

  async runProgram() {
    while (this.program[this.currentIndex] !== 99) {
      if (this.currentIndex >= this.program.length) {
        throw new Error('Index out of bounds');
      }

      await this.performOperation();
    }

    this._output.end();
  }

  async performOperation() {
    const operation = this.program[this.currentIndex];
    const { modes, opNumber } = this.parseOperation(operation);
    const valueA = this.getValueAt(this.currentIndex + 1, modes[0]);
    const valueB = this.getValueAt(this.currentIndex + 2, modes[1]);
    let address = this.program[this.currentIndex + 3];
    let nextIndex = this.getNextIndex(opNumber);
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
        address = this.program[this.currentIndex + 1];
        input = await this.getInput();

        if (input === undefined) {
          throw new Error('No input values left in stack.');
        }

        break;
      case 4:
        this.lastOutput = this.program[this.program[this.currentIndex + 1]];
        this._output.write(this.lastOutput);
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
      this.program[address] = input;
    }

    this.currentIndex = nextIndex;

    return { output };
  }

  parseOperation(operation) {
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
  }

  getValueAt(index, mode = 0) {
    const value = this.program[index];

    if (mode === 0) {
      return this.program[value];
    }

    return value;
  }

  async getInput() {
    while (this.inputStack.length === 0) {
      await this._waitMs(0);
    }

    return this.inputStack.shift();
  }

  getNextIndex(operation) {
    switch (operation) {
      case 1:
      case 2:
      case 7:
      case 8:
        return this.currentIndex + 4;
      case 3:
      case 4:
        return this.currentIndex + 2;
      case 5:
      case 6:
        return this.currentIndex + 3;
      default:
        throw new Error(`Unsupported index jump for operation "${operation}"`);
    }
  }

  set output(outputStream) {
    this._output = outputStream;
  }

  _waitMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const getMaxSignal = async (program, phases, phaseOrder = []) => {
  if (phases.length === 0) {
    return tryAmplifierLoop(program, phaseOrder);
  }

  let maxSignal = -Infinity;

  for (let i = 0; i < phases.length; i += 1) {
    const phase = phases[i];

    const partialResult = await getMaxSignal(
      program,
      phases.filter((p) => p !== phase),
      [...phaseOrder, phase]
    );

    maxSignal = Math.max(maxSignal, partialResult);
  }

  return maxSignal;
};

const tryAmplifierLoop = async (program, phases) => {
  const amplifiers = [];

  for (const phase of phases) {
    const amplifier = new Amplifier({ program });

    amplifier.write(phase);
    amplifiers.push(amplifier);
  }

  amplifiers[0].write(0);

  for (let i = 0; i < amplifiers.length; i += 1) {
    amplifiers[i].output = amplifiers[(i + 1) % amplifiers.length];
  }

  await Promise.all(amplifiers.map((amp) => amp.runProgram()));

  return amplifiers[amplifiers.length - 1].lastOutput;
};

const main = async (inputPath = 'day7/input') => {
  const program = await getInput(inputPath, parseInput);
  const maxSignal = getMaxSignal(program, [5, 6, 7, 8, 9]);

  return maxSignal;
};

module.exports = { getMaxSignal, main, tryAmplifierLoop };
