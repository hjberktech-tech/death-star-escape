// js/level3/characters3.js — All NPC / enemy characters for Level 3

import { SCREEN_W } from '../constants.js';
import { drawStormtrooper, drawBountyHunter, drawCivilian,
         drawRebelNPC, drawOfficer, drawBullet3 } from './assets3.js';
import { GROUND_Y, SPAWN_DATA } from './world3.js';
import { Explosion } from '../level2/enemies2.js';

const WALK_FPS      = 7;
const BULLET_SPEED  = 380; // px/s enemy bullets
const FIRE_RANGE    = 320; // px — enemy starts shooting
const ALERT_RANGE   = 380; // px — enemy wakes up

// Small indicator dot drawn above a character's head
function _indicator(ctx, sx, feetY, color) {
  ctx.fillStyle = color;
  ctx.fillRect(sx - 3, feetY - 62, 6, 6);
}

// ── Enemy bullet (horizontal only) ───────────────────────────────────────────
class EnemyBullet3 {
  constructor(x, y, facing) {
    this.x      = x;
    this.y      = y;
    this.vx     = facing * BULLET_SPEED;
    this.active = true;
    this.facing = facing;
  }
  update(dt) {
    this.x += this.vx * dt;
    if (this.x < -200 || this.x > 5000) this.active = false;
  }
}

// ── Base character ────────────────────────────────────────────────────────────
class Character3 {
  constructor(data) {
    this.x          = data.x;
    this.y          = GROUND_Y;
    this.facing     = 1;
    this.walkFrame  = 0;
    this.walkTimer  = 0;
    this.active     = true;
    this.patrolCX   = data.x;        // patrol centre
    this.patrolR    = data.patrol;    // patrol radius
    this.alerted    = false;
    this.hp         = 2;
    this.scoreValue = 0;
    this.friendly   = false;
    this.fireTimer  = 1 + Math.random() * 1.5;
    this.bullets    = [];
    this.dead       = false;
    this.deathTimer = 0;
    this.deathVy    = 0;
  }

  get halfW() { return 9; }

  _walkAnim(dt, moving) {
    if (moving) {
      this.walkTimer += dt;
      this.walkFrame = Math.floor(this.walkTimer * WALK_FPS) % 4;
    } else {
      this.walkFrame = 0;
    }
  }

  hit(dmg) {
    if (this.dead)     return null;
    if (this.friendly) return 'friendly';
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.hp         = 0;
      this.dead       = true;
      this.deathTimer = 0.55;
      this.deathVy    = -200;  // initial upward kick
      this.bullets    = [];    // drop bullets on death
      return 'killed';
    }
    return 'hit';
  }

  // Call from subclass update() when dead=true
  _updateDeath(dt) {
    this.deathVy    += 480 * dt;  // gravity
    this.y          += this.deathVy * dt;
    this.deathTimer -= dt;
    if (this.deathTimer <= 0) this.active = false;
  }

  _updateBullets(dt) {
    for (const b of this.bullets) b.update(dt);
    this.bullets = this.bullets.filter(b => b.active);
  }

  renderBullets(ctx, cameraX) {
    for (const b of this.bullets) {
      if (!b.active) continue;
      drawBullet3(ctx, b.x - cameraX, b.y, b.facing);
    }
  }
}

// ── Stormtrooper ──────────────────────────────────────────────────────────────
class Stormtrooper extends Character3 {
  constructor(data) {
    super(data);
    this.hp         = 2;
    this.scoreValue = 100;
    this.fireRate   = 2.0;
    this.fireTimer  = this.fireRate * Math.random();
    this.speed      = 70;
  }

  update(dt, player) {
    if (!this.active) return;
    if (this.dead) { this._updateDeath(dt); return; }
    this._updateBullets(dt);

    const dx    = player.x - this.x;
    const dist  = Math.abs(dx);

    // Alert / patrol logic
    if (dist < ALERT_RANGE) this.alerted = true;

    let moving = false;
    if (this.alerted) {
      // Chase until within fire range, then stop and shoot
      if (dist > FIRE_RANGE * 0.7) {
        this.x      += Math.sign(dx) * this.speed * dt;
        this.facing  = Math.sign(dx);
        moving       = true;
      } else {
        this.facing = Math.sign(dx) || 1;
      }

      // Fire
      this.fireTimer -= dt;
      if (this.fireTimer <= 0 && dist < FIRE_RANGE && !player.dead) {
        this.fireTimer = this.fireRate;
        this.bullets.push(new EnemyBullet3(
          this.x + this.facing * 14, this.y - 25, this.facing));
      }
    } else {
      // Patrol
      const edge = Math.abs(this.x - this.patrolCX) > this.patrolR;
      if (edge) this.facing = Math.sign(this.patrolCX - this.x) || 1;
      this.x += this.facing * this.speed * 0.5 * dt;
      moving = true;
    }

    // Clamp patrol
    if (!this.alerted) {
      this.x = Math.max(this.patrolCX - this.patrolR,
               Math.min(this.patrolCX + this.patrolR, this.x));
    }

    this._walkAnim(dt, moving);
  }

  render(ctx, cameraX) {
    if (!this.active) return;
    const sx = this.x - cameraX;
    if (sx < -60 || sx > SCREEN_W + 60) return;
    if (this.dead) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.deathTimer / 0.55);
      drawStormtrooper(ctx, sx, this.y, this.facing, 0, false);
      ctx.restore();
      return;
    }
    _indicator(ctx, sx, this.y, '#ff3322');
    drawStormtrooper(ctx, sx, this.y, this.facing, this.walkFrame, this.alerted);
    this.renderBullets(ctx, cameraX);
  }
}

// ── Bounty Hunter (faster, same AI but harder) ────────────────────────────────
class BountyHunter extends Character3 {
  constructor(data) {
    super(data);
    this.hp         = 3;
    this.scoreValue = 150;
    this.fireRate   = 1.4;
    this.fireTimer  = this.fireRate * Math.random();
    this.speed      = 110;
  }

  update(dt, player) {
    if (!this.active) return;
    if (this.dead) { this._updateDeath(dt); return; }
    this._updateBullets(dt);

    const dx   = player.x - this.x;
    const dist = Math.abs(dx);

    if (dist < ALERT_RANGE + 60) this.alerted = true;

    let moving = false;
    if (this.alerted) {
      if (dist > FIRE_RANGE * 0.6) {
        this.x     += Math.sign(dx) * this.speed * dt;
        this.facing = Math.sign(dx);
        moving      = true;
      } else {
        this.facing = Math.sign(dx) || 1;
      }
      this.fireTimer -= dt;
      if (this.fireTimer <= 0 && dist < FIRE_RANGE + 60 && !player.dead) {
        this.fireTimer = this.fireRate;
        this.bullets.push(new EnemyBullet3(
          this.x + this.facing * 14, this.y - 25, this.facing));
      }
    } else {
      const edge = Math.abs(this.x - this.patrolCX) > this.patrolR;
      if (edge) this.facing = Math.sign(this.patrolCX - this.x) || 1;
      this.x += this.facing * this.speed * 0.5 * dt;
      moving = true;
    }

    if (!this.alerted) {
      this.x = Math.max(this.patrolCX - this.patrolR,
               Math.min(this.patrolCX + this.patrolR, this.x));
    }
    this._walkAnim(dt, moving);
  }

  render(ctx, cameraX) {
    if (!this.active) return;
    const sx = this.x - cameraX;
    if (sx < -60 || sx > SCREEN_W + 60) return;
    if (this.dead) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.deathTimer / 0.55);
      drawBountyHunter(ctx, sx, this.y, this.facing, 0);
      ctx.restore();
      return;
    }
    _indicator(ctx, sx, this.y, '#ff3322');
    drawBountyHunter(ctx, sx, this.y, this.facing, this.walkFrame);
    this.renderBullets(ctx, cameraX);
  }
}

// ── Imperial Officer (stays back, fires quickly) ──────────────────────────────
class Officer extends Character3 {
  constructor(data) {
    super(data);
    this.hp         = 2;
    this.scoreValue = 200;
    this.fireRate   = 1.2;
    this.fireTimer  = this.fireRate * Math.random();
  }

  update(dt, player) {
    if (!this.active) return;
    if (this.dead) { this._updateDeath(dt); return; }
    this._updateBullets(dt);

    const dx   = player.x - this.x;
    const dist = Math.abs(dx);

    if (dist < ALERT_RANGE) this.alerted = true;

    if (this.alerted) {
      this.facing = Math.sign(dx) || 1;
      // Slowly back away if too close
      if (dist < 160) {
        this.x -= Math.sign(dx) * 40 * dt;
      }
      this.fireTimer -= dt;
      if (this.fireTimer <= 0 && dist < FIRE_RANGE + 80 && !player.dead) {
        this.fireTimer = this.fireRate;
        this.bullets.push(new EnemyBullet3(
          this.x + this.facing * 14, this.y - 28, this.facing));
      }
    } else {
      const edge = Math.abs(this.x - this.patrolCX) > this.patrolR;
      if (edge) this.facing = Math.sign(this.patrolCX - this.x) || 1;
      this.x += this.facing * 40 * dt;
    }

    if (!this.alerted) {
      this.x = Math.max(this.patrolCX - this.patrolR,
               Math.min(this.patrolCX + this.patrolR, this.x));
    }
    this._walkAnim(dt, !this.alerted);
  }

  render(ctx, cameraX) {
    if (!this.active) return;
    const sx = this.x - cameraX;
    if (sx < -60 || sx > SCREEN_W + 60) return;
    if (this.dead) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.deathTimer / 0.55);
      drawOfficer(ctx, sx, this.y, this.facing, 0);
      ctx.restore();
      return;
    }
    _indicator(ctx, sx, this.y, '#ff3322');
    drawOfficer(ctx, sx, this.y, this.facing, this.walkFrame);
    this.renderBullets(ctx, cameraX);
  }
}

// ── Civilian (friendly — wanders, no shooting) ────────────────────────────────
class Civilian extends Character3 {
  constructor(data) {
    super(data);
    this.friendly   = true;
    this.hp         = 1;
    this.scoreValue = -50; // penalty
    this.speed      = 45;
    this.variant    = data.variant ?? 0;
  }

  update(dt, player) {
    if (!this.active) return;
    if (this.dead) { this._updateDeath(dt); return; }
    // Simple patrol wander
    const edge = Math.abs(this.x - this.patrolCX) > this.patrolR;
    if (edge) this.facing = Math.sign(this.patrolCX - this.x) || 1;
    this.x += this.facing * this.speed * dt;
    this.x = Math.max(this.patrolCX - this.patrolR,
             Math.min(this.patrolCX + this.patrolR, this.x));
    this._walkAnim(dt, true);
  }

  render(ctx, cameraX) {
    if (!this.active) return;
    const sx = this.x - cameraX;
    if (sx < -60 || sx > SCREEN_W + 60) return;
    if (this.dead) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.deathTimer / 0.55);
      drawCivilian(ctx, sx, this.y, this.facing, 0, this.variant);
      ctx.restore();
      return;
    }
    _indicator(ctx, sx, this.y, '#33ff55');
    drawCivilian(ctx, sx, this.y, this.facing, this.walkFrame, this.variant);
  }
}

// ── Rebel NPC (friendly — moves right with player direction) ──────────────────
class RebelNPC extends Character3 {
  constructor(data) {
    super(data);
    this.friendly   = true;
    this.hp         = 1;
    this.scoreValue = -100;
    this.speed      = 55;
  }

  update(dt, player) {
    if (!this.active) return;
    if (this.dead) { this._updateDeath(dt); return; }
    const edge = Math.abs(this.x - this.patrolCX) > this.patrolR;
    if (edge) this.facing = Math.sign(this.patrolCX - this.x) || 1;
    this.x += this.facing * this.speed * dt;
    this.x = Math.max(this.patrolCX - this.patrolR,
             Math.min(this.patrolCX + this.patrolR, this.x));
    this._walkAnim(dt, true);
  }

  render(ctx, cameraX) {
    if (!this.active) return;
    const sx = this.x - cameraX;
    if (sx < -60 || sx > SCREEN_W + 60) return;
    if (this.dead) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.deathTimer / 0.55);
      drawRebelNPC(ctx, sx, this.y, this.facing, 0);
      ctx.restore();
      return;
    }
    _indicator(ctx, sx, this.y, '#33ff55');
    drawRebelNPC(ctx, sx, this.y, this.facing, this.walkFrame);
  }
}

// ── Characters manager ────────────────────────────────────────────────────────
export class Characters3 {
  constructor() {
    this.all      = [];
    this.explosions = [];
    this._build();
  }

  _build() {
    for (const d of SPAWN_DATA) {
      switch (d.type) {
        case 'stormtrooper': this.all.push(new Stormtrooper(d)); break;
        case 'bountyHunter': this.all.push(new BountyHunter(d)); break;
        case 'officer':      this.all.push(new Officer(d));      break;
        case 'civilian':     this.all.push(new Civilian(d));     break;
        case 'rebelNPC':     this.all.push(new RebelNPC(d));     break;
      }
    }
  }

  // Returns score delta for player bullet hits this frame
  checkBulletHits(bullets) {
    let total = 0;
    for (const b of bullets) {
      if (!b.active) continue;
      for (const ch of this.all) {
        if (!ch.active || ch.dead) continue;
        if (Math.abs(b.x - ch.x) < 22 && Math.abs(b.y - ch.y) < 32) {
          b.active = false;
          const result = ch.hit(1);
          if (result === 'killed' || result === 'friendly') {
            total += ch.scoreValue;
            this.explosions.push(
              new Explosion(ch.x, ch.y - 20, ch.friendly ? 0.6 : 1.0));
          }
          break;
        }
      }
    }
    return total;
  }

  // Check enemy bullets vs player — returns true if player was hit.
  // Uses player body range (feet up to ~50px) so bullets at ground level
  // don't hit a player standing on a platform above.
  checkEnemyHits(player) {
    const bodyBot = player.y + 4;
    const bodyTop = player.y - 50;
    for (const ch of this.all) {
      for (const b of ch.bullets) {
        if (!b.active) continue;
        if (Math.abs(b.x - player.x) < 18 && b.y >= bodyTop && b.y <= bodyBot) {
          b.active = false;
          return true;
        }
      }
    }
    return false;
  }

  update(dt, player) {
    for (const ch of this.all) ch.update(dt, player);
    for (const ex of this.explosions) ex.update(dt);
    this.explosions = this.explosions.filter(ex => !ex.done);
  }

  render(ctx, cameraX) {
    for (const ch of this.all) ch.render(ctx, cameraX);
    for (const ex of this.explosions) ex.render(ctx);
  }

  get enemyBullets() {
    return this.all.flatMap(ch => ch.bullets);
  }
}
