import React, { useEffect, useRef, useState } from 'react';
import Board from './Board';
import { checkWinner, bestMove } from '../utils';
import { createSFX } from '../sfx';

/*
  Full Game component (defaults: mode='cpu', symbolMode='icons')
  Handles: play, CPU, undo, restart, scores, popup with horror sound
*/

export default function Game({
  mode = 'cpu',
  symbolMode = 'icons',
  avatars = { A: 'Ghost', B: 'Skull' }
}) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [history, setHistory] = useState([]);
  const [xNext, setXNext] = useState(true); // A starts
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ttt-scores')) || { A: 0, B: 0, draws: 0 }; }
    catch { return { A: 0, B: 0, draws: 0 }; }
  });

  // result popup state
  const [showResult, setShowResult] = useState(false);
  const [resultWinner, setResultWinner] = useState(null);

  const sfx = useRef(null);
  const audioCtxRef = useRef(null);

  useEffect(() => { sfx.current = createSFX(); }, []);

  useEffect(() => {
    try { localStorage.setItem('ttt-scores', JSON.stringify(scores)); } catch {}
  }, [scores]);

  // detect result
  useEffect(() => {
    const res = checkWinner(board);
    if (res) {
      if (res.winner === 'draw') {
        setScores(s => ({ ...s, draws: s.draws + 1 }));
      } else {
        setScores(s => ({ ...s, [res.winner]: s[res.winner] + 1 }));
        setWinningLine(res.line);
      }
      setResultWinner(res.winner);
      setShowResult(true);
      playHorrorSound();
      if (sfx.current) {
        if (res.winner === 'draw') sfx.current.place();
        else sfx.current.win();
      }
    }
  }, [board]);

  // CPU turn
  useEffect(() => {
    if (mode !== 'cpu') return;
    const res = checkWinner(board); if (res) return;
    const cpuTurn = !xNext; // CPU = B
    if (cpuTurn) {
      const idx = bestMove(board.slice(), 'B', 'A');
      if (idx !== null && idx !== undefined) {
        const t = setTimeout(() => playMove(idx), 420);
        return () => clearTimeout(t);
      }
    }
  }, [board, xNext, mode]);

  function playMove(i) {
    if (board[i]) return;
    if (checkWinner(board)) return;
    const mark = xNext ? 'A' : 'B';
    const nb = board.slice();
    nb[i] = mark;
    setHistory(h => [...h, board.slice()]);
    setBoard(nb);
    setXNext(!xNext);
    if (sfx.current) sfx.current.place();
  }

  function undo() {
    setHistory(h => {
      if (!h.length) return h;
      const prev = h[h.length - 1];
      setBoard(prev);
      setXNext(prev.filter(Boolean).length % 2 === 0);
      return h.slice(0, -1);
    });
  }

  function restart() {
    setBoard(Array(9).fill(null));
    setHistory([]);
    setWinningLine([]);
    setXNext(true);
    setShowResult(false);
    setResultWinner(null);
  }

  function resetScores() {
    setScores({ A: 0, B: 0, draws: 0 });
    try { localStorage.removeItem('ttt-scores'); } catch {}
  }

  function closeResult() {
    setShowResult(false);
    // keep board as is so user can inspect result; restart if user chooses New Match
  }

  // small horror sound using WebAudio (works after user gesture usually)
  function playHorrorSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;

      // low rumble oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 50;
      gain.gain.value = 0.0001;
      osc.connect(gain); gain.connect(ctx.destination);
      gain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.12);
      osc.start();
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.85);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);
      osc.stop(ctx.currentTime + 2.2);

      // short noise impact
      const bufferSize = ctx.sampleRate * 0.25;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.8);
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.0;
      noise.connect(noiseGain); noiseGain.connect(ctx.destination);
      noiseGain.gain.setValueAtTime(0.0, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      noise.start(ctx.currentTime);
      noise.stop(ctx.currentTime + 0.9);

      // quick screech
      const screech = ctx.createOscillator();
      screech.type = 'sawtooth';
      screech.frequency.value = 700;
      const screechGain = ctx.createGain();
      screechGain.gain.value = 0.0001;
      screech.connect(screechGain);
      screechGain.connect(ctx.destination);
      screechGain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.02);
      screech.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.16);
      screechGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      screech.start(ctx.currentTime + 0.02);
      screech.stop(ctx.currentTime + 0.58);

    } catch (e) {
      // fallback to sfx if audio context not allowed
      if (sfx.current && sfx.current.win) sfx.current.win();
    }
  }

  const result = checkWinner(board);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%' }}>
        <Board
          board={board}
          onPlay={playMove}
          winningLine={winningLine}
          symbolMode={symbolMode}
          avatars={avatars}
        />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2 status-row">
        <div className="status-left">
          {result ? (
            result.winner === 'draw' ? (
              <div style={{ color: '#ffd54d', fontWeight: 800 }}>It's a draw!</div>
            ) : (
              <div style={{ color: '#ffd54d', fontWeight: 800 }}>Player {result.winner} wins!</div>
            )
          ) : (
            <div style={{ color: 'var(--text)', fontWeight: 700 }}>Turn: Player {xNext ? 'A' : 'B'}</div>
          )}
        </div>

        <div className="controls">
          <button className="btn btn-sm btn-outline-secondary" onClick={undo} disabled={history.length === 0}>Undo</button>
          <button className="btn btn-sm btn-outline-primary" onClick={restart}>Restart</button>
        </div>
      </div>

      <div className="row text-center mt-3 scoreboard" style={{ margin: 0 }}>
        <div className="col-4 score-col player-a">
          <div className="label">Player A</div>
          <div className="value">{scores.A}</div>
        </div>
        <div className="col-4 score-col draws">
          <div className="label">Draws</div>
          <div className="value">{scores.draws}</div>
        </div>
        <div className="col-4 score-col player-b">
          <div className="label">Player B</div>
          <div className="value">{scores.B}</div>
        </div>
      </div>

      <div className="reset-wrap">
        <div style={{ flex: 1 }} />
        <div>
          <button className="btn btn-outline-danger" onClick={resetScores}>Reset Scores</button>
        </div>
      </div>

      {/* Result popup overlay (new formatted JSX) */}
      {showResult && (
        <div className="result-overlay" role="dialog" aria-modal="true">
          <div className="result-backdrop" onClick={closeResult}></div>

          <div className="result-card" role="document" aria-live="assertive">
            <div className="result-icon" aria-hidden>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 2C9.8 2 8 3.8 8 6v1H6c-1.1 0-2 .9-2 2v7.5C4 18.9 5.1 20 6.5 20H7c.5 0 .9-.2 1.2-.5.3-.3.7-.5 1.3-.5s1 .2 1.3.5c.3.3.7.5 1.2.5s.9-.2 1.2-.5c.3-.3.7-.5 1.3-.5s1 .2 1.3.5c.3.3.7.5 1.2.5h.5c1.4 0 2.5-1.1 2.5-2.5V9c0-1.1-.9-2-2-2h-2V6c0-2.2-1.8-4-4-4z" fill="currentColor"/>
              </svg>
            </div>

            <h2>{resultWinner === 'draw' ? "It's a draw!" : `Player ${resultWinner} wins!`}</h2>
            <p>{resultWinner === 'draw' ? 'No one wins the night…' : 'A chilling victory — well played.'}</p>

            <div className="result-actions">
              <button className="btn btn-secondary" onClick={closeResult}>Close</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  restart();
                  closeResult();
                }}
              >
                New Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
