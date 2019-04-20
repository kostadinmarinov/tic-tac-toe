import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let title = props.square.value;

    if (props.square.isHighlighted) {
        title = <mark>{title}</mark>;
    }

    return (
        <button
            className="square"
            onClick={props.onClick}>
            {title}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            key={i}
            square={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} />;
    }

    render() {
        const board = Array.from({length: 3}, (x, i) => {
            const row = Array.from({length: 3}, (x, j) => this.renderSquare(i * 3 + j));

            return (
                <div key={i} className="board-row">
                    {row}
                </div>
            );
        });

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [
                {
                    squares: Array(9).fill({
                        value: null,
                        isHighlighted: false
                    }),
                    selectedIndex: null,
                    winner: null,
                }
            ],
            step: 0,
            isHistoryAsc: true,
        }
    }

    get currentPlayer() {
        return this.state.step % 2 === 0 ? 'X' : 'O';
    }

    get currentBoard() {
        return this.state.history[this.state.step];
    }

    handleClick(i) {
        const board = this.currentBoard;

        if (board.squares[i].value || board.winner) {
            return;
        }

        const currentPlayer = this.currentPlayer;

        const newSquares = board.squares.slice();
        newSquares[i] = {...newSquares[i], value: currentPlayer};
        // newSquares[i].value = currentPlayer;

        const winnerLine = calculateWinner(newSquares.map(x => x.value));

        if (winnerLine) {
            winnerLine.forEach(x => {
                newSquares[x] = {...newSquares[x], isHighlighted: true}
                // newSquares[i].isHighlighted = true;
            });
        }

        this.setState({
            history: [
                ...this.state.history.slice(0, this.state.step + 1),
                {
                    squares: newSquares,
                    selectedIndex: i,
                    winner: winnerLine ? currentPlayer : null,
                }],
            step: this.state.step + 1,
        })
    }

    jumpTo(i) {
        this.setState({step: i});
    }

    sortHistory() {
        this.setState({isHistoryAsc: !this.state.isHistoryAsc})
    }

    render() {
        const board = this.currentBoard;
        const status = board.winner ? `Winner is: ${board.winner}` : this.state.step === 9 ? 'The result is a draw.' : `Next player is: ${this.currentPlayer}`;
        const sortMovesTitle = `Sort moves in ${this.state.isHistoryAsc ? 'DESC' : 'ASC'} order`

        const movesSortCoef = this.state.isHistoryAsc ? 1 : -1;
        
        const moves = this.state.history
            .map((x, i) => {
                let title = i ? `Go to move (${Math.floor(x.selectedIndex / 3) + 1}, ${(x.selectedIndex % 3) + 1})` : `Go to game start`;

                if (i === this.state.step)
                {
                    title = (<b>{title}</b>);
                }

                return (
                    <li key={i}>
                        <button onClick={() => this.jumpTo(i)}>{title}</button>
                    </li>
                );
            })
            .sort((x, y) => (x.key - y.key) * movesSortCoef);
        
        // if (!this.state.isHistoryAsc) {
        //     moves = moves.reverse();
        // }

        const movesList = this.state.isHistoryAsc ? <ol>{moves}</ol> : <ol reversed>{moves}</ol>
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={board.squares}
                        onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>&nbsp;</div>
                    <div>
                        <button onClick={() => this.sortHistory()}>{sortMovesTitle}</button>
                    </div>
                    {movesList}
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return lines[i];
      }
    }
    return null;
  }