const { getInput } = require('../utils');
const { Writable } = require('stream');

const SYMBOLS = Object.freeze({
  EMPTY: '.',
  FLOOR: '#',
  ROBOT_NORTH: '^',
  ROBOT_SOUTH: 'v',
  ROBOT_EAST: '>',
  ROBOT_WEST: '<'
});

class Robot extends Writable {
  constructor(program) {
    super({ objectMode: true });

    this.program = [...program];
    this.currentIndex = 0;
    this.inputStack = [];
    this.parameterStack = [];
    this.output = [];
    this.relativeBase = 0;
    this.mapReady = false;
    this.floorMap = [];
    this.collectedDust = 0;
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
        ({ address, input } = await this.processInput(modes[0]));

        if (input === undefined) {
          throw new Error('No input values left in stack.');
        }

        break;
      case 4:
        await this.processOutput(valueA);
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

  encodeInput(input) {
    return `${input}\n`.split('').map((c) => c.charCodeAt());
  }

  async processInput(mode) {
    const address = this.getWriteAddress(this.currentIndex + 1, mode);
    const input = await this.getInput();
    const char = String.fromCharCode(input);

    if (char === '\n') {
      console.log(this.parameterStack.join(''));
      this.parameterStack = [];
      await this._waitMs(500);
    } else {
      this.parameterStack.push(char);
    }

    return { address, input };
  }

  async processOutput(output) {
    const char = String.fromCharCode(output);

    if (char === '\n') {
      const line = this.output.join('');

      console.log(line);

      if (!this.mapReady && line.length > 1) {
        this.floorMap.push(line);
      }

      if (this.output.length === 0) {
        this.mapReady = true;

        await this._waitMs(100);
      }

      this.output = [];
    } else {
      this.output.push(char);
      this.collectedDust = output;
    }
  }

  async scanArea() {
    while (!this.mapReady) {
      await this._waitMs(0);
    }

    return this.floorMap;
  }

  _waitMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  _write(value, encoding, callback) {
    this.inputStack.push(...this.encodeInput(value));

    callback();
  }
}

const parseInput = (input) => {
  const program = input.split(',').map((n) => parseInt(n, 10));

  program[0] = 2;

  return program;
};

const buildRoutine = (floorMap) => {
  const steps = getSteps(floorMap);
  const functions = buildFunctions(steps);
  let mainRoutine = steps.join(',');

  if (functions === null) {
    throw new Error('Failed to build routine');
  }

  for (const funcName in functions) {
    const funcString = functions[funcName];

    mainRoutine = mainRoutine.replace(new RegExp(funcString, 'g'), funcName);
  }

  return {
    mainRoutine,
    ...functions
  };
};

const getSteps = (floorMap) => {
  const nodes = findNodes(floorMap);
  const result = [];
  let { node: currentNode, robotDirection } = extractStartNode(floorMap, nodes);

  while (nodes.length) {
    const nextNode = extractNextNode(floorMap, currentNode, nodes);
    const { distance, direction } = getInstructions(currentNode, nextNode);
    const rotations = getRotations(robotDirection, direction);

    result.push(...rotations, distance);
    robotDirection = direction;
    currentNode = nextNode;
  }

  return result;
};

const buildFunctions = (steps) => {
  const routineString = steps.join(',');

  for (let aSize = 1; aSize <= steps.length - 2; aSize += 1) {
    const aCandidate = steps.slice(0, aSize);
    const aFuncString = aCandidate.join(',');

    if (aFuncString.length > 20) {
      break;
    }

    const stepsWithoutA = removeSubArray(steps, aCandidate);

    for (let bSize = 1; bSize <= stepsWithoutA.length - 1; bSize += 1) {
      const bCandidate = stepsWithoutA.slice(0, bSize);
      const bFuncString = bCandidate.join(',');

      if (bFuncString.length > 20) {
        break;
      }

      const stepsWithoutAandB = removeSubArray(stepsWithoutA, bCandidate);

      for (let cSize = 1; cSize <= stepsWithoutAandB.length; cSize += 1) {
        const cCandidate = stepsWithoutAandB.slice(0, cSize);
        const cFuncString = cCandidate.join(',');

        if (cFuncString.length > 20) {
          break;
        }

        const stepsWithoutABandC = removeSubArray(
          stepsWithoutAandB,
          cCandidate
        );

        if (
          stepsWithoutABandC.length === 0 &&
          validateFunctions(routineString, [
            aFuncString,
            bFuncString,
            cFuncString
          ])
        ) {
          return {
            A: aFuncString,
            B: bFuncString,
            C: cFuncString
          };
        }
      }
    }
  }

  return null;
};

const validateFunctions = (routineString, functions) => {
  let compressedRoutine = routineString;

  for (const func of functions) {
    compressedRoutine = compressedRoutine.replace(new RegExp(func, 'g'), '');
  }

  return compressedRoutine.replace(/,/g, '').length === 0;
};

const removeSubArray = (array, subArray) => {
  if (!subArray.length) {
    return array;
  }

  const result = [...array];
  let windowStart = 0;

  while (windowStart <= result.length - subArray.length) {
    for (let i = windowStart; i <= result.length - subArray.length; i += 1) {
      const match = result
        .slice(windowStart, windowStart + subArray.length)
        .every((el, index) => el === subArray[index]);

      if (match) {
        result.splice(i, subArray.length);
        windowStart = i;
        break;
      } else {
        windowStart += 1;
      }
    }
  }

  return result;
};

const findNodes = (floorMap) => {
  const result = [];

  for (let r = 0; r < floorMap.length; r += 1) {
    const row = floorMap[r];

    for (let c = 0; c < row.length; c += 1) {
      if (isNode(floorMap, r, c)) {
        result.push({ row: r, col: c });
      }
    }
  }

  return result;
};

const isNode = (floorMap, row, col) => {
  if (floorMap[row][col] === SYMBOLS.EMPTY) {
    return false;
  }

  const top = { row: row - 1, col };
  const bottom = { row: row + 1, col };
  const left = { row, col: col - 1 };
  const right = { row, col: col + 1 };
  let hasTopNeighbor = false;
  let hasBottomNeighbor = false;
  let hasLeftNeighbor = false;
  let hasRightNeighbor = false;
  let neighborCount = 0;

  if (isFloor(floorMap, top)) {
    neighborCount += 1;
    hasTopNeighbor = true;
  }

  if (isFloor(floorMap, bottom)) {
    neighborCount += 1;
    hasBottomNeighbor = true;
  }

  if (isFloor(floorMap, left)) {
    neighborCount += 1;
    hasLeftNeighbor = true;
  }

  if (isFloor(floorMap, right)) {
    neighborCount += 1;
    hasRightNeighbor = true;
  }

  if (neighborCount > 2) {
    return false;
  }

  if (hasTopNeighbor && hasBottomNeighbor) {
    return false;
  }

  if (hasLeftNeighbor && hasRightNeighbor) {
    return false;
  }

  return true;
};

const isFloor = (floorMap, { row, col }) => {
  return (
    floorMap[row] && floorMap[row][col] && floorMap[row][col] !== SYMBOLS.EMPTY
  );
};

const extractStartNode = (floorMap, nodes) => {
  const { ROBOT_NORTH, ROBOT_SOUTH, ROBOT_EAST, ROBOT_WEST } = SYMBOLS;
  const robotPositions = [ROBOT_NORTH, ROBOT_SOUTH, ROBOT_EAST, ROBOT_WEST];
  let node;
  let i = 0;
  let robotDirection;

  while (i < nodes.length) {
    node = nodes[i];
    const mapContent = floorMap[node.row][node.col];

    if (robotPositions.includes(mapContent)) {
      robotDirection = mapContent;
      break;
    }

    i += 1;
  }

  nodes.splice(i, 1);

  return { node, robotDirection };
};

const extractNextNode = (floorMap, currentNode, nodes) => {
  let i = 0;
  let result;

  while (i < nodes.length) {
    const node = nodes[i];

    if (existsEdge(floorMap, currentNode, node)) {
      result = node;
      break;
    }

    i += 1;
  }

  nodes.splice(i, 1);

  return result;
};

const existsEdge = (floorMap, nodeA, nodeB) => {
  const rowDiff = nodeA.row - nodeB.row;
  const colDiff = nodeA.col - nodeB.col;

  if (rowDiff !== 0 && colDiff !== 0) {
    return false;
  }

  const startRow = Math.min(nodeA.row, nodeB.row);
  const endRow = Math.max(nodeA.row, nodeB.row);
  const startCol = Math.min(nodeA.col, nodeB.col);
  const endCol = Math.max(nodeA.col, nodeB.col);

  return checkEdge({ floorMap, startRow, endRow, startCol, endCol });
};

const checkEdge = ({ floorMap, startRow, endRow, startCol, endCol }) => {
  for (let r = startRow; r <= endRow; r += 1) {
    for (let c = startCol; c <= endCol; c += 1) {
      if (floorMap[r][c] === SYMBOLS.EMPTY) {
        return false;
      }
    }
  }

  return true;
};

const getInstructions = (currentNode, nextNode) => {
  let direction;
  const distance = Math.sqrt(
    Math.pow(currentNode.row - nextNode.row, 2) +
      Math.pow(currentNode.col - nextNode.col, 2)
  );

  if (currentNode.row < nextNode.row) {
    direction = SYMBOLS.ROBOT_SOUTH;
  } else if (currentNode.row > nextNode.row) {
    direction = SYMBOLS.ROBOT_NORTH;
  } else if (currentNode.col < nextNode.col) {
    direction = SYMBOLS.ROBOT_EAST;
  } else {
    direction = SYMBOLS.ROBOT_WEST;
  }

  return { distance, direction };
};

const getRotations = (currentDirection, nextDirection) => {
  const result = [];
  let angleDiff = 0;
  let direction = currentDirection;

  while (direction !== nextDirection) {
    direction = getNextDirection(direction);
    angleDiff += 90;
  }

  switch (angleDiff) {
    case 90:
      result.push('R');
      break;
    case 180:
      result.push('R', 'R');
      break;
    case 270:
      result.push('L');
      break;
    default:
    // NOOP
  }

  return result;
};

const getNextDirection = (direction) => {
  const { ROBOT_NORTH, ROBOT_SOUTH, ROBOT_WEST, ROBOT_EAST } = SYMBOLS;

  switch (direction) {
    case ROBOT_NORTH:
      return ROBOT_EAST;
    case ROBOT_EAST:
      return ROBOT_SOUTH;
    case ROBOT_SOUTH:
      return ROBOT_WEST;
    default:
      return ROBOT_NORTH;
  }
};

const main = async (inputPath = 'day17/input', options) => {
  const program = await getInput(inputPath, parseInput);
  const robot = new Robot(program);
  const videoFeed = options.includes('--video') ? 'y' : 'n';

  const robotsSaved = robot.run();
  const floorMap = await robot.scanArea();
  const { mainRoutine, A, B, C } = buildRoutine(floorMap);

  robot.write(mainRoutine);
  robot.write(A);
  robot.write(B);
  robot.write(C);
  robot.write(videoFeed);

  await robotsSaved;

  return robot.collectedDust;
};

module.exports = { main, removeSubArray };
