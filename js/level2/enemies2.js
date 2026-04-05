// js/level2/enemies2.js — Enemies, explosions, and wave spawner for Level 2

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { drawTIEFighter, drawTIEInterceptor, drawAsteroid } from './assets2.js';

// ── Enemy Bullet ──────────────────────────────────────────────────────────────

export class EnemyBullet {
  constructor(x, y, vx, vy) {
    this.x  = x;
    this.y  = y;
    this.vx = vx;
    this.vy = vy;
    this.active = true;
    this.w = 14;
    this.h = 4;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.x < -20 || this.x > SCREEN_W + 20 ||
        this.y < -20 || this.y > SCREEN_H + 20) {
      this.active = false;
    }
  }
}

// ── Explosion ─────────────────────────────────────────────────────────────────

const EXPLOSION_COLORS = ['#ff8800', '#ffcc00', '#ff4400', '#ffffff', '#ffaa33', '#ff6600'];

export class Explosion {
  constructor(x, y, scale = 1) {
    const count = Math.floor(8 + Math.random() * 9); // 8–16 particles
    this.particles = [];
    for (let i = 0; i < count; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const speed  = (50 + Math.random() * 130) * scale;
      const life   = 0.3 + Math.random() * 0.2; // up to 0.5s
      this.particles.push({
        x, y,
        vx:    Math.cos(angle) * speed,
        vy:    Math.sin(angle) * speed,
        life,
        maxLife: life,
        size:  (2 + Math.random() * 4) * scale,
        color: EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
      });
    }
  }

  update(dt) {
    for (const p of this.particles) {
      p.x    += p.vx * dt;
      p.y    += p.vy * dt;
      p.life -= dt;
      // Drag
      p.vx *= 0.95;
      p.vy *= 0.95;
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      if (p.life <= 0) continue;
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.restore();
    }
  }

  get done() {
    return this.particles.every(p => p.life <= 0);
  }
}

// ── Asteroid ──────────────────────────────────────────────────────────────────

export class Asteroid {
  constructor(x, y, pattern) {
    this.x       = x;
    this.y       = y;
    this.r       = 18 + Math.random() * 16; // 18–34
    this.vx      = -(100 + Math.random() * 80);
    this.vy      = (Math.random() - 0.5) * 40;
    this.angle   = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 1.5;
    this.hp      = 1;
    this.active  = true;
    this.score   = 50;
    this.type    = 'asteroid';
    this.seed    = Math.random() * 9999;
  }

  update(dt) {
    this.x     += this.vx * dt;
    this.y     += this.vy * dt;
    this.angle += this.rotSpeed * dt;

    if (this.x < -this.r * 2 ||
        this.y < -this.r * 2 ||
        this.y > SCREEN_H + this.r * 2) {
      this.active = false;
    }
  }

  takeDamage(n) {
    this.hp -= n;
    if (this.hp <= 0) {
      this.active = false;
      return true;
    }
    return false;
  }

  getBounds() {
    return { cx: this.x, cy: this.y, r: this.r };
  }

  render(ctx) {
    drawAsteroid(ctx, this.x, this.y, this.r, this.angle, this.seed);
  }
}

// ── Base TIE class ────────────────────────────────────────────────────────────

class BaseTIE {
  constructor(x, y, pattern) {
    this.x            = x;
    this.y            = y;
    this.pattern      = pattern;
    this.active       = true;
    this.patternTimer = 0;
    this.fireTimer    = 0; // set to actual value in subclass after fireRate is defined
    this._patternBase  = y;
    this._patternPhase = Math.random() * Math.PI * 2;
    this._vDir        = Math.random() > 0.5 ? 1 : -1;
  }

  update(dt, player, enemyBullets) {
    this.patternTimer += dt;
    this.fireTimer    -= dt;
    this._updateMovement(dt, player);

    // Off-screen deactivate
    if (this.x < -60 || this.y < -60 || this.y > SCREEN_H + 60) {
      this.active = false;
    }

    // Fire
    if (this.fireTimer <= 0 && player) {
      this.fireTimer = this.fireRate;
      this._fire(player, enemyBullets);
    }
  }

  _fire(player, bullets) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = 280;
    bullets.push(new EnemyBullet(this.x, this.y, (dx / dist) * speed, (dy / dist) * speed));
  }

  getBounds() {
    return { x: this.x - 20, y: this.y - 18, w: 40, h: 36 };
  }
}

// ── TIE Fighter ───────────────────────────────────────────────────────────────

export class TIEFighter extends BaseTIE {
  constructor(x, y, pattern) {
    super(x, y, pattern);
    this.hp        = 2;
    this.speed     = 120;
    this.fireRate  = 2.5;
    this.score     = 100;
    this.type      = 'tiefighter';
    this.fireTimer = this.fireRate * Math.random(); // stagger initial fire
  }

  _updateMovement(dt, player) {
    switch (this.pattern) {
      case 'straight':
        this.x -= this.speed * dt;
        break;

      case 'wave':
        this.x -= this.speed * dt;
        this.y = this._patternBase + Math.sin(this.patternTimer * 1.2 + this._patternPhase) * 80;
        break;

      case 'v_down': {
        this.x -= this.speed * dt;
        // Bounce between 10% and 90% of screen height
        const minY = SCREEN_H * 0.1;
        const maxY = SCREEN_H * 0.9;
        this.y += this._vDir * this.speed * 0.7 * dt;
        if (this.y < minY) { this.y = minY; this._vDir = 1; }
        if (this.y > maxY) { this.y = maxY; this._vDir = -1; }
        break;
      }

      case 'dive':
        this.x -= this.speed * 0.6 * dt;
        if (player) {
          const dy = player.y - this.y;
          this.y += Math.sign(dy) * Math.min(Math.abs(dy), this.speed * 1.2 * dt);
        }
        break;

      default:
        this.x -= this.speed * dt;
        break;
    }
  }

  takeDamage(n) {
    this.hp -= n;
    if (this.hp <= 0) {
      this.active = false;
      return true;
    }
    return false;
  }

  render(ctx) {
    drawTIEFighter(ctx, this.x, this.y);
  }
}

// ── TIE Interceptor ───────────────────────────────────────────────────────────

export class TIEInterceptor extends BaseTIE {
  constructor(x, y, pattern) {
    super(x, y, pattern);
    this.hp        = 3;
    this.speed     = 160;
    this.fireRate  = 1.8;
    this.score     = 150;
    this.type      = 'tieinterceptor';
    this.fireTimer = this.fireRate * Math.random(); // stagger initial fire
  }

  _updateMovement(dt, player) {
    switch (this.pattern) {
      case 'wave':
        this.x -= this.speed * dt;
        this.y = this._patternBase + Math.sin(this.patternTimer * 1.8 + this._patternPhase) * 90;
        break;

      case 'swarm':
        this.x -= this.speed * dt;
        this.y = this._patternBase + Math.sin(this.patternTimer * 3.5 + this._patternPhase) * 70;
        break;

      case 'dive':
        this.x -= this.speed * 0.7 * dt;
        if (player) {
          const dy = player.y - this.y;
          this.y += Math.sign(dy) * Math.min(Math.abs(dy), this.speed * 1.4 * dt);
        }
        break;

      default:
        this.x -= this.speed * dt;
        break;
    }
  }

  takeDamage(n) {
    this.hp -= n;
    if (this.hp <= 0) {
      this.active = false;
      return true;
    }
    return false;
  }

  render(ctx) {
    drawTIEInterceptor(ctx, this.x, this.y);
  }
}

// ── Spawn helpers (hoisted via function declarations) ─────────────────────────

function spawnAsteroids(n, pattern) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const x = SCREEN_W + 40 + i * 60;
    const y = 40 + Math.random() * (SCREEN_H - 80);
    result.push(new Asteroid(x, y, pattern));
  }
  return result;
}

function spawnTIEs(n, pattern) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const x = SCREEN_W + 40 + i * 55;
    const y = 50 + Math.random() * (SCREEN_H - 100);
    result.push(new TIEFighter(x, y, pattern));
  }
  return result;
}

function spawnInterceptors(n, pattern) {
  const result = [];
  for (let i = 0; i < n; i++) {
    const x = SCREEN_W + 40 + i * 55;
    const y = 50 + Math.random() * (SCREEN_H - 100);
    result.push(new TIEInterceptor(x, y, pattern));
  }
  return result;
}

// ── Wave Definitions ──────────────────────────────────────────────────────────

const WAVE_DEFS = [
  // Zone 1 (progress 0.02–0.28)
  { p: 0.03, fn: () => spawnAsteroids(2, 'spread') },
  { p: 0.08, fn: () => spawnTIEs(2, 'straight') },
  { p: 0.14, fn: () => spawnAsteroids(3, 'spread') },
  { p: 0.20, fn: () => spawnTIEs(3, 'v_down') },
  { p: 0.27, fn: () => [...spawnAsteroids(2, 'spread'), ...spawnTIEs(2, 'wave')] },
  // Zone 2 (0.32–0.64)
  { p: 0.33, fn: () => spawnInterceptors(2, 'wave') },
  { p: 0.40, fn: () => spawnAsteroids(5, 'spread') },
  { p: 0.47, fn: () => [...spawnTIEs(3, 'v_down'), ...spawnInterceptors(2, 'dive')] },
  { p: 0.55, fn: () => spawnInterceptors(3, 'swarm') },
  { p: 0.62, fn: () => [...spawnAsteroids(3, 'spread'), ...spawnTIEs(2, 'wave')] },
  // Zone 3 (0.68–0.84)
  { p: 0.68, fn: () => [...spawnTIEs(4, 'v_down'), ...spawnAsteroids(2, 'spread')] },
  { p: 0.76, fn: () => spawnInterceptors(4, 'swarm') },
  { p: 0.83, fn: () => [...spawnAsteroids(3, 'spread'), ...spawnTIEs(3, 'wave')] },
];

// ── Wave Spawner ──────────────────────────────────────────────────────────────

export class WaveSpawner {
  constructor() {
    this.idx = 0;
  }

  update(progress) {
    const spawned = [];
    while (this.idx < WAVE_DEFS.length && progress >= WAVE_DEFS[this.idx].p) {
      const wave = WAVE_DEFS[this.idx].fn();
      spawned.push(...wave);
      this.idx++;
    }
    return spawned;
  }

  reset() {
    this.idx = 0;
  }
}
