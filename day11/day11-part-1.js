const { getInput } = require('../utils');

const ACTIONS = Object.freeze({
  PAINT: 'paint',
  MOVE: 'move'
});

const DIRECTIONS = Object.freeze({
  NORTH: 'north',
  EAST: 'east',
  SOUTH: 'south',
  WEST: 'west'
});

const COLORS = Object.freeze({
  BLACK: 0,
  WHITE: 1
});

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

class Robot {
  constructor(program, panel) {
    this.program = [...program];
    this.currentIndex = 0;
    this.relativeBase = 0;
    this.direction = DIRECTIONS.NORTH;
    this.xCoord = 0;
    this.yCoord = 0;
    this.panel = panel;
    this.nextAction = ACTIONS.PAINT;
  }

  run() {
    while (this.program[this.currentIndex] !== 99) {
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
        input = this.readCamera();
        break;
      case 4:
        this.executeNextAction(valueA);
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

  readCamera() {
    return this.panel[this.positionKey] || COLORS.BLACK;
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

  executeNextAction(parameter) {
    switch (this.nextAction) {
      case ACTIONS.PAINT:
        this.paintPanel(parameter);
        this.nextAction = ACTIONS.MOVE;
        break;
      case ACTIONS.MOVE:
        this.move(parameter);
        this.nextAction = ACTIONS.PAINT;
        break;
      default:
        throw new Error(`Action not supported: ${this.nextAction}`);
    }
  }

  paintPanel(color) {
    this.panel[this.positionKey] = color;
  }

  move(direction) {
    switch (direction) {
      case 0:
        this.turnLeft();
        break;
      case 1:
        this.turnRight();
        break;
      default:
        throw new Error(`Rotation not supported: ${direction}`);
    }

    this.moveForward();
  }

  turnLeft() {
    switch (this.direction) {
      case DIRECTIONS.NORTH:
        this.direction = DIRECTIONS.WEST;
        break;
      case DIRECTIONS.EAST:
        this.direction = DIRECTIONS.NORTH;
        break;
      case DIRECTIONS.SOUTH:
        this.direction = DIRECTIONS.EAST;
        break;
      case DIRECTIONS.WEST:
        this.direction = DIRECTIONS.SOUTH;
        break;
      default:
        throw new Error(`Direction not supported: ${this.direction}`);
    }
  }

  turnRight() {
    switch (this.direction) {
      case DIRECTIONS.NORTH:
        this.direction = DIRECTIONS.EAST;
        break;
      case DIRECTIONS.EAST:
        this.direction = DIRECTIONS.SOUTH;
        break;
      case DIRECTIONS.SOUTH:
        this.direction = DIRECTIONS.WEST;
        break;
      case DIRECTIONS.WEST:
        this.direction = DIRECTIONS.NORTH;
        break;
      default:
        throw new Error(`Direction not supported: ${this.direction}`);
    }
  }

  moveForward() {
    switch (this.direction) {
      case DIRECTIONS.NORTH:
        this.yCoord += 1;
        break;
      case DIRECTIONS.EAST:
        this.xCoord += 1;
        break;
      case DIRECTIONS.SOUTH:
        this.yCoord -= 1;
        break;
      case DIRECTIONS.WEST:
        this.xCoord -= 1;
        break;
      default:
        throw new Error(`Direction not supported: ${this.direction}`);
    }
  }

  get positionKey() {
    return `${this.xCoord},${this.yCoord}`;
  }
}

const getPaintedPanels = (program) => {
  const panel = {};
  const robot = new Robot(program, panel);
  robot.run();

  return panel;
};

const main = async (inputPath = 'day11/input') => {
  const program = await getInput(inputPath, parseInput);
  const paintedPanels = getPaintedPanels(program);

  return Object.keys(paintedPanels).length;
};

module.exports = { COLORS, main, Robot };
