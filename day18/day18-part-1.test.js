const { describe, it } = require('mocha');
const { expect } = require('chai');
const { CaveMap, main } = require('./day18-part-1');

describe('Day 18 - Part 1', () => {
  describe('CaveMap', () => {
    describe('findShortestPath', () => {
      it('returns the length of one of the shortest paths to get all the keys', function () {
        this.timeout(0);
        const caveMapA = new CaveMap(['#########', '#b.A.@.a#', '#########']);
        const caveMapB = new CaveMap([
          '########################',
          '#f.D.E.e.C.b.A.@.a.B.c.#',
          '######################.#',
          '#d.....................#',
          '########################'
        ]);
        const caveMapC = new CaveMap([
          '########################',
          '#...............b.C.D.f#',
          '#.######################',
          '#.....@.a.B.c.d.A.e.F.g#',
          '########################'
        ]);
        const caveMapD = new CaveMap([
          '########################',
          '#@..............ac.GI.b#',
          '###d#e#f################',
          '###A#B#C################',
          '###g#h#i################',
          '########################'
        ]);
        const caveMapE = new CaveMap([
          '#################',
          '#i.G..c...e..H.p#',
          '########.########',
          '#j.A..b...f..D.o#',
          '########@########',
          '#k.E..a...g..B.n#',
          '########.########',
          '#l.F..d...h..C.m#',
          '#################'
        ]);

        expect(caveMapA.findShortestPath()).to.equal(8);
        expect(caveMapB.findShortestPath()).to.equal(86);
        expect(caveMapC.findShortestPath()).to.equal(132);
        expect(caveMapD.findShortestPath()).to.equal(81);
        expect(caveMapE.findShortestPath()).to.equal(136);
      });
    });
  });

  describe('main', () => {
    it('returns the length of one of the shortest paths to get all the keys', async function () {
      this.timeout(0);
      const result = await main('day18/test-input');

      expect(result).to.equal(136);
    });
  });
});
