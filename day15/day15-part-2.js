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
    this.oxygenSystemPosition = null;
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

    if (value === OUTPUTS.OXYGEN_SYSTEM) {
      this.oxygenSystemPosition = position;
    }
  }

  pathToKey(path) {
    return path.join(',');
  }

  positionToKey(position) {
    return `${position.x},${position.y}`;
  }

  display() {
    const { minX, maxX, minY, maxY } = this.getBoundaries(this.floorMap);
    const result = [];

    for (let row = maxY; row >= minY; row -= 1) {
      let line = '';

      for (let col = minX; col <= maxX; col += 1) {
        const element = this.floorMap[this.positionToKey({ x: col, y: row })];

        switch (element) {
          case OUTPUTS.SUCCESS:
            line += ' ';
            break;
          case OUTPUTS.OXYGEN_SYSTEM:
            line += 'O';
            break;
          default:
            line += '#';
        }
      }

      result.push(line);
    }

    console.log(result.join('\n'));
  }

  getBoundaries() {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const key in this.floorMap) {
      const [x, y] = key.split(',').map((n) => parseInt(n, 10));
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    return { minX, maxX, minY, maxY };
  }

  async getOxygenationTime({ display = false }) {
    const queue = [[this.positionToKey(this.oxygenSystemPosition)]];
    let minutes = 0;

    while (queue.length) {
      if (display) {
        this.display();
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const positionsToProcess = queue.shift();
      const neighborKeys = this.getFloorNeighbors(positionsToProcess);

      for (const neighborKey of neighborKeys) {
        this.floorMap[neighborKey] = OUTPUTS.OXYGEN_SYSTEM;
      }

      if (neighborKeys.length) {
        queue.push(neighborKeys);
        minutes += 1;
      }
    }

    return minutes;
  }

  getFloorNeighbors(positionKeys) {
    const result = [];

    for (const positionKey of positionKeys) {
      const [x, y] = positionKey.split(',').map((n) => parseInt(n, 10));
      const neighborKeys = [
        { x, y: y + 1 },
        { x, y: y - 1 },
        { x: x - 1, y },
        { x: x + 1, y }
      ]
        .map((position) => this.positionToKey(position))
        .filter((key) => this.floorMap[key] === OUTPUTS.SUCCESS);

      result.push(...neighborKeys);
    }

    return result;
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

const exploreMap = (program) => {
  let path;
  let robot;
  const floorMap = new FloorMap();
  const queue = [...getNextPaths([], floorMap)];

  while (queue.length) {
    path = queue.shift();
    robot = new Robot(program, path);
    robot.run();
    floorMap.markPosition(path, robot.lastOutput);

    if ([OUTPUTS.SUCCESS, OUTPUTS.OXYGEN_SYSTEM].includes(robot.lastOutput)) {
      queue.push(...getNextPaths(path, floorMap));
    }
  }

  return floorMap;
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

const main = async (inputPath = 'day15/input', options) => {
  const program = await getInput(inputPath, parseInput);
  const floorMap = exploreMap(program);

  return floorMap.getOxygenationTime({
    display: options.includes('--display')
  });
};

module.exports = { main };
