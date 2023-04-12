import { useState } from 'react';

function Square({ value, onSquareClick, isHighlight }) {
  let className = isHighlight ? "square highlight" : "square";
  return (
    <button className={className} onClick={onSquareClick}>{value}</button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const [winner, checkedSquares] = calculateWinner(squares);

  function handleClick(i) {
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares)
  }

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every((s) => s)) {
    status = "Draw."
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const board = Array.from(Array(3), (_, i) => (
    <div key={i} className="board-row">
      {
        Array.from(Array(3), (_, j) => {
          const k = i * 3 + j;
          return (
            <Square
              key={k}
              value={squares[k]}
              onSquareClick={() => handleClick(k)}
              isHighlight={checkedSquares[k]}
            />
          );
        })
      }
    </div>
  ));

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

function Order({ orderIsDesc, onChangeOrder }) {
  const order = orderIsDesc ? "descending" : "ascending";
  return (
    <div>
      order: <button onClick={onChangeOrder}>{order}</button>
    </div>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [moveOrderIsDesc, setMoveOrderIsDesc] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handlerChangeOrder() {
    setMoveOrderIsDesc(!moveOrderIsDesc);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const movePosition = squares.findIndex(
        (s1, i) => s1 && s1 != history[move - 1][i]
      );
      description = `Go to move #${move}: (${Math.floor(movePosition / 3) + 1}, ${movePosition % 3 + 1})`;
    } else {
      description = "Go to game start";
    }

    if (move == currentMove) {
      return (
        <li key={move}>{description}</li>
      )
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>
            {description}
          </button>
        </li>
      );
    }
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <Order orderIsDesc={moveOrderIsDesc} onChangeOrder={handlerChangeOrder} />
        <ol>{moveOrderIsDesc ? moves.reverse() : moves}</ol>
      </div>
    </div>
  );
}

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

  let winner = null;
  const checkedSquares = Array(9).fill(false);
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winner = squares[a];
      checkedSquares[a] = true;
      checkedSquares[b] = true;
      checkedSquares[c] = true;
    }
  }

  return [winner, checkedSquares];
}
