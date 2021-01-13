const { getInput } = require('../utils');

const parseInput = (input) => {
  return input.split('\n').map((massText) => {
    return getFuel(parseInt(massText, 10));
  });
};

const getFuel = (mass) => {
  const requiredFuel = Math.floor(mass / 3) - 2;

  if (requiredFuel <= 0) {
    return 0;
  }

  return requiredFuel + getFuel(requiredFuel);
};

const main = async (inputPath = 'day1/input') => {
  const fuelRequirements = await getInput(inputPath, parseInput);
  let result = 0;

  for (const fuelReq of fuelRequirements) {
    result += fuelReq;
  }

  return result;
};

module.exports = { getFuel, main };
