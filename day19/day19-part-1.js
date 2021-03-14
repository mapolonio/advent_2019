const { getInput } = require('../utils');

class Drone {
  constructor(program) {
    this.originalProgram = program;
  }

  moveTo(position) {
    this.program = [...this.originalProgram];
    this.currentIndex = 0;
    this.inputStack = [position.x, position.y];
    this.relativeBase = 0;
    this.result = null;
  }

  testTractorBeam() {
    while (this.program[this.currentIndex] !== 99) {
      this.performOperation();
    }

    return this.result;
  }

  performOperation() {
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
        input = this.inputStack.shift();

        if (input === undefined) {
          throw new Error('No input values left in stack.');
        }

        break;
      case 4:
        this.result = valueA;
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
}

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const testTractorBeam = (program, gridSize) => {
  const queue = [{ x: 0, y: 0 }];
  const queuedPositions = new Map([[0, true]]);
  const drone = new Drone(program);
  let successPositions = 0;

  while (queue.length) {
    const position = queue.shift();

    queue.push(...getNeighbors(position, queuedPositions, gridSize));
    drone.moveTo(position);

    successPositions += drone.testTractorBeam();
  }

  return successPositions;
};

const getNeighbors = ({ x, y }, queuedPositions, gridSize) => {
  const limit = gridSize;
  const result = [];

  const candidates = [
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 }
  ];

  for (const candidate of candidates) {
    const candidateKey = getPositionKey(candidate, gridSize);

    if (
      candidate.x < limit &&
      candidate.y < limit &&
      !queuedPositions.has(candidateKey)
    ) {
      result.push(candidate);
      queuedPositions.set(candidateKey, true);
    }
  }

  return result;
};

const getPositionKey = ({ x, y }, gridSize) => {
  // eslint-disable-next-line no-mixed-operators
  return y * gridSize + x;
};

const main = async (inputPath = 'day19/input') => {
  const program = await getInput(inputPath, parseInput);

  return testTractorBeam(program, 50);
};

module.exports = { Drone, main, parseInput, testTractorBeam };
