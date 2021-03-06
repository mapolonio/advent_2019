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
    this.keyMap = {};
    this.entrances = new Set();
    this.keys = new Set();
    this.doors = new Set();
    const keyPattern = /^[a-z]$/;
    const doorPattern = /^[A-Z]$/;

    for (let r = 0; r < this.caveMap.length; r += 1) {
      for (let c = 0; c < this.caveMap[r].length; c += 1) {
        const char = this.caveMap[r][c];
        const isKey = keyPattern.test(char);
        const isDoor = doorPattern.test(char);

        if (CaveMap.isEntrance(char)) {
          this.entrances.add({ row: r, col: c });
        }

        if (isKey) {
          this.keyMap[char] = { row: r, col: c };
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
    fromPositions = [...this.entrances],
    currentKeys = new KeySet(),
    takenSteps = 0
  ) {
    const cacheKey = this.mainCacheKey(fromPositions, currentKeys, takenSteps);

    if (this.mainCache.has(cacheKey)) {
      return this.mainCache.get(cacheKey);
    }

    if (currentKeys.size === this.keys.size) {
      this.mainCache.set(cacheKey, takenSteps);

      return takenSteps;
    }

    const reachableKeySets = [];

    for (const position of fromPositions) {
      const reachableKeys = this.getReachableKeys(position, currentKeys);

      reachableKeySets.push(reachableKeys);
    }

    let currentMin = Infinity;

    for (let k = 0; k < reachableKeySets.length; k += 1) {
      for (const { key, dist } of reachableKeySets[k]) {
        const newPositions = [
          ...fromPositions.slice(0, k),
          this.keyMap[key],
          ...fromPositions.slice(k + 1)
        ];
        const newKeySet = currentKeys.clone();
        newKeySet.setKey(key);

        const minCandidate = this.findShortestPath(
          newPositions,
          newKeySet,
          takenSteps + dist
        );

        currentMin = Math.min(currentMin, minCandidate);
      }
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
        CaveMap.isEntrance(char) ||
        CaveMap.isFloor(char) ||
        this.isKey(char) ||
        (this.isDoor(char) && currentKeys.getKey(char.toLowerCase()))
      ) {
        result.push({ row, col, totalSteps });
      }
    }

    return result;
  }

  mainCacheKey(positions, currentKeys, takenSteps) {
    const positionsKey = positions.map((p) => this.getKey(p)).join(',');

    return `${positionsKey}-${currentKeys}-${takenSteps}`;
  }

  cacheKey(position, currentKeys) {
    return `${this.getKey(position)}-${currentKeys}`;
  }

  getKey({ row, col }) {
    return row * this.width + col;
  }

  static isEntrance(char) {
    return char === SYMBOLS.ENTRANCE;
  }

  static isFloor(char) {
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
  const rows = input.split('\n');
  let entrancePos;

  for (let r = 0; r < rows.length; r += 1) {
    for (let c = 0; c < rows[r].length; c += 1) {
      if (CaveMap.isEntrance(rows[r][c])) {
        entrancePos = {
          row: r,
          col: c
        };

        break;
      }
    }

    if (entrancePos) {
      break;
    }
  }

  updateEntrance(entrancePos, rows);

  return new CaveMap(rows);
};

const updateEntrance = (entrancePosition, caveScan) => {
  const { row, col } = entrancePosition;
  const replacements = ['@#@', '###', '@#@'];
  let repIndex = 0;

  for (let r = row - 1; r <= row + 1; r += 1) {
    caveScan[r] = `${caveScan[r].substring(0, col - 1)}${
      replacements[repIndex]
    }${caveScan[r].substring(col + 2)}`;
    repIndex += 1;
  }
};

const main = async (inputPath = 'day18/input') => {
  const caveMap = await getInput(inputPath, parseInput);
  const shortestPath = caveMap.findShortestPath();

  return shortestPath;
};

module.exports = { CaveMap, main };
