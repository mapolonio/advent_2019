const { describe, it } = require('mocha');
const { expect } = require('chai');
const { main, processSignal, Signal } = require('./day16-part-2');

describe('Day 16 - Part 2', () => {
  describe('Signal', () => {
    describe('offset', () => {
      it('returns the offset of a signal', async () => {
        const signal = new Signal([
          0,
          3,
          0,
          3,
          6,
          7,
          3,
          2,
          5,
          7,
          7,
          2,
          1,
          2,
          9,
          4,
          4,
          0,
          6,
          3,
          4,
          9,
          1,
          5,
          6,
          5,
          4,
          7,
          4,
          6,
          6,
          4
        ]);

        expect(signal.offset).to.equal(303673);
      });
    });

    describe('message', () => {
      it('returns the message using the provided offset', () => {
        const signal = new Signal([
          9,
          8,
          7,
          6,
          5,
          4,
          3,
          2,
          1,
          0,
          9,
          8,
          7,
          6,
          5,
          4,
          3,
          2,
          1,
          0
        ]);

        expect(signal.getMessage(7)).to.equal('21098765');
      });
    });
  });

  describe('processSignal', () => {
    it('returns the output after processing a single phase of a signal', () => {
      const resultA = [4, 8, 2, 2, 6, 1, 5, 8];
      const resultB = [3, 4, 0, 4, 0, 4, 3, 8];
      const resultC = [0, 3, 4, 1, 5, 5, 1, 8];
      const resultD = [0, 1, 0, 2, 9, 4, 9, 8];

      expect(
        processSignal(new Signal([1, 2, 3, 4, 5, 6, 7, 8]))
      ).to.deep.include({
        signal: resultA
      });
      expect(processSignal(new Signal(resultA))).to.deep.include({
        signal: resultB
      });
      expect(processSignal(new Signal(resultB))).to.deep.include({
        signal: resultC
      });
      expect(processSignal(new Signal(resultC))).to.deep.include({
        signal: resultD
      });
    });
  });

  describe('main', () => {
    it('returns the 8 digit message counting from the offset after processing 100 phases of 10000xsignal', async () => {
      const result = await main('day16/test-input');

      expect(result).to.equal('84462026');
    });
  });
});
