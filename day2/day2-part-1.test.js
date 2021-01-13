const { describe, it } = require('mocha');
const { expect } = require('chai');
const { processProgram } = require('./day2-part-1');

describe('Day 2 - Part 1', () => {
  describe('processProgram', () => {
    it('returns the memory state after processing a program', () => {
      expect(processProgram([1, 0, 0, 0, 99])).to.deep.equal([2, 0, 0, 0, 99]);
      expect(processProgram([2, 3, 0, 3, 99])).to.deep.equal([2, 3, 0, 6, 99]);
      expect(processProgram([2, 4, 4, 5, 99, 0])).to.deep.equal([
        2,
        4,
        4,
        5,
        99,
        9801
      ]);
      expect(processProgram([1, 1, 1, 4, 99, 5, 6, 0, 99])).to.deep.equal([
        30,
        1,
        1,
        4,
        2,
        5,
        6,
        0,
        99
      ]);
    });
  });
});
