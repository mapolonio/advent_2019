const { describe, it } = require('mocha');
const { expect } = require('chai');
const { getFuel, main } = require('./day1-part-2');

describe('Day 1 - Part 2', () => {
  describe('getFuel', () => {
    it('returns the fuel amount required for a specific mass', () => {
      expect(getFuel(14)).to.equal(2);
      expect(getFuel(1969)).to.equal(966);
      expect(getFuel(100756)).to.equal(50346);
    });
  });
});
