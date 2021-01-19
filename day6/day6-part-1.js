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

const countOrbits = (key, orbitMap) => {
  const center = orbitMap[key];

  if (!center) {
    return 0;
  }

  return 1 + countOrbits(center, orbitMap);
};

const countMapOrbits = (orbitMap) => {
  let result = 0;

  for (const key in orbitMap) {
    result += countOrbits(key, orbitMap);
  }

  return result;
};

const main = async (inputPath = 'day6/input') => {
  const orbitMap = await getInput(inputPath, parseInput);
  const totalOrbits = countMapOrbits(orbitMap);

  return totalOrbits;
};

module.exports = { countOrbits, main, parseInput };
