const { getInput } = require('../utils');

const TRILLION = 1000000000000;

const parseInput = (input) => {
  const rulesText = input.split('\n');
  const result = {
    ORE: {
      name: 'ORE',
      quantity: 1,
      cost: []
    }
  };

  rulesText.forEach((ruleText) => {
    const node = parseRule(ruleText);

    result[node.name] = node;
  });

  return result;
};

const parseRule = (ruleText) => {
  const [requirementsText, outputText] = ruleText.split(' => ');
  const { name, quantity } = parseNode(outputText);
  const cost = [];

  for (const requiredNodeText of requirementsText.split(', ')) {
    const requirement = parseNode(requiredNodeText);

    cost.push({
      name: requirement.name,
      quantity: requirement.quantity
    });
  }

  return {
    name,
    quantity,
    cost
  };
};

const parseNode = (nodeText) => {
  const [quantityText, name] = nodeText.split(' ');

  return {
    name,
    quantity: parseInt(quantityText, 10)
  };
};

const createFuel = (reactions, initialResources = {}) => {
  const fuelCost = reactions.FUEL.cost;
  const debt = [...fuelCost];
  const resources = { ...initialResources };
  let usedOre = 0;

  for (const key in reactions) {
    if (!(key in resources)) {
      resources[key] = 0;
    }
  }

  while (debt.length) {
    const { name, quantity: debtQty } = debt.shift();
    let available = resources[name];

    if (name === 'ORE') {
      usedOre += debtQty;
    } else {
      const node = reactions[name];
      let factor = 0;

      while (available < debtQty) {
        factor += 1;
        available += node.quantity;
      }

      if (factor) {
        debt.push(...multiplyCost(node.cost, factor));
      }
    }

    available -= debtQty;

    resources[name] = available;

    if (available < 0) {
      break;
    }

    if (debt.length === 0) {
      resources.FUEL += 1;
    }
  }

  return { resources, usedOre };
};

const multiplyCost = (cost, factor) =>
  cost.map(({ name, quantity }) => ({
    name,
    quantity: factor * quantity
  }));

const resourcesAtZero = (resources) => {
  for (const key in resources) {
    if (!['ORE', 'FUEL'].includes(key)) {
      if (resources[key] !== 0) {
        return false;
      }
    }
  }

  return true;
};

const findOreCycle = (reactions) => {
  let resources = { ORE: TRILLION };
  let totalOre = 0;

  do {
    const result = createFuel(reactions, resources);
    ({ resources } = result);
    totalOre += result.usedOre;
  } while (totalOre <= TRILLION && !resourcesAtZero(resources));

  totalOre = Math.min(totalOre, TRILLION);

  return { FUEL: resources.FUEL, ORE: totalOre };
};

const useTrillionOre = (reactions) => {
  const oreCycle = findOreCycle(reactions);
  const oreCost = oreCycle.ORE;
  const cycles = Math.floor(TRILLION / oreCost);
  let resources = {
    FUEL: oreCycle.FUEL * cycles,
    ORE: TRILLION - cycles * oreCost
  };

  while (resources.ORE >= 0) {
    const result = createFuel(reactions, resources);

    ({ resources } = result);
  }

  return resources.FUEL;
};

const main = async (inputPath = 'day14/input') => {
  const reactions = await getInput(inputPath, parseInput);
  const totalFuel = useTrillionOre(reactions);

  return totalFuel;
};

module.exports = { createFuel, findOreCycle, main, parseInput, useTrillionOre };
