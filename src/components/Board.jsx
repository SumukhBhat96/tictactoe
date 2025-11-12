// src/components/Board.jsx
import React from 'react';
import { AVATARS } from './Avatars';

/*
 Props:
  - board: Array(9) of null | 'A' | 'B'
  - onPlay(index)
  - winningLine: array of indices or []
  - symbolMode: 'icons' | 'xo'
  - avatars: { A: 'Ghost', B: 'Skull' }
*/

export default function Board({
  board = Array(9).fill(null),
  onPlay = () => {},
  winningLine = [],
  symbolMode = 'icons',
  avatars = { A: 'Ghost', B: 'Skull' }
}) {
  function renderAvatar(player) {
    if (!player) return null;
    const name = player === 'A' ? avatars.A : avatars.B;
    const Comp = AVATARS[name] || null;
    if (!Comp) return null;
    return <Comp />;
  }

  return (
    <div className="board-container">
      <div className="board-grid" role="grid" aria-label="Tic Tac Toe board">
        {board.map((cell, i) => {
          const isWinning = Array.isArray(winningLine) && winningLine.includes(i);
          const cls = `cell ${isWinning ? 'win-pulse' : ''}`;

          return (
            <button
              key={i}
              className={cls}
              onClick={() => onPlay(i)}
              role="gridcell"
              aria-label={`Square ${i + 1}`}
              aria-pressed={!!cell}
              style={{ background: 'transparent', border: 'none', padding: 0 }}
            >
              {symbolMode === 'xo' ? (
                cell ? (
                  <span className={`xo ${cell === 'A' ? 'x' : 'o'}`} aria-hidden>
                    {cell === 'A' ? 'X' : 'O'}
                  </span>
                ) : null
              ) : (
                cell ? (
                  <div
                    className="avatar"
                    data-player={cell}
                    aria-hidden="true"
                    style={{ color: cell === 'A' ? 'var(--primary)' : 'var(--accent)' }}
                  >
                    {renderAvatar(cell)}
                  </div>
                ) : (
                  <div className="avatar empty" aria-hidden data-player="">
                    {/* empty placeholder */}
                  </div>
                )
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
