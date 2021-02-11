const { describe, it } = require('mocha');
const { expect } = require('chai');
const { createFuel, parseInput } = require('./day14-part-1');

describe('Day 14 - Part 1', () => {
  describe('parseInput', () => {
    it('returns an array representing the graph of requirements', async () => {
      const input = [
        '9 ORE => 2 A',
        '8 ORE => 3 B',
        '7 ORE => 5 C',
        '3 A, 4 B => 1 AB',
        '5 B, 7 C => 1 BC',
        '4 C, 1 A => 1 CA',
        '2 AB, 3 BC, 4 CA => 1 FUEL'
      ].join('\n');

      expect(parseInput(input)).to.deep.equal({
        ORE: {
          name: 'ORE',
          quantity: 1,
          cost: []
        },
        A: {
          name: 'A',
          quantity: 2,
          cost: [{ name: 'ORE', quantity: 9 }]
        },
        B: {
          name: 'B',
          quantity: 3,
          cost: [{ name: 'ORE', quantity: 8 }]
        },
        C: {
          name: 'C',
          quantity: 5,
          cost: [{ name: 'ORE', quantity: 7 }]
        },
        AB: {
          name: 'AB',
          quantity: 1,
          cost: [
            { name: 'A', quantity: 3 },
            { name: 'B', quantity: 4 }
          ]
        },
        BC: {
          name: 'BC',
          quantity: 1,
          cost: [
            { name: 'B', quantity: 5 },
            { name: 'C', quantity: 7 }
          ]
        },
        CA: {
          name: 'CA',
          quantity: 1,
          cost: [
            { name: 'C', quantity: 4 },
            { name: 'A', quantity: 1 }
          ]
        },
        FUEL: {
          name: 'FUEL',
          quantity: 1,
          cost: [
            { name: 'AB', quantity: 2 },
            { name: 'BC', quantity: 3 },
            { name: 'CA', quantity: 4 }
          ]
        }
      });
    });
  });

  describe('createFuel', () => {
    it('returns the ammount of ORE required to creat 1 FUEL', async () => {
      const inputA = [
        '10 ORE => 10 A',
        '1 ORE => 1 B',
        '7 A, 1 B => 1 C',
        '7 A, 1 C => 1 D',
        '7 A, 1 D => 1 E',
        '7 A, 1 E => 1 FUEL'
      ].join('\n');
      const inputB = [
        '9 ORE => 2 A',
        '8 ORE => 3 B',
        '7 ORE => 5 C',
        '3 A, 4 B => 1 AB',
        '5 B, 7 C => 1 BC',
        '4 C, 1 A => 1 CA',
        '2 AB, 3 BC, 4 CA => 1 FUEL'
      ].join('\n');
      const inputC = [
        '171 ORE => 8 CNZTR',
        '7 ZLQW, 3 BMBT, 9 XCVML, 26 XMNCP, 1 WPTQ, 2 MZWV, 1 RJRHP => 4 PLWSL',
        '114 ORE => 4 BHXH',
        '14 VRPVC => 6 BMBT',
        '6 BHXH, 18 KTJDG, 12 WPTQ, 7 PLWSL, 31 FHTLT, 37 ZDVW => 1 FUEL',
        '6 WPTQ, 2 BMBT, 8 ZLQW, 18 KTJDG, 1 XMNCP, 6 MZWV, 1 RJRHP => 6 FHTLT',
        '15 XDBXC, 2 LTCX, 1 VRPVC => 6 ZLQW',
        '13 WPTQ, 10 LTCX, 3 RJRHP, 14 XMNCP, 2 MZWV, 1 ZLQW => 1 ZDVW',
        '5 BMBT => 4 WPTQ',
        '189 ORE => 9 KTJDG',
        '1 MZWV, 17 XDBXC, 3 XCVML => 2 XMNCP',
        '12 VRPVC, 27 CNZTR => 2 XDBXC',
        '15 KTJDG, 12 BHXH => 5 XCVML',
        '3 BHXH, 2 VRPVC => 7 MZWV',
        '121 ORE => 7 VRPVC',
        '7 XCVML => 6 RJRHP',
        '5 BHXH, 4 VRPVC => 5 LTCX'
      ].join('\n');
      const reactionsMapA = parseInput(inputA);
      const reactionsMapB = parseInput(inputB);
      const reactionsMapC = parseInput(inputC);

      expect(createFuel(reactionsMapA)).to.equal(31);
      expect(createFuel(reactionsMapB)).to.equal(165);
      expect(createFuel(reactionsMapC)).to.equal(2210736);
    });
  });
});
