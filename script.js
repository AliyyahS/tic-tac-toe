function Gameboard() {
    const board = []
    
    for (let i = 0; i < 9; i++) {
        board.push(Cell())
    }
    
    const getBoardValue = () => board.map(cell => cell.getValue())
    
    const acceptMarker = (cell, player) => {
        if (board[cell].getValue() === '0') {
            board[cell].placeMarker(player)
            return true
        } else return false
    }
    
    return { getBoardValue, acceptMarker }
};
  
function Cell() {
    let value = '0'
    
    const getValue = () => value
    
    const placeMarker = (playerMarker) => {
        value = playerMarker
    } 
    
    return { getValue, placeMarker }
};
  
function Player() {
    const players = [
        {
            name: "Player One",
            marker: "X"
        },
        {
            name: "Player Two",
            marker: "O"
        }
    ]
    
    let activePlayer = players[0]
    
    const getActivePlayer = () => activePlayer
    
    const switchPlayers = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }
    
    return { getActivePlayer, switchPlayers }
};
  
function GameController() {
    const board = Gameboard()
    const players = Player()
    const display = DisplayController()
    
    const printNewRound = () => {
        display.printMessage(`It's ${players.getActivePlayer().name}'s turn`)
        display.highlightActivePlayer(players.getActivePlayer().name)
    }
    
    const checkWin = () => {
        const boardValue = board.getBoardValue()
        const winSequences = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ]
  
        return winSequences.some(sequence => 
            boardValue[sequence[0]] !== '0' &&
            boardValue[sequence[0]] === boardValue[sequence[1]] &&
            boardValue[sequence[1]] === boardValue[sequence[2]]
        )
    }
  
    const checkDraw = () => {
        const boardValue = board.getBoardValue()
        return boardValue.every(cell => cell !== '0')
    }
    
    const handleCellClick = (e) => {
        playRound(e.target.getAttribute('data-index'))
    };
    
    const endGame = () => {
        display.disableCell();
        display.cells.forEach((cell) => {
            cell.removeEventListener('click', handleCellClick);
        });
    };
  
    const playRound = (cell) => {
        if (board.acceptMarker(cell, players.getActivePlayer().marker)) {
            display.updateCell(cell, players.getActivePlayer().marker)
        } else {
            printNewRound()
            return
        }
        
        if (checkWin()) {
            display.printMessage(`Game over! The winner is ${players.getActivePlayer().name}`)
            endGame()
            } else if (checkDraw()) {
            display.printMessage(`It's a draw!`)
            endGame()
        } else {
            players.switchPlayers()
            printNewRound()
      }
    }
    
    display.cells.forEach((cell) => {
        cell.addEventListener('click', handleCellClick)
    })
    
    display.resetCell()
    printNewRound()
};
  
function DisplayController() {
    const playerOne = document.querySelector('#playerOne')
    const playerTwo = document.querySelector('#playerTwo')
    const messageDiv = document.querySelector('.message')
    const cells = document.querySelectorAll('.cell')
    
    cells.forEach((cell, index) => {
        cell.classList.remove('disable')
        cell.setAttribute('data-value', '0')
        cell.setAttribute('data-index', index)
    })
    
    const highlightActivePlayer = (player) => {
        if(player === 'Player One') {
            playerOne.classList.add('active')
            playerTwo.classList.remove('active')
        } else {
            playerOne.classList.remove('active')
            playerTwo.classList.add('active')
        }
    }
    
    const printMessage = (message) => {
        messageDiv.textContent = message
    }
    
    const updateCell = (index, value) => {
        cells[index].setAttribute('data-value', value)
        cells[index].textContent = value
        cells[index].classList.add('disable')
    }
    
    const disableCell = () => {
        cells.forEach((cell) => {
            cell.classList.add('disable')
        })
    }
    
    const resetCell = () => {
        cells.forEach((cell) => {
            cell.textContent = ''
        })
    }
    
    return { cells, highlightActivePlayer, printMessage, updateCell, disableCell, resetCell }
};
  
(() => {
    const startBtn = document.querySelector('#startBtn')

    startBtn.addEventListener('click', () => {
        const game = GameController()
    })
})();