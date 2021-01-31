const { getInput } = require('../utils');
const { COLORS, Robot } = require('./day11-part-1');

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const getPaintedPanels = (program) => {
  const panel = { '0,0': COLORS.WHITE };
  const robot = new Robot(program, panel);
  robot.run();

  return panel;
};

const printPanels = (panelCoordinates) => {
  const result = [];
  const { leftMost, rightMost, topMost, bottomMost } = getBoundaries(
    panelCoordinates
  );

  for (let yCoord = topMost; yCoord >= bottomMost; yCoord -= 1) {
    let line = '';

    for (let xCoord = leftMost; xCoord <= rightMost; xCoord += 1) {
      line += panelCoordinates[`${xCoord},${yCoord}`] === 1 ? '#' : ' ';
    }

    result.push(line);
  }

  return `\n${result.join('\n')}`;
};

const getBoundaries = (panelCoordinates) => {
  let leftMost = Infinity;
  let rightMost = -Infinity;
  let topMost = -Infinity;
  let bottomMost = Infinity;

  for (const key in panelCoordinates) {
    const [xCoord, yCoord] = key.split(',');

    leftMost = Math.min(leftMost, parseInt(xCoord, 10));
    topMost = Math.max(topMost, parseInt(yCoord, 10));
    rightMost = Math.max(rightMost, parseInt(xCoord, 10));
    bottomMost = Math.min(bottomMost, parseInt(yCoord, 10));
  }

  return {
    leftMost,
    rightMost,
    topMost,
    bottomMost
  };
};

const main = async (inputPath = 'day11/input') => {
  const program = await getInput(inputPath, parseInput);
  const paintedPanels = getPaintedPanels(program);
  const hullCode = printPanels(paintedPanels);

  return hullCode;
};

module.exports = { main };
