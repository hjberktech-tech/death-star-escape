import {
  TROOPER_HP, TROOPER_DAMAGE, TROOPER_FIRE_INTERVAL,
  TROOPER_MOVE_SPEED, TROOPER_SIGHT_RANGE, TROOPER_ATTACK_RANGE,
} from './constants.js';
import { isWall } from './map.js';
import AudioManager from './audio.js';

export const EnemyState = {
  PATROL: 'patrol',
  ALERT: 'alert',
  ATTACK: 'attack',
  SEARCH: 'search',
  PAIN: 'pain',
  DEAD: 'dead',
};

export class Enemy {
  constructor(data) {
    this.x = data.x;
    this.y = data.y;
    this.type = data.type || 'stormtrooper';
    this.patrol = data.patrol ? data.patrol.map(p => ({ x: p.x + 0.5, y: p.y + 0.5 })) : [];
    this.patrolIdx = 0;

    this.health = TROOPER_HP;
    this.maxHealth = TROOPER_HP;
    this.damage = TROOPER_DAMAGE;
    this.fireInterval = TROOPER_FIRE_INTERVAL;
    this.moveSpeed = TROOPER_MOVE_SPEED;
    this.sightRange = TROOPER_SIGHT_RANGE;
    this.attackRange = TROOPER_ATTACK_RANGE;

    this.state = EnemyState.PATROL;
    this.stateTimer = 0;
    this.fireCooldown = this.fireInterval * Math.random(); // stagger initial shots
    this.lastKnownX = null;
    this.lastKnownY = null;
    this.active = true;
    this.animFrame = 0;
    this.animTimer = 0;
    this.phase2 = false;

    this._prevX = data.x;
    this._prevY = data.y;
    this.footstepAccum = 0;

    // Audio flags — consumed by main.js each frame
    this.alertSoundPending = false;
    this.deathSoundPending = false;
  }

  update(dt, player) {
    if (!this.active) return;

    this.stateTimer -= dt;
    this.fireCooldown -= dt;
    this.animTimer += dt;
    if (this.animTimer > 0.25) { this.animTimer = 0; this.animFrame = (this.animFrame + 1) % 4; }

    const dist = Math.hypot(player.x - this.x, player.y - this.y);
    const canSee = dist < this.sightRange && hasLOS(this.x, this.y, player.x, player.y);

    switch (this.state) {
      case EnemyState.PATROL:
        this._patrol(dt);
        if (canSee) this._enter(EnemyState.ALERT);
        break;

      case EnemyState.ALERT:
        this._faceTarget(player.x, player.y);
        if (this.stateTimer <= 0) this._enter(EnemyState.ATTACK);
        if (!canSee && this.stateTimer <= 0) {
          this.lastKnownX = player.x; this.lastKnownY = player.y;
          this._enter(EnemyState.SEARCH);
        }
        break;

      case EnemyState.ATTACK:
        if (canSee) {
          this.lastKnownX = player.x; this.lastKnownY = player.y;
          if (dist > this.attackRange) this._moveToward(player.x, player.y, dt);
          if (this.fireCooldown <= 0) {
            this._shoot(dist, player);
            this.fireCooldown = this.fireInterval;
          }
        } else {
          this._enter(EnemyState.SEARCH);
        }
        break;

      case EnemyState.SEARCH:
        if (canSee) { this._enter(EnemyState.ALERT); break; }
        if (this.lastKnownX !== null) {
          const d = Math.hypot(this.lastKnownX - this.x, this.lastKnownY - this.y);
          if (d > 0.2) {
            this._moveToward(this.lastKnownX, this.lastKnownY, dt);
          } else if (this.stateTimer <= 0) {
            this._enter(EnemyState.PATROL);
          }
        } else {
          this._enter(EnemyState.PATROL);
        }
        break;

      case EnemyState.PAIN:
        if (this.stateTimer <= 0) this._enter(EnemyState.ATTACK);
        break;

      case EnemyState.DEAD:
        // death anim
        if (this.stateTimer <= 0) this.active = false;
        break;
    }

    // Footsteps — only for nearby moving enemies
    const distMoved    = Math.hypot(this.x - this._prevX, this.y - this._prevY);
    const distToPlayer = Math.hypot(player.x - this.x, player.y - this.y);
    if (distMoved > 0 && distToPlayer < 7 &&
        this.state !== EnemyState.DEAD && this.state !== EnemyState.PAIN) {
      this.footstepAccum += distMoved;
      if (this.footstepAccum >= 0.45) {
        this.footstepAccum = 0;
        AudioManager.playFootstep(false);
      }
    }
    this._prevX = this.x;
    this._prevY = this.y;
  }

  takeDamage(amount) {
    if (this.state === EnemyState.DEAD) return;
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this._enter(EnemyState.DEAD);
    } else {
      this._enter(EnemyState.PAIN);
    }
  }

  _enter(state) {
    this.state = state;
    switch (state) {
      case EnemyState.ALERT:
        this.stateTimer = 0.5;
        this.alertSoundPending = true;
        break;
      case EnemyState.SEARCH: this.stateTimer = 3.0; break;
      case EnemyState.PAIN:   this.stateTimer = 0.2; break;
      case EnemyState.DEAD:
        this.stateTimer = 0.8;
        this.animFrame  = 0;
        this.deathSoundPending = true;
        break;
    }
  }

  _patrol(dt) {
    if (this.patrol.length === 0) return;
    const target = this.patrol[this.patrolIdx];
    const d = Math.hypot(target.x - this.x, target.y - this.y);
    if (d < 0.15) {
      this.patrolIdx = (this.patrolIdx + 1) % this.patrol.length;
    } else {
      this._moveToward(target.x, target.y, dt);
    }
  }

  _moveToward(tx, ty, dt) {
    const dx = tx - this.x;
    const dy = ty - this.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.01) return;
    const mx = (dx / len) * this.moveSpeed;
    const my = (dy / len) * this.moveSpeed;
    const r = 0.3;
    if (!isWall(this.x + mx + r * Math.sign(mx), this.y)) this.x += mx;
    if (!isWall(this.x, this.y + my + r * Math.sign(my))) this.y += my;
  }

  _faceTarget(tx, ty) {
    // No visual rotation stored, just track direction conceptually
    this.lastKnownX = tx;
    this.lastKnownY = ty;
  }

  _shoot(dist, player) {
    const hitChance = Math.max(0.05, Math.min(0.7, 1 - dist / 10));
    if (Math.random() < hitChance) {
      player.takeDamage(this.damage);
    }
    this.animFrame = 3; // fire frame
  }
}

export function hasLOS(ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const dist = Math.hypot(dx, dy);
  const steps = Math.ceil(dist * 5);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (isWall(ax + dx * t, ay + dy * t)) return false;
  }
  return true;
}

export function updateAllEnemies(enemies, player, dt) {
  for (const e of enemies) {
    e.update(dt, player);
  }
}
