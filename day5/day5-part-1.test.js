const { afterEach, describe, it } = require('mocha');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const day5 = require('./day5-part-1');

chai.use(sinonChai);

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe('Day 5 - Part 1', () => {
  afterEach(() => {
    sandbox.restore();
  });

  describe('performOperation', () => {
    it('sums and stores result correctly', async () => {
      const program = [1101, 100, -1, 4, 0];

      day5.performOperation(program, 0);

      expect(program).to.deep.equal([1101, 100, -1, 4, 99]);
    });

    it('multiplies and stores result correctly', async () => {
      const program = [1002, 4, 3, 4, 33];

      day5.performOperation(program, 0);

      expect(program).to.deep.equal([1002, 4, 3, 4, 99]);
    });

    it('stores input correctly', async () => {
      const program = [3, 0, 4, 0, 99];

      day5.performOperation(program, 0);

      expect(program).to.deep.equal([1, 0, 4, 0, 99]);
    });

    it('logs output correctly', async () => {
      const program = [1, 0, 4, 0, 99];
      const consoleStub = sandbox.stub(console, 'log');

      day5.performOperation(program, 2);

      expect(program).to.deep.equal([1, 0, 4, 0, 99]);
      expect(consoleStub).to.have.been.calledOnceWith('Program output: 1');
    });
  });
});
