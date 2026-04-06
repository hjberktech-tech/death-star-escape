// js/level3/player3.js — Rebel player with platformer physics

import { SCREEN_W } from '../constants.js';
import { drawRebel, drawBullet3 } from './assets3.js';
import { GROUND_Y } from './world3.js';

const WALK_SPEED   = 170;  // px/s
const JUMP_VEL     = -420; // px/s (negative = up)
const GRAVITY      = 900;  // px/s²
const FIRE_RATE    = 0.25; // seconds between shots
const BULLET_SPEED = 520;  // px/s
const MAX_HP       = 3;
const INVIC_TIME   = 1.4;  // seconds of invincibility after hit
const WALK_FPS     = 8;    // animation frames per second

export class Bullet3 {
  constructor(x, y, facing) {
    this.x      = x;
    this.y      = y;
    this.vx     = facing * BULLET_SPEED;
    this.active = true;
    this.facing = facing;
  }
  update(dt) {
    this.x += this.vx * dt;
    if (this.x < -40 || this.x > SCREEN_W + 40) this.active = false;
  }
}

export class Player3 {
  constructor() {
    this.x          = 120;
    this.y          = GROUND_Y;   // feet y
    this.vy         = 0;
    this.facing     = 1;          // 1=right, -1=left
    this.onGround   = true;
    this.hp         = MAX_HP;
    this.maxHp      = MAX_HP;
    this.dead       = false;
    this.bullets    = [];
    this.fireTimer  = 0;
    this.invicTimer = 0;
    this.walkTimer  = 0;          // drives animation frame
    this.walkFrame  = 0;
    this.shooting   = false;
    this.walking    = false;
    this.halfW      = 9;          // half collision width
  }

  update(dt, input, world) {
    if (this.dead) return;

    // ── Horizontal movement ──────────────────────────────────────────────────
    let dx = 0;
    if (input.left)  { dx = -1; this.facing = -1; }
    if (input.right) { dx =  1; this.facing =  1; }
    this.walking = dx !== 0;

    this.x += dx * WALK_SPEED * dt;
    // Clamp to world
    this.x = Math.max(40, Math.min(world.WORLD_W - 40, this.x));

    // ── Jump ─────────────────────────────────────────────────────────────────
    if (input.jump && this.onGround) {
      this.vy = JUMP_VEL;
      this.onGround = false;
    }

    // ── Gravity + platform collision ─────────────────────────────────────────
    this.vy += GRAVITY * dt;
    const resolved = world.resolveY(this.x, this.y, this.vy, dt, this.halfW * 2);
    this.y        = resolved.y;
    this.vy       = resolved.vy;
    this.onGround = resolved.onGround;

    // ── Shooting ─────────────────────────────────────────────────────────────
    this.fireTimer -= dt;
    this.shooting = false;
    if (input.shoot && this.fireTimer <= 0) {
      this.fireTimer = FIRE_RATE;
      this.shooting  = true;
      const bx = this.x + this.facing * (this.halfW + 6);
      this.bullets.push(new Bullet3(bx, this.y - 25, this.facing));
    }

    for (const b of this.bullets) b.update(dt);
    this.bullets = this.bullets.filter(b => b.active);

    // ── Walk animation ────────────────────────────────────────────────────────
    if (this.walking) {
      this.walkTimer += dt;
      this.walkFrame = Math.floor(this.walkTimer * WALK_FPS) % 4;
    } else {
      this.walkFrame = 0;
    }

    // ── Invincibility timer ───────────────────────────────────────────────────
    if (this.invicTimer > 0) this.invicTimer -= dt;
  }

  takeDamage() {
    if (this.invicTimer > 0) return false;
    this.hp--;
    this.invicTimer = INVIC_TIME;
    if (this.hp <= 0) {
      this.hp   = 0;
      this.dead = true;
    }
    return true;
  }

  heal() {
    this.hp = Math.min(this.maxHp, this.hp + 1);
  }

  render(ctx, cameraX) {
    if (this.dead) return;
    const sx = this.x - cameraX;

    // Blink when invincible
    if (this.invicTimer > 0 && Math.floor(this.invicTimer * 8) % 2 === 0) {
      ctx.restore?.();
      return;
    }

    drawRebel(ctx, sx, this.y, this.facing, this.walkFrame, this.shooting);

    // Bullets
    for (const b of this.bullets) {
      if (!b.active) continue;
      drawBullet3(ctx, b.x - cameraX, b.y, b.facing);
    }
  }
}
