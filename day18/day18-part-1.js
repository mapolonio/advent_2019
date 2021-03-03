const { getInput } = require('../utils');

const SYMBOLS = Object.freeze({
  EMPTY: '.',
  WALL: '#',
  ENTRANCE: '@'
});

class KeySet {
  constructor() {
    this.bitArray = 0;
    this.elementCount = 0;
  }

  get size() {
    return this.elementCount;
  }

  setKey(char) {
    const key = char.charCodeAt() - 97;
    const mask = 1 << key;
    const old = this.bitArray & mask;

    this.bitArray |= mask;

    if (old !== 1) {
      this.elementCount += 1;
    }
  }

  getKey(char) {
    const key = char.charCodeAt() - 97;
    const mask = 1 << key;

    return this.bitArray & mask;
  }

  clone() {
    const clone = new KeySet();
    clone.bitArray = this.bitArray;
    clone.elementCount = this.elementCount;

    return clone;
  }

  toString() {
    return `${this.bitArray}`;
  }
}

class CaveMap {
  constructor(caveMap) {
    this.caveMap = caveMap;
    this.mainCache = new Map();
    this.keyCache = new Map();
    this.inspectCave();
  }

  get width() {
    return this.caveMap[0].length;
  }

  inspectCave() {
    this.elementsMap = {};
    this.keys = new Set();
    this.doors = new Set();
    const keyPattern = /^[a-z]$/;
    const doorPattern = /^[A-Z]$/;

    for (let r = 0; r < this.caveMap.length; r += 1) {
      for (let c = 0; c < this.caveMap[r].length; c += 1) {
        const char = this.caveMap[r][c];
        const isKey = keyPattern.test(char);
        const isDoor = doorPattern.test(char);

        if (this.isEntrance(char) || isKey) {
          this.elementsMap[char] = { row: r, col: c };
        }

        if (isKey) {
          this.keys.add(char);
        }

        if (isDoor) {
          this.doors.add(char);
        }
      }
    }

    this.positionQty = this.caveMap.length + this.width;
    this.allKeysValue = Math.pow(2, this.keys.size) - 1;
  }

  findShortestPath(
    fromPosition = this.elementsMap[SYMBOLS.ENTRANCE],
    currentKeys = new KeySet(),
    takenSteps = 0
  ) {
    const cacheKey = this.mainCacheKey(fromPosition, currentKeys, takenSteps);

    if (this.mainCache.has(cacheKey)) {
      return this.mainCache.get(cacheKey);
    }

    if (currentKeys.size === this.keys.size) {
      this.mainCache.set(cacheKey, takenSteps);

      return takenSteps;
    }

    const foundKeys = this.getReachableKeys(fromPosition, currentKeys);
    let currentMin = Infinity;

    for (const { key, dist } of foundKeys) {
      const position = this.elementsMap[key];
      const newKeySet = currentKeys.clone();
      newKeySet.setKey(key);

      const minCandidate = this.findShortestPath(
        position,
        newKeySet,
        takenSteps + dist
      );

      currentMin = Math.min(currentMin, minCandidate);
    }

    this.mainCache.set(cacheKey, currentMin);

    return currentMin;
  }

  getReachableKeys(fromPosition, currentKeys) {
    const cacheKey = this.cacheKey(fromPosition, currentKeys);

    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey);
    }

    const result = [];
    const visited = new Set([[this.getKey(fromPosition)]]);
    const queue = this.getNeighbors(fromPosition, currentKeys, visited, 0);

    while (queue.length) {
      const { row, col, totalSteps } = queue.shift();
      const char = this.caveMap[row][col];
      visited.add(this.getKey({ row, col }));

      if (this.isKey(char) && !currentKeys.getKey(char)) {
        result.push({ key: char, dist: totalSteps });
      }

      queue.push(
        ...this.getNeighbors({ row, col }, currentKeys, visited, totalSteps)
      );
    }

    this.keyCache.set(cacheKey, result);

    return result;
  }

  getNeighbors(position, currentKeys, visited, takenSteps) {
    const totalSteps = takenSteps + 1;

    const result = [];
    const candidates = [
      { row: position.row, col: position.col + 1 },
      { row: position.row, col: position.col - 1 },
      { row: position.row + 1, col: position.col },
      { row: position.row - 1, col: position.col }
    ];

    for (const { row, col } of candidates) {
      if (
        !this.caveMap[row] ||
        !this.caveMap[row][col] ||
        visited.has(this.getKey({ row, col }))
      ) {
        continue;
      }

      const char = this.caveMap[row][col];

      if (
        this.isEntrance(char) ||
        this.isFloor(char) ||
        this.isKey(char) ||
        (this.isDoor(char) && currentKeys.getKey(char.toLowerCase()))
      ) {
        result.push({ row, col, totalSteps });
      }
    }

    return result;
  }

  mainCacheKey(position, currentKeys, takenSteps) {
    // This is a way of enumerating coordinates (x, y, z) in a cube
    const width = this.positionQty;
    const height = this.allKeysValue;
    const depth = width * height * takenSteps;
    const row = width * currentKeys;

    return depth + row + this.getKey(position);
  }

  cacheKey(position, currentKeys) {
    return `${this.getKey(position)}-${currentKeys}`;
  }

  getKey({ row, col }) {
    return row * this.width + col;
  }

  isEntrance(char) {
    return char === SYMBOLS.ENTRANCE;
  }

  isFloor(char) {
    return char === SYMBOLS.EMPTY;
  }

  isKey(char) {
    return this.keys.has(char);
  }

  isDoor(char) {
    return this.doors.has(char);
  }
}

const parseInput = (input) => {
  return new CaveMap(input.split('\n'));
};

const main = async (inputPath = 'day18/input') => {
  const caveMap = await getInput(inputPath, parseInput);
  const shortestPath = caveMap.findShortestPath();

  return shortestPath;
};

module.exports = { CaveMap, main };
