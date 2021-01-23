const { describe, it } = require('mocha');
const { expect } = require('chai');
const { IntcodeComputer } = require('./day9-part-1');

describe('Day 9 - Part 1', () => {
  describe('IntcodeComputer', () => {
    describe('performOperation', () => {
      describe('relative base adjustment', () => {
        describe('position mode', () => {
          it('updates the relative base correctly', async () => {
            const program = [9, 2, 50];
            const computer = new IntcodeComputer(program);

            await computer.performOperation();

            expect(computer.currentIndex).to.equal(2);
            expect(computer.relativeBase).to.equal(50);
          });
        });

        describe('immediate mode', () => {
          it('updates the relative base correctly', async () => {
            const program = [109, 50];
            const computer = new IntcodeComputer(program);

            await computer.performOperation();

            expect(computer.currentIndex).to.equal(2);
            expect(computer.relativeBase).to.equal(50);
          });
        });

        describe('relative position mode', () => {
          it('updates the relative base correctly', async () => {
            const program = [209, 50];
            program[40] = 10;
            const computer = new IntcodeComputer(program);
            computer.relativeBase = -10;

            await computer.performOperation();

            expect(computer.currentIndex).to.equal(2);
            expect(computer.relativeBase).to.equal(0);
          });
        });
      });

      describe('get input', () => {
        describe('position mode', () => {
          it('stores input in provided address', async () => {
            const program = [3, 2];
            const computer = new IntcodeComputer(program);
            computer.write(1);

            await computer.performOperation();

            expect(computer.currentIndex).to.equal(2);
            expect(computer.program[2]).to.equal(1);
          });
        });

        describe('relative position mode', () => {
          it('stores input in provided address', async () => {
            const program = [203, 50];
            const computer = new IntcodeComputer(program);
            computer.relativeBase = -10;
            computer.write(1);

            await computer.performOperation();

            expect(computer.currentIndex).to.equal(2);
            expect(computer.program[40]).to.equal(1);
          });
        });
      });
    });

    describe('run', () => {
      it('processes programs', async () => {
        const programA = [
          109,
          1,
          204,
          -1,
          1001,
          100,
          1,
          100,
          1008,
          100,
          16,
          101,
          1006,
          101,
          0,
          99
        ];
        const programB = [1102, 34915192, 34915192, 7, 4, 7, 99, 0];
        const programC = [104, 1125899906842624, 99];

        const computerA = new IntcodeComputer(programA);
        const computerB = new IntcodeComputer(programB);
        const computerC = new IntcodeComputer(programC);

        const resultA = await computerA.run();
        // const resultB = await computerB.run();
        // const resultC = await computerC.run();

        expect(resultA).to.deep.equal(programA);
        // expect(resultB).to.deep.equal([1219070632396864]);
        // expect(resultC).to.deep.equal([1125899906842624]);
      });
    });
  });
});
