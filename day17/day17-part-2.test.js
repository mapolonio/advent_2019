const { describe, it } = require('mocha');
const { expect } = require('chai');
const { removeSubArray } = require('./day17-part-2');

describe('Day 17 - Part 2', () => {
  describe('removeSubArray', () => {
    it('removes all appearances of subArray in array', () => {
      expect(removeSubArray([1], [1])).to.deep.equal([]);
      expect(removeSubArray([1, 2, 3], [1, 2, 3])).to.deep.equal([]);
      expect(removeSubArray([1, 2, 3], [2, 3])).to.deep.equal([1]);
      expect(removeSubArray([1, 2, 3, 3, 2, 1], [1])).to.deep.equal([
        2,
        3,
        3,
        2
      ]);
      expect(removeSubArray([1, 2, 3, 2, 3, 5], [2, 3])).to.deep.equal([1, 5]);
      expect(removeSubArray([1, 2, 3, 2, 3, 5], [])).to.deep.equal([
        1,
        2,
        3,
        2,
        3,
        5
      ]);
      expect(removeSubArray([1, 2, 3, 2, 3, 5], [8, 9])).to.deep.equal([
        1,
        2,
        3,
        2,
        3,
        5
      ]);
    });
  });
});
