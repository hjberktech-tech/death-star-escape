import { CELL } from './constants.js';

// Build 48x40 map programmatically
function buildMap() {
  const W = 48, H = 40;
  const g = Array.from({length: H}, () => new Array(W).fill(1));

  const room = (x1, y1, x2, y2) => {
    for (let y = y1; y <= y2; y++)
      for (let x = x1; x <= x2; x++)
        g[y][x] = 0;
  };
  const accent = (x1, y1, x2, y2) => {
    for (let y = y1; y <= y2; y++)
      for (let x = x1; x <= x2; x++)
        g[y][x] = 2;
  };
  const door = (x, y, t = 3) => { g[y][x] = t; };

  // ── TOP TIER (rows 1-8) ─────────────────────────────
  room(1, 1,  8,  8);   // Room A — start
  room(10, 1, 18,  8);  // Room B
  room(20, 1, 28,  8);  // Room C
  room(30, 1, 46,  8);  // Room D (large)

  // Horizontal doors between top rooms
  door(9,  4);   // A → B
  door(19, 4);   // B → C
  door(29, 4);   // C → D

  // Accent walls in top rooms
  accent(12, 6, 13, 7); // B
  accent(24, 2, 25, 3); // C
  accent(33, 6, 34, 7); // D

  // ── MIDDLE TIER (rows 10-18) ──────────────────────────
  // Row 9 stays solid (separator wall)
  room(1, 10,  8, 18);  // Room E
  room(10, 10, 23, 18); // Room F (wide)
  room(25, 10, 46, 18); // Room G (very wide)

  // Vertical doors (row 9 separator)
  door(4,  9);   // A → E
  door(14, 9);   // B → F
  door(37, 9);   // D → G

  // Horizontal doors inside middle tier
  door(9,  14);  // E → F
  door(24, 14);  // F → G

  // Accent walls in middle rooms
  accent(16, 12, 17, 13); // F
  accent(30, 12, 31, 13); // G
  accent(2,  16,  3, 17); // E

  // ── BOTTOM TIER (rows 20-28) ─────────────────────────
  // Row 19 stays solid (separator wall)
  room(1,  20, 13, 28); // Room H
  room(15, 20, 27, 28); // Room I
  room(29, 20, 46, 28); // Room J (pre-boss)

  // Vertical doors (row 19 separator)
  door(4,  19);  // E → H
  door(18, 19);  // F → I
  door(37, 19);  // G → J

  // Horizontal doors inside bottom tier
  door(14, 24); // H → I
  door(28, 24); // I → J

  // Accent walls in bottom rooms
  accent(3,  26,  4, 27); // H
  accent(19, 22, 20, 23); // I
  accent(35, 22, 36, 23); // J

  // ── BOSS ROOM (rows 30-38) ───────────────────────────
  // Row 29 stays solid (separator wall)
  room(33, 30, 46, 38); // Boss chamber

  // Boss door in separator wall
  door(39, 29, 4); // boss door: J → boss room

  // Accent walls in boss room for atmosphere
  accent(35, 33, 36, 34);
  accent(43, 33, 44, 34);
  accent(35, 36, 36, 37);
  accent(43, 36, 44, 37);

  // Player spawn marker (treated as floor)
  g[2][2] = 9;

  return g;
}

export const MAP_DATA = buildMap();
export const MAP_W = MAP_DATA[0].length; // 48
export const MAP_H = MAP_DATA.length;    // 40

// Door state: "x,y" → 'closed' | 'open' | 'locked'
const doorStates = {};

export const LEVEL_META = {
  playerStart: { x: 2.5, y: 2.5, angle: 0 },

  enemies: [
    // Room B
    { x: 14.5, y: 4.5, type: 'stormtrooper', patrol: [{x:10,y:1},{x:18,y:1},{x:18,y:8},{x:10,y:8}] },
    // Room C
    { x: 24.5, y: 4.5, type: 'stormtrooper', patrol: [{x:20,y:1},{x:28,y:1},{x:28,y:8},{x:20,y:8}] },
    // Room D (2 troopers)
    { x: 34.5, y: 3.5, type: 'stormtrooper', patrol: [{x:30,y:1},{x:40,y:1},{x:40,y:4},{x:30,y:4}] },
    { x: 42.5, y: 6.5, type: 'stormtrooper', patrol: [{x:35,y:5},{x:46,y:5},{x:46,y:8},{x:35,y:8}] },
    // Room F
    { x: 16.5, y:14.5, type: 'stormtrooper', patrol: [{x:10,y:10},{x:23,y:10},{x:23,y:18},{x:10,y:18}] },
    // Room G (2 troopers)
    { x: 30.5, y:13.5, type: 'stormtrooper', patrol: [{x:25,y:10},{x:40,y:10},{x:40,y:14},{x:25,y:14}] },
    { x: 40.5, y:16.5, type: 'stormtrooper', patrol: [{x:30,y:15},{x:46,y:15},{x:46,y:18},{x:30,y:18}] },
    // Room H
    { x:  6.5, y:24.5, type: 'stormtrooper', patrol: [{x:1,y:20},{x:13,y:20},{x:13,y:28},{x:1,y:28}] },
    // Room I
    { x: 20.5, y:24.5, type: 'stormtrooper', patrol: [{x:15,y:20},{x:27,y:20},{x:27,y:28},{x:15,y:28}] },
    // Room J (2 troopers — last line of defense before boss)
    { x: 35.5, y:24.5, type: 'stormtrooper', patrol: [{x:29,y:20},{x:40,y:20},{x:40,y:24},{x:29,y:24}] },
    { x: 42.5, y:26.5, type: 'stormtrooper', patrol: [{x:35,y:24},{x:46,y:24},{x:46,y:28},{x:35,y:28}] },
  ],

  boss: { x: 39.5, y: 34.5 },

  doors: [
    { x:  9, y:  4, type: 'normal' }, // A → B
    { x: 19, y:  4, type: 'normal' }, // B → C
    { x: 29, y:  4, type: 'normal' }, // C → D
    { x:  4, y:  9, type: 'normal' }, // A → E
    { x: 14, y:  9, type: 'normal' }, // B → F
    { x: 37, y:  9, type: 'normal' }, // D → G
    { x:  9, y: 14, type: 'normal' }, // E → F
    { x: 24, y: 14, type: 'normal' }, // F → G
    { x:  4, y: 19, type: 'normal' }, // E → H
    { x: 18, y: 19, type: 'normal' }, // F → I
    { x: 37, y: 19, type: 'normal' }, // G → J
    { x: 14, y: 24, type: 'normal' }, // H → I
    { x: 28, y: 24, type: 'normal' }, // I → J
    { x: 39, y: 29, type: 'boss'   }, // J → Boss room
  ],

  pickups: [
    // Health packs
    { x: 7.5, y: 7.5, type: 'health', amount: 25 },
    { x:15.5, y: 7.5, type: 'health', amount: 25 },
    { x:42.5, y: 7.5, type: 'health', amount: 25 },
    { x:38.5, y:16.5, type: 'health', amount: 25 },
    { x:22.5, y:27.5, type: 'health', amount: 25 },
    { x:33.5, y:27.5, type: 'health', amount: 25 },
    // Ammo packs
    { x:11.5, y: 2.5, type: 'ammo',   amount: 15 },
    { x:25.5, y: 6.5, type: 'ammo',   amount: 15 },
    { x: 3.5, y:11.5, type: 'ammo',   amount: 15 },
    { x:21.5, y:11.5, type: 'ammo',   amount: 15 },
    { x:32.5, y:16.5, type: 'ammo',   amount: 15 },
    { x:10.5, y:27.5, type: 'ammo',   amount: 15 },
    { x:25.5, y:20.5, type: 'ammo',   amount: 15 },
  ],
};

export function resetDoors() {
  for (const key of Object.keys(doorStates)) delete doorStates[key];
  for (const d of LEVEL_META.doors) {
    doorStates[`${d.x},${d.y}`] = 'closed';
  }
}
resetDoors();

export function getCell(x, y) {
  const tx = Math.floor(x), ty = Math.floor(y);
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return CELL.WALL;
  return MAP_DATA[ty][tx];
}

export function getCellRaw(tx, ty) {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return CELL.WALL;
  return MAP_DATA[ty][tx];
}

export function isWall(x, y) {
  const c = getCell(x, y);
  if (c === CELL.WALL || c === CELL.WALL2) return true;
  if (c === CELL.DOOR || c === CELL.BOSS_DOOR) {
    return doorStates[`${Math.floor(x)},${Math.floor(y)}`] !== 'open';
  }
  return false;
}

export function isDoor(x, y) {
  const c = getCell(x, y);
  return c === CELL.DOOR || c === CELL.BOSS_DOOR;
}

export function getDoorState(x, y) {
  return doorStates[`${Math.floor(x)},${Math.floor(y)}`] || null;
}

export function openDoor(x, y) {
  const key = `${Math.floor(x)},${Math.floor(y)}`;
  if (doorStates[key] === 'closed') { doorStates[key] = 'open'; return true; }
  return false;
}

export function lockDoor(x, y) {
  doorStates[`${Math.floor(x)},${Math.floor(y)}`] = 'locked';
}
