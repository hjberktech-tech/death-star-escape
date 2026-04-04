import {
  VADER_HP,
  VADER_DAMAGE_MELEE, VADER_DAMAGE_MELEE_P2,
  VADER_MOVE_SPEED_P1, VADER_MOVE_SPEED_P2,
  VADER_MELEE_RANGE_P1, VADER_MELEE_RANGE_P2,
} from './constants.js';
import { Enemy, EnemyState } from './enemies.js';
import { LEVEL_META } from './map.js';

export class DarthVader extends Enemy {
  constructor() {
    const meta = LEVEL_META.boss;
    super({ x: meta.x, y: meta.y, type: 'vader', patrol: [] });

    this.health    = VADER_HP;
    this.maxHealth = VADER_HP;
    this.moveSpeed = VADER_MOVE_SPEED_P1;
    this.sightRange = 30; // Force — always knows player position
    this.attackRange = VADER_MELEE_RANGE_P1;

    this.meleeDamage      = VADER_DAMAGE_MELEE;
    this.meleeCooldown    = 0.9;
    this._meleeCooldownTimer = 0;

    this.phase2 = false;
    this.phase2AlertTimer = 0;

    this.active = false; // activated when player enters boss room
    this.state  = EnemyState.PATROL;
    this.deathCallbackFired = false;
  }

  activate() {
    this.active = true;
    this._enter(EnemyState.ATTACK);
  }

  update(dt, player) {
    if (!this.active) return;

    this.stateTimer -= dt;
    this._meleeCooldownTimer -= dt;
    this.animTimer += dt;
    if (this.animTimer > 0.2) { this.animTimer = 0; this.animFrame = (this.animFrame + 1) % 4; }
    if (this.phase2AlertTimer > 0) this.phase2AlertTimer -= dt;

    // Phase 2 transition at 50 % HP
    if (!this.phase2 && this.health <= VADER_HP / 2) {
      this.phase2 = true;
      this.phase2AlertTimer = 3.0;
      this.moveSpeed   = VADER_MOVE_SPEED_P2;
      this.attackRange = VADER_MELEE_RANGE_P2;
      this.meleeDamage = VADER_DAMAGE_MELEE_P2;
      this.meleeCooldown = 0.6;
    }

    if (this.state === EnemyState.DEAD) {
      if (this.stateTimer <= 0 && !this.deathCallbackFired) {
        this.deathCallbackFired = true;
        this.active = false;
      }
      return;
    }

    if (this.state === EnemyState.PAIN) {
      if (this.stateTimer <= 0) this._enter(EnemyState.ATTACK);
      return;
    }

    const dist = Math.hypot(player.x - this.x, player.y - this.y);

    // Always pursue player (Force awareness)
    if (dist > this.attackRange) {
      this._moveToward(player.x, player.y, dt);
    }

    // Lightsaber melee — must be close
    if (dist <= this.attackRange && this._meleeCooldownTimer <= 0) {
      player.takeDamage(this.meleeDamage);
      this._meleeCooldownTimer = this.meleeCooldown;
      this.animFrame = 3; // swing animation frame
    }
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

  isDead()     { return this.state === EnemyState.DEAD; }
  isDefeated() { return this.deathCallbackFired; }
  getPhase2AlertTimer() { return this.phase2AlertTimer; }
}
