// js/level2/player2.js — Player ship for Level 2

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { drawXWing } from './assets2.js';

const PLAYER_SPEED = 200; // px/s
const FIRE_RATE    = 0.2; // seconds between shots
const BULLET_SPEED = 700; // px/s
const BULLET_W     = 18;
const BULLET_H     = 4;

export class Bullet {
  constructor(x, y, vx, vy) {
    this.x  = x;
    this.y  = y;
    this.vx = vx;
    this.vy = vy;
    this.active = true;
    this.w = BULLET_W;
    this.h = BULLET_H;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    // Deactivate if off-screen
    if (this.x < -this.w || this.x > SCREEN_W + this.w ||
        this.y < -this.h || this.y > SCREEN_H + this.h) {
      this.active = false;
    }
  }
}

export class Player2 {
  constructor() {
    this.x = 120;
    this.y = SCREEN_H / 2;
    this.w = 54;
    this.h = 24;

    this.lives  = 3;
    this.hp     = 3;
    this.maxHp  = 3;
    this.facing = 1; // 1=right, -1=left

    this.bullets     = [];
    this.fireTimer   = 0;
    this.invincTimer = 0;
    this.flashTimer  = 0;
    this.dead        = false;
  }

  update(dt, input) {
    if (this.dead) return;

    // --- Movement ---
    let dx = 0, dy = 0;
    if (input.moveLeft)  dx -= 1;
    if (input.moveRight) dx += 1;
    if (input.moveUp)    dy -= 1;
    if (input.moveDown)  dy += 1;

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      const inv = 1 / Math.sqrt(2);
      dx *= inv;
      dy *= inv;
    }

    this.x += dx * PLAYER_SPEED * dt;
    this.y += dy * PLAYER_SPEED * dt;

    // Clamp to screen with 10px margin
    const margin = 10;
    const hw = this.w / 2;
    const hh = this.h / 2;
    this.x = Math.max(margin + hw, Math.min(SCREEN_W - margin - hw, this.x));
    this.y = Math.max(margin + hh, Math.min(SCREEN_H - margin - hh, this.y));

    // --- Flip ship ---
    if (input.flipShip) {
      this.facing *= -1;
    }

    // --- Auto-fire ---
    this.fireTimer -= dt;
    if (input.shooting && this.fireTimer <= 0) {
      this.fireTimer = FIRE_RATE;
      const bvx = BULLET_SPEED * this.facing;
      const noseX = this.x + (this.facing > 0 ? this.w / 2 : -this.w / 2);
      this.bullets.push(new Bullet(noseX, this.y, bvx, 0));
    }

    // --- Update bullets ---
    for (const b of this.bullets) b.update(dt);
    this.bullets = this.bullets.filter(b => b.active);

    // --- Timers ---
    if (this.invincTimer > 0) this.invincTimer -= dt;
    if (this.flashTimer  > 0) this.flashTimer  -= dt;
  }

  takeDamage() {
    if (this.invincTimer > 0) return false;

    this.hp--;
    this.invincTimer = 1.5;
    this.flashTimer  = 1.5;

    if (this.hp <= 0) {
      this.lives--;
      if (this.lives <= 0) {
        this.dead = true;
      } else {
        this.hp = 3;
        this.x  = 120;
        this.y  = SCREEN_H / 2;
        this.bullets = [];
      }
    }
    return true;
  }

  render(ctx) {
    if (this.dead) return;

    // Blinking when flashing: blink at ~8Hz
    const blinking = this.flashTimer > 0 && Math.floor(this.flashTimer * 8) % 2 === 0;
    const hitFlash = blinking;

    // Draw X-Wing
    const flipped = this.facing < 0;
    drawXWing(ctx, this.x, this.y, flipped, hitFlash);

    // Draw bullets
    const bulletColor  = this.facing > 0 ? '#44ff88' : '#44ffff';
    const bulletColor2 = this.facing > 0 ? '#aaffcc' : '#aaffff';
    for (const b of this.bullets) {
      if (!b.active) continue;
      ctx.fillStyle = bulletColor;
      ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
      ctx.fillStyle = bulletColor2;
      ctx.fillRect(b.x - b.w / 2 + 2, b.y - b.h / 2 + 1, b.w - 4, b.h - 2);
    }
  }
}
