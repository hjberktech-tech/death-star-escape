// js/level2/main2.js — Level 2 orchestrator (2D space shooter)

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { Input } from '../input.js';
import AudioManager from '../audio.js';
import { Background2 } from './background2.js';
import { Player2 } from './player2.js';
import { WaveSpawner, Explosion } from './enemies2.js';
import { ImperialCruiser } from './boss2.js';
import { renderHUD2 } from './hud2.js';

export const L2State = {
  PLAYING: 'l2_playing',
  DEAD:    'l2_dead',
  WIN:     'l2_win',
};

// ── Private module state ──────────────────────────────────────────────────────

let bg, player2, spawner, enemies, enemyBullets, explosions, boss;
let score, progress, bossSpawned, state2;

const PROGRESS_SPEED = 0.012; // ~83s level

// ── Init ──────────────────────────────────────────────────────────────────────

export function initLevel2() {
  bg           = new Background2();
  player2      = new Player2();
  spawner      = new WaveSpawner();
  enemies      = [];
  enemyBullets = [];
  explosions   = [];
  boss         = null;
  score        = 0;
  progress     = 0;
  bossSpawned  = false;
  state2       = L2State.PLAYING;

  AudioManager.playMusic('level2');
}

// ── Input mapping ─────────────────────────────────────────────────────────────

function getInput() {
  return {
    moveLeft:  Input.strafeRight || Input.rotLeft,   // A or ←
    moveRight: Input.strafeLeft  || Input.rotRight,  // D or →
    moveUp:    Input.forward,                        // W or ↑
    moveDown:  Input.back,                           // S or ↓
    shooting:  Input.shoot,
    flipShip:  Input.consumeInteract(),              // F or Enter
  };
}

// ── Update ────────────────────────────────────────────────────────────────────

export function updateLevel2(dt) {
  if (state2 !== L2State.PLAYING) return;

  progress = Math.min(1, progress + PROGRESS_SPEED * dt);
  bg.update(dt);

  // Spawn waves until boss zone
  if (!bossSpawned) {
    enemies.push(...spawner.update(progress));
  }

  // Spawn boss at progress >= 0.86
  if (progress >= 0.86 && !bossSpawned) {
    bossSpawned = true;
    boss = new ImperialCruiser();
    boss._onMissileLaunch = () => AudioManager.playMissileLaunch();
    AudioManager.playMusic('imperial');
  }

  player2.update(dt, getInput());

  for (const e of enemies) e.update(dt, player2, enemyBullets);
  enemies = enemies.filter(e => e.active);

  for (const b of enemyBullets) b.update(dt, player2);
  enemyBullets = enemyBullets.filter(b => b.active);

  if (boss) {
    boss.update(dt, player2, player2.bullets, enemyBullets);
    if (boss.isFullyDefeated()) {
      state2 = L2State.WIN;
      AudioManager.stopMusic();
    }
  }

  // ── Collision: player bullets vs enemies ──────────────────────────────────

  for (const b of player2.bullets) {
    if (!b.active) continue;
    for (const e of enemies) {
      if (!e.active) continue;
      let hit = false;
      if (e.type === 'asteroid') {
        const bd = e.getBounds();
        hit = Math.hypot(b.x - bd.cx, b.y - bd.cy) < bd.r + 5;
      } else {
        const bd = e.getBounds();
        hit = b.x > bd.x && b.x < bd.x + bd.w && b.y > bd.y && b.y < bd.y + bd.h;
      }
      if (hit) {
        b.active = false;
        if (e.takeDamage(1)) {
          score += e.score;
          explosions.push(new Explosion(e.x, e.y, e.type === 'asteroid' ? 1.2 : 1.5));
          AudioManager.playExplosion();
        }
        break;
      }
    }
  }

  // ── Collision: enemy bullets + bodies vs player ───────────────────────────

  if (!player2.dead) {
    for (const b of enemyBullets) {
      if (!b.active) continue;
      if (Math.abs(b.x - player2.x) < 22 && Math.abs(b.y - player2.y) < 12) {
        b.active = false;
        if (player2.takeDamage()) AudioManager.playShieldHit();
      }
    }
    for (const e of enemies) {
      if (!e.active) continue;
      const col = e.type === 'asteroid'
        ? Math.hypot(e.x - player2.x, e.y - player2.y) < e.r + 14
        : Math.abs(e.x - player2.x) < 28 && Math.abs(e.y - player2.y) < 18;
      if (col) {
        e.active = false;
        explosions.push(new Explosion(e.x, e.y, 1.5));
        if (player2.takeDamage()) AudioManager.playShieldHit();
        AudioManager.playExplosion();
      }
    }
  }

  for (const ex of explosions) ex.update(dt);
  explosions = explosions.filter(ex => !ex.done);

  if (player2.dead) {
    state2 = L2State.DEAD;
    AudioManager.stopMusic();
  }
}

// ── Render ────────────────────────────────────────────────────────────────────

export function renderLevel2(ctx) {
  bg.render(ctx, progress);

  for (const e of enemies) e.render(ctx);

  for (const b of enemyBullets) {
    if (b.render) {
      b.render(ctx);
    } else {
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(b.x - 7, b.y - 2, 14, 4);
      ctx.fillStyle = '#ffaaaa';
      ctx.fillRect(b.x - 5, b.y - 1, 10, 2);
    }
  }

  if (boss) boss.render(ctx);

  player2.render(ctx);

  for (const ex of explosions) ex.render(ctx);

  renderHUD2(ctx, player2, score, progress, boss && !boss.defeated ? boss : null);

  // ── Death overlay ────────────────────────────────────────────────────────

  if (state2 === L2State.DEAD) {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 46px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SHIP DESTROYED', SCREEN_W / 2, SCREEN_H / 2 - 20);
    ctx.fillStyle = '#aaddff';
    ctx.font = '20px monospace';
    ctx.fillText('Click to try again', SCREEN_W / 2, SCREEN_H / 2 + 30);
    ctx.textAlign = 'left';
  }

  // ── Win overlay ──────────────────────────────────────────────────────────

  if (state2 === L2State.WIN) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    ctx.fillStyle = '#ffcc44';
    ctx.font = 'bold 42px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TATOOINE REACHED!', SCREEN_W / 2, SCREEN_H / 2 - 30);
    ctx.fillStyle = '#aaddff';
    ctx.font = '18px monospace';
    ctx.fillText(`Score: ${score}`, SCREEN_W / 2, SCREEN_H / 2 + 15);
    ctx.fillText('Click to play again', SCREEN_W / 2, SCREEN_H / 2 + 50);
    ctx.textAlign = 'left';
  }
}

// ── Public accessors ──────────────────────────────────────────────────────────

export function getState2() {
  return state2;
}
