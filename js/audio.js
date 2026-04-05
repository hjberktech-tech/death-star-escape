// js/audio.js — Web Audio API sound system (no external files)

const AudioManager = (() => {
  let ctx = null;
  let masterGain;

  // Music state — each playMusic call gets its own session gain node so old
  // oscillators can be faded/disconnected independently of the new track.
  let currentTrack     = null;
  let musicLoopTimeout = null;
  let musicPlaying     = false;
  let musicSessionGain = null; // active session gain, replaced on each track switch

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
    masterGain.gain.value = 0.7;
    masterGain.connect(ctx.destination);
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

  const BPM = 100;
  const B   = 60 / BPM; // seconds per beat

  // ── Star Wars Main Theme — Bb major ───────────────────────
  // F5 = dotted quarter (1.5), quick Bb4 eighth (0.5), then eighth-run to Bb5.
  const MAIN_THEME = [
    // First statement
    [N.Bb4,1],[N.Bb4,1],[N.Bb4,1],
    [N.F5,1.5],[N.Bb4,0.5],
    [N.Eb5,0.5],[N.D5,0.5],[N.C5,1],
    [N.Bb5,2],[N.REST,1],
    // Second statement
    [N.F5,1.5],[N.Bb4,0.5],
    [N.Eb5,0.5],[N.D5,0.5],[N.C5,1],
    [N.Bb5,3],[N.REST,3],
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

  // targetGain is the session-specific gain node, so old oscillators on a
  // previous session are never heard when the new session fades in.
  function scheduleSequence(seq, startTime, targetGain) {
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
        env.connect(targetGain);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      }
      t += beats * B;
    }
    return t;
  }

  function _loopMusic(sessionGain) {
    if (!musicPlaying) return;
    const seq   = currentTrack === 'main' ? MAIN_THEME : IMPERIAL_MARCH;
    const start = ctx.currentTime + 0.05;
    const end   = scheduleSequence(seq, start, sessionGain);
    const delay = Math.max(100, (end - ctx.currentTime - 0.1) * 1000);
    musicLoopTimeout = setTimeout(() => _loopMusic(sessionGain), delay);
  }

  function playMusic(track) {
    if (!ctx) return;
    if (currentTrack === track && musicPlaying) return;

    // Stop current loop
    if (musicLoopTimeout) { clearTimeout(musicLoopTimeout); musicLoopTimeout = null; }
    musicPlaying = false;

    // Fade out and disconnect old session (old oscillators stay bound to it, go silent)
    if (musicSessionGain) {
      const old = musicSessionGain;
      old.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      setTimeout(() => { try { old.disconnect(); } catch (_) {} }, 2000);
    }

    // New session gain starts silent, fades in after a short pause
    const session = ctx.createGain();
    session.gain.value = 0;
    session.connect(masterGain);
    musicSessionGain = session;
    currentTrack = track;

    setTimeout(() => {
      if (!ctx || musicSessionGain !== session) return; // superseded
      musicPlaying = true;
      session.gain.setTargetAtTime(0.15, ctx.currentTime, 0.5); // quiet background level
      _loopMusic(session);
    }, 500);
  }

  function stopMusic() {
    musicPlaying = false;
    currentTrack = null;
    if (musicLoopTimeout) { clearTimeout(musicLoopTimeout); musicLoopTimeout = null; }
    if (musicSessionGain) {
      const old = musicSessionGain;
      musicSessionGain = null;
      old.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      setTimeout(() => { try { old.disconnect(); } catch (_) {} }, 2000);
    }
  }

  // ── Blaster ───────────────────────────────────────────────
  function playBlaster() {
    if (!ctx) return;
    ctx.resume();
    // Use small lookahead so scheduled events are never in the past
    const t = ctx.currentTime + 0.01;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = 'square';
    // 300→60 Hz sweep — laptop speakers reproduce this range clearly
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.linearRampToValueAtTime(60, t + 0.22);
    // Linear ramp to zero avoids any exponential scheduling edge cases
    env.gain.setValueAtTime(1.0, t);
    env.gain.linearRampToValueAtTime(0, t + 0.22);
    osc.connect(env); env.connect(masterGain);
    osc.start(t); osc.stop(t + 0.24);
  }

  // ── Trooper alert — "HEY there!" ─────────────────────────
  function playTrooperAlert() {
    if (!ctx) return;
    ctx.resume();
    const now = ctx.currentTime;
    if (now - lastAlertTime < 0.6) return; // rate-limit simultaneous alerts
    lastAlertTime = now;
    const t = now + 0.01;

    // "HEY" — short sharp mid tone, full gain at start
    const osc1 = ctx.createOscillator();
    const env1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(480, t);
    osc1.frequency.linearRampToValueAtTime(420, t + 0.14);
    env1.gain.setValueAtTime(0.7, t);
    env1.gain.linearRampToValueAtTime(0, t + 0.15);
    osc1.connect(env1); env1.connect(masterGain);
    osc1.start(t); osc1.stop(t + 0.17);

    // "there" — lower descending tone follows immediately
    const osc2 = ctx.createOscillator();
    const env2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(300, t + 0.16);
    osc2.frequency.linearRampToValueAtTime(220, t + 0.42);
    env2.gain.setValueAtTime(0.6, t + 0.16);
    env2.gain.linearRampToValueAtTime(0, t + 0.44);
    osc2.connect(env2); env2.connect(masterGain);
    osc2.start(t + 0.16); osc2.stop(t + 0.46);
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
    osc.connect(env); env.connect(masterGain);
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
    filter.Q.value         = 8;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, ctx.currentTime);
    env.gain.linearRampToValueAtTime(vol, ctx.currentTime + dur * 0.3);
    env.gain.linearRampToValueAtTime(0, ctx.currentTime + dur);
    src.connect(filter); filter.connect(env); env.connect(masterGain);
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
    // Inhale: very short hiss (50 ms)
    _breathPulse(low ? 600 : 700, low ? 0.25 : 0.14, 0.05);
    // Exhale: slightly longer and lower (80 ms), after 300 ms gap
    setTimeout(() => {
      if (!playerBreathing) return;
      _breathPulse(low ? 350 : 450, low ? 0.2 : 0.11, 0.08);
    }, 300);
    // Long silence before next breath — clearly pulsed
    playerBreathTimeout = setTimeout(_playerBreathCycle, low ? 1400 : 2600);
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
    src.connect(filter); filter.connect(env); env.connect(masterGain);
    src.start(ctx.currentTime);
    src.stop(ctx.currentTime + 0.08);
  }

  // ── Pickup ────────────────────────────────────────────────
  function playPickup() {
    if (!ctx) return;
    const t = ctx.currentTime;
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      const st = t + i * 0.09;
      env.gain.setValueAtTime(0.35, st);
      env.gain.exponentialRampToValueAtTime(0.001, st + 0.14);
      osc.connect(env); env.connect(masterGain);
      osc.start(st); osc.stop(st + 0.16);
    });
  }

  return {
    init,
    playMusic, stopMusic,
    playBlaster,
    playTrooperAlert, playTrooperDeath,
    startVaderBreath, stopVaderBreath, updateVaderBreathPhase,
    updatePlayerBreath, stopPlayerBreath,
    playFootstep, playPickup,
  };
})();

export default AudioManager;
