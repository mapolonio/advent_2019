const { describe, it } = require('mocha');
const { expect } = require('chai');
const { getFuel, main } = require('./day1-part-1');

describe('Day 1 - Part 1', () => {
  describe('getFuel', () => {
    it('returns the fuel amount required for a specific mass', () => {
      expect(getFuel(12)).to.equal(2);
      expect(getFuel(14)).to.equal(2);
      expect(getFuel(1969)).to.equal(654);
      expect(getFuel(100756)).to.equal(33583);
    });
  });

  describe('main', () => {
    it('returns the sum of the requirements for all the pods', async () => {
      const result = await main('day1/test-input');

      expect(result).to.equal(2 + 2 + 654 + 33583);
    });
  });
});
