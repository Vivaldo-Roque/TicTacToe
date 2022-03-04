var boxsID = [
	[, ,],
	[, ,],
	[, ,]
];
var X = "X";
var O = "O";
var EMPTY = "";

var board = initial_state();
var move = Array();
var turn = "";
var won = "";

function initial_state() {

	//Returns starting state of the board.

	return [[EMPTY, EMPTY, EMPTY],
	[EMPTY, EMPTY, EMPTY],
	[EMPTY, EMPTY, EMPTY]];
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

	x_player = 0;
	o_player = 0;

	// Check if board is starting state
	if (JSON.stringify(board) === JSON.stringify(initial_state())) {
		return X;
	}

	for (var a = 0; a < board.length; a++) {
		x_player = x_player + board[a].filter(item => item === X).length;
		o_player = o_player + board[a].filter(item => item === O).length;
	}

	if (((x_player + o_player) % 2) === 0) {
		return X;
	}
	else {
		return O;
	}


}

function winner(board) {
	// Checking Vertically and Horizontally
	var moves = [X, O];

	for (var i = 0; i < moves.length; i++) {

		for (var x = 0; x < 3; x++) {
			if ((board[i][0] === moves[i]) && (moves[i] === board[i][1]) && (board[i][2] === moves[i])) {
				return moves[i];
			}

			if ((board[0][i] === moves[i]) && (board[1][i] === moves[i]) && (board[2][i] === moves[i])) {
				return moves[i];
			}

		}
		// Checking on Cross
		if ((board[0][0] === moves[i]) && (board[1][1] === moves[i]) && (board[2][2] === moves[i])) {
			return moves[i];
		}

		if ((board[0][2] === moves[i]) && (board[1][1] === moves[i]) && (board[2][0] === moves[i])) {
			return moves[i];
		}
	}
	return "";
}

function terminal(board) {
	//Returns true if game is over, False otherwise.

	if (winner(board) !== EMPTY || (!board.some(row => row === EMPTY) && winner(board) !== EMPTY)) {
		return true;
	}
	else {
		return false;
	}
}

function utility(board) {

	//Returns 1 if X has won the game, -1 if O has won, 0 otherwise.

	var res = winner(board);

	if (res === X) {
		return 1;
	}
	else if (res === O) {
		return -1;
	}
	else {
		return 0
	}
}

function result(board, action) {

	//Returns the board that results from making move (i, j) on the board.

	var res = actions(board);

	if (!res.some(element => JSON.stringify(element) === JSON.stringify(action))) {
		return;
	}

	copy_board = JSON.parse(JSON.stringify(board));

	copy_board[action[0]][action[1]] = player(board);

	return copy_board;
}

function minValueAction(board, alpha, beta) {

	var value = Infinity;
	var action = actions(board);

	if (terminal(board) === true) {
		return [utility(board), null];
	}
	
	for(var i = 0; i < action.length; i++){
		[val, temp] = maxValueAction(result(board, action[i]), alpha, beta);
		next_value = Math.min(value, val);

		if (next_value < value) {
			value = next_value;
			best_action = action[i];
		}

		beta = Math.min(beta, value);
		if (alpha >= beta) {
			 break;
			}
	}
	
	return [value, best_action];
}

function maxValueAction(board, alpha, beta){

	var value = -Infinity;
	var action = actions(board);

	 if (terminal(board) === true){
        return [utility(board), null];
	 }

    for(var i = 0; i < action.length; i++){
        [val, temp] = minValueAction(result(board, action[i]), alpha, beta);
        next_value = Math.max(value, val);

        if (next_value > value){
            value = next_value;
            best_action = action[i];
		}

        alpha = Math.max(alpha, value);
        if (alpha >= beta){
            break;
		}
	}
    return [value, best_action];
}

function minimax(board){
    //Returns the optimal action for the current player on the board.
    var alpha = -Infinity;
    var beta = Infinity;

    if (terminal(board) === true){
        return;
	}
    else{
		if (player(board) === X){
            [temp, best_action] = maxValueAction(board, alpha, beta);
		}
        else{
            [temp, best_action] = minValueAction(board, alpha, beta);
		}
	}
    return best_action;
}

function initVariables() {
	boxsID[0][0] = document.getElementById("b1");
	boxsID[0][1] = document.getElementById("b2");
	boxsID[0][2] = document.getElementById("b3");
	boxsID[1][0] = document.getElementById("b4");
	boxsID[1][1] = document.getElementById("b5");
	boxsID[1][2] = document.getElementById("b6");
	boxsID[2][0] = document.getElementById("b7");
	boxsID[2][1] = document.getElementById("b8");
	boxsID[2][2] = document.getElementById("b9");
	turn = player(board);
}

// Function to reset game
function restart() {
	location.reload();
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			boxsID[i][j].value = "";
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

function updateButtonTexts() {
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			boxsID[i][j].value = board[i][j];
		}
	}
}

// Function called whenever user tab on any box
function game() {

	// Setting DOM to all boxes or input field
	board = [
		[boxsID[0][0].value, boxsID[0][1].value, boxsID[0][2].value],
		[boxsID[1][0].value, boxsID[1][1].value, boxsID[1][2].value],
		[boxsID[2][0].value, boxsID[2][1].value, boxsID[2][2].value]
	];

	if (terminal(board)) {
		won = winner(board);
		document.getElementById('print').innerHTML = "Player " + won + " Won";
		disableAllButtons();
	} else {
		turn = player(board);
		move = minimax(board);
		board = result(board, move);
		console.table(move);

		if (turn === X) {
			boxsID[move[0]][move[1]].style.color = "red";
			boxsID[move[0]][move[1]].disabled = true;
		} else if (turn === O) {
			boxsID[move[0]][move[1]].style.color = "blue";
			boxsID[move[0]][move[1]].disabled = true;
		}

		
		document.getElementById('print').innerHTML = "Player " + turn + " Turn";
	}
	turn = player(board);
	updateButtonTexts();
}

function button1() {

	if (turn === X) {
		boxsID[0][0].style.color = "red";
	}
	else
		if (turn === O) {
			boxsID[0][0].style.color = "blue";
		}

	boxsID[0][0].value = turn;
	boxsID[0][0].disabled = true;
	game();
}

function button2() {

	if (turn === X) {
		boxsID[0][1].style.color = "red";
	}
	else
		if (turn === O) {
			boxsID[0][1].style.color = "blue";
		}

	boxsID[0][1].value = turn;
	boxsID[0][1].disabled = true;
	game();
}

function button3() {

	if (turn === X) {
		boxsID[0][2].style.color = "red";
	}
	else
		if (turn === O) {
			boxsID[0][2].style.color = "blue";
		}

	boxsID[0][2].value = turn;
	boxsID[0][2].disabled = true;
	game();
}

function button4() {

	if (turn === X) {
		boxsID[1][0].style.color = "red";
	}
	else
		if (turn === O) {
			boxsID[1][0].style.color = "blue";
		}

	boxsID[1][0].value = turn;
	boxsID[1][0].disabled = true;
	game();
}

function button5() {

	if (turn === X) {
		boxsID[1][1].style.color = "red";
	}
	else
		if (turn === O) {
			boxsID[1][1].style.color = "blue";
		}

	boxsID[1][1].value = turn;
	boxsID[1][1].disabled = true;
	game();
}

function button6() {

	if (turn === X) {
		boxsID[1][2].style.color = "red";
	}
	else
		if (turn === O) {
			boxsID[1][2].style.color = "blue";
		}

	boxsID[1][2].value = turn;
	boxsID[1][2].disabled = true;
	game();
}

function button7() {

	if (turn === X) {
		boxsID[2][0].style.color = "red";
	}
	else
		if (turn === O) {
			boxsID[2][0].style.color = "blue";
		}

	boxsID[2][0].value = turn;
	boxsID[2][0].disabled = true;
	game();
}

function button8() {

	if (turn === X) {
		boxsID[2][1].style.color = "red";
	}
	else
		if (turn === O) {
			boxsID[2][1].style.color = "blue";
		}

	boxsID[2][1].value = turn;
	boxsID[2][1].disabled = true;
	game();
}

function button9() {

	if (turn === X) {
		boxsID[2][2].style.color = "red";
	}
	else
		if (turn === O) {
			boxsID[2][2].style.color = "blue";
		}

	boxsID[2][2].value = turn;
	boxsID[2][2].disabled = true;
	game();
}
