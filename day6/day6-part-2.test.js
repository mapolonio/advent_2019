const { describe, it } = require('mocha');
const { expect } = require('chai');
const { getInput } = require('../utils');
const {
  getClosestRelative,
  getDistance,
  getDistanceMap,
  parseInput
} = require('./day6-part-2');

describe('Day 6 - Part 2', () => {
  describe('getDistanceMap', () => {
    it('returns a hash map containing distances from a node to the COM', async () => {
      const orbitMap = await getInput('day6/test-input-2', parseInput);

      expect(getDistanceMap('YOU', orbitMap)).to.deep.equal({
        YOU: 0,
        K: 1,
        J: 2,
        E: 3,
        D: 4,
        C: 5,
        B: 6,
        COM: 7
      });
      expect(getDistanceMap('SAN', orbitMap)).to.deep.equal({
        SAN: 0,
        I: 1,
        D: 2,
        C: 3,
        B: 4,
        COM: 5
      });
    });
  });

  describe('getClosestRelative', () => {
    it('returns the closest relative between two bodies', () => {
      const distanceMapA = {
        YOU: 0,
        K: 1,
        J: 2,
        E: 3,
        D: 4,
        C: 5,
        B: 6,
        COM: 7
      };
      const distanceMapB = {
        SAN: 0,
        I: 1,
        D: 2,
        C: 3,
        B: 4,
        COM: 5
      };

      expect(getClosestRelative(distanceMapA, distanceMapB)).to.equal('D');
    });
  });

  describe('getDistance', () => {
    it('returns the number of orbital transfers between two bodies', async () => {
      const orbitMap = await getInput('day6/test-input-2', parseInput);

      expect(getDistance('YOU', 'SAN', orbitMap)).to.equal(4);
    });
  });
});
