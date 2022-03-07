var boxsID = [
	[, ,],
	[, ,],
	[, ,]
];
var X = "X";
var O = "O";
var EMPTY = "";
var msg;
var board = initial_state();
var move = Array();
var won = "";
var ai_turn = true;
var game_mode_cpu = true; 
var start_x_o = true;
var user  = "";

//#region AI functions

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

	var x_player = 0;
	var o_player = 0;
	
	// Check if board is starting state
	if (JSON.stringify(board) === JSON.stringify(initial_state())) {
		return X;
	}

	for (var a = 0; a < board.length; a++) {
		x_player = x_player + board[a].filter(item => item === X).length;
		o_player = o_player + board[a].filter(item => item === O).length;
	}

	if(o_player === 1 && x_player === 0){
		start_x_o = false;
	}

	if(start_x_o){
		if (((x_player + o_player) % 2) == 0) {
			return X;
		}
		else {
			return O;
		}
	}else{
		if (((x_player + o_player) % 2) == 0) {
			return O;
		}
		else {
			return X;
		}
	}
}

function winner(board) {
	// Checking Vertically and Horizontally
	var moves = [X, O];

	for (var i = 0; i < moves.length; i++) {

		for (var x = 0; x < 3; x++) {
			if ((board[x][0] === moves[i]) && (moves[i] === board[x][1]) && (board[x][2] === moves[i])) {
				return moves[i];
			}

			if ((board[0][x] === moves[i]) && (board[1][x] === moves[i]) && (board[2][x] === moves[i])) {
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
	return null;
}

function terminal(board) {
	//Returns true if game is over, False otherwise.

	if (winner(board) !== null || (!board.some(row => row.some(subRow => subRow === EMPTY)) && winner(board) === null)) {
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
	}
	else {
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
	let bestVal;
	let bestMove = new Array();
	var alpha = -Infinity;
	var beta = Infinity;

	if(user === O)
		{
			bestVal = -Infinity;
		}else{
			bestVal = Infinity;
		}

	for (var action of actions(board)) {

		let moveVal = minimax(result(board, action), alpha, beta);

		if(user === O)
		{
			if (moveVal > bestVal) {
				bestMove = action;
				bestVal = moveVal;
			}

		}else{
			if (moveVal < bestVal) {
				bestMove = action;
				bestVal = moveVal;
			}
		}
	}

	return bestMove;
}

//#endregion

function popup(AI){
	const myPopUp = document.getElementsByClassName("popup_box")[0];
	const myBtn1 = document.getElementsByClassName("btn1")[0];
	const myBtn2 = document.getElementsByClassName("btn2")[0];
	myPopUp.style.display = "block";
	if(AI){
		myBtn1.addEventListener("click", function(){
			const myPopUp = document.getElementsByClassName("popup_box")[0];
			myPopUp.style.display = "none";
			enableAllButtons();
			msg.innerHTML = "Player " + player(board) + " Turn";
			user = X;
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 3; j++) {
					boxsID[i][j].value = "";
				}
			}
			game_mode_cpu = true;
			copyButtonTextsToBoard();
		});
		myBtn2.addEventListener("click", function(){
			const myPopUp = document.getElementsByClassName("popup_box")[0];
			myPopUp.style.display = "none";
			enableAllButtons();
			msg.innerHTML = "Player " + player(board) + " Turn";
			user = O;
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 3; j++) {
					boxsID[i][j].value = "";
				}
			}
			game_mode_cpu = AI;
			copyButtonTextsToBoard();
			if (ai_turn && game_mode_cpu) {
				move = findBestMove(board);
				if (player(board) === X) {
					boxsID[move[0]][move[1]].style.color = "red";
					boxsID[move[0]][move[1]].disabled = true;
				} else {
					boxsID[move[0]][move[1]].style.color = "blue";
					boxsID[move[0]][move[1]].disabled = true;
				}
				board = result(board, move);
				updateButtonTexts();
				ai_turn = false;
			}
		});
	}else{
		myBtn1.addEventListener("click", function(){
			const myPopUp = document.getElementsByClassName("popup_box")[0];
			myPopUp.style.display = "none";
			enableAllButtons();
			msg.innerHTML = "Player " + X + " Turn";
			user = X;
			game_mode_cpu = false;
		});
		myBtn2.addEventListener("click", function(){
			const myPopUp = document.getElementsByClassName("popup_box")[0];
			myPopUp.style.display = "none";
			enableAllButtons();
			msg.innerHTML = "Player " + O + " Turn";
			user = O;
			game_mode_cpu = false;
		});
	}
}

function oneVsOne(){
	popup(false);
}

function oneVsCpu(){
	popup(true);
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
	msg = document.getElementById('print');
	disableAllButtons();
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

function enableAllButtons(){
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
		[boxsID[2][0].value, boxsID[2][1].value, boxsID[2][2].value]
	];
}

// Function called whenever user tab on any box
function game() {

	copyButtonTextsToBoard();

	ai_turn = true;

	if (terminal(board)) {
		won = winner(board);
		msg.innerHTML = "Player " + won + " Won";
		if (won === null) {
			msg.innerHTML = "Tie";
		}
		disableAllButtons();
		return;
	} else {
		if (ai_turn && game_mode_cpu) {
			move = findBestMove(board);

			if (player(board) === X) {
				boxsID[move[0]][move[1]].style.color = "red";
				boxsID[move[0]][move[1]].disabled = true;
			} else {
				boxsID[move[0]][move[1]].style.color = "blue";
				boxsID[move[0]][move[1]].disabled = true;
			}

			board = result(board, move);
			ai_turn = false;

			updateButtonTexts();

			if (terminal(board)) {
				won = winner(board);
				msg.innerHTML = "Player " + won + " Won";
				if (won === null) {
					msg.innerHTML = "Tie";
				}
				disableAllButtons();
				return;
			}
		}
	}

	updateButtonTexts();
	if(!game_mode_cpu){
		user = player(board);
	}
	msg.innerHTML = "Player " + player(board) + " Turn";

	if (terminal(board)) {
		won = winner(board);
		msg.innerHTML = "Player " + won + " Won";
		if (won === null) {
			msg.innerHTML = "Tie";
		}
		disableAllButtons();
		return;
	}
}

function button1() {

	if (user === X) {
		boxsID[0][0].style.color = "red";
	}
	else {
		boxsID[0][0].style.color = "blue";
	}

	boxsID[0][0].value = user;
	boxsID[0][0].disabled = true;
	game();
}

function button2() {

	if (user === X) {
		boxsID[0][1].style.color = "red";
	}
	else {
		boxsID[0][1].style.color = "blue";
	}

	boxsID[0][1].value = user;
	boxsID[0][1].disabled = true;
	game();
}

function button3() {

	if (user === X) {
		boxsID[0][2].style.color = "red";
	}
	else {
		boxsID[0][2].style.color = "blue";
	}

	boxsID[0][2].value = user;
	boxsID[0][2].disabled = true;
	game();
}

function button4() {

	if (user === X) {
		boxsID[1][0].style.color = "red";
	}
	else {
		boxsID[1][0].style.color = "blue";
	}

	boxsID[1][0].value = user;
	boxsID[1][0].disabled = true;
	game();
}

function button5() {

	if (user === X) {
		boxsID[1][1].style.color = "red";
	}
	else {
		boxsID[1][1].style.color = "blue";
	}

	boxsID[1][1].value = user;
	boxsID[1][1].disabled = true;
	game();
}

function button6() {

	if (user === X) {
		boxsID[1][2].style.color = "red";
	}
	else {
		boxsID[1][2].style.color = "blue";
	}

	boxsID[1][2].value = user;
	boxsID[1][2].disabled = true;
	game();
}

function button7() {

	if (user === X) {
		boxsID[2][0].style.color = "red";
	}
	else {
		boxsID[2][0].style.color = "blue";
	}

	boxsID[2][0].value = user;
	boxsID[2][0].disabled = true;
	game();
}

function button8() {

	if (user === X) {
		boxsID[2][1].style.color = "red";
	}
	else {
		boxsID[2][1].style.color = "blue";
	}

	boxsID[2][1].value = user;
	boxsID[2][1].disabled = true;
	game();
}

function button9() {

	if (user === X) {
		boxsID[2][2].style.color = "red";
	}
	else {
		boxsID[2][2].style.color = "blue";
	}

	boxsID[2][2].value = user;
	boxsID[2][2].disabled = true;
	game();
}
