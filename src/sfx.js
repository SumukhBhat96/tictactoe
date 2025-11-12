// small WebAudio SFX helper
export function createSFX() {
  let ctx;
  try {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    return { place: () => {}, win: () => {}, lose: () => {} };
  }

  function beep(freq = 440, dur = 0.08) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
    o.start();
    o.stop(ctx.currentTime + dur);
  }

  return {
    place: () => beep(520, 0.06),
    win: () => { beep(880, 0.08); setTimeout(() => beep(1320, 0.08), 80); },
    lose: () => beep(220, 0.12)
  };
}
