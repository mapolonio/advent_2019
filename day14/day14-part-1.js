const { getInput } = require('../utils');

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

const createFuel = (reactions) => {
  const debt = [{ name: 'FUEL', quantity: 1 }];
  const resources = {};
  let usedOre = 0;

  while (debt.length) {
    const { name, quantity: debtQty } = debt.shift();

    if (!(name in resources)) {
      resources[name] = 0;
    }

    const node = reactions[name];

    while (resources[name] < debtQty) {
      resources[name] += node.quantity;

      debt.push(...node.cost);
    }

    resources[name] -= debtQty;

    if (name === 'ORE') {
      usedOre += debtQty;
    }
  }

  return usedOre;
};

const main = async (inputPath = 'day14/input') => {
  const reactionsMap = await getInput(inputPath, parseInput);
  const totalOreCost = createFuel(reactionsMap);

  return totalOreCost;
};

module.exports = { createFuel, main, parseInput };
