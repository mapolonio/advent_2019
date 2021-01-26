const { getInput } = require('../utils');

const parseInput = (input) => {
  const result = new Map();
  const rows = input.split('\n');

  for (let r = 0; r < rows.length; r += 1) {
    const row = rows[r];
    const columns = row.split('');

    for (let c = 0; c < columns.length; c += 1) {
      const coord = columns[c];

      if (coord === '#') {
        result.set([r, c], true);
      }
    }
  }

  return result;
};

const getVisibilityMap = (asteroidMap) => {
  const visibilityMap = new Map();

  for (const [coords] of asteroidMap) {
    visibilityMap.set(coords, getVisibleAsteroidAnglesMap(coords, asteroidMap));
  }

  return visibilityMap;
};

const getVisibleAsteroidAnglesMap = (origin, asteroidMap) => {
  const result = {};

  for (const [coords] of asteroidMap) {
    const [row, col] = coords;

    if (row === origin[0] && col === origin[1]) {
      continue;
    }

    const { angle, dist } = getAngleAndDist(origin, [row, col]);
    const { dist: currentDist } = result[angle] || {};

    if (currentDist === undefined || dist < currentDist) {
      result[angle] = {
        dist,
        asteroid: [row, col]
      };
    }
  }

  return result;
};

const getAngleAndDist = (asteroidA, asteroidB) => {
  const { xCoord, yCoord } = getCartesianCoords(asteroidA, asteroidB);
  const angle = getAngle(xCoord, yCoord);
  const dist = getDistance(xCoord, yCoord);

  return { angle, dist };
};

const getCartesianCoords = (center, point) => {
  const xCoord = point[1] - center[1];
  const yCoord = center[0] - point[0];

  return { xCoord, yCoord };
};

const getAngle = (xCoord, yCoord) => {
  let angle = Math.atan2(yCoord, xCoord) * (180 / Math.PI);

  if (angle < 0) {
    angle += 360;
  }

  return angle;
};

const getDistance = (xCoord, yCoord) => {
  return Math.sqrt(Math.pow(xCoord, 2) + Math.pow(yCoord, 2));
};

const main = async (inputPath = 'day10/input') => {
  const asteroidMap = await getInput(inputPath, parseInput);
  const visibilityMap = getVisibilityMap(asteroidMap);
  let max = 0;

  for (const [, visibleAsteroidsMap] of visibilityMap) {
    max = Math.max(max, Object.keys(visibleAsteroidsMap).length);
  }

  return max;
};

module.exports = { getAngle, getCartesianCoords, main, parseInput };
