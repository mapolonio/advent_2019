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
        const char = this.mazeMap[r][c];
        const rightChar = this.mazeMap[r][c + 1];
        const bottomChar = this.mazeMap[r + 1][c];
        let rightLabel = `${char}${rightChar}`;
        let bottomLabel = `${char}${bottomChar}`;

        if (this.isLetter(char)) {
          if (this.isLetter(rightChar)) {
            rightLabel =
              `${rightLabel}-1` in this.portalMap
                ? `${rightLabel}-2`
                : `${rightLabel}-1`;

            const portalCol = this.mazeMap[r][c - 1] === '.' ? c - 1 : c + 2;
            const portalPosition = { row: r, col: portalCol };
            const key = this.positionKey(portalPosition);

            this.portalMap[rightLabel] = portalPosition;
            this.positionToPortalMap[key] = rightLabel;
          } else if (this.isLetter(bottomChar)) {
            bottomLabel =
              `${bottomLabel}-1` in this.portalMap
                ? `${bottomLabel}-2`
                : `${bottomLabel}-1`;

            const portalRow =
              this.mazeMap[r + 2] && this.mazeMap[r + 2][c] === '.'
                ? r + 2
                : r - 1;
            const portalPosition = { row: portalRow, col: c };
            const key = this.positionKey(portalPosition);

            this.portalMap[bottomLabel] = portalPosition;
            this.positionToPortalMap[key] = bottomLabel;
          }
        }
      }
    }

    this.destination = this.portalMap['ZZ-1'];
  }

  findMinPath(
    fromPosition = this.portalMap['AA-1'],
    takenSteps = 0,
    visitedPortals = new Set(['AA-1'])
  ) {
    if (
      this.destination.row === fromPosition.row &&
      this.destination.col === fromPosition.col
    ) {
      return takenSteps;
    }

    const reachablePortals = this.getReachablePortals(
      fromPosition,
      visitedPortals
    );
    let minPath = Infinity;

    for (const { portal, dist } of reachablePortals) {
      const portalExit = this.getExitPortal(portal);
      const nextPosition = this.portalMap[portalExit];
      let teleportingDist = dist;

      if (portalExit !== portal) {
        teleportingDist += 1;
      }

      const candidatePath = this.findMinPath(
        nextPosition,
        takenSteps + teleportingDist,
        new Set([...visitedPortals, portal])
      );

      minPath = Math.min(candidatePath, minPath);
    }

    return minPath;
  }

  getExitPortal(entryPortal) {
    if (entryPortal === 'ZZ-1') {
      return entryPortal;
    }

    const [portalLabel, suffix] = entryPortal.split('-');
    const exitPortalSuffix = suffix === '1' ? '2' : '1';

    return `${portalLabel}-${exitPortalSuffix}`;
  }

  getReachablePortals(fromPosition, visitedPortals) {
    const queuedNeighbors = new Set();
    const queue = [...this.getNeighbors(fromPosition, queuedNeighbors)];
    const portals = [];

    while (queue.length) {
      const { position, dist } = queue.shift();
      const key = this.positionKey(position);
      const portalLabel = this.positionToPortalMap[key];

      if (portalLabel && !visitedPortals.has(portalLabel)) {
        portals.push({ portal: portalLabel, dist });
      }

      queue.push(...this.getNeighbors(position, queuedNeighbors, dist));
    }

    return portals;
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
