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
        const board = Array.from({length: this.props.size}, (_x, i) => {
            const row = Array.from({length: this.props.size}, (_x, j) => this.renderSquare(i * this.props.size + j));

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
            ...this.newGame(3),
            isHistoryAsc: true,
        };
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

        const winnerLine = calculateWinnerLine(newSquares.map(x => x.value), this.state.size);

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

    newGame(size) {
        return {
            size: size,
            history: [
                {
                    squares: Array(size * size).fill({
                        value: null,
                        isHighlighted: false
                    }),
                    selectedIndex: null,
                    winner: null,
                }
            ],
            step: 0,
        };
    }

    restart(size) {
        this.setState(this.newGame(size));
    }

    jumpTo(i) {
        this.setState({step: i});
    }

    sortHistory() {
        this.setState({isHistoryAsc: !this.state.isHistoryAsc})
    }

    render() {
        const board = this.currentBoard;
        const status = board.winner ? `Winner is: ${board.winner}` : this.state.step === this.state.size * this.state.size ? 'The result is a draw.' : `Next player is: ${this.currentPlayer}`;
        const sortMovesTitle = `Sort moves in ${this.state.isHistoryAsc ? 'DESC' : 'ASC'} order`

        const movesSortCoef = this.state.isHistoryAsc ? 1 : -1;
        
        const moves = this.state.history
            .map((x, i) => {
                let title = i ? `Go to move (${Math.floor(x.selectedIndex / this.state.size) + 1}, ${(x.selectedIndex % this.state.size) + 1})` : `Go to game start`;

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

        const movesList = this.state.isHistoryAsc ? <ol>{moves}</ol> : <ol reversed>{moves}</ol>;

        const sizes = Array.from({length: 20 - 2}, (x, i) => i + 3).map(x => <option key={x} value={x}>Size {x}</option>);
        
        return (
            <>
                <div className="game-info">
                    <select value={this.state.size} onChange={(e) => this.restart(Number.parseInt(e.target.value))}>
                        {sizes}
                    </select>
                </div>
                <div>
                    &nbsp;
                </div>
                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={board.squares}
                            size={this.state.size}
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
            </>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinnerLine(squares, size) {
    const lines =
    [
        ...[...Array(size).keys()].reduce(
            (acc, _x, i) =>
                [
                    ...acc,
                    Array.from({length: size}, (_y, j) => size * i + j),         // by i-th row
                    Array.from({length: size}, (_y, j) => i + size * j),         // by i-th column
                ],
            []),
        Array.from({length: size}, (_y, i) => size * i + i),                     // by left-to-right diagonal
        Array.from({length: size}, (_y, i) => size * i  + (size - 1 - i)),       // by right-to-left diagonal
    ];

    return lines.find(l => l.map(i => squares[i]).reduce((acc, x) => acc === x ? acc : null));
  }