const { describe, it } = require('mocha');
const { expect } = require('chai');
const { isValidPassword } = require('./day4-part-1');

describe('Day 4 - Part 1', () => {
  describe('isValidPassword', () => {
    it('returns a boolean indicating if password is valid', () => {
      expect(isValidPassword(111111)).to.equal(true);
      expect(isValidPassword(223450)).to.equal(false);
      expect(isValidPassword(123789)).to.equal(false);
    });
  });
});
