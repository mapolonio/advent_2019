const { describe, it } = require('mocha');
const { expect } = require('chai');
const {
  getLCM,
  getPrimeFactors,
  getPrimesLessThan,
  removeNonPrimes
} = require('./lcm');

describe('lcm', () => {
  describe('removeNonPrimes', () => {
    it('receives an ordered array of postive integers and filters out non prime numbers', () => {
      const input = [...new Array(98)].map((_, i) => i + 2);

      expect(removeNonPrimes(input)).to.deep.equal([
        2,
        3,
        5,
        7,
        11,
        13,
        17,
        19,
        23,
        29,
        31,
        37,
        41,
        43,
        47,
        53,
        59,
        61,
        67,
        71,
        73,
        79,
        83,
        89,
        97
      ]);
    });
  });

  describe('getPrimesLessThan', () => {
    it('returns an array of prime numbers that are less or equal the given input', () => {
      expect(getPrimesLessThan(1)).to.deep.equal([]);
      expect(getPrimesLessThan(2)).to.deep.equal([2]);
      expect(getPrimesLessThan(3)).to.deep.equal([2, 3]);
      expect(getPrimesLessThan(4)).to.deep.equal([2, 3]);
      expect(getPrimesLessThan(5)).to.deep.equal([2, 3, 5]);
      expect(getPrimesLessThan(1)).to.deep.equal([]);
      expect(getPrimesLessThan(20)).to.deep.equal([2, 3, 5, 7, 11, 13, 17, 19]);
      expect(getPrimesLessThan(100)).to.deep.equal([
        2,
        3,
        5,
        7,
        11,
        13,
        17,
        19,
        23,
        29,
        31,
        37,
        41,
        43,
        47,
        53,
        59,
        61,
        67,
        71,
        73,
        79,
        83,
        89,
        97
      ]);
    });
  });

  describe('getPrimeFactors', () => {
    it('returns an object with the count of prime factors of a number', () => {
      expect(getPrimeFactors(1)).to.deep.equal({});
      expect(getPrimeFactors(2)).to.deep.equal({ 2: 1 });
      expect(getPrimeFactors(3)).to.deep.equal({ 3: 1 });
      expect(getPrimeFactors(4)).to.deep.equal({ 2: 2 });
      expect(getPrimeFactors(147)).to.deep.equal({ 3: 1, 7: 2 });
    });
  });

  describe('getLCM', () => {
    it('returns the LCM between an array of numbers', () => {
      expect(getLCM([2028, 4702, 5898])).to.equal(4686774924);
    });
  });
});
