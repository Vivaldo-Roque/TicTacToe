var boxsID = [
  [, ,],
  [, ,],
  [, ,],
];

const X = 'X';
const O = 'O';
const EMPTY = '';
var msg;
var board = initial_state();
var move = Array();
var won = '';
var ai_turn = true;
var game_mode_cpu = true;
var start_x_o = true;
var user = '';

const circle_element = `
  <svg class="naught" width="60" height="60" view-box="0 0 100 100">
      <circle
        r="27"
        cx="30"
        cy="30"
        stroke-width="6"
        stroke-linecap="round"
        stroke-dasharray="200"
        stroke-dashoffset="200"
        fill="none"
      />
  </svg>
`;

const cross_element = `
  <svg class="cross" width="60" height="60" view-box="0 0 100 100">
    <path
      d="M 60 0 L 0 60"
      stroke-dasharray="100"
      stroke-dashoffset="100"
      stroke-width="5"
      stroke-linecap="round"
    />
    <path
      d="M 0 0 L 60 60"
      stroke-dasharray="100"
      stroke-dashoffset="100"
      stroke-width="5"
      stroke-linecap="round"
    />
  </svg>
`;

//#region AI functions

function initial_state() {
  //Returns starting state of the board.

  return [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
  ];
}

function actions(board) {
  //Returns set of all possible actions (i, j) available on the board.
  var actions = new Array();

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (board[i][j] === EMPTY) {
        actions.push([i, j]);
      }
    }
  }

  return actions;
}

function player(board) {
  //Returns player who has the next turn on a board.

  let x_player = 0;
  let o_player = 0;

  // Check if board is starting state
  if (JSON.stringify(board) === JSON.stringify(initial_state())) {
    return X;
  }

  for (var a = 0; a < board.length; a++) {
    x_player = x_player + board[a].filter((item) => item === X).length;
    o_player = o_player + board[a].filter((item) => item === O).length;
  }

  if (o_player === 1 && x_player === 0) {
    start_x_o = false;
  }

  if (start_x_o) {
    if ((x_player + o_player) % 2 == 0) {
      return X;
    } else {
      return O;
    }
  } else {
    if ((x_player + o_player) % 2 == 0) {
      return O;
    } else {
      return X;
    }
  }
}

function winner(board) {
  // Checking Vertically and Horizontally
  var moves = [X, O];

  for (var i = 0; i < moves.length; i++) {
    for (var x = 0; x < 3; x++) {
      if (
        board[x][0] === moves[i] &&
        moves[i] === board[x][1] &&
        board[x][2] === moves[i]
      ) {
        return moves[i];
      }

      if (
        board[0][x] === moves[i] &&
        board[1][x] === moves[i] &&
        board[2][x] === moves[i]
      ) {
        return moves[i];
      }
    }
    // Checking on Cross
    if (
      board[0][0] === moves[i] &&
      board[1][1] === moves[i] &&
      board[2][2] === moves[i]
    ) {
      return moves[i];
    }

    if (
      board[0][2] === moves[i] &&
      board[1][1] === moves[i] &&
      board[2][0] === moves[i]
    ) {
      return moves[i];
    }
  }
  return null;
}

function terminal(board) {
  //Returns true if game is over, False otherwise.

  if (
    winner(board) !== null ||
    (!board.some((row) => row.some((subRow) => subRow === EMPTY)) &&
      winner(board) === null)
  ) {
    return true;
  } else {
    return false;
  }
}

function utility(board) {
  //Returns 1 if X has won the game, -1 if O has won, 0 otherwise.

  var res = winner(board);

  if (res === X) {
    return 1;
  } else if (res === O) {
    return -1;
  } else {
    return 0;
  }
}

function result(board, action) {
  //Returns the board that results from making move (i, j) on the board.

  var res = actions(board);

  if (
    !res.some((element) => JSON.stringify(element) === JSON.stringify(action))
  ) {
    return;
  }

  copy_board = JSON.parse(JSON.stringify(board));

  copy_board[action[0]][action[1]] = player(board);

  return copy_board;
}

function minimax(board, alpha, beta) {
  if (terminal(board)) {
    return utility(board);
  }

  if (player(board) === X) {
    let best = -Infinity;

    for (var action of actions(board)) {
      best = Math.max(best, minimax(result(board, action), alpha, beta));
      alpha = Math.max(alpha, best);

      // Alpha Beta Pruning
      if (beta <= alpha) {
        break;
      }
    }
    return best;
  } else {
    let best = Infinity;

    for (var action of actions(board)) {
      best = Math.min(best, minimax(result(board, action), alpha, beta));
      beta = Math.min(beta, best);

      // Alpha Beta Pruning
      if (beta <= alpha) {
        break;
      }
    }
    return best;
  }
}

function findBestMove(board) {
  const alpha = -Infinity;
  const beta = Infinity;
  let bestVal;
  let bestMove = new Array();

  if (user === O) {
    bestVal = -Infinity;
  } else {
    bestVal = Infinity;
  }

  for (const action of actions(board)) {
    let moveVal = minimax(result(board, action), alpha, beta);
    if (user === O) {
      if (moveVal > bestVal) {
        bestMove = action;
        bestVal = moveVal;
      }
    } else {
      if (moveVal < bestVal) {
        bestMove = action;
        bestVal = moveVal;
      }
    }
  }

  return bestMove;
}

//#endregion

function popup(AI) {
  const myPopUp = document.getElementsByClassName('popup_box')[0];
  const myBtn1 = document.getElementsByClassName('btn1')[0];
  const myBtn2 = document.getElementsByClassName('btn2')[0];
  myPopUp.style.display = 'block';
  if (AI) {
    myBtn1.addEventListener('click', function () {
      const myPopUp = document.getElementsByClassName('popup_box')[0];
      myPopUp.style.display = 'none';
      enableAllButtons();
      msg.innerHTML = 'Player ' + player(board) + ' Turn';
      user = X;
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          boxsID[i][j].value = '';
        }
      }
      game_mode_cpu = true;
      copyButtonTextsToBoard();
    });
    myBtn2.addEventListener('click', function () {
      const myPopUp = document.getElementsByClassName('popup_box')[0];
      myPopUp.style.display = 'none';
      enableAllButtons();
      msg.innerHTML = 'Player ' + player(board) + ' Turn';
      user = O;
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          boxsID[i][j].value = '';
        }
      }
      game_mode_cpu = AI;
      copyButtonTextsToBoard();
      if (ai_turn && game_mode_cpu) {
        move = findBestMove(board);
        if (player(board) === X) {
          boxsID[move[0]][move[1]].innerHTML = cross_element;
          boxsID[move[0]][move[1]].disabled = true;
        } else {
          boxsID[move[0]][move[1]].innerHTML = circle_element;
          boxsID[move[0]][move[1]].disabled = true;
        }
        board = result(board, move);
        updateButtonTexts();
        ai_turn = false;
      }
    });
  } else {
    myBtn1.addEventListener('click', function () {
      const myPopUp = document.getElementsByClassName('popup_box')[0];
      myPopUp.style.display = 'none';
      enableAllButtons();
      msg.innerHTML = 'Player ' + X + ' Turn';
      user = X;
      game_mode_cpu = false;
    });
    myBtn2.addEventListener('click', function () {
      const myPopUp = document.getElementsByClassName('popup_box')[0];
      myPopUp.style.display = 'none';
      enableAllButtons();
      msg.innerHTML = 'Player ' + O + ' Turn';
      user = O;
      game_mode_cpu = false;
    });
  }
}

function oneVsOne() {
  popup(false);
}

function oneVsCpu() {
  popup(true);
}

function initVariables() {
  boxsID[0][0] = document.getElementById('b1');
  boxsID[0][1] = document.getElementById('b2');
  boxsID[0][2] = document.getElementById('b3');
  boxsID[1][0] = document.getElementById('b4');
  boxsID[1][1] = document.getElementById('b5');
  boxsID[1][2] = document.getElementById('b6');
  boxsID[2][0] = document.getElementById('b7');
  boxsID[2][1] = document.getElementById('b8');
  boxsID[2][2] = document.getElementById('b9');
  msg = document.getElementById('print');
  disableAllButtons();
}

// Function to reset game
function restart() {
  location.reload();
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      boxsID[i][j].value = '';
    }
  }
}

function disableAllButtons() {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      boxsID[i][j].disabled = true;
    }
  }
}

function enableAllButtons() {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      boxsID[i][j].disabled = false;
    }
  }
}

function updateButtonTexts() {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      boxsID[i][j].value = board[i][j];
    }
  }
}

function copyButtonTextsToBoard() {
  board = [
    [boxsID[0][0].value, boxsID[0][1].value, boxsID[0][2].value],
    [boxsID[1][0].value, boxsID[1][1].value, boxsID[1][2].value],
    [boxsID[2][0].value, boxsID[2][1].value, boxsID[2][2].value],
  ];
}

// Function called whenever user tab on any box
function game() {
  copyButtonTextsToBoard();

  ai_turn = true;

  if (terminal(board)) {
    won = winner(board);
    msg.innerHTML = 'Player ' + won + ' Won';
    if (won === null) {
      msg.innerHTML = 'Tie';
    }
    disableAllButtons();
    return;
  } else {
    if (ai_turn && game_mode_cpu) {
      move = findBestMove(board);

      if (player(board) === X) {
        boxsID[move[0]][move[1]].innerHTML = cross_element;
        boxsID[move[0]][move[1]].disabled = true;
      } else {
        boxsID[move[0]][move[1]].innerHTML = circle_element;
        boxsID[move[0]][move[1]].disabled = true;
      }

      board = result(board, move);
      ai_turn = false;

      updateButtonTexts();
      if (terminal(board)) {
        won = winner(board);
        msg.innerHTML = 'Player ' + won + ' Won';
        if (won === null) {
          msg.innerHTML = 'Tie';
        }
        disableAllButtons();
        return;
      }
    }
  }

  updateButtonTexts();
  if (!game_mode_cpu) {
    user = player(board);
  }
  msg.innerHTML = 'Player ' + player(board) + ' Turn';

  if (terminal(board)) {
    won = winner(board);
    msg.innerHTML = 'Player ' + won + ' Won';
    if (won === null) {
      msg.innerHTML = 'Tie';
    }
    disableAllButtons();
    return;
  }
}

// object of places to play on the grid boxes
const placeToPlay = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 1 },
  3: { x: 0, y: 2 },
  4: { x: 1, y: 0 },
  5: { x: 1, y: 1 },
  6: { x: 1, y: 2 },
  7: { x: 2, y: 0 },
  8: { x: 2, y: 1 },
  9: { x: 2, y: 2 },
};

// delay function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function called when user click on one grid box
function handleClickButton(btn) {
  const place = placeToPlay[btn];
  if (user === X) {
    boxsID[place.x][place.y].innerHTML = cross_element;
  } else {
    boxsID[place.x][place.y].innerHTML = circle_element;
  }

  boxsID[place.x][place.y].value = user;
  boxsID[place.x][place.y].disabled = true;
  game();
}
