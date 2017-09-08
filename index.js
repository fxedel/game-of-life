const fs = require('fs');
const path = require('path');

class Cell {
  /**
   * Creates a new dead Cell instance.
   */
  constructor() {
    this.alive = false;
  }
}

class GameOfLife {
  /**
   * Creates a new Game of Life instance with cells for an area of the given width and height.
   * @param {!number} width Positive integer
   * @param {!number} height Positive integer
   * @param {!number[][]} [alives=[]] Array of X-Y-Positions of all cells that are alive in the beginning.
   */
  constructor(width, height, alives=[]) {
    this.cells = [];
    this.width = width;
    this.height = height;

    // create a field of dead cells
    for (let y = 0; y < height; y++) {
      this.cells[y] = [];
      for (let x = 0; x < width; x++) {
        this.cells[y][x] = new Cell();
      }
    }

    // alive the cells at the specified positions
    for (const [x, y] of alives) {
      this.cells[y][x].alive = true;
    }

    this.draw();

    // call this.nextRound() every 200ms
    setInterval(this.nextRound.bind(this), 200);
  }

  /**
   * Apply Conway's Game of Life's rules to make the right cells die or be born and draw the resulting new field.
   */
  nextRound() {
    let born = new Set();
    let die = new Set();

    // find out which cells have to die and which have to be born
    // don't let them die/born immediately as we need the current state to count living neighbor cells
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const livingNeighbors = this.countAdjacentLivingCells(x, y);
        const cell = this.cells[y][x];

        if (cell.alive && (livingNeighbors < 2 || livingNeighbors > 3)) {
          die.add(cell);
        }
        else if (!cell.alive && livingNeighbors === 3) {
          born.add(cell);
        }
      }
    }

    if (born.size === 0 && die.size === 0) {
      console.log('Game of Life has ended.');
      process.exit(0);
    }

    born.forEach(cell => {
      cell.alive = true;
    });
    die.forEach(cell => {
      cell.alive = false;
    });

    this.draw();
  }

  /**
   * Counts how many of the 8 adjacent cells live. Cells at the border use the cells in the opposite border as "neighbor".
   * @param {!number} x The horizontal position of the cell.
   * @param {!number} y The vertical position of the cell.
   * @return {!number} Integer from 0 to 8 defining the amount of living neighbor cells.
   */
  countAdjacentLivingCells(x, y) {
    // the positions of the adjacent cells – borders not respected
    let cellPositions = [
      [x-1, y-1], [x, y-1], [x+1, y-1],  // 0 1 2
      [x-1, y],             [x+1, y],    // 3   4
      [x-1, y+1], [x, y+1], [x+1, y+1]   // 5 6 7
    ];

    // main cell is at the left border
    if (x === 0) {
      // move left positions to the right border
      cellPositions[0][0] = this.width-1;
      cellPositions[3][0] = this.width-1;
      cellPositions[5][0] = this.width-1;
    }
    // main cell is at the right border
    else if (x === this.width-1) {
      // move right positions to the left border
      cellPositions[2][0] = 0;
      cellPositions[4][0] = 0;
      cellPositions[7][0] = 0;
    }

    // main cell is at the top border
    if (y === 0) {
      // move top positions to the bottom border
      cellPositions[0][1] = this.height-1;
      cellPositions[1][1] = this.height-1;
      cellPositions[2][1] = this.height-1;
    }
    // main cell is at the bottom border
    else if (y === this.height-1) {
      // move bottom positions to the top border
      cellPositions[5][1] = 0;
      cellPositions[6][1] = 0;
      cellPositions[7][1] = 0;
    }

    const adjacentCells = new Set(cellPositions.map(
      ([x, y]) => this.cells[y][x]
    ));
    
    return [...adjacentCells].filter(cell => cell.alive).length;
  }

  /**
   * Draws the current field in ASCII in console
   */
  draw() {
    for (let y = -1; y <= this.height; y++) {
      let line = '';

      for (let x = -1; x <= this.width; x++) {
        // border
        if (y === -1 || y === this.height || x === -1 || x === this.width) {
          line += '\u2588';
        }
        // cells
        else {
          line += this.cells[y][x].alive ? 'O' : ' ';
        }
      }

      console.log(line);
    }
  }
}

// wrong number of command line arguments
if (process.argv.length !== 3) {
  console.log([
    'Just another implementation of Conway\'s Game of Life. Use simple txt files with "O"s for living cells and spaces for empty fields to create a start generation.',
    'Some sample start generations are available in the samples/ directory.',
    `Usage: node ${process.argv[1]} <path/to/start-generation.txt>`,
    `For example: node index.js samples/rocket.txt`
  ].join('\n'));
  process.exit(1);
}

// read start generation file
fs.readFile(path.join(__dirname, process.argv[2]), 'utf8', (err, data) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  
  let width = 0;
  let alives = [];

  const lines = data.split('\n');
  for (let y = 0; y < lines.length; y++) {
    const chars = lines[y].split('');

    // if the lines aren't equally long, use the longest line as width
    // the not specified cells are considered as empty (dead)
    width = Math.max(width, chars.length);

    for (let x = 0; x < chars.length; x++) {
      if (chars[x] === 'O') {
        alives.push([x, y]);
      }
      else if (chars[x] !== ' ') {
        console.error(`Invalid character '${chars[x]}'. Only ' ' and 'O' allowed.`);
      }
    }
  }

  // start the Game of Life!
  new GameOfLife(width, lines.length, alives);
});