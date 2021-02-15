const { getInput } = require('../utils');

const OUTPUTS = Object.freeze({
  WALL: 0,
  SUCCESS: 1,
  OXYGEN_SYSTEM: 2
});

const DIRECTIONS = Object.freeze({
  NORTH: 1,
  SOUTH: 2,
  WEST: 3,
  EAST: 4
});

class FloorMap {
  constructor() {
    this.floorMap = { '0,0': OUTPUTS.SUCCESS };
    this.cache = {};
  }

  toPosition(path) {
    const key = this.pathToKey(path);

    if (key in this.cache) {
      return this.cache[key];
    }

    let x = 0;
    let y = 0;

    for (const direction of path) {
      switch (direction) {
        case DIRECTIONS.NORTH:
          y += 1;
          break;
        case DIRECTIONS.SOUTH:
          y -= 1;
          break;
        case DIRECTIONS.WEST:
          x -= 1;
          break;
        case DIRECTIONS.EAST:
          x += 1;
          break;
        default:
          throw new Error(`Direction not suported: ${direction}`);
      }
    }

    const result = { x, y };
    this.cache[key] = result;

    return result;
  }

  isVisited(path) {
    const position = this.toPosition(path);
    return this.positionToKey(position) in this.floorMap;
  }

  markPosition(path, value) {
    const position = this.toPosition(path);
    this.floorMap[this.positionToKey(position)] = value;
  }

  pathToKey(path) {
    return path.join(',');
  }

  positionToKey(position) {
    return `${position.x},${position.y}`;
  }
}

class Robot {
  constructor(program, path) {
    this.program = [...program];
    this.currentIndex = 0;
    this.inputStack = [];
    this.outputs = [];
    this.relativeBase = 0;
    this.path = path;
    this.pathIndex = 0;
    this.oxygenReached = false;
    this.lastOutput = undefined;
  }

  run() {
    while (
      this.pathIndex <= this.path.length &&
      this.program[this.currentIndex] !== 99
    ) {
      if (this.currentIndex >= this.program.length) {
        throw new Error('Index out of bounds');
      }

      this.performOperation();
    }
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
        input = this.path[this.pathIndex];
        this.pathIndex += 1;

        break;
      case 4:
        this.processOutput(valueA);
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

  processOutput(output) {
    this.lastOutput = output;
    this.oxygenReached = output === OUTPUTS.OXYGEN_SYSTEM;
  }
}

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const findPath = (program) => {
  let path;
  let robot;
  const floorMap = new FloorMap();
  const queue = [...getNextPaths([], floorMap)];

  do {
    path = queue.shift();
    robot = new Robot(program, path);
    robot.run();
    floorMap.markPosition(path, robot.lastOutput);

    if (robot.lastOutput === OUTPUTS.SUCCESS) {
      queue.push(...getNextPaths(path, floorMap));
    }
  } while (!robot.oxygenReached);

  return path;
};

const getNextPaths = (prevPath, floorMap) => {
  const result = [];

  for (const direction of Object.values(DIRECTIONS)) {
    const newPath = [...prevPath, direction];

    if (!floorMap.isVisited(newPath)) {
      result.push(newPath);
    }
  }

  return result;
};

const main = async (inputPath = 'day15/input') => {
  const program = await getInput(inputPath, parseInput);
  const path = findPath(program);

  return path.length;
};

module.exports = { main };
