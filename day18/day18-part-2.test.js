const { describe, it } = require('mocha');
const { expect } = require('chai');
const { CaveMap } = require('./day18-part-2');

describe('Day 18 - Part 2', () => {
  describe('CaveMap', () => {
    describe('findShortestPath', () => {
      it('returns the length of one of the shortest paths to get all the keys', function () {
        this.timeout(0);
        const caveMapA = new CaveMap([
          '#######',
          '#a.#Cd#',
          '##@#@##',
          '#######',
          '##@#@##',
          '#cB#Ab#',
          '#######'
        ]);
        const caveMapB = new CaveMap([
          '###############',
          '#d.ABC.#.....a#',
          '######@#@######',
          '###############',
          '######@#@######',
          '#b.....#.....c#',
          '###############'
        ]);
        const caveMapC = new CaveMap([
          '#############',
          '#DcBa.#.GhKl#',
          '#.###@#@#I###',
          '#e#d#####j#k#',
          '###C#@#@###J#',
          '#fEbA.#.FgHi#',
          '#############'
        ]);
        const caveMapD = new CaveMap([
          '#############',
          '#g#f.D#..h#l#',
          '#F###e#E###.#',
          '#dCba@#@BcIJ#',
          '#############',
          '#nK.L@#@G...#',
          '#M###N#H###.#',
          '#o#m..#i#jk.#',
          '#############'
        ]);

        expect(caveMapA.findShortestPath()).to.equal(8);
        expect(caveMapB.findShortestPath()).to.equal(24);
        expect(caveMapC.findShortestPath()).to.equal(32);
        expect(caveMapD.findShortestPath()).to.equal(72);
      });
    });
  });
});
