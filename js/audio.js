// js/audio.js — Web Audio API sound system (no external files)

const AudioManager = (() => {
  let ctx = null;
  let masterGain, musicGain, sfxGain;

  // Music state
  let currentTrack    = null;
  let musicLoopTimeout = null;
  let musicPlaying    = false;

  // Vader breath state
  let vaderBreathing    = false;
  let vaderBreathTimeout = null;
  let vaderPhase2       = false;

  // Player breath state
  let playerBreathing    = false;
  let playerBreathTimeout = null;
  let playerHealthLevel  = 'high';

  // Alert rate-limit
  let lastAlertTime = -999;

  // ── Init ──────────────────────────────────────────────────
  function init() {
    if (ctx) { ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    masterGain = ctx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ctx.destination);

    musicGain = ctx.createGain();
    musicGain.gain.value = 0.35;
    musicGain.connect(masterGain);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.7;
    sfxGain.connect(masterGain);
  }

  function midi(n) { return 440 * Math.pow(2, (n - 69) / 12); }

  // MIDI note numbers
  const N = {
    REST: -1,
    G3:55, Ab3:56, A3:57, Bb3:58, B3:59,
    C4:60, Db4:61, D4:62, Eb4:63, E4:64, F4:65, Gb4:66, G4:67, Ab4:68, A4:69, Bb4:70, B4:71,
    C5:72, Db5:73, D5:74, Eb5:75, E5:76, F5:77, Gb5:78, G5:79, Ab5:80, A5:81, Bb5:82, B5:83,
    C6:84,
  };

  const BPM = 120;
  const B   = 60 / BPM; // seconds per beat

  // ── Star Wars Main Theme — Bb major ───────────────────────
  const MAIN_THEME = [
    // Opening: "Dun dun dun DUN-dah  Eb D C DUN  F"
    [N.Bb4,0.75],[N.Bb4,0.75],[N.Bb4,0.75],
    [N.F5,1.5],[N.Bb4,0.5],
    [N.Eb5,0.75],[N.D5,0.75],[N.C5,0.75],[N.Bb5,1.5],[N.F5,0.5],
    [N.Eb5,0.75],[N.D5,0.75],[N.C5,0.75],[N.Bb5,2.0],[N.REST,0.5],
    // Second statement
    [N.F5,1.5],[N.Bb4,0.5],
    [N.Eb5,0.75],[N.D5,0.75],[N.C5,0.75],[N.Bb5,1.5],[N.F5,0.5],
    [N.Eb5,0.75],[N.D5,0.75],[N.C5,0.75],[N.Bb5,2.0],[N.REST,1.0],
    // Triumphant bridge
    [N.G5,1.5],[N.Bb4,0.5],[N.Bb4,0.5],
    [N.G5,1.5],[N.Bb4,0.5],[N.Bb4,0.5],
    [N.G5,1.5],[N.Eb5,0.5],
    [N.Eb5,0.5],[N.D5,0.5],[N.C5,0.5],
    [N.Bb5,2.0],[N.REST,1.0],
  ];

  // ── Imperial March — G minor ──────────────────────────────
  const IMPERIAL_MARCH = [
    // Iconic riff x2
    [N.G4,1.0],[N.G4,1.0],[N.G4,1.0],
    [N.Eb4,0.75],[N.Bb4,0.25],[N.G4,1.0],
    [N.Eb4,0.75],[N.Bb4,0.25],[N.G4,2.0],
    [N.D5,1.0],[N.D5,1.0],[N.D5,1.0],
    [N.Eb5,0.75],[N.Bb4,0.25],[N.Gb4,1.0],
    [N.Eb4,0.75],[N.Bb4,0.25],[N.G4,2.0],
    // Descending counter-melody
    [N.G5,1.0],[N.G4,0.75],[N.G4,0.25],
    [N.G5,1.0],[N.Gb5,0.75],[N.F5,0.25],
    [N.E5,0.25],[N.Eb5,0.25],[N.E5,0.5],
    [N.REST,0.5],[N.Ab4,0.5],[N.Db5,1.0],[N.C5,0.75],[N.B4,0.25],
    [N.Bb4,0.25],[N.A4,0.25],[N.Bb4,0.5],
    [N.REST,0.5],[N.Eb4,0.5],[N.Gb4,1.0],[N.Eb4,0.75],[N.Gb4,0.25],
    [N.Bb4,1.0],[N.G4,0.75],[N.Bb4,0.25],[N.D5,2.0],
  ];

  function scheduleSequence(seq, startTime) {
    let t = startTime;
    for (const [note, beats] of seq) {
      if (note !== N.REST) {
        const dur = beats * B;
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = midi(note);
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(0.3, t + 0.01);
        env.gain.setValueAtTime(0.3, t + dur * 0.85);
        env.gain.linearRampToValueAtTime(0, t + dur);
        osc.connect(env);
        env.connect(musicGain);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      }
      t += beats * B;
    }
    return t;
  }

  function _loopMusic() {
    if (!musicPlaying) return;
    const seq   = currentTrack === 'main' ? MAIN_THEME : IMPERIAL_MARCH;
    const start = ctx.currentTime + 0.05;
    const end   = scheduleSequence(seq, start);
    const delay = Math.max(100, (end - ctx.currentTime - 0.1) * 1000);
    musicLoopTimeout = setTimeout(_loopMusic, delay);
  }

  function playMusic(track) {
    if (!ctx) return;
    if (currentTrack === track && musicPlaying) return;
    if (musicLoopTimeout) { clearTimeout(musicLoopTimeout); musicLoopTimeout = null; }
    musicPlaying = false;
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    setTimeout(() => {
      if (!ctx) return;
      currentTrack = track;
      musicPlaying = true;
      musicGain.gain.cancelScheduledValues(ctx.currentTime);
      musicGain.gain.setTargetAtTime(0.35, ctx.currentTime, 0.5);
      _loopMusic();
    }, 600);
  }

  function stopMusic() {
    musicPlaying = false;
    currentTrack = null;
    if (musicLoopTimeout) { clearTimeout(musicLoopTimeout); musicLoopTimeout = null; }
    if (ctx && musicGain) {
      musicGain.gain.cancelScheduledValues(ctx.currentTime);
      musicGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
    }
  }

  // ── Blaster ───────────────────────────────────────────────
  function playBlaster() {
    if (!ctx) return;
    const t   = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.18);
    env.gain.setValueAtTime(0.5, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(env); env.connect(sfxGain);
    osc.start(t); osc.stop(t + 0.25);
  }

  // ── Trooper alert ─────────────────────────────────────────
  function playTrooperAlert() {
    if (!ctx) return;
    const now = ctx.currentTime;
    if (now - lastAlertTime < 0.5) return; // rate-limit simultaneous alerts
    lastAlertTime = now;
    [440, 660, 880].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = f;
      const st = now + i * 0.07;
      env.gain.setValueAtTime(0, st);
      env.gain.linearRampToValueAtTime(0.22, st + 0.01);
      env.gain.linearRampToValueAtTime(0, st + 0.08);
      osc.connect(env); env.connect(sfxGain);
      osc.start(st); osc.stop(st + 0.1);
    });
  }

  // ── Trooper death scream ──────────────────────────────────
  function playTrooperDeath() {
    if (!ctx) return;
    const t   = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.5);
    env.gain.setValueAtTime(0.4, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(env); env.connect(sfxGain);
    osc.start(t); osc.stop(t + 0.55);
  }

  // ── Noise buffer helper ───────────────────────────────────
  function _noise(dur) {
    const n    = Math.ceil(ctx.sampleRate * dur);
    const buf  = ctx.createBuffer(1, n, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    const src  = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }

  // ── Breath pulse (shared by Vader + player) ───────────────
  function _breathPulse(freq, vol, dur) {
    const src    = _noise(dur);
    const filter = ctx.createBiquadFilter();
    filter.type            = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value         = 4;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(vol, ctx.currentTime + dur * 0.3);
    env.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
    src.connect(filter); filter.connect(env); env.connect(sfxGain);
    src.start(ctx.currentTime);
    src.stop(ctx.currentTime + dur + 0.05);
  }

  // ── Darth Vader breathing ─────────────────────────────────
  function startVaderBreath(phase2 = false) {
    if (!ctx) return;
    stopVaderBreath();
    vaderBreathing = true;
    vaderPhase2    = phase2;
    _vaderCycle();
  }

  function _vaderCycle() {
    if (!vaderBreathing) return;
    const p2    = vaderPhase2;
    const cycle = p2 ? 2.2 : 1.8;
    const vol   = p2 ? 0.3 : 0.2;
    _breathPulse(p2 ? 60 : 80, vol, cycle * 0.45);          // inhale
    vaderBreathTimeout = setTimeout(() => {
      if (!vaderBreathing) return;
      _breathPulse(p2 ? 50 : 65, vol * 0.85, cycle * 0.45); // exhale
      vaderBreathTimeout = setTimeout(_vaderCycle, cycle * 0.55 * 1000);
    }, cycle * 0.48 * 1000);
  }

  function updateVaderBreathPhase(phase2) {
    vaderPhase2 = phase2; // next cycle picks it up automatically
  }

  function stopVaderBreath() {
    vaderBreathing = false;
    if (vaderBreathTimeout) { clearTimeout(vaderBreathTimeout); vaderBreathTimeout = null; }
  }

  // ── Player breathing ──────────────────────────────────────
  function updatePlayerBreath(health) {
    if (!ctx) return;
    const level = health > 50 ? 'high' : health > 25 ? 'medium' : 'low';
    if (level === 'high') { if (playerBreathing) stopPlayerBreath(); return; }
    if (level !== playerHealthLevel || !playerBreathing) {
      playerHealthLevel = level;
      stopPlayerBreath();
      playerBreathing = true;
      _playerBreathCycle();
    }
  }

  function _playerBreathCycle() {
    if (!playerBreathing) return;
    const low = playerHealthLevel === 'low';
    _breathPulse(low ? 200 : 300, low ? 0.2 : 0.1, 0.35);
    playerBreathTimeout = setTimeout(_playerBreathCycle, low ? 900 : 1600);
  }

  function stopPlayerBreath() {
    playerBreathing   = false;
    playerHealthLevel = 'high';
    if (playerBreathTimeout) { clearTimeout(playerBreathTimeout); playerBreathTimeout = null; }
  }

  // ── Footsteps ─────────────────────────────────────────────
  function playFootstep(isPlayer) {
    if (!ctx) return;
    const src    = _noise(0.04);
    const filter = ctx.createBiquadFilter();
    filter.type            = 'lowpass';
    filter.frequency.value = isPlayer ? 350 : 220;
    const env = ctx.createGain();
    env.gain.setValueAtTime(isPlayer ? 0.3 : 0.12, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
    src.connect(filter); filter.connect(env); env.connect(sfxGain);
    src.start(ctx.currentTime);
    src.stop(ctx.currentTime + 0.08);
  }

  return {
    init,
    playMusic, stopMusic,
    playBlaster,
    playTrooperAlert, playTrooperDeath,
    startVaderBreath, stopVaderBreath, updateVaderBreathPhase,
    updatePlayerBreath, stopPlayerBreath,
    playFootstep,
  };
})();

export default AudioManager;
