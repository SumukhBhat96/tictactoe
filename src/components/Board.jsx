// src/components/Board.jsx
import React from 'react';
import Cell from './Cell';
import { AVATARS } from './Avatars';

/*
  Board supports:
    - board: array of 9 ('A'|'B'|null)
    - onPlay(index)
    - winningLine: array
    - symbolMode: 'xo' | 'icons'
    - avatars: { A: 'Rocket', B: 'Planet' }
*/
export default function Board({
  board,
  onPlay,
  winningLine = [],
  symbolMode = 'xo',
  avatars = { A: 'Rocket', B: 'Planet' }
}) {
  return (
    <div className="board-grid" role="grid" aria-label="tic tac toe board">
      {board.map((v, i) => {
        const isWin = Array.isArray(winningLine) && winningLine.includes(i);

        // content will be the actual element rendered inside cell
        let content = null;

        if (v === 'A') {
          if (symbolMode === 'xo') {
            content = <span className="xo x" aria-hidden>X</span>;
          } else {
            const Avatar = AVATARS[avatars.A] || AVATARS.Rocket;
            // NOTE: we add data-player so CSS can color SVG via `color`
            content = (
              <div className="avatar" data-player="A" aria-hidden>
                <Avatar size={84} />
              </div>
            );
          }
        } else if (v === 'B') {
          if (symbolMode === 'xo') {
            content = <span className="xo o" aria-hidden>O</span>;
          } else {
            const Avatar = AVATARS[avatars.B] || AVATARS.Planet;
            content = (
              <div className="avatar" data-player="B" aria-hidden>
                <Avatar size={84} />
              </div>
            );
          }
        }

        return (
          <Cell
            key={i}
            value={content}
            onClick={() => onPlay(i)}
            isWinning={isWin}
          />
        );
      })}
    </div>
  );
}
