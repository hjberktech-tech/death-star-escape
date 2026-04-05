import { isWall } from './map.js';
import { Input } from './input.js';
import { EnemyState } from './enemies.js';
import AudioManager from './audio.js';

const WEAPON_DAMAGE = 25;
const FIRE_COOLDOWN = 0.25;
const BULLET_RANGE = 20;

export class Weapon {
  constructor() {
    this.fireCooldown = 0;
    this.fireAnimTimer = 0;
    this.isFiring = false;
  }

  update(dt, player, enemies, boss) {
    this.fireCooldown -= dt;
    this.fireAnimTimer -= dt;
    if (this.fireAnimTimer <= 0) this.isFiring = false;

    if (Input.consumeShoot() && this.fireCooldown <= 0) {
      if (player.ammo > 0) {
        player.ammo--;
        this.fireCooldown = FIRE_COOLDOWN;
        this.fireAnimTimer = 0.12;
        this.isFiring = true;
        AudioManager.playBlaster();
        this._doHit(player, enemies, boss);
      }
    }
  }

  _doHit(player, enemies, boss) {
    // Cast a ray straight ahead from player
    const rx = player.dirX;
    const ry = player.dirY;
    let closestDist = BULLET_RANGE;
    let hitEnemy = null;

    // Check enemies
    for (const e of enemies) {
      if (!e.active || e.state === EnemyState.DEAD) continue;
      const hit = rayCircleIntersect(player.x, player.y, rx, ry, e.x, e.y, 0.4);
      if (hit !== null && hit < closestDist) {
        // Verify no wall between player and enemy
        if (isLineOfSightClear(player.x, player.y, e.x, e.y)) {
          closestDist = hit;
          hitEnemy = e;
        }
      }
    }

    // Check boss
    if (boss && boss.active && boss.state !== EnemyState.DEAD) {
      const hit = rayCircleIntersect(player.x, player.y, rx, ry, boss.x, boss.y, 0.6);
      if (hit !== null && hit < closestDist) {
        if (isLineOfSightClear(player.x, player.y, boss.x, boss.y)) {
          closestDist = hit;
          hitEnemy = boss;
        }
      }
    }

    if (hitEnemy) hitEnemy.takeDamage(WEAPON_DAMAGE);
  }
}

function rayCircleIntersect(ox, oy, dx, dy, cx, cy, r) {
  // Returns t (distance along ray) if ray hits circle, else null
  const fx = ox - cx;
  const fy = oy - cy;
  const a = dx*dx + dy*dy;
  const b = 2*(fx*dx + fy*dy);
  const c = fx*fx + fy*fy - r*r;
  const disc = b*b - 4*a*c;
  if (disc < 0) return null;
  const t = (-b - Math.sqrt(disc)) / (2*a);
  return t > 0 ? t : null;
}

function isLineOfSightClear(ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const dist = Math.hypot(dx, dy);
  const steps = Math.ceil(dist * 5);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (isWall(ax + dx*t, ay + dy*t)) return false;
  }
  return true;
}
