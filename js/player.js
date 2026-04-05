import {
  MOVE_SPEED, ROT_SPEED, MOUSE_SENSITIVITY,
  PLAYER_MAX_HP, PLAYER_MAX_AMMO, PLAYER_START_AMMO, PLAYER_RADIUS, CELL,
} from './constants.js';
import { isWall, isDoor, getCell, getDoorState, openDoor, LEVEL_META } from './map.js';
import { Input } from './input.js';
import AudioManager from './audio.js';

export class Player {
  constructor() {
    const s = LEVEL_META.playerStart;
    this.x = s.x;
    this.y = s.y;

    this.dirX  = Math.cos(s.angle);
    this.dirY  = Math.sin(s.angle);
    this.planeX = -this.dirY * 0.66;
    this.planeY =  this.dirX * 0.66;

    this.health    = PLAYER_MAX_HP;
    this.ammo      = PLAYER_START_AMMO;
    this.maxHealth = PLAYER_MAX_HP;
    this.maxAmmo   = PLAYER_MAX_AMMO;

    this.damageFX = 0;
    this.interactCooldown = 0;
    this.bossRoomEntered  = false;

    this.blockedMessage = '';
    this.blockedTimer   = 0;

    this._prevX = s.x;
    this._prevY = s.y;
    this.footstepAccum = 0;
  }

  // canOpenBossDoor: () => bool   called when player tries to open boss door
  // onBossRoomEntered: (x, y) called when boss door actually opens
  update(dt, canOpenBossDoor, onBossRoomEntered) {
    Input.flushMouse();

    // Rotation
    let da = 0;
    if (Input.rotLeft)  da -= ROT_SPEED;
    if (Input.rotRight) da += ROT_SPEED;
    da += Input.mouseDX * MOUSE_SENSITIVITY;

    if (da !== 0) {
      const cos = Math.cos(da), sin = Math.sin(da);
      const dx = this.dirX * cos - this.dirY * sin;
      const dy = this.dirX * sin + this.dirY * cos;
      this.dirX = dx; this.dirY = dy;
      const px = this.planeX * cos - this.planeY * sin;
      const py = this.planeX * sin + this.planeY * cos;
      this.planeX = px; this.planeY = py;
    }

    // Movement
    let mx = 0, my = 0;
    if (Input.forward)     { mx += this.dirX; my += this.dirY; }
    if (Input.back)        { mx -= this.dirX; my -= this.dirY; }
    if (Input.strafeLeft)  { mx += this.planeX / 0.66; my += this.planeY / 0.66; }
    if (Input.strafeRight) { mx -= this.planeX / 0.66; my -= this.planeY / 0.66; }

    if (mx !== 0 || my !== 0) {
      const len = Math.hypot(mx, my);
      mx = mx / len * MOVE_SPEED;
      my = my / len * MOVE_SPEED;
      const r = PLAYER_RADIUS;
      if (!isWall(this.x + mx + r * Math.sign(mx), this.y)) this.x += mx;
      if (!isWall(this.x, this.y + my + r * Math.sign(my))) this.y += my;
    }

    this.interactCooldown -= dt;
    if (Input.consumeInteract() && this.interactCooldown <= 0) {
      this._tryInteract(canOpenBossDoor, onBossRoomEntered);
      this.interactCooldown = 0.5;
    }

    if (this.damageFX   > 0) this.damageFX   -= dt;
    if (this.blockedTimer > 0) this.blockedTimer -= dt;

    // Footsteps
    const distMoved = Math.hypot(this.x - this._prevX, this.y - this._prevY);
    this._prevX = this.x;
    this._prevY = this.y;
    if (distMoved > 0) {
      this.footstepAccum += distMoved;
      if (this.footstepAccum >= 0.38) {
        this.footstepAccum = 0;
        AudioManager.playFootstep(true);
      }
    }
  }

  _tryInteract(canOpenBossDoor, onBossRoomEntered) {
    const range = 1.2;
    const fx = this.x + this.dirX * range;
    const fy = this.y + this.dirY * range;
    const tx = Math.floor(fx);
    const ty = Math.floor(fy);

    if (!isDoor(tx, ty)) return;
    if (getDoorState(tx, ty) !== 'closed') return;

    const cellType = getCell(tx, ty);
    if (cellType === CELL.BOSS_DOOR) {
      if (!canOpenBossDoor()) {
        this.blockedMessage = 'Eliminate all stormtroopers first!';
        this.blockedTimer = 2.5;
        return;
      }
      openDoor(tx, ty);
      if (!this.bossRoomEntered) {
        this.bossRoomEntered = true;
        onBossRoomEntered(tx, ty);
      }
    } else {
      openDoor(tx, ty);
    }
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    this.damageFX = 0.3;
  }

  heal(amount)     { this.health = Math.min(this.maxHealth, this.health + amount); }
  addAmmo(amount)  { this.ammo   = Math.min(this.maxAmmo,   this.ammo   + amount); }
  isDead()         { return this.health <= 0; }
  getShootDir()    { return { x: this.dirX, y: this.dirY }; }
}
