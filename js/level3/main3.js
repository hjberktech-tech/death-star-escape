// js/level3/main3.js — Level 3 orchestrator (Mos Eisley platformer)

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { Input } from '../input.js';
import AudioManager from '../audio.js';
import { World3 } from './world3.js';
import { Player3 } from './player3.js';
import { Characters3 } from './characters3.js';
import { Cutscene3 } from './cutscene3.js';
import { Battle3 } from './battle3.js';
import { renderHUD3 } from './hud3.js';

export const L3State = {
  PLAYING:  'l3_playing',
  CUTSCENE: 'l3_cutscene',
  BATTLE:   'l3_battle',
  DEAD:     'l3_dead',
  WIN:      'l3_win',
};

// ── Private module state ──────────────────────────────────────────────────────

let world, player, characters, cutscene, battle;
let state3, score, cameraX, lastDt;
let cantinaTriggered, battleTriggered, friendlyFireFlash;

// ── Init ──────────────────────────────────────────────────────────────────────

export function initLevel3() {
  world              = new World3();
  player             = new Player3();
  characters         = new Characters3();
  cutscene           = new Cutscene3();
  battle             = new Battle3();
  state3             = L3State.PLAYING;
  score              = 0;
  cameraX            = 0;
  lastDt             = 0;
  cantinaTriggered   = false;
  battleTriggered    = false;
  friendlyFireFlash  = 0;

  AudioManager.playMusic('level2'); // reuse existing track
}

// ── Input mapping ─────────────────────────────────────────────────────────────

function getInput3() {
  return {
    left:     Input.strafeRight || Input.rotLeft,
    right:    Input.strafeLeft  || Input.rotRight,
    jump:     Input.forward,
    shoot:    Input.shoot,
    interact: Input.consumeInteract(),
  };
}

// ── Update ────────────────────────────────────────────────────────────────────

export function updateLevel3(dt) {
  lastDt = dt;

  if (state3 === L3State.DEAD || state3 === L3State.WIN) return;

  const inp = getInput3();

  // ── Cutscene ──────────────────────────────────────────────────────────────
  if (state3 === L3State.CUTSCENE) {
    const done = cutscene.update(inp);
    if (done) {
      state3 = L3State.PLAYING;
      world.cantinaTriggered = true;
      // Move player just past cantina door so they don't re-trigger
      player.x = world.CANTINA_X + 60;
    }
    return;
  }

  // ── Battle ────────────────────────────────────────────────────────────────
  if (state3 === L3State.BATTLE) {
    battle.update(dt, player);
    player.update(dt, inp, world);   // still need shoot/jump input
    cameraX = battle.camX;           // lock camera to show Falcon area
    if (player.shooting) AudioManager.playBlaster();
    if (battle.done) {
      state3 = L3State.WIN;
      AudioManager.stopMusic();
    }
    if (player.dead) {
      state3 = L3State.DEAD;
      AudioManager.stopMusic();
    }
    return;
  }

  // ── Playing ───────────────────────────────────────────────────────────────
  player.update(dt, inp, world);
  characters.update(dt, player);

  // Camera (player at ~35% from left, clamped)
  cameraX = Math.max(0, Math.min(world.WORLD_W - SCREEN_W,
            player.x - SCREEN_W * 0.35));

  // Bullet collision: player → characters
  const scoreChange = characters.checkBulletHits(player.bullets);
  if (scoreChange !== 0) {
    score += scoreChange;
    if (scoreChange < 0) friendlyFireFlash = 2.0;
  }

  // Enemy bullets → player
  if (characters.checkEnemyHits(player)) {
    if (player.takeDamage()) AudioManager.playShieldHit();
  }

  // Blaster sounds
  if (player.shooting) AudioManager.playBlaster();

  // Triggers
  if (!cantinaTriggered && player.x >= world.CANTINA_X) {
    cantinaTriggered = true;
    state3 = L3State.CUTSCENE;
    cutscene.start();
    AudioManager.stopMusic();
  }

  if (!battleTriggered && player.x >= world.FALCON_X) {
    battleTriggered = true;
    state3 = L3State.BATTLE;
    battle.start(player);
    AudioManager.playMusic('imperial');
  }

  if (player.dead) {
    state3 = L3State.DEAD;
    AudioManager.stopMusic();
  }
}

// ── Render ────────────────────────────────────────────────────────────────────

export function renderLevel3(ctx) {
  world.render(ctx, cameraX);
  characters.render(ctx, cameraX);
  player.render(ctx, cameraX);

  if (state3 === L3State.BATTLE) {
    battle.render(ctx, cameraX);
  }

  renderHUD3(ctx, player, score, world, lastDt);

  if (state3 === L3State.CUTSCENE) {
    cutscene.render(ctx);
  }

  // ── Dead overlay ────────────────────────────────────────────────────────
  if (state3 === L3State.DEAD) {
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = '#ff4444';
    ctx.font      = 'bold 44px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('YOU WERE SHOT DOWN', SCREEN_W / 2, SCREEN_H / 2 - 20);
    ctx.fillStyle = '#aaddff';
    ctx.font      = '19px monospace';
    ctx.fillText('Click to try again', SCREEN_W / 2, SCREEN_H / 2 + 30);
    ctx.textAlign = 'left';
  }

  // ── Win overlay ──────────────────────────────────────────────────────────
  if (state3 === L3State.WIN) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = '#ffcc44';
    ctx.font      = 'bold 38px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FALCON SECURED!', SCREEN_W / 2, SCREEN_H / 2 - 40);
    ctx.fillStyle = '#aaddff';
    ctx.font      = '16px monospace';
    ctx.fillText(`Final Score: ${score}`, SCREEN_W / 2, SCREEN_H / 2 + 10);
    ctx.fillText('Click to continue', SCREEN_W / 2, SCREEN_H / 2 + 46);
    ctx.textAlign = 'left';
  }
}

// ── Public accessor ───────────────────────────────────────────────────────────

export function getState3() { return state3; }
