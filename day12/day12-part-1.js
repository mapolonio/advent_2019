const { getInput } = require('../utils');

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
    if (otherMoon.xCoord > this.xCoord) {
      this.xVelocity += 1;
    } else if (otherMoon.xCoord < this.xCoord) {
      this.xVelocity -= 1;
    }

    if (otherMoon.yCoord > this.yCoord) {
      this.yVelocity += 1;
    } else if (otherMoon.yCoord < this.yCoord) {
      this.yVelocity -= 1;
    }

    if (otherMoon.zCoord > this.zCoord) {
      this.zVelocity += 1;
    } else if (otherMoon.zCoord < this.zCoord) {
      this.zVelocity -= 1;
    }
  }

  move() {
    this.xCoord += this.xVelocity;
    this.yCoord += this.yVelocity;
    this.zCoord += this.zVelocity;
  }

  get potencialEnergy() {
    return (
      Math.abs(this.xCoord) + Math.abs(this.yCoord) + Math.abs(this.zCoord)
    );
  }

  get kineticEnergy() {
    return (
      Math.abs(this.xVelocity) +
      Math.abs(this.yVelocity) +
      Math.abs(this.zVelocity)
    );
  }

  get energy() {
    return this.potencialEnergy * this.kineticEnergy;
  }
}

class MoonSystem {
  constructor(moons) {
    this.moons = new Set(moons);
    this.moonPairs = this.getMoonPairs();
  }

  getMoonPairs() {
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
      moonB.applyGravity(moonA);
    }

    for (const moon of this.moons) {
      moon.move();
    }
  }

  get totalEnergy() {
    let total = 0;

    for (const moon of this.moons) {
      total += moon.energy;
    }

    return total;
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

const main = async (inputPath = 'day12/input') => {
  const moons = await getInput(inputPath, parseInput);
  const moonSystem = new MoonSystem(moons);

  for (let i = 0; i < 1000; i += 1) {
    moonSystem.simulateStep();
  }

  return moonSystem.totalEnergy;
};

module.exports = { main, parseMoon, Moon, MoonSystem };
