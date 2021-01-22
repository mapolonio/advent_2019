const { describe, it } = require('mocha');
const { expect } = require('chai');
const { getLayers } = require('./day8-part-1');

describe('Day 8 - Part 1', () => {
  describe('getLayers', () => {
    it('returns an array of layers of pixels', () => {
      expect(
        getLayers([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2], 3, 2)
      ).to.deep.equal([
        [
          [1, 2, 3],
          [4, 5, 6]
        ],
        [
          [7, 8, 9],
          [0, 1, 2]
        ]
      ]);
    });
  });
});
