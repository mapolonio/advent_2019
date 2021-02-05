const { describe, it } = require('mocha');
const { expect } = require('chai');
const { findRepeatedStep, Moon, MoonSystem } = require('./day12-part-2');

describe('Day 12 - Part 2', () => {
  describe('findRepeatedStep', () => {
    it('returns the first step number where the system repeats its state', () => {
      const moonSystemA = new MoonSystem([
        new Moon(-1, 0, 2),
        new Moon(2, -10, -7),
        new Moon(4, -8, 8),
        new Moon(3, 5, -1)
      ]);
      const moonSystemB = new MoonSystem([
        new Moon(-8, -10, 0),
        new Moon(5, 5, 10),
        new Moon(2, -7, 3),
        new Moon(9, -8, -3)
      ]);

      expect(findRepeatedStep(moonSystemA)).to.equal(2772);
      expect(findRepeatedStep(moonSystemB)).to.equal(4686774924);
    });
  });
});
