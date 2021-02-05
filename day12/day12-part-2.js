const { getInput, getLCM } = require('../utils');

class Moon {
  constructor(xCoord, yCoord, zCoord) {
    this.xCoord = xCoord;
    this.yCoord = yCoord;
    this.zCoord = zCoord;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.zVelocity = 0;
  }

  applyGravity(otherMoon) {
    const xChange = this.getVelocityChange(this.xCoord, otherMoon.xCoord);
    const yChange = this.getVelocityChange(this.yCoord, otherMoon.yCoord);
    const zChange = this.getVelocityChange(this.zCoord, otherMoon.zCoord);

    this.xVelocity += xChange;
    this.yVelocity += yChange;
    this.zVelocity += zChange;
    otherMoon.xVelocity -= xChange;
    otherMoon.yVelocity -= yChange;
    otherMoon.zVelocity -= zChange;
  }

  getVelocityChange(coordA, coordB) {
    if (coordA === coordB) {
      return 0;
    }

    if (coordA < coordB) {
      return 1;
    }

    return -1;
  }

  move() {
    this.xCoord += this.xVelocity;
    this.yCoord += this.yVelocity;
    this.zCoord += this.zVelocity;
  }
}

class MoonSystem {
  constructor(moons) {
    this.moons = moons;
    this.moonPairs = this.initPairs();
    this.currentStep = 0;
    this.cache = { x: {}, y: {}, z: {} };
    this.states = {};
    this.cycles = {};
    this.updateStateKeys();
    this.saveState();
  }

  initPairs() {
    const pairs = new Map();
    const result = [];

    for (const moon of this.moons) {
      if (!pairs.has(moon)) {
        pairs.set(moon, new Map());
      }

      for (const otherMoon of this.moons) {
        if (!pairs.has(otherMoon)) {
          pairs.set(otherMoon, new Map());
        }

        if (
          moon === otherMoon ||
          pairs.get(moon).get(otherMoon) ||
          pairs.get(otherMoon).get(moon)
        ) {
          continue;
        }

        pairs.get(moon).set(otherMoon, true);
        result.push([moon, otherMoon]);
      }
    }

    return result;
  }

  simulateStep() {
    for (const [moonA, moonB] of this.moonPairs) {
      moonA.applyGravity(moonB);
    }

    for (const moon of this.moons) {
      moon.move();
    }

    this.currentStep += 1;
    this.updateStateKeys();
    this.updateCycleStates();
    this.saveState();
  }

  saveState() {
    for (const axis of ['x', 'y', 'z']) {
      this.cache[axis][this.states[axis]] = this.currentStep;
    }
  }

  updateCycleStates() {
    for (const axis of ['x', 'y', 'z']) {
      const state = this.states[axis];

      if (!(axis in this.cycles) && state in this.cache[axis]) {
        this.cycles[axis] = this.currentStep - this.cache[axis][state];
      }
    }
  }

  updateStateKeys() {
    const xState = [];
    const yState = [];
    const zState = [];

    for (const moon of this.moons) {
      xState.push(moon.xCoord, moon.xVelocity);
      yState.push(moon.yCoord, moon.yVelocity);
      zState.push(moon.zCoord, moon.zVelocity);
    }

    this.states.x = xState.join(',');
    this.states.y = yState.join(',');
    this.states.z = zState.join(',');
  }

  get cycleCompleted() {
    return ['x', 'y', 'z'].every((axis) => axis in this.cycles);
  }

  get cycleLength() {
    if (this.cycleCompleted) {
      return getLCM([this.cycles.x, this.cycles.y, this.cycles.z]);
    }

    return null;
  }
}

const parseInput = (input) => {
  return input.split('\n').map(parseMoon);
};

const parseMoon = (moonText) => {
  const [, , xText, , yText, , zText] = moonText.split(/<|=|,|>/g);

  return new Moon(
    parseInt(xText, 10),
    parseInt(yText, 10),
    parseInt(zText, 10)
  );
};

const findRepeatedStep = (moonSystem) => {
  while (!moonSystem.cycleCompleted) {
    moonSystem.simulateStep();
  }

  return moonSystem.cycleLength;
};

const main = async (inputPath = 'day12/input') => {
  const moons = await getInput(inputPath, parseInput);
  const moonSystem = new MoonSystem(moons);
  const result = findRepeatedStep(moonSystem);

  return result;
};

module.exports = {
  findRepeatedStep,
  main,
  Moon,
  MoonSystem
};
