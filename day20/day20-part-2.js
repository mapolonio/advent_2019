const { getInput } = require('../utils');

class Maze {
  constructor(mazeMap) {
    this.mazeMap = mazeMap;
    this.scanMaze();
  }

  scanMaze() {
    this.portalMap = {};
    this.mazeWidth = this.mazeMap[0].length;
    this.positionToPortalMap = {};

    for (let r = 0; r < this.mazeMap.length - 1; r += 1) {
      for (let c = 0; c < this.mazeMap[r].length - 1; c += 1) {
        if (!this.isLabelStart({ row: r, col: c })) {
          continue;
        }

        const { label, position } = this.getPortalData({ row: r, col: c });

        this.portalMap[label] = position;
        this.positionToPortalMap[this.positionKey(position)] = label;
      }
    }

    this.destination = this.portalMap['ZZ-o'];
    this.totalPortals = Object.keys(this.portalMap).length;
  }

  isLabelStart({ row, col }) {
    return (
      this.isLetter(this.mazeMap[row][col]) &&
      (this.isLetter(this.mazeMap[row][col + 1]) ||
        (this.mazeMap[row + 1] && this.isLetter(this.mazeMap[row + 1][col])))
    );
  }

  getPortalData({ row, col }) {
    let label = this.mazeMap[row][col];
    const position = {
      row,
      col
    };

    if (this.isOutterTopPortal({ row, col })) {
      label += `${this.mazeMap[row + 1][col]}-o`;
      position.row += 2;
    } else if (this.isOutterLeftPortal({ row, col })) {
      label += `${this.mazeMap[row][col + 1]}-o`;
      position.col += 2;
    } else if (this.isOutterBottomPortal({ row, col })) {
      label += `${this.mazeMap[row + 1][col]}-o`;
      position.row -= 1;
    } else if (this.isOutterRightPortal({ row, col })) {
      label += `${this.mazeMap[row][col + 1]}-o`;
      position.col -= 1;
    } else if (this.isInnerTopPortal({ row, col })) {
      label += `${this.mazeMap[row + 1][col]}-i`;
      position.row -= 1;
    } else if (this.isInnerLeftPortal({ row, col })) {
      label += `${this.mazeMap[row][col + 1]}-i`;
      position.col -= 1;
    } else if (this.isInnerRightPortal({ row, col })) {
      label += `${this.mazeMap[row][col + 1]}-i`;
      position.col += 2;
    } else {
      label += `${this.mazeMap[row + 1][col]}-i`;
      position.row += 2;
    }

    return {
      label,
      position
    };
  }

  isOutterTopPortal({ row, col }) {
    return (
      row === 0 &&
      this.isLetter(this.mazeMap[row + 1][col]) &&
      this.mazeMap[row + 2][col] === '.'
    );
  }

  isOutterLeftPortal({ row, col }) {
    return (
      col === 0 &&
      this.isLetter(this.mazeMap[row][col + 1]) &&
      this.mazeMap[row][col + 2] === '.'
    );
  }

  isOutterBottomPortal({ row, col }) {
    return (
      row === this.mazeMap.length - 2 &&
      this.isLetter(this.mazeMap[row + 1][col]) &&
      this.mazeMap[row - 1][col] === '.'
    );
  }

  isOutterRightPortal({ row, col }) {
    return (
      col === this.mazeWidth - 2 &&
      this.isLetter(this.mazeMap[row][col + 1]) &&
      this.mazeMap[row][col - 1] === '.'
    );
  }

  isInnerTopPortal({ row, col }) {
    return (
      this.isLetter(this.mazeMap[row + 1][col]) &&
      this.mazeMap[row - 1][col] === '.' &&
      this.mazeMap[row + 2][col] === ' '
    );
  }

  isInnerLeftPortal({ row, col }) {
    return (
      this.isLetter(this.mazeMap[row][col + 1]) &&
      this.mazeMap[row][col - 1] === '.' &&
      this.mazeMap[row][col + 2] === ' '
    );
  }

  isInnerRightPortal({ row, col }) {
    return (
      this.isLetter(this.mazeMap[row][col + 1]) &&
      this.mazeMap[row][col + 2] === '.' &&
      this.mazeMap[row][col - 1] === ' '
    );
  }

  findMinPath(
    fromPortal = 'AA-o',
    takenSteps = 0,
    visitedPortals = ['AA-o-0'],
    currentLevel = 0
  ) {
    if (fromPortal === 'ZZ-o' && currentLevel === 0) {
      return takenSteps;
    }

    const reachablePortals = this.getReachablePortals(
      fromPortal,
      visitedPortals,
      currentLevel
    );
    let minPath = Infinity;

    for (const { portal, dist } of reachablePortals) {
      const portalExit = this.getExitPortal(portal);
      let nextLevel = portal.endsWith('i')
        ? currentLevel + 1
        : currentLevel - 1;
      let teleportingDist = dist + 1;

      if (portalExit === 'ZZ-o') {
        nextLevel += 1;
        teleportingDist -= 1;
      }

      const candidatePath = this.findMinPath(
        portalExit,
        takenSteps + teleportingDist,
        [...visitedPortals, `${portal}-${currentLevel}`],
        nextLevel
      );

      minPath = Math.min(candidatePath, minPath);
    }

    return minPath;
  }

  getExitPortal(entryPortal) {
    if (entryPortal === 'ZZ-o') {
      return entryPortal;
    }

    const [portalLabel, suffix] = entryPortal.split('-');
    const exitPortalSuffix = suffix === 'i' ? 'o' : 'i';

    return `${portalLabel}-${exitPortalSuffix}`;
  }

  getReachablePortals(fromPortal, visitedPortals, currentLevel) {
    // Heuristic: if we don't reach the exit by running >2 times each portal, then we never will
    if (visitedPortals.length >= 2.5 * this.totalPortals) {
      return [];
    }

    const queuedNeighbors = new Set([]);
    const queue = [
      ...this.getNeighbors(this.portalMap[fromPortal], queuedNeighbors)
    ];
    const portals = [];

    while (queue.length) {
      const { position, dist } = queue.shift();
      const key = this.positionKey(position);
      const portalLabel = this.positionToPortalMap[key];

      queue.push(...this.getNeighbors(position, queuedNeighbors, dist));

      if (
        !portalLabel ||
        portalLabel === fromPortal ||
        !this.isPortalAvailable(portalLabel, currentLevel)
      ) {
        continue;
      }

      if (!visitedPortals.includes(`${portalLabel}-${currentLevel}`)) {
        portals.push({ portal: portalLabel, dist });
      }
    }

    return portals;
  }

  isPortalAvailable(portal, currentLevel) {
    if (currentLevel === 0) {
      return portal === 'ZZ-o' || portal.endsWith('i');
    }

    return !['AA-o', 'ZZ-o'].includes(portal);
  }

  getNeighbors({ row, col }, queuedNeighbors, dist = 0) {
    const neighbors = [
      { row: row - 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
      { row: row + 1, col }
    ];
    const result = [];

    for (const neighbor of neighbors) {
      const key = this.positionKey(neighbor);

      if (queuedNeighbors.has(key)) {
        continue;
      }

      if (this.mazeMap[neighbor.row][neighbor.col] === '.') {
        result.push({ position: neighbor, dist: dist + 1 });
        queuedNeighbors.add(key);
      }
    }

    return result;
  }

  positionKey({ row, col }) {
    // eslint-disable-next-line no-mixed-operators
    return row * this.mazeWidth + col;
  }

  isLetter(char) {
    return /[A-Z]/.test(char);
  }
}

const parseInput = (input) => {
  return input.split('\n');
};

const main = async (inputPath = 'day20/input') => {
  const mazeInput = await getInput(inputPath, parseInput);
  const maze = new Maze(mazeInput);

  return maze.findMinPath();
};

module.exports = { main, Maze };
