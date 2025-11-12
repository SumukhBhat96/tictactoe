import React, { useEffect, useState } from 'react';
import Game from './components/Game';
import { AVATARS } from './components/Avatars';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

export default function App() {
  // theme: default to dark
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('ttt-theme') || 'dark'; } catch { return 'dark'; }
  });

  // symbol mode: icons by default
  const [symbolMode, setSymbolMode] = useState(() => {
    try { return localStorage.getItem('ttt-symbol') || 'icons'; } catch { return 'icons'; }
  });

  // mode default: vs CPU
  const [mode, setMode] = useState('cpu');

  // avatars defaults
  const [avatars, setAvatars] = useState({ A: 'Ghost', B: 'Skull' });

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try { localStorage.setItem('ttt-theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem('ttt-symbol', symbolMode); } catch {}
  }, [symbolMode]);

  return (
    <div className="app-shell">
      <div className="card game-card">
        <div className="card-header-modern">
          <div className="title-wrap" aria-hidden={false}>
            <h1>
              <span>Nocturne</span>
              <span className="brand">Tic</span>
              <span>Toe</span>
            </h1>
            <small>Late-night Tic Tac Toe — choose theme & symbol</small>
          </div>

          <div className="header-actions" role="toolbar" aria-label="controls">
            <div className="btn-group" role="group" aria-label="mode">
              <button type="button" className={`btn btn-sm ${mode === 'local' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('local')}>Local PvP</button>
              <button type="button" className={`btn btn-sm ${mode === 'cpu' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMode('cpu')}>Vs CPU</button>
            </div>

            <div className="btn-group" role="group" aria-label="theme">
              <button type="button" className={`btn btn-sm ${theme === 'light' ? 'btn-outline-secondary' : 'btn-outline-secondary'}`} onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
                {theme === 'light' ? 'Light' : 'Dark'}
              </button>
            </div>

            <div className="btn-group" role="group" aria-label="symbol">
              <button type="button" className={`btn btn-sm ${symbolMode === 'xo' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSymbolMode('xo')}>X / O</button>
              <button type="button" className={`btn btn-sm ${symbolMode === 'icons' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setSymbolMode('icons')}>Icons</button>
            </div>
          </div>
        </div>

        <div className="card-body-modern">
          <div className="preview-row">
            <div className="preview-side">
              <div className="label">Player A</div>
              <div className="chip" aria-hidden>{symbolMode === 'xo' ? <strong style={{fontSize:14}}>X</strong> : '👻'}</div>
            </div>

            <div className="preview-side" style={{ justifyContent:'flex-end' }}>
              <div className="label">Player B</div>
              <div className="chip" aria-hidden>{symbolMode === 'xo' ? <strong style={{fontSize:14}}>O</strong> : '💀'}</div>
            </div>
          </div>

          <div className="board-container" aria-live="polite">
            <Game mode={mode} symbolMode={symbolMode} avatars={avatars} />
          </div>

          {/* Scoreboard area lives inside Game component, tip text removed at app-level */}
        </div>
      </div>
    </div>
  );
}
