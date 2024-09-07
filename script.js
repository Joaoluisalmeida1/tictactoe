function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeToken = (row, column, player) => {
        if (board[row][column].getValue() !== 0) return false;

        board[row][column].addToken(player);
        return true;
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return { getBoard, placeToken, printBoard};
};

function Cell() {
    let value = 0;
    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function GameController(
    displayMessage,
    resetButton
) {
    const board = Gameboard();

    const players = [
        {
            name: "Player One",
            token: 'X'
        },
        {
            name: "Player Two",
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        displayMessage(`${getActivePlayer().name}'s turn to play.`);
    };

    const checkWinner = (row, column) => {
        const currentBoard = board.getBoard();
        const playerToken = currentBoard[row][column].getValue();
        const rowWin = currentBoard[row].every(cell => cell.getValue() === playerToken);
        const columnWin = currentBoard.every(row => row[column].getValue() === playerToken);
        const topLeftBottomRightWin = row === column && currentBoard.every((row, index) => currentBoard[index][index].getValue() === playerToken);
        const topRightBottomLeftWin = row + column === currentBoard.length - 1 && currentBoard.every((row, index) => currentBoard[index][currentBoard.length - 1 - index].getValue() === playerToken);

        if (rowWin || columnWin || topLeftBottomRightWin || topRightBottomLeftWin) {
            return playerToken;
        }

        return null;
    };

    const playRound = (row, column) => {
        const activePlayer = getActivePlayer();
        displayMessage(`Placing ${getActivePlayer().name}'s token into row ${row}, column ${column}.`);
        
        const tokenPlaced = board.placeToken(row, column, getActivePlayer().token);
        
        if (!tokenPlaced) {
            displayMessage("Cell already filled, try again.");
            return;
        }

        const winner = checkWinner(row, column);

        if (winner !== null) {
            displayMessage(`${getActivePlayer().name} wins!`);
            resetButton.style.display = "block";
            return;
        }
        
        const isBoardFull = board.getBoard().every(row => row.every(cell => cell.getValue() !== 0));

        if (isBoardFull) {
            displayMessage("Game is over. It's a draw!");
            resetButton.style.display = "block";
            return;
        };

        switchPlayerTurn();
        printNewRound();
    };
    
    

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };  
};

function ScreenController() {
    const boardDiv = document.querySelector('.board');
    const messagesDiv = document.querySelector('.messages');
    const resetButton = document.querySelector('.reset');

    const displayMessage = (message) => {
        messagesDiv.textContent = message;
    }


    const resetGame = () => {
        boardDiv.textContent = "";
        messagesDiv.textContent = "";
        resetButton.style.display = "none";
        ScreenController();
    };

    const game = GameController(displayMessage, resetButton);


    const updateScreen = () => {

        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue() === 0 ? "": cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedColumn = parseInt(e.target.dataset.column);
        const selectedRow = parseInt(e.target.dataset.row);

        if (isNaN(selectedColumn) || isNaN(selectedRow)) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
        };

    resetButton.addEventListener("click", resetGame);
    boardDiv.addEventListener("click", clickHandlerBoard);
    
    
    updateScreen();
};

ScreenController();