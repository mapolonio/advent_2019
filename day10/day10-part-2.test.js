const { describe, it } = require('mocha');
const { expect } = require('chai');
const { getInput } = require('../utils');
const {
  getAngle,
  getCartesianCoords,
  getClockwiseAngle,
  getStationCoords,
  getVisibilityMap,
  main,
  parseInput
} = require('./day10-part-2');

describe('Day 10 - Part 2', () => {
  describe('getCartesianCoords', () => {
    it('returns the cartesian coordinates of a [row, col] pair given an origin', () => {
      expect(
        getCartesianCoords({ row: 13, col: 11 }, { row: 13, col: 11 })
      ).to.deep.equal({
        xCoord: 0,
        yCoord: 0
      });
      expect(
        getCartesianCoords({ row: 13, col: 11 }, { row: 12, col: 11 })
      ).to.deep.equal({
        xCoord: 0,
        yCoord: 1
      });
    });
  });

  describe('getClockwiseAngle', () => {
    it('returns the clockwise angle of a counter clockwise angle', () => {
      expect(getClockwiseAngle(0)).to.equal(0);
      expect(getClockwiseAngle(45)).to.equal(315);
      expect(getClockwiseAngle(90)).to.equal(270);
      expect(getClockwiseAngle(135)).to.equal(225);
      expect(getClockwiseAngle(180)).to.equal(180);
      expect(getClockwiseAngle(225)).to.equal(135);
      expect(getClockwiseAngle(270)).to.equal(90);
      expect(getClockwiseAngle(315)).to.equal(45);
    });
  });

  describe('getAngle', () => {
    it('returns the clockwise angle from the vertical to a point', async () => {
      expect(getAngle(0, 1)).to.equal(0);
      expect(getAngle(1, 1)).to.equal(45);
      expect(getAngle(1, 0)).to.equal(90);
      expect(getAngle(1, -1)).to.equal(135);
      expect(getAngle(0, -1)).to.equal(180);
      expect(getAngle(-1, -1)).to.equal(225);
      expect(getAngle(-1, 0)).to.equal(270);
      expect(getAngle(-1, 1)).to.equal(315);
    });
  });

  describe('getStationCoords', () => {
    it('returns the row and col of the station that can reach most asteroids', async () => {
      const asteroids = await getInput('day10/test-input', parseInput);
      const visibilityMap = getVisibilityMap(asteroids);

      expect(getStationCoords(visibilityMap)).to.deep.equal({
        asteroid: {
          col: 11,
          row: 13
        },
        visibleAsteroids: 210
      });
    });
  });

  describe('main', () => {
    it('returns the result of an operation on the coords of 200th asteroid to be destroyed', async () => {
      const result = await main('day10/test-input');

      expect(result).to.equal(802);
    });
  });
});
