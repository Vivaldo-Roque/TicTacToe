//#region AI functions / Funções da IA

const X = 'X';
const O = 'O';
const EMPTY = '';

function initial_state() {
  // Returns starting state of the board.
  // Retorna o estado inicial do tabuleiro.

  return [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
  ];
}

function actions(board) {
  // Returns set of all possible actions (i, j) available on the board.
  // Retorna um conjunto de todas as possiveis ações (i, j) disponiveis no tabuleiro, ou seja todas as possiveis jogadas.
  const actions = new Array();

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
  // Returns player who has the next turn on a board.
  // Retorna o jogador que fará a proxima jogada no tabuleiro.

  let x_player = 0;
  let o_player = 0;

  // Check if board is starting state
  // Verifica se o tabuleiro está em estado inicial
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

  // Check who player wins on board.
  // Verifica qual jogador ganhou no tabuleiro.

  // Checking Vertically and Horizontally.
  // Verificação vertical e horizontal.
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
    // Verificando as diagonais
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

// Returns true if game is over, False otherwise.
// Retorna verdadeiro se o jogo terminou, caso contrário falso.
function terminal(board) {
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

//Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
// Retorna 1 se X ganhou o jogo, -1 se O ganhou o jogo, caso contrário 0.
function utility(board) {
  const res = winner(board);
  if (res === X) {
    return 1;
  } else if (res === O) {
    return -1;
  } else {
    return 0;
  }
}

// Returns the board that results from making move (i, j) on the board.
// Retorna o tabuleiro que resulta pelo ato de fazer um movimento (i, j) no tabuleiro.
function result(board, action) {
  const res = actions(board);
  if (
    !res.some((element) => JSON.stringify(element) === JSON.stringify(action))
  ) {
    return;
  }

  copy_board = JSON.parse(JSON.stringify(board));
  copy_board[action[0]][action[1]] = player(board);

  return copy_board;
}

// Minimax algorithm implemetation
// Implementação do algoritmo minimax
function minimax(board, alpha, beta) {
  let best;
  if (terminal(board)) {
    return utility(board);
  }

  if (player(board) === X) {
    best = -Infinity;

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
    best = Infinity;

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

// Returns best move on the board
// Retorna o melhor movimento no tabuleiro
function findBestMove(board, user) {
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

// 2D array to save all instance of my buttons
// Vector 2D (2 dimensões) para salvar toda instância dos meus botões
var boxsID = [
  [, ,],
  [, ,],
  [, ,],
];

// Variables to make the game work
// Variavéis para fazer o jogo funcionar
var msg;
var board = initial_state();
var move = Array();
var won = '';
var ai_turn = true;
var game_mode_cpu = true;
var start_x_o = true;
var user = '';
var refreshIntervalId;
var blink;
var crossAudio;
var circleAudio;
var jqueryButtons = Array();
var letterSize = 60;

if (window.screen.width <= 320) {
  letterSize = 40;
}

// HTML code for Circle
// Código HTML para Circulo
const circle_element = `
  <svg class="naught" width="${letterSize}" height="${letterSize}" viewBox="0 0 60 60">
      <circle
        r="25"
        cx="30"
        cy="30"
        stroke-width="10"
        stroke-linecap="round"
        stroke-dasharray="200"
        stroke-dashoffset="200"
        fill="none"
      />
  </svg>
`;

// HTML code for Cross
// Código HTML para Cruz
const cross_element = `
  <svg class="cross" width="${letterSize}" height="${letterSize}" viewBox="0 0 100 100">
    <path
      d="M 95 5 L 5 95"
      stroke-dasharray="300"
      stroke-dashoffset="300"
      stroke-linecap="round"
      stroke-width="15"
    />
    <path
      d="M 5 5 L 95 95"
      stroke-dasharray="300"
      stroke-dashoffset="300"
      stroke-linecap="round"
      stroke-width="15"
    />
  </svg>
`;

// Function to show select game mode and side popup
// Função para mostrar diálogo de alerta para seleção do modo de jogo e lado.
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
      msg.innerHTML = 'Vez do jogador ' + player(board);
      if (player(board) === X) {
        msg.style.color = "#FF073A";
      } else if (player(board) === O) {
        msg.style.color = "#006AF9";
      }
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
      msg.innerHTML = 'Vez do jogador ' + player(board);
      if (player(board) === X) {
        msg.style.color = "#FF073A";
      } else if (player(board) === O) {
        msg.style.color = "#006AF9";
      }
      user = O;
      for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
          boxsID[i][j].value = '';
        }
      }
      game_mode_cpu = AI;

      if (ai_turn && game_mode_cpu) {
        disableAllButtons();
        refreshIntervalId = setInterval(function () {
          blink.style.opacity = (blink.style.opacity == 0 ? 1 : 0);
        }, 500);
        setTimeout(setAiMove1, 3000);

      }
    });
  } else {
    myBtn1.addEventListener('click', function () {
      const myPopUp = document.getElementsByClassName('popup_box')[0];
      myPopUp.style.display = 'none';
      enableAllButtons();
      msg.innerHTML = 'Vez do jogador ' + X;
      user = X;
      if (user === X) {
        msg.style.color = "#FF073A";
      }
      game_mode_cpu = false;
    });
    myBtn2.addEventListener('click', function () {
      const myPopUp = document.getElementsByClassName('popup_box')[0];
      myPopUp.style.display = 'none';
      enableAllButtons();
      msg.innerHTML = 'Vez do jogador ' + O;
      user = O;
      if (user === O) {
        msg.style.color = "#006AF9";
      }
      game_mode_cpu = false;
    });
  }
}

// Function for 1 vs 1
// Função para jogar 1 contra 1
function oneVsOne() {
  popup(false);
  document.getElementById("1vs1").disabled = true;
  document.getElementById("1vscpu").disabled = true;
}

// Function for 1 vs cpu (AI)
// Função para jogar 1 contra computador(AI)
function oneVsCpu() {
  popup(true);
  document.getElementById("1vs1").disabled = true;
  document.getElementById("1vscpu").disabled = true;
}

// Function for initialize all needed variables
// Função para incialização de todas a variavéis necessárias
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
  blink = document.getElementById('blink');
  crossAudio = document.getElementById('crossAudio');
  circleAudio = document.getElementById('circleAudio');
  crossAudio.playbackRate = 2;
  circleAudio.playbackRate = 2;
  initLinesPositions();
  disableAllButtons();
}

// Function that get all buttons coordenates in grade box, on screen using Jquery()
// Função que faz uso do Jquery() para pegar as coordenadas de cada botão(caixa) na grade
function initLinesPositions() {
  jqueryButtons[0] = $('#b1').position();
  jqueryButtons[1] = $('#b2').position();
  jqueryButtons[2] = $('#b3').position();
  jqueryButtons[3] = $('#b4').position();
  jqueryButtons[4] = $('#b5').position();
  jqueryButtons[5] = $('#b6').position();
  jqueryButtons[6] = $('#b7').position();
  jqueryButtons[7] = $('#b8').position();
  jqueryButtons[8] = $('#b9').position();
}

// Function to reset game
// Função que reinicia o jogo
function restart() {
  location.reload();
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      boxsID[i][j].value = '';
    }
  }
}

// Function to disable all the buttons
// Função que desliga todos os botões
function disableAllButtons() {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if(boxsID[i][j].value === ""){
        boxsID[i][j].disabled = true;
      }
    }
  }
}

// Function to enable all the buttons
// FUnção que ativa todos os botões
function enableAllButtons() {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if(boxsID[i][j].value === ""){
        boxsID[i][j].disabled = false;
      }
    }
  }
}

// Function to update the text of all the buttons with the data in the board array
// Função que atualiza o texto dos botões com o dado presente no vector 2D do tabuleiro
function updateButtonTexts() {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      boxsID[i][j].value = board[i][j];
    }
  }
}

// Function to copy all button text to the board array
// Função para copiar todos texto dos botões para o vector 2D do tabuleiro
function copyButtonTextsToBoard() {
  board = [
    [boxsID[0][0].value, boxsID[0][1].value, boxsID[0][2].value],
    [boxsID[1][0].value, boxsID[1][1].value, boxsID[1][2].value],
    [boxsID[2][0].value, boxsID[2][1].value, boxsID[2][2].value],
  ];
}

// Function called by setTimeout() inside popup() function
// Função chamada por setTimeout() dentro da função popup()
function setAiMove1() {

  copyButtonTextsToBoard();

  move = findBestMove(board, user);

  if (player(board) === X) {
    playCrossAudio();
    boxsID[move[0]][move[1]].innerHTML = cross_element;
    boxsID[move[0]][move[1]].disabled = true;
  } else {
    playCircleAudio();
    boxsID[move[0]][move[1]].innerHTML = circle_element;
    boxsID[move[0]][move[1]].disabled = true;
  }
  board = result(board, move);
  updateButtonTexts();
  ai_turn = false;
  enableAllButtons();
  msg.innerHTML = 'Vez do jogador ' + player(board);
  if (player(board) === X) {
    msg.style.color = "#FF073A";
  } else if (player(board) === O) {
    msg.style.color = "#006AF9";
  }
  clearInterval(refreshIntervalId);
  blink.style.opacity = 1;
}

// Function called by setTimeout() inside game() function
// Função chamada por setTimeout() dentro da função game()
function setAiMove2() {

  move = findBestMove(board, user);

  if (player(board) === X) {
    playCrossAudio();
    boxsID[move[0]][move[1]].innerHTML = cross_element;
    boxsID[move[0]][move[1]].disabled = true;
  } else {
    playCircleAudio();
    boxsID[move[0]][move[1]].innerHTML = circle_element;
    boxsID[move[0]][move[1]].disabled = true;
  }

  board = result(board, move);
  ai_turn = false;

  updateButtonTexts();
  if (terminal(board)) {
    won = winner(board);
    msg.innerHTML = 'Jogador ' + won + ' venceu!';
    msg.style.color = "#04AA6D";
    drawLine();
    if (won === null) {
      msg.innerHTML = 'Empate';
    }
    disableAllButtons();
    clearInterval(refreshIntervalId);
    blink.style.opacity = 1;
    return;
  }

  msg.innerHTML = 'Vez do jogador ' + player(board);
  if (player(board) === X) {
    msg.style.color = "#FF073A";
  } else if (player(board) === O) {
    msg.style.color = "#006AF9";
  }

  enableAllButtons();

  clearInterval(refreshIntervalId);
  blink.style.opacity = 1;
}

// Function called whenever user tab on any box
// Função chamada sempre que o usuário clicar em uma caixa
function game() {

  copyButtonTextsToBoard();

  ai_turn = true;

  if (terminal(board)) {
    won = winner(board);
    msg.innerHTML = 'Jogador ' + won + ' venceu!';
    msg.style.color = "#04AA6D";
    drawLine();
    if (won === null) {
      msg.innerHTML = 'Empate';
    }
    disableAllButtons();
    return;
  } else {
    if (ai_turn && game_mode_cpu) {
      disableAllButtons();
      refreshIntervalId = setInterval(function () {
        blink.style.opacity = (blink.style.opacity == 0 ? 1 : 0);
      }, 500);
      setTimeout(setAiMove2, 3000);

    }
  }

  updateButtonTexts();
  if (!game_mode_cpu) {
    user = player(board);
  }
  msg.innerHTML = 'Vez do jogador ' + player(board);
  if (player(board) === X) {
    msg.style.color = "#FF073A";
  } else if (player(board) === O) {
    msg.style.color = "#006AF9";
  }

  if (terminal(board)) {
    won = winner(board);
    msg.innerHTML = 'Jogador ' + won + ' venceu!';
    msg.style.color = "#04AA6D";
    drawLine();
    if (won === null) {
      msg.innerHTML = 'Empate';
    }
    disableAllButtons();
    return;
  }
}

// Object of places to play on the grid boxes
// Objecto com os lugares a serem jogados na grade de caixas
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

// Function called when user click on one grid box
// Função chamada quando o usuário clica em uma das caixas na grade
function handleClickButton(btn) {
  const place = placeToPlay[btn];
  if (user === X) {
    playCrossAudio();
    boxsID[place.x][place.y].innerHTML = cross_element;
  } else {
    playCircleAudio();
    boxsID[place.x][place.y].innerHTML = circle_element;
  }

  boxsID[place.x][place.y].value = user;
  boxsID[place.x][place.y].disabled = true;
  game();
}

// Function to play pencil effect
// Função que toca efeito de lápis
function playCrossAudio() {
  crossAudio.play();
}

// Function to play pencil effect
// Função que toca efeito de lápis
function playCircleAudio() {
  circleAudio.play();
}

// Function that draw the line in SVG
// Função responsável por gerar a linha em SVG
function drawLine() {

  if (document.getElementById("lineSvg")) {
    document.getElementById("lineSvg").remove();
  }

  var pos1;
  var pos2;
  var x1;
  var y1;
  var x2;
  var y2;

  var magicalNumber = 100;

  if (window.screen.width <= 320) {
    magicalNumber = 50;
  }

  // cross
  if (board[0][0] === won && board[2][2] === won && board[1][1] === won) {

    pos1 = jqueryButtons[0];
    pos2 = jqueryButtons[8];

    x1 = (pos1.left + magicalNumber / 2) - 40;
    y1 = (pos1.top + magicalNumber / 2) - 40;
    x2 = (pos2.left + magicalNumber / 2) + 40;
    y2 = (pos2.top + magicalNumber / 2) + 40;

  } else if (board[2][0] === won && board[0][2] === won && board[1][1] === won) {

    pos1 = jqueryButtons[6];
    pos2 = jqueryButtons[2];

    x1 = (pos1.left + magicalNumber / 2) - 40;
    y1 = (pos1.top + magicalNumber / 2) + 40;
    x2 = (pos2.left + magicalNumber / 2) + 40;
    y2 = (pos2.top + magicalNumber / 2) - 40;

    // line inside horizontal
  } else if (board[1][0] === won && board[1][2] === won && board[1][1] === won) {

    pos1 = jqueryButtons[3];
    pos2 = jqueryButtons[5];

    x1 = pos1.left;
    y1 = pos1.top + magicalNumber / 2;
    x2 = pos2.left + magicalNumber;
    y2 = pos2.top + magicalNumber / 2;

    // line inside vertical
  } else if (board[0][1] === won && board[2][1] === won && board[1][1] === won) {

    pos1 = jqueryButtons[1];
    pos2 = jqueryButtons[7];

    x1 = pos1.left + (magicalNumber - 1) / 2;
    y1 = pos1.top;
    x2 = pos2.left + (magicalNumber - 1) / 2;
    y2 = pos2.top + magicalNumber;

    // line outside horizontal
  } else if (board[0][0] === won && board[0][1] === won && board[0][2] === won) {

    pos1 = jqueryButtons[0];
    pos2 = jqueryButtons[2];

    x1 = pos1.left;
    y1 = pos1.top + magicalNumber / 2;
    x2 = pos2.left + magicalNumber;
    y2 = pos2.top + magicalNumber / 2;

  } else if (board[2][0] === won && board[2][1] === won && board[2][2] === won) {

    pos1 = jqueryButtons[6];
    pos2 = jqueryButtons[8];

    x1 = pos1.left;
    y1 = pos1.top + magicalNumber / 2;
    x2 = pos2.left + magicalNumber;
    y2 = pos2.top + magicalNumber / 2;

    // line outside vertical
  } else if (board[0][0] === won && board[1][0] === won && board[2][0] === won) {

    pos1 = jqueryButtons[0];
    pos2 = jqueryButtons[6];

    x1 = pos1.left + (magicalNumber - 1) / 2;
    y1 = pos1.top;
    x2 = pos2.left + (magicalNumber - 1) / 2;
    y2 = pos2.top + magicalNumber;

  } else if (board[0][2] === won && board[1][2] === won && board[2][2] === won) {

    pos1 = jqueryButtons[2];
    pos2 = jqueryButtons[8];

    x1 = pos1.left + (magicalNumber - 1) / 2;
    y1 = pos1.top;
    x2 = pos2.left + (magicalNumber - 1) / 2;
    y2 = pos2.top + magicalNumber;

  }

  /*
  
  to get the center coordinates of the button use this formula:

  centerX = $("#b1").position().left + width / 2;
  centerY = $("#b1").position().left + height / 2;

  note: in css i used 100px for width and height
  
  */

  var line_element = `
  <svg id="lineSvg">
    <line id="line1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
      <animate id="anim1" attributeName="x2" from="${x1}" to="${x2}" begin="1s" dur="2s" repeatCount="1" restart="whenNotActive" /> 
      <animate id="anim2" attributeName="y2" from="${y1}" to="${y2}" begin="1s" dur="2s" repeatCount="1" restart="whenNotActive" /> 
    </line>
  </svg>
`;

  var gridLineContainer = document.getElementById("grid-line-container");

  gridLineContainer.innerHTML += line_element;

  startLineAnimation();

}

// Function that starts line animation
// Função responsável por iniciar a animação da linha
function startLineAnimation() {
  var anim1 = document.getElementById("anim1");
  var anim2 = document.getElementById("anim2");
  anim1.beginElement();
  anim2.beginElement();
}

// Run when page gets full loaded
// Executa quando a página é totalmente carregada
window.onload = function () {
  initVariables();
};