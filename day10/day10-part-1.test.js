const { describe, it } = require('mocha');
const { expect } = require('chai');
const {
  getAngle,
  getCartesianCoords,
  main,
  parseInput
} = require('./day10-part-1');

describe('Day 10 - Part 1', () => {
  describe('parseInput', () => {
    it('returns a hashmap with the coordinates of the asteroids', () => {
      const input = ['.#..#', '.....', '#####', '....#', '...##'].join('\n');

      const result = parseInput(input);

      expect(result).to.deep.equal(
        new Map([
          [[0, 1], true],
          [[0, 4], true],
          [[2, 0], true],
          [[2, 1], true],
          [[2, 2], true],
          [[2, 3], true],
          [[2, 4], true],
          [[3, 4], true],
          [[4, 3], true],
          [[4, 4], true]
        ])
      );
    });
  });

  describe('getCartesianCoords', () => {
    it('returns the cartesian coordinates of a [row, col] pair given an origin', () => {
      expect(getCartesianCoords([2, 2], [2, 2])).to.deep.equal({
        xCoord: 0,
        yCoord: 0
      });
      expect(getCartesianCoords([2, 2], [0, 1])).to.deep.equal({
        xCoord: -1,
        yCoord: 2
      });
      expect(getCartesianCoords([2, 2], [0, 4])).to.deep.equal({
        xCoord: 2,
        yCoord: 2
      });
      expect(getCartesianCoords([2, 2], [2, 0])).to.deep.equal({
        xCoord: -2,
        yCoord: 0
      });
      expect(getCartesianCoords([2, 2], [2, 1])).to.deep.equal({
        xCoord: -1,
        yCoord: 0
      });
      expect(getCartesianCoords([2, 2], [2, 3])).to.deep.equal({
        xCoord: 1,
        yCoord: 0
      });
      expect(getCartesianCoords([2, 2], [2, 4])).to.deep.equal({
        xCoord: 2,
        yCoord: 0
      });
      expect(getCartesianCoords([2, 2], [3, 4])).to.deep.equal({
        xCoord: 2,
        yCoord: -1
      });
      expect(getCartesianCoords([2, 2], [4, 3])).to.deep.equal({
        xCoord: 1,
        yCoord: -2
      });
      expect(getCartesianCoords([2, 2], [4, 4])).to.deep.equal({
        xCoord: 2,
        yCoord: -2
      });
    });
  });

  describe('getAngle', () => {
    it('returns the angle between the origin and a vector', async () => {
      expect(getAngle(1, 0)).to.equal(0);
      expect(getAngle(1, 1)).to.equal(45);
      expect(getAngle(0, 1)).to.equal(90);
      expect(getAngle(-1, 1)).to.equal(135);
      expect(getAngle(-1, 0)).to.equal(180);
      expect(getAngle(-1, -1)).to.equal(225);
      expect(getAngle(0, -1)).to.equal(270);
      expect(getAngle(1, -1)).to.equal(315);
    });
  });

  describe('main', () => {
    it('returns the maximum number of visible asteroids from a found position', async () => {
      const result = await main('day10/test-input');

      expect(result).to.equal(210);
    });
  });
});
