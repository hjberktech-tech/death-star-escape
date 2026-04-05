// js/level2/boss2.js — Imperial Cruiser boss for Level 2

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { drawImperialCruiser, drawTurret, drawReactor } from './assets2.js';
import { EnemyBullet, Explosion } from './enemies2.js';

const TARGET_X   = SCREEN_W * 0.62; // ~595
const CRUISER_W  = 300;
const CRUISER_H  = 180;
const ENTRY_SPEED = 80; // px/s

// Turret relative positions (from cruiser center)
const TURRET_OFFSETS = [
  { rx: -80, ry: -55 },
  { rx: -80, ry:  55 },
  { rx:  20, ry: -65 },
  { rx:  20, ry:  65 },
];

const TURRET_MAX_HP   = 25;
const REACTOR_MAX_HP  = 80;
const TURRET_FIRE_MIN = 2.5;
const TURRET_FIRE_MAX = 3.0;
const REACTOR_RADIUS  = 14;

class Turret {
  constructor(rx, ry) {
    this.rx        = rx;
    this.ry        = ry;
    this.hp        = TURRET_MAX_HP;
    this.maxHp     = TURRET_MAX_HP;
    this.fireTimer = TURRET_FIRE_MIN + Math.random() * (TURRET_FIRE_MAX - TURRET_FIRE_MIN);
    this.angle     = 0;
    this.active    = true;
  }

  get alive() { return this.hp > 0; }
}

export class ImperialCruiser {
  constructor() {
    this.x = SCREEN_W + 200;
    this.y = SCREEN_H / 2;
    this.w = CRUISER_W;
    this.h = CRUISER_H;

    // Entry state
    this.entered = false;

    // Drift
    this.driftTimer = 0;
    this.driftBase  = SCREEN_H / 2;

    // Turrets
    this.turrets = TURRET_OFFSETS.map(o => new Turret(o.rx, o.ry));

    // Reactor
    this.reactorHp    = REACTOR_MAX_HP;
    this.reactorMaxHp = REACTOR_MAX_HP;
    this.reactorFlash = 0;

    // Defeat state
    this.defeated    = false;
    this.defeatTimer = 0;
    this.explosions  = [];

    this.phase2 = false;
  }

  get totalMaxHp() {
    return TURRET_MAX_HP * 4 + REACTOR_MAX_HP;
  }

  get totalHp() {
    const turretHp = this.turrets.reduce((sum, t) => sum + Math.max(0, t.hp), 0);
    return turretHp + Math.max(0, this.reactorHp);
  }

  get allTurretsDown() {
    return this.turrets.every(t => !t.alive);
  }

  update(dt, player, playerBullets, enemyBullets) {
    if (this.defeated) {
      this.defeatTimer -= dt;
      for (const ex of this.explosions) ex.update(dt);
      this.explosions = this.explosions.filter(ex => !ex.done);
      return;
    }

    // Entry slide
    if (!this.entered) {
      this.x -= ENTRY_SPEED * dt;
      if (this.x <= TARGET_X) {
        this.x       = TARGET_X;
        this.entered = true;
        this.driftBase = this.y;
      }
    }

    // Slow drift on Y axis
    if (this.entered) {
      this.driftTimer += dt;
      this.y = this.driftBase + Math.sin(this.driftTimer * 0.3) * 20;
    }

    // Phase 2 check
    if (!this.phase2 && this.totalHp < this.totalMaxHp * 0.5) {
      this.phase2 = true;
    }

    const fireRateMult = this.phase2 ? 0.6 : 1.0; // phase 2: 40% faster (×0.6)

    // Update turrets
    for (const turret of this.turrets) {
      if (!turret.alive) continue;

      // Aim at player
      const tx = this.x + turret.rx;
      const ty = this.y + turret.ry;
      turret.angle = Math.atan2(player.y - ty, player.x - tx);

      // Fire timer
      turret.fireTimer -= dt;
      if (turret.fireTimer <= 0) {
        turret.fireTimer = (TURRET_FIRE_MIN + Math.random() * (TURRET_FIRE_MAX - TURRET_FIRE_MIN)) * fireRateMult;
        const speed = 280;
        const dx = player.x - tx;
        const dy = player.y - ty;
        const dist = Math.hypot(dx, dy) || 1;
        enemyBullets.push(new EnemyBullet(tx, ty, (dx / dist) * speed, (dy / dist) * speed));
      }
    }

    // Reactor flash
    if (this.reactorFlash > 0) this.reactorFlash -= dt;

    // Check player bullets vs turrets
    for (const b of playerBullets) {
      if (!b.active) continue;
      for (const turret of this.turrets) {
        if (!turret.alive) continue;
        const tx = this.x + turret.rx;
        const ty = this.y + turret.ry;
        if (Math.abs(b.x - tx) < 12 && Math.abs(b.y - ty) < 12) {
          b.active = false;
          turret.hp--;
          if (turret.hp <= 0) {
            turret.hp = 0;
            this.explosions.push(new Explosion(tx, ty, 1.2));
          }
          break;
        }
      }
    }

    // Check player bullets vs reactor (only when all turrets down)
    if (this.allTurretsDown && this.reactorHp > 0) {
      const rx = this.x - 60;
      const ry = this.y;
      for (const b of playerBullets) {
        if (!b.active) continue;
        if (Math.hypot(b.x - rx, b.y - ry) < REACTOR_RADIUS + 5) {
          b.active = false;
          this.reactorHp--;
          this.reactorFlash = 0.15;

          if (this.reactorHp <= 0) {
            this.reactorHp   = 0;
            this.defeated    = true;
            this.defeatTimer = 3.0;
            // Big explosion
            for (let i = 0; i < 6; i++) {
              setTimeout(() => {
                const ox = (Math.random() - 0.5) * CRUISER_W * 0.8;
                const oy = (Math.random() - 0.5) * CRUISER_H * 0.8;
                this.explosions.push(new Explosion(this.x + ox, this.y + oy, 2.5));
              }, i * 180);
            }
            this.explosions.push(new Explosion(rx, ry, 3.0));
          }
          break;
        }
      }
    }

    // Update explosion effects
    for (const ex of this.explosions) ex.update(dt);
    this.explosions = this.explosions.filter(ex => !ex.done);
  }

  isFullyDefeated() {
    return this.defeated && this.defeatTimer <= 0;
  }

  render(ctx) {
    // Draw explosions first (behind ship)
    for (const ex of this.explosions) ex.render(ctx);

    if (!this.defeated) {
      // Main ship hull
      drawImperialCruiser(ctx, this.x, this.y, this.w, this.h, this.phase2);

      // Draw turrets
      for (const turret of this.turrets) {
        if (!turret.alive) continue;
        const tx = this.x + turret.rx;
        const ty = this.y + turret.ry;
        drawTurret(ctx, tx, ty, turret.angle, turret.hp, turret.maxHp);
      }

      // Draw reactor when all turrets are down
      if (this.allTurretsDown && this.reactorHp > 0) {
        const rx = this.x - 60;
        const ry = this.y;
        drawReactor(ctx, rx, ry, REACTOR_RADIUS, this.reactorFlash > 0);
      }
    }
  }
}
