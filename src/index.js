import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const classNames = [
        'square',
        (props.isWinner) ? 'highlight' : '',
    ].join(' ');

    return (
        <button
            className={classNames}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, isWinner) {
        return (
            <Square key={i}
                    value={this.props.squares[i]}
                    isWinner={isWinner}
                    onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                {
                    [...Array(3)].map((x, row) => {
                        return (
                            <div className="board-row" key={row}>
                                {
                                    [...Array(3)].map((x, col) => {
                                        const index = row * 3 + col;
                                        return this.renderSquare(index, this.props.winners && this.props.winners.includes(index));
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                lastMovePos: {
                    row: null,
                    col: null,
                },
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const lastMovePos = {
            row: Math.floor(i / 3) + 1,
            col: (i % 3) + 1
        };
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMovePos: lastMovePos,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const history = this.state.history;
        const currentStep = this.state.stepNumber;
        const current = history[currentStep];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const lastMove = step.lastMovePos;
            const desc = move ?
                `Go to move #${move}(${lastMove.row}, ${lastMove.col})` :
                'Go to game start';

            const classNames = [
                (move === currentStep) ? 'thick' : '',
                // (winner && winner.includes(move)) ? 'highlight' : '',
            ].join(' ');

            return (
                <li key={move}>
                    <button
                        className={classNames}
                        onClick={() => this.jumpTo(move)}>{desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winners={winner}
                        onClick={(i) => this.handleClick(i)}
                    />
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
    <Game/>,
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
            return [a, b, c];
        }
    }

    return false;
}