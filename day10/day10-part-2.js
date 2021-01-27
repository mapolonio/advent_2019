const { getInput } = require('../utils');

const parseInput = (input) => {
  const result = new Set();
  const rows = input.split('\n');

  for (let r = 0; r < rows.length; r += 1) {
    const row = rows[r];
    const columns = row.split('');

    for (let c = 0; c < columns.length; c += 1) {
      const coord = columns[c];

      if (coord === '#') {
        result.add({ row: r, col: c });
      }
    }
  }

  return result;
};

const getVisibilityMap = (asteroids) => {
  const visibilityMap = new Map();

  for (const asteroid of asteroids) {
    visibilityMap.set(asteroid, getVisibleAsteroidsMap(asteroid, asteroids));
  }

  return visibilityMap;
};

const getVisibleAsteroidsMap = (origin, asteroidMap) => {
  const angleMap = {};

  for (const asteroid of asteroidMap) {
    if (asteroid === origin) {
      continue;
    }

    const { angle, dist } = getAngleAndDist(origin, asteroid);
    const { dist: currentDist } = angleMap[angle] || {};

    if (currentDist === undefined || dist < currentDist) {
      angleMap[angle] = {
        angle,
        dist,
        asteroid
      };
    }
  }

  return angleMap;
};

const getAngleAndDist = (asteroidA, asteroidB) => {
  const { xCoord, yCoord } = getCartesianCoords(asteroidA, asteroidB);
  const angle = getAngle(xCoord, yCoord);
  const dist = getDistance(xCoord, yCoord);

  return { angle, dist };
};

const getCartesianCoords = (center, point) => {
  const xCoord = point.col - center.col;
  const yCoord = center.row - point.row;

  return { xCoord, yCoord };
};

const getAngle = (xCoord, yCoord) => {
  let counterClockwiseAngle = Math.atan2(yCoord, xCoord) * (180 / Math.PI);

  if (counterClockwiseAngle < 0) {
    counterClockwiseAngle += 360;
  }

  const clockWiseAngle = getClockwiseAngle(counterClockwiseAngle);
  let verticalZeroAngle = clockWiseAngle - 270;

  if (verticalZeroAngle < 0) {
    verticalZeroAngle += 360;
  }

  return verticalZeroAngle;
};

const getDistance = (xCoord, yCoord) => {
  return Math.sqrt(Math.pow(xCoord, 2) + Math.pow(yCoord, 2));
};

const getStationCoords = (visibilityMap) => {
  let max = -Infinity;
  let station;

  for (const [asteroid, visibleAsteroidsMap] of visibilityMap) {
    const visibleAsteroids = Object.keys(visibleAsteroidsMap).length;

    if (visibleAsteroids > max) {
      max = visibleAsteroids;
      station = asteroid;
    }
  }

  return { asteroid: station, visibleAsteroids: max };
};

const destroyAsteroids = (origin, visibilityMap, asteroids, result = []) => {
  if (asteroids.size === 1) {
    return result;
  }

  const remainingAsteroids = new Set(asteroids);
  const visibleAsteroids = visibilityMap.get(origin);
  const clockwiseAsteroids = sortClockwise(visibleAsteroids);

  for (const { asteroid } of clockwiseAsteroids) {
    result.push(asteroid);
    remainingAsteroids.delete(asteroid);
  }

  return destroyAsteroids(
    origin,
    getVisibilityMap(remainingAsteroids),
    remainingAsteroids,
    result
  );
};

const sortClockwise = (visibleAsteroids) => {
  const result = [];

  for (const angle in visibleAsteroids) {
    result.push(visibleAsteroids[angle]);
  }

  return result.sort(sortByAngle);
};

const sortByAngle = (asteroidA, asteroidB) => {
  return asteroidA.angle - asteroidB.angle;
};

const getClockwiseAngle = (angle) => (360 - angle) % 360;

const main = async (inputPath = 'day10/input') => {
  const asteroids = await getInput(inputPath, parseInput);
  const visibilityMap = getVisibilityMap(asteroids);
  const stationCoords = getStationCoords(visibilityMap);
  const destroyedAsteroids = destroyAsteroids(
    stationCoords.asteroid,
    visibilityMap,
    asteroids
  );

  const twoHoundredthAsteroid = destroyedAsteroids[199];

  // eslint-disable-next-line no-mixed-operators
  return twoHoundredthAsteroid.col * 100 + twoHoundredthAsteroid.row;
};

module.exports = {
  getAngle,
  getCartesianCoords,
  getClockwiseAngle,
  getStationCoords,
  getVisibilityMap,
  main,
  parseInput
};
