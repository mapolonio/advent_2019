const { describe, it } = require('mocha');
const { expect } = require('chai');
const { getMaxSignal, tryAmplifierLoop } = require('./day7-part-2');

describe('Day 7 - Part 2', () => {
  describe('tryAmplifierLoop', () => {
    it('returns the amplified signal after choosing a phase order', async () => {
      const programA = [
        3,
        26,
        1001,
        26,
        -4,
        26,
        3,
        27,
        1002,
        27,
        2,
        27,
        1,
        27,
        26,
        27,
        4,
        27,
        1001,
        28,
        -1,
        28,
        1005,
        28,
        6,
        99,
        0,
        0,
        5
      ];
      const programB = [
        3,
        52,
        1001,
        52,
        -5,
        52,
        3,
        53,
        1,
        52,
        56,
        54,
        1007,
        54,
        5,
        55,
        1005,
        55,
        26,
        1001,
        54,
        -5,
        54,
        1105,
        1,
        12,
        1,
        53,
        54,
        53,
        1008,
        54,
        0,
        55,
        1001,
        55,
        1,
        55,
        2,
        53,
        55,
        53,
        4,
        53,
        1001,
        56,
        -1,
        56,
        1005,
        56,
        6,
        99,
        0,
        0,
        0,
        0,
        10
      ];

      const resultA = await tryAmplifierLoop(programA, [9, 8, 7, 6, 5]);
      const resultB = await tryAmplifierLoop(programB, [9, 7, 8, 5, 6]);

      expect(resultA).to.equal(139629729);
      expect(resultB).to.equal(18216);
    });
  });

  describe('getMaxSignal', () => {
    it('returns the max output signal after trying al phase combinations', async function () {
      this.timeout(0);

      const programA = [
        3,
        26,
        1001,
        26,
        -4,
        26,
        3,
        27,
        1002,
        27,
        2,
        27,
        1,
        27,
        26,
        27,
        4,
        27,
        1001,
        28,
        -1,
        28,
        1005,
        28,
        6,
        99,
        0,
        0,
        5
      ];
      const programB = [
        3,
        52,
        1001,
        52,
        -5,
        52,
        3,
        53,
        1,
        52,
        56,
        54,
        1007,
        54,
        5,
        55,
        1005,
        55,
        26,
        1001,
        54,
        -5,
        54,
        1105,
        1,
        12,
        1,
        53,
        54,
        53,
        1008,
        54,
        0,
        55,
        1001,
        55,
        1,
        55,
        2,
        53,
        55,
        53,
        4,
        53,
        1001,
        56,
        -1,
        56,
        1005,
        56,
        6,
        99,
        0,
        0,
        0,
        0,
        10
      ];
      const phases = [5, 6, 7, 8, 9];

      const resultA = await getMaxSignal(programA, phases);
      const resultB = await getMaxSignal(programB, phases);

      expect(resultA).to.equal(139629729);
      expect(resultB).to.equal(18216);
    });
  });
});
