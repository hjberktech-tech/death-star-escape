// js/level3/battle3.js — Final stormtrooper wave battle at the Millennium Falcon

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { drawStormtrooper, drawBullet3 } from './assets3.js';
import { GROUND_Y } from './world3.js';
import { Explosion } from '../level2/enemies2.js';

const WALK_FPS     = 7;
const BULLET_SPEED = 360;

// ── Battle stormtrooper (simpler than world version) ─────────────────────────
class BattleTrooper {
  constructor(spawnX, spawnDelay) {
    this.x          = spawnX;
    this.y          = GROUND_Y;
    this.hp         = 2;
    this.facing     = -1; // walks left toward player
    this.walkFrame  = 0;
    this.walkTimer  = 0;
    this.active     = true;
    this.spawnDelay = spawnDelay;
    this.spawned    = false;
    this.fireTimer  = 1.5 + Math.random() * 1.5;
    this.bullets    = [];
    this.speed      = 65 + Math.random() * 30;
  }

  update(dt, player) {
    if (!this.active) return;

    this.spawnDelay -= dt;
    if (this.spawnDelay > 0) return;
    this.spawned = true;

    for (const b of this.bullets) {
      b.x += b.vx * dt;
      if (b.x < -50 || b.x > SCREEN_W + 50) b.active = false;
    }
    this.bullets = this.bullets.filter(b => b.active);

    const dx   = player.x - this.x;
    const dist = Math.abs(dx);

    // Move toward player, stop at ~200px
    if (dist > 200) {
      this.x += Math.sign(dx) * this.speed * dt;
    }
    this.facing = Math.sign(dx) || -1;

    // Fire
    this.fireTimer -= dt;
    if (this.fireTimer <= 0 && dist < 420 && !player.dead) {
      this.fireTimer = 1.2 + Math.random();
      this.bullets.push({
        x: this.x + this.facing * 14, y: player.y - 25,
        vx: this.facing * BULLET_SPEED, active: true, facing: this.facing
      });
    }

    this.walkTimer += dt;
    this.walkFrame = Math.floor(this.walkTimer * WALK_FPS) % 4;
  }

  hit() {
    this.hp--;
    if (this.hp <= 0) { this.active = false; return true; }
    return false;
  }

  render(ctx) {
    if (!this.active || !this.spawned) return;
    drawStormtrooper(ctx, this.x, this.y, this.facing, this.walkFrame, true);
    for (const b of this.bullets) {
      if (!b.active) continue;
      drawBullet3(ctx, b.x, b.y, b.facing);
    }
  }
}

// ── Wave definitions — { count, spawnX range, delay between troops } ──────────
const WAVES = [
  { count: 5,  baseX: SCREEN_W + 40, spread: 80,  interval: 1.2, msg: 'WAVE 1 — Advance squad!' },
  { count: 8,  baseX: SCREEN_W + 40, spread: 100, interval: 0.9, msg: 'WAVE 2 — Reinforcements!' },
  { count: 12, baseX: SCREEN_W + 40, spread: 120, interval: 0.6, msg: 'WAVE 3 — Full assault!' },
];

// ── Battle class ──────────────────────────────────────────────────────────────
export class Battle3 {
  constructor() {
    this.troopers    = [];
    this.explosions  = [];
    this.waveIdx     = 0;
    this.killed      = 0;
    this.totalNeeded = WAVES.reduce((s, w) => s + w.count, 0);
    this.done        = false;
    this.waveMsg     = '';
    this.waveMsgTimer = 0;
    this._player     = null; // set in start()
    // Player locked to left third of screen during battle
    this.playerX     = SCREEN_W * 0.25;
  }

  start(player) {
    this._player        = player;
    player.x            = this.playerX;
    this.waveIdx        = 0;
    this.killed         = 0;
    this.done           = false;
    this.troopers       = [];
    this.explosions     = [];
    this._spawnWave(0);
  }

  _spawnWave(idx) {
    if (idx >= WAVES.length) return;
    const w = WAVES[idx];
    this.waveMsg      = w.msg;
    this.waveMsgTimer = 3.0;
    for (let i = 0; i < w.count; i++) {
      const sx    = w.baseX + Math.random() * w.spread + i * 30;
      const delay = i * w.interval;
      this.troopers.push(new BattleTrooper(sx, delay));
    }
  }

  update(dt, player) {
    if (this.done) return;

    // Lock player to left side
    player.x = this.playerX;

    if (this.waveMsgTimer > 0) this.waveMsgTimer -= dt;

    for (const t of this.troopers) t.update(dt, player);

    // Player bullets vs troopers
    for (const b of player.bullets) {
      if (!b.active) continue;
      for (const t of this.troopers) {
        if (!t.active || !t.spawned) continue;
        if (Math.abs(b.x - t.x) < 22 && Math.abs(b.y - t.y) < 30) {
          b.active = false;
          if (t.hit()) {
            this.killed++;
            this.explosions.push(new Explosion(t.x, t.y - 20, 1.0));
          }
          break;
        }
      }
    }

    // Trooper bullets vs player
    for (const t of this.troopers) {
      for (const b of t.bullets) {
        if (!b.active) continue;
        if (Math.abs(b.x - player.x) < 20 && Math.abs(b.y - player.y) < 28) {
          b.active = false;
          player.takeDamage();
        }
      }
    }

    for (const ex of this.explosions) ex.update(dt);
    this.explosions = this.explosions.filter(ex => !ex.done);

    // Advance wave when current wave is all dead
    const waveActive = this.troopers.some(t => t.active);
    if (!waveActive && this.waveIdx < WAVES.length - 1) {
      this.waveIdx++;
      this._spawnWave(this.waveIdx);
    } else if (!waveActive && this.waveIdx === WAVES.length - 1) {
      this.done = true;
    }
  }

  get progress() {
    return Math.min(1, this.killed / this.totalNeeded);
  }

  render(ctx) {
    // Troopers render at their screen x directly (no camera during battle)
    for (const t of this.troopers) t.render(ctx);
    for (const ex of this.explosions) ex.render(ctx);

    // Progress bar
    const barW  = 400;
    const barH  = 18;
    const barX  = (SCREEN_W - barW) / 2;
    const barY  = 12;
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(barX - 4, barY - 4, barW + 8, barH + 24);
    ctx.fillStyle = '#221100';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#cc2200';
    ctx.fillRect(barX, barY, barW * this.progress, barH);
    ctx.fillStyle = '#ff4400';
    ctx.fillRect(barX, barY, barW * this.progress * 0.4, barH);
    ctx.strokeStyle = '#884422';
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(barX, barY, barW, barH);
    ctx.fillStyle   = '#ffaa44';
    ctx.font        = 'bold 11px monospace';
    ctx.textAlign   = 'center';
    ctx.fillText(`BATTLE PROGRESS  ${Math.round(this.progress * 100)}%`, SCREEN_W / 2, barY + barH + 14);

    // Wave message
    if (this.waveMsgTimer > 0) {
      const alpha = Math.min(1, this.waveMsgTimer);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = '#ff4400';
      ctx.font        = 'bold 22px monospace';
      ctx.textAlign   = 'center';
      ctx.fillText(this.waveMsg, SCREEN_W / 2, SCREEN_H / 2 - 60);
      ctx.restore();
    }

    ctx.textAlign = 'left';
  }
}
