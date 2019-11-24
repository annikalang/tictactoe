// Basic Setup

let origBoard; // original Board, is going to be an array that keeps track of what is in each square of the tic tac toe board

// Players' variables
const humanPlayer = '0';
const aiPlayer = 'X';

// Array of  arrays of winning-combinations
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

// Variable storing a reference to each cell in the table
const cells = document.querySelectorAll('.cell') // selects each element on the page that has the class "cell"

// we need to start the game with a function, which we are going to define now
startGame();

// definition of startGame function
function startGame() {
  document.querySelector('.endgame').style.display = "none"; // selecting the endgame element and set the css-style display property to none
  origBoard = Array.from(Array(9).keys()); // the array origBoard contains every number from 0 to 9

  //removing als the x and o from the table
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = ''; // there's nothing in the cell
    cells[i].style.removeProperty('background-color'); // remove background color of winner's cells
    cells[i].addEventListener('click', turnClick, false); // call turnClick function everytime a cell is clicked
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, humanPlayer)
    if (!checkTie()) turnClick(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player)
  if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', turnClick, false);
  }
  declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose!");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
  // return emptySquares()[0];
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner("Tie Game!")
    return true;
  }
  return false;
}


