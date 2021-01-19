const { describe, it } = require('mocha');
const { expect } = require('chai');
const { getInput } = require('../utils');
const { countOrbits, main, parseInput } = require('./day6-part-1');

describe('Day 6 - Part 1', () => {
  describe('parseInput', () => {
    it('returns a hash map containing the orbit map', async () => {
      const result = await getInput('day6/test-input', parseInput);

      expect(result).to.deep.equal({
        B: 'COM',
        C: 'B',
        D: 'C',
        E: 'D',
        F: 'E',
        G: 'B',
        H: 'G',
        I: 'D',
        J: 'E',
        K: 'J',
        L: 'K'
      });
    });
  });

  describe('countOrbits', () => {
    it('returns the number of orbits from key to COM', async () => {
      const orbitMap = {
        B: 'COM',
        C: 'B',
        D: 'C',
        E: 'D',
        F: 'E',
        G: 'B',
        H: 'G',
        I: 'D',
        J: 'E',
        K: 'J',
        L: 'K'
      };

      expect(countOrbits('COM', orbitMap)).to.equal(0);
      expect(countOrbits('D', orbitMap)).to.equal(3);
      expect(countOrbits('L', orbitMap)).to.equal(7);
    });
  });

  describe('main', () => {
    it('returns the total number of orbits in the orbit map', async () => {
      const result = await main('day6/test-input');

      expect(result).to.equal(42);
    });
  });
});
