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

  // removing als the x and o from the table
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = ''; // there's nothing in the cell
    cells[i].style.removeProperty('background-color'); // remove background color of winner's cells
    cells[i].addEventListener('click', turnClick, false); // call turnClick function everytime a cell is clicked
  }
}

// definition of turnClick function (see above)
function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number') {
    turn(square.target.id, humanPlayer) // the human player is going to take the turn
    if (!checkTie()) turnClick(bestSpot(), aiPlayer);
  }
}

// definition of turn function (see above)
function turn(squareId, player) { // player is the humanPlayer in the above case
  origBoard[squareId] = player; // set the origBoard array to the cell we just clicked and let the player who just clicked that spot take this place
  document.getElementById(squareId).innerText = player; // select the element with the square id, which we just clicked, and set the inner text to the player who took it
  let gameWon = checkWin(origBoard, player) // whenever a turn is taken, we're going to check if the game has been won
  if (gameWon) gameOver(gameWon) // if we find out the game has been one, use the gameOver function
}

// definition of checkWin function (see above)
function checkWin(board, player) {
  // a fancy way to find all the places on the board that have already been played in.
  // the reduce method is going to go through every element of the board array and do something.
  // it's going to give back one single value. The accumulator (a) is the value that it's going to give back in the end.
  // element in the board array (e) is, index (i)
  let plays = board.reduce((a, e, i) =>
    (e === player) ? a.concat(i) : a, []);
    // if the element (e) equals the player, then we're going to add the index (i) to the array,
    // if element doesn't equal the player, we just return the accumulator. the accumulator is initialized to an empty array.
    // this is a way to find the index every player has played in.
  let gameWon = null;
  // let's check if the game has been won, this a for loop
  for (let [index, win] of winCombos.entries()) { // we have to loop through every winCombo (see above)
    // we check if the player has played in every spot that counts as a win for that win
    if (win.every(elem => plays.indexOf(elem) > -1)) { // we're going through every element in the winCombo (f.e. 0,1,2), we will check the places the player has played on the board, and if the index of the elements is more than -1
      gameWon = {index: index, player: player}; // if this is true, the player has won, the variable gameWon will be set to the player
      break;
    }
  }
  return gameWon; // if nobody wins, this will be null
}

// definition of checkWin function (see above)
function gameOver(gameWon) {
  // the index of the win combo that won this game, we go through every index of that win combo
  for (let index of winCombos[gameWon.index]) {
    // seeting the backgroundcolor of the win combo to whoever whon the game
    document.getElementById(index).style.backgroundColor =
      // ternary operator: if the winning player is human, then the backgroundcolor will turn blue, if not it will turn red
      gameWon.player == humanPlayer ? "blue" : "red";
  }
  // going through every cell, removing clickability
  for (var i = 0; i < cells.length; i++) {
    // re3vmove the click event listener by setting it to false
    cells[i].removeEventListener('click', turnClick, false);
  }
  // determine the winner
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


