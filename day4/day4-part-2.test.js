const { describe, it } = require('mocha');
const { expect } = require('chai');
const { isValidPassword } = require('./day4-part-2');

describe('Day 4 - Part 2', () => {
  describe('isValidPassword', () => {
    it('returns a boolean indicating if password is valid', () => {
      expect(isValidPassword(112233)).to.equal(true);
      expect(isValidPassword(123444)).to.equal(false);
      expect(isValidPassword(111122)).to.equal(true);
    });
  });
});
