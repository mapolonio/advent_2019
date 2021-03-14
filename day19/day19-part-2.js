const { getInput } = require('../utils');
const { Drone } = require('./day19-part-1');

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const findSquarePosition = (program) => {
  // From previous experiments we can see beam starts at (0, 0) and then jumps to (4, 5)
  const queue = [{ x: 4, y: 5 }];
  const queuedPositions = new Map([[0, true]]);
  const positionMap = new Map();
  const drone = new Drone(program);
  let result = null;

  while (!result) {
    const position = queue.shift();
    const positionKey = getPositionKey(position);

    drone.moveTo(position);

    const isAttracted = drone.testTractorBeam();
    positionMap.set(positionKey, isAttracted);

    if (isAttracted) {
      if (isBottomRightCorner(position, positionMap)) {
        result = { x: position.x - 99, y: position.y - 99 };
      }

      queue.push(...getNeighbors(position, queuedPositions));
    }
  }

  return result;
};

const isBottomRightCorner = (position, positionMap) => {
  const { x, y } = position;
  const corners = [
    { x: x - 99, y: y - 99 },
    { x: x - 99, y },
    { x, y: y - 99 }
  ];

  for (const corner of corners) {
    const positionKey = getPositionKey(corner);

    if (positionMap.get(positionKey) !== 1) {
      return false;
    }
  }

  return true;
};

const getNeighbors = ({ x, y }, queuedPositions) => {
  const result = [];

  const candidates = [
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 }
  ];

  for (const candidate of candidates) {
    const candidateKey = getPositionKey(candidate);

    if (!queuedPositions.has(candidateKey)) {
      result.push(candidate);
      queuedPositions.set(candidateKey, true);
    }
  }

  return result;
};

const getPositionKey = ({ x, y }) => {
  // eslint-disable-next-line no-mixed-operators
  return y * 1000 + x;
};

const main = async (inputPath = 'day19/input') => {
  const program = await getInput(inputPath, parseInput);
  const squarePosition = findSquarePosition(program);

  // eslint-disable-next-line no-mixed-operators
  return squarePosition.x * 10000 + squarePosition.y;
};

module.exports = { main, parseInput };
