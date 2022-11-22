/*
Reglas Juego de la vida de Conway
1. Si una célula tiene menos de 2 vecinos muere
2. Si tiene 2 o 3 vecinos se mantendrá igual (sobrevive)
3. Si tiene más de 3 vecinos muere por "sobrepoblación"
4. Si una célula muerta tiene exactamente 3 vecinos revive
*/

let canvas;
let ctx;
const fps = 10;
let canvasX = 500; // 500 width pixels
let canvasY = 500; // height pixels
let tileX;
let tileY;

let board;
const rows = 100;
const columns = 100;

const purple = '#FFD700';
const yellow = '#000000';


function initialize() {
  canvas = document.getElementById('screen');
  ctx = canvas.getContext('2d');
  canvas.width = canvasX;
  canvas.height = canvasY;

  // Calculate tile size
  tileX = Math.floor(canvasX / rows);
  tileY = Math.floor(canvasY / rows);

  // Create board
  board = createBoard(rows);
  // Initialize board
  initBoard(board);

  setInterval(() => {
    main();
  }, 1000 / fps);
}

function initBoard(board) {
  let state = null;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      state = Math.floor(Math.random() * 2);
      board[y][x] = new Cell(x, y, state);
    }
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      board[y][x].addNextCells();
    }
  }
}

class Cell {
  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.nextState = this.state;
    this.nextCells = [];
  }

  // add neighbours
  addNextCells() {
    let nextX = null;
    let nextY = null;

    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        nextX = (this.x + y + columns) % columns;
        nextY = (this.y + x + rows) % columns;

        if (x !== 0 || y !== 0) {
          this.nextCells.push(board[nextY][nextX]);
        }
      }
    }
  }

  // this method draw the cells in the board
  draw() {
    let color = null;

    if (this.state === 1) {
      color = yellow;
    } else {
      color = purple;
    }

    ctx.fillStyle = color;
    ctx.fillRect(this.x * tileX, this.y * tileY, tileX, tileY);
  }

  stablishRules() {
    let add = 0;
    // calculate the quantity of cells next to us
    for (let i = 0; i < this.nextCells.length; i++) {
      add += this.nextCells[i].state;
    }

    this.nextState = this.state;

    // Death: It has less than 2 or 3 cells around
    if (add < 2 || add > 3) {
      this.nextState = 0;
    }

    // Reborn: If there is a death cell and if it has exactly 3 cells
    // it will be reborn
    if (add === 3) {
      this.nextState = 1;
    }
  }

  changeState() {
    this.state = this.nextState;
  }
}

function createBoard(rows) {
  const arr = [];
  for (let i = 0; i < rows; i++) {
    arr.push(new Array());
  }
  return arr;
}

function main() {
  clearCanvas();
  drawBoard(board);
}

function clearCanvas() {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
}

function drawBoard(board) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      board[y][x].draw();
    }
  }

  // calcs the next loop
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      board[y][x].stablishRules();
    }
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      board[y][x].changeState();
    }
  }
}
