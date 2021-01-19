const { getInput } = require('../utils');

const parseInput = (input) => {
  const result = {};

  for (const orbitText of input.split('\n')) {
    const { center, satellite } = parseOrbit(orbitText);

    result[satellite] = center;
  }

  return result;
};

const parseOrbit = (orbitText) => {
  const [center, satellite] = orbitText.split(')');

  return {
    center,
    satellite
  };
};

const getDistanceMap = (key, orbitMap, accumulatedDist = 0, result = {}) => {
  const center = orbitMap[key];
  result[key] = accumulatedDist;

  if (!center) {
    return result;
  }

  return getDistanceMap(center, orbitMap, accumulatedDist + 1, result);
};

const getDistance = (bodyA, bodyB, orbitMap) => {
  const centerA = orbitMap[bodyA];
  const centerB = orbitMap[bodyB];

  const distanceMapA = getDistanceMap(centerA, orbitMap);
  const distanceMapB = getDistanceMap(centerB, orbitMap);

  if (distanceMapA[centerB]) {
    return distanceMapA[centerB];
  }

  if (distanceMapB[centerA]) {
    return distanceMapB[centerA];
  }

  const closestRelative = getClosestRelative(distanceMapA, distanceMapB);

  return distanceMapA[closestRelative] + distanceMapB[closestRelative];
};

const getClosestRelative = (distanceMapA, distanceMapB) => {
  let closestRelative;
  let minDistance = Infinity;

  for (const relative in distanceMapA) {
    const distanceToB = distanceMapB[relative] || Infinity;

    if (distanceToB < minDistance) {
      closestRelative = relative;
      minDistance = distanceToB;
    }
  }

  return closestRelative;
};

const main = async (inputPath = 'day6/input') => {
  const orbitMap = await getInput(inputPath, parseInput);
  const distanceToSanta = getDistance('YOU', 'SAN', orbitMap);

  return distanceToSanta;
};

module.exports = {
  getClosestRelative,
  getDistance,
  getDistanceMap,
  main,
  parseInput
};
