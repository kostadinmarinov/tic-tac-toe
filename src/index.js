import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [
                Array(9).fill(null)
            ],
            step: 0
        }
    }

    get currentPlayer() {
        return this.state.step % 2 === 0 ? 'X' : 'O';
    }

    get currentSquares() {
        return this.state.history[this.state.step];
    }

    handleClick(i) {
        const squares = this.currentSquares;

        if (squares[i] || calculateWinner(squares)) {
            return;
        }

        const newSquares = squares.slice();
        newSquares[i] = this.currentPlayer;

        this.setState({
            history: [...this.state.history.slice(0, this.state.step + 1), newSquares],
            step: this.state.step + 1
        })
    }

    jumpTo(i) {
        this.setState({step: i});
    }

    render() {
        const squares = this.currentSquares;
        const winner = calculateWinner(squares);
        const status = winner ? `Winner is: ${winner}` : `Next player is: ${this.currentPlayer}`;

        const moves = this.state.history.map((x, i) => (
            <li key={i}>
                <button onClick={() => this.jumpTo(i)}>{i ? `Go to move #${i}` : `Go to game start`}</button>
            </li>
        ));
        
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={squares}
                        onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
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
        return squares[a];
      }
    }
    return null;
  }