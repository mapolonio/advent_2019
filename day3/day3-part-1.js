const { getInput } = require('../utils');

const parseInput = (input) => {
  const [path1, path2] = input.split('\n').map(parsePath);

  return {
    path1,
    path2
  };
};

const parsePath = (pathText) =>
  pathText.split(',').map((dirText) => ({
    direction: dirText[0],
    value: parseInt(dirText.substring(1), 10)
  }));

const getClosestIntersection = (path1, path2) => {
  const cableLines1 = getCableLines(path1);
  const cableLines2 = getCableLines(path2);
  let minDist = Infinity;

  for (const line1 of cableLines1) {
    for (const line2 of cableLines2) {
      const intersection = getIntersection(line1, line2);

      if (intersection && !isOrigin(intersection)) {
        const distToOrigin = getDistToOrigin(intersection);

        minDist = Math.min(distToOrigin, minDist);
      }
    }
  }

  return minDist;
};

const getIntersection = (line1, line2) => {
  const points = getPoints(line1);

  for (const point of points) {
    if (belongsToLine(point, line2)) {
      return point;
    }
  }
};

const getPoints = (line) => {
  const { origin, end } = line;
  const result = [];
  let start;
  let finish;

  if (origin.x === end.x) {
    start = Math.min(origin.y, end.y);
    finish = Math.max(origin.y, end.y);

    for (let i = start; i <= finish; i += 1) {
      result.push({ x: origin.x, y: i });
    }
  } else {
    start = Math.min(origin.x, end.x);
    finish = Math.max(origin.x, end.x);

    for (let i = start; i <= finish; i += 1) {
      result.push({ x: i, y: origin.y });
    }
  }

  return result;
};

const belongsToLine = (point, line) => {
  const { origin, end } = line;
  const { x, y } = point;

  if (origin.x === end.x) {
    return isInInterval(origin.y, end.y, y) && x === origin.x;
  }

  return isInInterval(origin.x, end.x, x) && y === origin.y;
};

const isInInterval = (boundaryA, boundaryB, value) => {
  const min = Math.min(boundaryA, boundaryB);
  const max = Math.max(boundaryA, boundaryB);

  return min <= value && value <= max;
};

const isOrigin = ({ x, y }) => x === 0 && y === 0;

const getDistToOrigin = ({ x, y }) => Math.abs(x) + Math.abs(y);

const getCableLines = (cablePath) => {
  let x = 0;
  let y = 0;
  const result = [];

  for (const line of cablePath) {
    const { endX, endY } = getEndCoordinates(line, x, y);

    result.push({
      origin: { x, y },
      end: { x: endX, y: endY }
    });

    x = endX;
    y = endY;
  }

  return result;
};

const getEndCoordinates = (line, startX, startY) => {
  let endX = startX;
  let endY = startY;

  switch (line.direction) {
    case 'R':
      endX += line.value;
      break;
    case 'L':
      endX -= line.value;
      break;
    case 'U':
      endY += line.value;
      break;
    case 'D':
      endY -= line.value;
      break;
    default:
      new Error(`Direction not supported: "${line.direction}"`);
  }

  return {
    endX,
    endY
  };
};

const main = async (inputPath = 'day3/input') => {
  const { path1, path2 } = await getInput(inputPath, parseInput);
  const distanceToClosestIntersection = getClosestIntersection(path1, path2);

  return distanceToClosestIntersection;
};

module.exports = {
  belongsToLine,
  getCableLines,
  getClosestIntersection,
  main,
  parseInput
};
