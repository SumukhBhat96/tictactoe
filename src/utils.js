export const LINES = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

export function checkWinner(board) {
  for (const [a,b,c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a,b,c] };
    }
  }
  if (board.every(Boolean)) return { winner: 'draw' };
  return null;
}

// minimax CPU - cpuMark (e.g. 'B'), humanMark (e.g. 'A')
export function bestMove(board, cpuMark, humanMark) {
  if (checkWinner(board)) return null;

  function minimax(newBoard, player) {
    const res = checkWinner(newBoard);
    if (res) {
      if (res.winner === 'draw') return { score: 0 };
      return { score: res.winner === cpuMark ? 10 : -10 };
    }

    const moves = [];
    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = player;
        const next = minimax(newBoard, player === cpuMark ? humanMark : cpuMark);
        moves.push({ index: i, score: next.score });
        newBoard[i] = null;
      }
    }

    if (player === cpuMark) {
      let best = moves[0];
      for (const m of moves) if (m.score > best.score) best = m;
      return best;
    } else {
      let best = moves[0];
      for (const m of moves) if (m.score < best.score) best = m;
      return best;
    }
  }

  const move = minimax(board.slice(), cpuMark);
  return move ? move.index : null;
}
