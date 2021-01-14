const { describe, it } = require('mocha');
const { expect } = require('chai');
const { countSteps, getMinStepsToIntersection } = require('./day3-part-2');

describe('Day 3 - Part 2', () => {
  describe('countSteps', () => {
    it('returns the number of steps to reach a point from the start of a cable', async () => {
      const lines = [
        { origin: { x: 0, y: 0 }, end: { x: 8, y: 0 } },
        { origin: { x: 8, y: 0 }, end: { x: 8, y: 5 } },
        { origin: { x: 8, y: 5 }, end: { x: 3, y: 5 } },
        { origin: { x: 3, y: 5 }, end: { x: 3, y: 2 } }
      ];
      const pointA = { x: 3, y: 3 };
      const pointB = { x: 6, y: 5 };

      expect(countSteps(lines, pointA)).to.equal(20);
      expect(countSteps(lines, pointB)).to.equal(15);
    });
  });

  describe('getMinStepsToIntersection', () => {
    it('returns the minimum number of combined steps to reach an intersection', async () => {
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

      const result = getMinStepsToIntersection(pathA, pathB);

      expect(result).to.equal(30);
    });
  });
});
