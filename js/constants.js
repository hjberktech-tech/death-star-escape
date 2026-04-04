export const SCREEN_W = 960;
export const SCREEN_H = 540;
export const HALF_H = SCREEN_H / 2;
export const FOV = Math.PI / 3;
export const NUM_RAYS = SCREEN_W;
export const MAX_DEPTH = 20;
export const MOVE_SPEED = 0.05;
export const ROT_SPEED = 0.03;
export const MOUSE_SENSITIVITY = 0.002;

export const CELL = {
  FLOOR: 0,
  WALL: 1,
  WALL2: 2,
  DOOR: 3,
  BOSS_DOOR: 4,
  SPAWN: 9,
};

export const COLORS = {
  CEILING: '#1a1a2e',
  FLOOR: '#0d0d0d',
  WALL_LIGHT: '#4a4a5a',
  WALL_DARK: '#2e2e3e',
  WALL2_LIGHT: '#3a4a5a',
  WALL2_DARK: '#253040',
  DOOR_LIGHT: '#d4a020',   // bright gold — high contrast vs grey walls
  DOOR_DARK:  '#7a5a08',
  BOSS_DOOR_LIGHT: '#cc2020', // red boss door
  BOSS_DOOR_DARK:  '#6a0808',
  FOG: '#0d0d0d',
};

export const PLAYER_HEIGHT = 0.5; // eye level fraction of tile
export const PLAYER_RADIUS = 0.25;
export const PLAYER_MAX_HP = 100;
export const PLAYER_MAX_AMMO = 50;
export const PLAYER_START_AMMO = 30;

export const TROOPER_HP = 50;
export const TROOPER_DAMAGE = 10;
export const TROOPER_FIRE_INTERVAL = 1.5;
export const TROOPER_MOVE_SPEED = 0.025;
export const TROOPER_SIGHT_RANGE = 10;
export const TROOPER_ATTACK_RANGE = 1.5;

export const VADER_HP = 500;
export const VADER_DAMAGE_RANGED = 25;
export const VADER_DAMAGE_MELEE = 35;
export const VADER_DAMAGE_MELEE_P2 = 50;
export const VADER_FIRE_INTERVAL_P1 = 0.8;
export const VADER_FIRE_INTERVAL_P2 = 0.5;
export const VADER_MOVE_SPEED_P1 = 0.03;
export const VADER_MOVE_SPEED_P2 = 0.045;
export const VADER_MELEE_RANGE_P1 = 1.0;
export const VADER_MELEE_RANGE_P2 = 1.5;
