const { describe, it } = require('mocha');
const { expect } = require('chai');
const { Moon, MoonSystem, parseMoon } = require('./day12-part-1');

describe('Day 12 - Part 1', () => {
  describe('parseMoon', () => {
    it('returns Moon instances', () => {
      expect(parseMoon('<x=-1, y=0, z=2>')).to.deep.include({
        xCoord: -1,
        yCoord: 0,
        zCoord: 2
      });
      expect(parseMoon('<x=2, y=-10, z=-7>')).to.deep.include({
        xCoord: 2,
        yCoord: -10,
        zCoord: -7
      });
      expect(parseMoon('<x=4, y=-8, z=8>')).to.deep.include({
        xCoord: 4,
        yCoord: -8,
        zCoord: 8
      });
      expect(parseMoon('<x=3, y=5, z=-1>')).to.deep.include({
        xCoord: 3,
        yCoord: 5,
        zCoord: -1
      });
    });
  });

  describe('Moon', () => {
    describe('energy', () => {
      it('returns the multiplication of the moon potencial energy and kinetic energy', () => {
        const io = new Moon(2, 1, -3);
        const europa = new Moon(1, -8, 0);
        const ganymede = new Moon(3, -6, 1);
        const callisto = new Moon(2, 0, 4);
        io.xVelocity = -3;
        io.yVelocity = -2;
        io.zVelocity = 1;
        europa.xVelocity = -1;
        europa.yVelocity = 1;
        europa.zVelocity = 3;
        ganymede.xVelocity = 3;
        ganymede.yVelocity = 2;
        ganymede.zVelocity = -3;
        callisto.xVelocity = 1;
        callisto.yVelocity = -1;
        callisto.zVelocity = -1;

        expect(io.potencialEnergy).to.equal(6);
        expect(europa.potencialEnergy).to.equal(9);
        expect(ganymede.potencialEnergy).to.equal(10);
        expect(callisto.potencialEnergy).to.equal(6);
        expect(io.kineticEnergy).to.equal(6);
        expect(europa.kineticEnergy).to.equal(5);
        expect(ganymede.kineticEnergy).to.equal(8);
        expect(callisto.kineticEnergy).to.equal(3);
        expect(io.energy).to.equal(36);
        expect(europa.energy).to.equal(45);
        expect(ganymede.energy).to.equal(80);
        expect(callisto.energy).to.equal(18);
      });
    });
  });

  describe('MoonSystem', () => {
    describe('simulateStep', () => {
      it('calculates positions of its moons after one step', () => {
        const io = new Moon(-1, 0, 2);
        const europa = new Moon(2, -10, -7);
        const ganymede = new Moon(4, -8, 8);
        const callisto = new Moon(3, 5, -1);
        const moonSystem = new MoonSystem([io, europa, ganymede, callisto]);

        for (let i = 0; i < 10; i += 1) {
          moonSystem.simulateStep();
        }

        expect(io).to.deep.include({
          xCoord: 2,
          yCoord: 1,
          zCoord: -3,
          xVelocity: -3,
          yVelocity: -2,
          zVelocity: 1
        });
        expect(europa).to.deep.include({
          xCoord: 1,
          yCoord: -8,
          zCoord: 0,
          yVelocity: 1,
          xVelocity: -1,
          zVelocity: 3
        });
        expect(ganymede).to.deep.include({
          xCoord: 3,
          yCoord: -6,
          zCoord: 1,
          xVelocity: 3,
          yVelocity: 2,
          zVelocity: -3
        });
        expect(callisto).to.deep.include({
          xCoord: 2,
          yCoord: 0,
          zCoord: 4,
          xVelocity: 1,
          yVelocity: -1,
          zVelocity: -1
        });
      });
    });

    describe('totalEnergy', () => {
      it('returns the total energy of the moon system', () => {
        const io = new Moon(-1, 0, 2);
        const europa = new Moon(2, -10, -7);
        const ganymede = new Moon(4, -8, 8);
        const callisto = new Moon(3, 5, -1);
        const moonSystem = new MoonSystem([io, europa, ganymede, callisto]);

        for (let i = 0; i < 10; i += 1) {
          moonSystem.simulateStep();
        }

        expect(moonSystem.totalEnergy).to.equal(179);
      });
    });
  });
});
