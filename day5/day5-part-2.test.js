const { afterEach, describe, it } = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const day5 = require('./day5-part-2');

chai.use(sinonChai);

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe('Day 5 - Part 2', () => {
  afterEach(() => {
    sandbox.restore();
  });

  describe('performOperation', () => {
    describe('equals', () => {
      describe('postion mode', () => {
        it('writes a 1 when equality is true', async () => {
          const program = [3, 9, 8, 9, 10, 9, 4, 9, 99, 8, 8];

          const nextIndex = await day5.performOperation(program, 2);

          expect(program).to.deep.equal([3, 9, 8, 9, 10, 9, 4, 9, 99, 1, 8]);
          expect(nextIndex).to.equal(6);
        });

        it('writes a 0 when equality is false', async () => {
          const program = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];

          const nextIndex = await day5.performOperation(program, 2);

          expect(program).to.deep.equal([3, 9, 8, 9, 10, 9, 4, 9, 99, 0, 8]);
          expect(nextIndex).to.equal(6);
        });
      });

      describe('immediate mode', () => {
        it('writes a 1 when equality is true', async () => {
          const program = [3, 3, 1108, 8, 8, 3, 4, 3, 99];

          const nextIndex = await day5.performOperation(program, 2);

          expect(program).to.deep.equal([3, 3, 1108, 1, 8, 3, 4, 3, 99]);
          expect(nextIndex).to.equal(6);
        });

        it('writes a 0 when equality is false', async () => {
          const program = [3, 3, 1108, -1, 8, 3, 4, 3, 99];

          const nextIndex = await day5.performOperation(program, 2);

          expect(program).to.deep.equal([3, 3, 1108, 0, 8, 3, 4, 3, 99]);
          expect(nextIndex).to.equal(6);
        });
      });
    });

    describe('less than', () => {
      describe('position mode', () => {
        it('writes a 1 when first parameter is less than second parameter', async () => {
          const program = [3, 9, 7, 9, 10, 9, 4, 9, 99, 7, 8];

          const nextIndex = await day5.performOperation(program, 2);

          expect(program).to.deep.equal([3, 9, 7, 9, 10, 9, 4, 9, 99, 1, 8]);
          expect(nextIndex).to.equal(6);
        });

        it('writes a 0 when first parameter is equal to second parameter', async () => {
          const program = [3, 9, 7, 9, 10, 9, 4, 9, 99, 8, 8];

          const nextIndex = await day5.performOperation(program, 2);

          expect(program).to.deep.equal([3, 9, 7, 9, 10, 9, 4, 9, 99, 0, 8]);
          expect(nextIndex).to.equal(6);
        });

        it('writes a 0 when first parameter is greater than second parameter', async () => {
          const program = [3, 9, 7, 9, 10, 9, 4, 9, 99, 9, 8];

          const nextIndex = await day5.performOperation(program, 2);

          expect(program).to.deep.equal([3, 9, 7, 9, 10, 9, 4, 9, 99, 0, 8]);
          expect(nextIndex).to.equal(6);
        });
      });

      describe('immediate mode', () => {
        it('writes a 1 when first parameter is less than second parameter', async () => {
          const program = [3, 3, 1107, -1, 8, 3, 4, 3, 99];

          const nextIndex = await day5.performOperation(program, 2);

          expect(program).to.deep.equal([3, 3, 1107, 1, 8, 3, 4, 3, 99]);
          expect(nextIndex).to.equal(6);
        });

        it('writes a 0 when first parameter is equal to second parameter', async () => {
          const program = [3, 3, 1107, 8, 8, 3, 4, 3, 99];

          const nextIndex = await day5.performOperation(program, 2);

          expect(program).to.deep.equal([3, 3, 1107, 0, 8, 3, 4, 3, 99]);
          expect(nextIndex).to.equal(6);
        });

        it('writes a 0 when first parameter is greater than second parameter', async () => {
          const program = [3, 3, 1107, 9, 8, 3, 4, 3, 99];

          const nextIndex = await day5.performOperation(program, 2);

          expect(program).to.deep.equal([3, 3, 1107, 0, 8, 3, 4, 3, 99]);
          expect(nextIndex).to.equal(6);
        });
      });
    });

    describe('jump if true', () => {
      describe('position mode', () => {
        it('when first parameter is not 0 sets index to value of second parameter', async () => {
          const program = [
            3,
            12,
            5,
            12,
            15,
            1,
            13,
            14,
            13,
            4,
            13,
            99,
            1,
            0,
            1,
            9
          ];

          const nextIndex = await day5.performOperation(program, 2);

          expect(nextIndex).to.equal(9);
        });

        it('when first parameter is 0 sets index to next instruction', async () => {
          const program = [
            3,
            12,
            5,
            12,
            15,
            1,
            13,
            14,
            13,
            4,
            13,
            99,
            0,
            0,
            1,
            9
          ];

          const nextIndex = await day5.performOperation(program, 2);

          expect(nextIndex).to.equal(5);
        });
      });

      describe('immediate mode', () => {
        it('when first parameter is not 0 sets index to value of second parameter', async () => {
          const program = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];

          const nextIndex = await day5.performOperation(program, 2);

          expect(nextIndex).to.equal(9);
        });

        it('when first parameter is 0 sets index to next instruction', async () => {
          const program = [3, 3, 1105, 0, 9, 1101, 0, 0, 12, 4, 12, 99, 1];

          const nextIndex = await day5.performOperation(program, 2);

          expect(nextIndex).to.equal(5);
        });
      });
    });

    describe('jump if false', () => {
      describe('position mode', () => {
        it('when first parameter is 0 sets index to value of second parameter', async () => {
          const program = [
            3,
            12,
            6,
            12,
            15,
            1,
            13,
            14,
            13,
            4,
            13,
            99,
            0,
            0,
            1,
            9
          ];

          const nextIndex = await day5.performOperation(program, 2);

          expect(nextIndex).to.equal(9);
        });

        it('when first parameter is not 0 sets index to next instruction', async () => {
          const program = [
            3,
            12,
            6,
            12,
            15,
            1,
            13,
            14,
            13,
            4,
            13,
            99,
            1,
            0,
            1,
            9
          ];

          const nextIndex = await day5.performOperation(program, 2);

          expect(nextIndex).to.equal(5);
        });
      });

      describe('immediate mode', () => {
        it('when first parameter is 0 sets index to value of second parameter', async () => {
          const program = [3, 3, 1106, 0, 9, 1101, 0, 0, 12, 4, 12, 99, 1];

          const nextIndex = await day5.performOperation(program, 2);

          expect(nextIndex).to.equal(9);
        });

        it('when first parameter is not 0 sets index to next instruction', async () => {
          const program = [3, 3, 1106, 1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];

          const nextIndex = await day5.performOperation(program, 2);

          expect(nextIndex).to.equal(5);
        });
      });
    });
  });
});
