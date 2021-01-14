const { describe, it } = require('mocha');
const { expect } = require('chai');
const { getInput } = require('../utils');
const {
  belongsToLine,
  getCableLines,
  getClosestIntersection,
  parseInput
} = require('./day3-part-1');

describe('Day 3 - Part 1', () => {
  describe('parseInput', () => {
    it('returns an object with the information of the wires', async () => {
      const result = await getInput('day3/test-input', parseInput);

      expect(result).to.deep.equal({
        path1: [
          { direction: 'R', value: 8 },
          { direction: 'U', value: 5 },
          { direction: 'L', value: 5 },
          { direction: 'D', value: 3 }
        ],
        path2: [
          { direction: 'U', value: 7 },
          { direction: 'R', value: 6 },
          { direction: 'D', value: 4 },
          { direction: 'L', value: 4 }
        ]
      });
    });
  });

  describe('getCableLines', () => {
    it('returns an array of points describing path segments', async () => {
      const pathA = [
        { direction: 'R', value: 8 },
        { direction: 'U', value: 5 },
        { direction: 'L', value: 5 },
        { direction: 'D', value: 3 }
      ];
      const pathB = [
        { direction: 'U', value: 7 },
        { direction: 'R', value: 6 },
        { direction: 'D', value: 4 },
        { direction: 'L', value: 4 }
      ];

      const resultA = getCableLines(pathA);
      const resultB = getCableLines(pathB);

      expect(resultA).to.deep.equal([
        { origin: { x: 0, y: 0 }, end: { x: 8, y: 0 } },
        { origin: { x: 8, y: 0 }, end: { x: 8, y: 5 } },
        { origin: { x: 8, y: 5 }, end: { x: 3, y: 5 } },
        { origin: { x: 3, y: 5 }, end: { x: 3, y: 2 } }
      ]);
      expect(resultB).to.deep.equal([
        { origin: { x: 0, y: 0 }, end: { x: 0, y: 7 } },
        { origin: { x: 0, y: 7 }, end: { x: 6, y: 7 } },
        { origin: { x: 6, y: 7 }, end: { x: 6, y: 3 } },
        { origin: { x: 6, y: 3 }, end: { x: 2, y: 3 } }
      ]);
    });
  });

  describe('belongsToLine', () => {
    it('returns a boolean that indicates if a point belongs to a line', async () => {
      const point = { x: 3, y: 3 };
      const line = { origin: { x: 6, y: 3 }, end: { x: 2, y: 3 } };

      expect(belongsToLine(point, line)).to.equal(true);
    });
  });

  describe('getClosestIntersection', () => {
    it('returns distance origint to the closest intersection', async () => {
      const path1 = [
        { direction: 'R', value: 8 },
        { direction: 'U', value: 5 },
        { direction: 'L', value: 5 },
        { direction: 'D', value: 3 }
      ];
      const path2 = [
        { direction: 'U', value: 7 },
        { direction: 'R', value: 6 },
        { direction: 'D', value: 4 },
        { direction: 'L', value: 4 }
      ];

      const result = getClosestIntersection(path1, path2);

      expect(result).to.equal(6);
    });
  });
});
