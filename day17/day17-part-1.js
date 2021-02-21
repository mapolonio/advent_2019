const { getInput } = require('../utils');
const { Writable } = require('stream');

class IntcodeComputer extends Writable {
  constructor(program) {
    super({ objectMode: true });

    this.program = [...program];
    this.currentIndex = 0;
    this.inputStack = [];
    this.output = '';
    this.relativeBase = 0;
  }

  async run() {
    while (this.program[this.currentIndex] !== 99) {
      if (this.currentIndex >= this.program.length) {
        throw new Error('Index out of bounds');
      }

      await this.performOperation();
    }

    return this.output;
  }

  async performOperation() {
    const operation = this.program[this.currentIndex];
    const { modes, opNumber } = this.parseOperation(operation);
    const valueA = this.getValueAt(this.currentIndex + 1, modes[0]);
    const valueB = this.getValueAt(this.currentIndex + 2, modes[1]);
    let address = this.getWriteAddress(this.currentIndex + 3, modes[2]);
    let nextIndex = this.getNextIndex(opNumber);
    let input;

    switch (opNumber) {
      case 1:
        input = valueA + valueB;
        break;
      case 2:
        input = valueA * valueB;
        break;
      case 3:
        address = this.getWriteAddress(this.currentIndex + 1, modes[0]);
        input = await this.getInput();

        if (input === undefined) {
          throw new Error('No input values left in stack.');
        }

        break;
      case 4:
        this.output += String.fromCharCode(valueA);
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
      case 9:
        this.relativeBase += valueA;
        break;
      default:
        throw new Error(`Operation "${operation}": not supported`);
    }

    if (input !== undefined) {
      this.program[address] = input;
    }

    this.currentIndex = nextIndex;
  }

  parseOperation(operation) {
    const modes = [];

    if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(operation)) {
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
    const parameter = this._valueAt(index);

    switch (mode) {
      case 1:
        return parameter;
      case 2:
        return this._valueAt(parameter + this.relativeBase);
      default:
        return this._valueAt(parameter);
    }
  }

  getWriteAddress(index, mode = 0) {
    const address = this.program[index];

    if (mode === 2) {
      return address + this.relativeBase;
    }

    return address;
  }

  _valueAt(index) {
    return this.program[index] || 0;
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
      case 9:
        return this.currentIndex + 2;
      case 5:
      case 6:
        return this.currentIndex + 3;
      default:
        throw new Error(`Unsupported index jump for operation "${operation}"`);
    }
  }

  _waitMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  _write(value, encoding, callback) {
    this.inputStack.push(value);
    callback();
  }
}

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const calibrateCameras = (robotView) => {
  const rows = robotView.split('\n');
  let result = 0;

  for (let r = 0; r < rows.length; r += 1) {
    const row = rows[r];

    for (let c = 0; c < row.length; c += 1) {
      if (isIntersection(rows, r, c)) {
        result += c * r;
      }
    }
  }

  return result;
};

const isIntersection = (matrix, row, col) => {
  const coords = [
    { r: row, c: col },
    { r: row - 1, c: col },
    { r: row + 1, c: col },
    { r: row, c: col + 1 },
    { r: row, c: col - 1 }
  ];

  for (const { r, c } of coords) {
    if (matrix[r] && matrix[r][c] !== '#') {
      return false;
    }
  }

  return true;
};

const main = async (inputPath = 'day17/input') => {
  const program = await getInput(inputPath, parseInput);
  const computer = new IntcodeComputer(program);
  const robotView = await computer.run();

  console.log(robotView);

  return calibrateCameras(robotView);
};

module.exports = { main };
