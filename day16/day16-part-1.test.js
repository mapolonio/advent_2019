const { describe, it } = require('mocha');
const { expect } = require('chai');
const { buildMultiplierMatrix, processSignal } = require('./day16-part-1');

describe('Day 16 - Part 1', () => {
  describe('buildMultiplierMatrix', () => {
    it('returns a matrix of multipliers', () => {
      const result = buildMultiplierMatrix(8);

      expect(result).to.deep.equal([
        [1, 0, -1, 0, 1, 0, -1, 0],
        [0, 1, 1, 0, 0, -1, -1, 0],
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1]
      ]);
    });
  });

  describe('processSignal', () => {
    it('returns the output after processing a single phase of a signal', () => {
      const resultA = [4, 8, 2, 2, 6, 1, 5, 8];
      const resultB = [3, 4, 0, 4, 0, 4, 3, 8];
      const resultC = [0, 3, 4, 1, 5, 5, 1, 8];
      const resultD = [0, 1, 0, 2, 9, 4, 9, 8];

      expect(processSignal([1, 2, 3, 4, 5, 6, 7, 8])).to.deep.equal(resultA);
      expect(processSignal(resultA)).to.deep.equal(resultB);
      expect(processSignal(resultB)).to.deep.equal(resultC);
      expect(processSignal(resultC)).to.deep.equal(resultD);
    });
  });
});
