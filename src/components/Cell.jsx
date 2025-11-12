import React from 'react';

export default function Cell({ value, onClick, isWinning }) {
  return (
    <button
      type="button"
      className={`cell btn p-0 ${isWinning ? 'win-pulse' : ''}`}
      onClick={onClick}
      aria-pressed={!!value}
      aria-label="board cell"
    >
      <div style={{ width: '90%', height: '90%', display:'flex', alignItems:'center', justifyContent:'center' }}>
        {value}
      </div>
    </button>
  );
}
