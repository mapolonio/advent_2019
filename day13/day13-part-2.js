const { getInput } = require('../utils');
const { stdin, stdout } = process;

const TILES = Object.freeze({
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  PADDLE: 3,
  BALL: 4
});

const SYMBOLS = Object.freeze({
  EMPTY: ' ',
  WALL: '|',
  BLOCK: '#',
  PADDLE: '■',
  BALL: 'o'
});

class Arcade {
  constructor(program) {
    this.program = [...program];
    this.currentIndex = 0;
    this.inputStack = [];
    this.outputs = [];
    this.relativeBase = 0;
    this.score = 0;
    this.tiles = {};
    this.nextMove = undefined;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
    this.savedData = undefined;

    this.initJoystick();
  }

  saveData() {
    this.savedData = {
      program: [...this.program],
      currentIndex: this.currentIndex,
      inputStack: [...this.inputStack],
      outputs: [...this.outputs],
      relativeBase: this.relativeBase,
      score: this.score,
      tiles: { ...this.tiles },
      nextMove: this.nextMove,
      maxX: this.maxX,
      maxY: this.maxY
    };

    this.logToFirstLine('Game Saved');

    setTimeout(() => {
      this.logToFirstLine('');
    }, 800);
  }

  logToFirstLine(message) {
    stdout.clearLine();
    stdout.write(message);
    stdout.cursorTo(0);
  }

  insertCoin() {
    this.program[0] = 2;
  }

  initJoystick() {
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    stdin.on('data', (key) => {
      switch (key) {
        case 's':
          this.saveData();
          break;
        case 'y':
          this.lastResponse = 'y';
          break;
        case 'n':
          this.lastResponse = 'n';
          break;
        // CTRL+C
        case '\u0003':
          process.exit();
          break;
        // left arrow
        case '\u001b[D':
          this.nextMove = -1;
          break;
        // right arrow
        case '\u001b[C':
          this.nextMove = 1;
          break;
        default:
          this.nextMove = 0;
      }
    });
  }

  async play() {
    while (this.program[this.currentIndex] !== 99) {
      await this.performOperation();
    }

    if (this.blocks === 0) {
      this.logToFirstLine('Congratulations!!!');
    } else {
      const loadData = await this.askToLoad('Load last saved data? (Y/N)');

      if (loadData === 'y') {
        this.loadData();
        return this.play();
      }
    }

    this.endGame();

    return this.outputs;
  }

  async askToLoad() {
    if (this.savedData === undefined) {
      return 'n';
    }

    this.logToFirstLine('Load last saved data? (Y/N)');

    while (this.lastResponse === undefined) {
      await this._waitMs(0);
    }

    const { lastResponse } = this;

    this.lastResponse = undefined;

    return lastResponse;
  }

  loadData() {
    this.program = [...this.savedData.program];
    this.currentIndex = this.savedData.currentIndex;
    this.inputStack = [...this.savedData.inputStack];
    this.outputs = [...this.savedData.outputs];
    this.relativeBase = this.savedData.relativeBase;
    this.score = this.savedData.score;
    this.tiles = { ...this.savedData.tiles };
    this.nextMove = this.savedData.nextMove;
    this.maxX = this.savedData.maxX;
    this.maxY = this.savedData.maxY;

    stdout.clearLine();
    stdout.write('');
    stdout.cursorTo(0);
  }

  endGame() {
    stdout.cursorTo(0);
    stdout.moveCursor(0, this.maxY + 3);
    stdout.write('\n');
    stdin.destroy();
  }

  async performOperation() {
    const operation = this.program[this.currentIndex];
    const { modes, opNumber } = this.parseOperation(operation);
    const valueA = this.getValueAt(this.currentIndex + 1, modes[0]);
    const valueB = this.getValueAt(this.currentIndex + 2, modes[1]);
    let address = this.getWriteAddress(this.currentIndex + 3, modes[2]);
    let nextIndex = this.getNextIndex(opNumber);
    let input;

    switch (opNumber) {
      case 1:
        input = valueA + valueB;
        break;
      case 2:
        input = valueA * valueB;
        break;
      case 3:
        this.displayGame();
        address = this.getWriteAddress(this.currentIndex + 1, modes[0]);
        input = await this.readJoystick();

        break;
      case 4:
        this.outputs.push(valueA);

        if (this.outputs.length === 3) {
          this.processOutput();
        }

        break;
      case 5:
        if (valueA !== 0) {
          nextIndex = valueB;
        }

        break;
      case 6:
        if (valueA === 0) {
          nextIndex = valueB;
        }

        break;
      case 7:
        input = valueA < valueB ? 1 : 0;
        break;
      case 8:
        input = valueA === valueB ? 1 : 0;
        break;
      case 9:
        this.relativeBase += valueA;
        break;
      default:
        throw new Error(`Operation "${operation}": not supported`);
    }

    if (input !== undefined) {
      this.program[address] = input;
    }

    this.currentIndex = nextIndex;
  }

  parseOperation(operation) {
    const modes = [];

    if ([1, 2, 3, 4, 5, 6, 7, 8, 9].includes(operation)) {
      return { opNumber: operation, modes };
    }

    const opText = `${operation}`;
    const opNumber = parseInt(opText.substring(opText.length - 2));

    for (let i = opText.length - 3; i >= 0; i -= 1) {
      modes.push(parseInt(opText[i], 10));
    }

    return { opNumber, modes };
  }

  getValueAt(index, mode = 0) {
    const parameter = this._valueAt(index);

    switch (mode) {
      case 1:
        return parameter;
      case 2:
        return this._valueAt(parameter + this.relativeBase);
      default:
        return this._valueAt(parameter);
    }
  }

  getWriteAddress(index, mode = 0) {
    const address = this.program[index];

    if (mode === 2) {
      return address + this.relativeBase;
    }

    return address;
  }

  _valueAt(index) {
    return this.program[index] || 0;
  }

  async readJoystick() {
    while (this.nextMove === undefined) {
      await this._waitMs(0);
    }

    const { nextMove = 0 } = this;
    this.nextMove = undefined;

    return nextMove;
  }

  getNextIndex(operation) {
    switch (operation) {
      case 1:
      case 2:
      case 7:
      case 8:
        return this.currentIndex + 4;
      case 3:
      case 4:
      case 9:
        return this.currentIndex + 2;
      case 5:
      case 6:
        return this.currentIndex + 3;
      default:
        throw new Error(`Unsupported index jump for operation "${operation}"`);
    }
  }

  processOutput() {
    const [xPos, yPos, value] = this.outputs;

    if (xPos === -1 && yPos === 0) {
      this.updateScore(value);
    } else {
      this.updateTile(xPos, yPos, value);
    }

    this.outputs = [];
  }

  updateScore(score) {
    this.score = score;
  }

  updateTile(xPos, yPos, value) {
    this.maxX = Math.max(this.maxX, xPos);
    this.maxY = Math.max(this.maxY, yPos);

    this.tiles[`${xPos},${yPos}`] = value;
  }

  displayGame() {
    stdout.write(`\nBlocks: ${this.blocks} | Score: ${this.score}\n`);
    let writtenLines = 2;

    for (let row = 0; row <= this.maxY; row += 1) {
      const line = [];

      for (let col = 0; col <= this.maxX; col += 1) {
        line.push(this.getSymbol(col, row));
      }

      writtenLines += 1;
      stdout.write(`${line.join('')}\n`);
    }

    stdout.clearLine();
    stdout.cursorTo(0);
    stdout.moveCursor(0, -writtenLines);
  }

  getSymbol(xPos, yPos) {
    const key = `${xPos},${yPos}`;
    const tile = this.tiles[key];

    switch (tile) {
      case TILES.EMPTY:
        return SYMBOLS.EMPTY;
      case TILES.WALL:
        return SYMBOLS.WALL;
      case TILES.BLOCK:
        return SYMBOLS.BLOCK;
      case TILES.PADDLE:
        return SYMBOLS.PADDLE;
      case TILES.BALL:
        return SYMBOLS.BALL;
      default:
        return SYMBOLS.EMPTY;
    }
  }

  get blocks() {
    let count = 0;

    for (const key in this.tiles) {
      if (this.tiles[key] === TILES.BLOCK) {
        count += 1;
      }
    }

    return count;
  }

  _waitMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

const parseInput = (input) => {
  return input.split(',').map((n) => parseInt(n, 10));
};

const main = async (inputPath = 'day13/input') => {
  const program = await getInput(inputPath, parseInput);
  const arcade = new Arcade(program);

  arcade.insertCoin();
  await arcade.play();

  return arcade.score;
};

module.exports = { main };
