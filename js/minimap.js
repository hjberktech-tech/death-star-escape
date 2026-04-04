import { MAP_DATA, MAP_W, MAP_H } from './map.js';
import { CELL } from './constants.js';
import { EnemyState } from './enemies.js';

const TILE = 5;
const PAD = 8;

export function renderMinimap(ctx, player, enemies, boss, pickups) {
  const mapW = MAP_W * TILE;
  const mapH = MAP_H * TILE;
  const ox = PAD;
  const oy = PAD;

  // Background
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(ox - 2, oy - 2, mapW + 4, mapH + 4);

  // Tiles
  for (let ty = 0; ty < MAP_H; ty++) {
    for (let tx = 0; tx < MAP_W; tx++) {
      const c = MAP_DATA[ty][tx];
      if (c === CELL.WALL || c === CELL.WALL2) {
        ctx.fillStyle = c === CELL.WALL2 ? '#3a4a5a' : '#4a4a5a';
      } else if (c === CELL.DOOR) {
        ctx.fillStyle = '#6a5a3a';
      } else if (c === CELL.BOSS_DOOR) {
        ctx.fillStyle = '#8a3a3a';
      } else {
        ctx.fillStyle = '#1a1a1a';
      }
      ctx.fillRect(ox + tx * TILE, oy + ty * TILE, TILE, TILE);
    }
  }

  // Enemies
  for (const e of enemies) {
    if (!e.active || e.state === EnemyState.DEAD) continue;
    ctx.fillStyle = '#f00';
    ctx.fillRect(ox + e.x * TILE - 1, oy + e.y * TILE - 1, 3, 3);
  }

  // Boss
  if (boss && boss.active && !boss.isDefeated()) {
    ctx.fillStyle = boss.phase2 ? '#f44' : '#c00';
    ctx.fillRect(ox + boss.x * TILE - 2, oy + boss.y * TILE - 2, 5, 5);
  }

  // Pickups
  if (pickups) {
    for (const p of pickups) {
      if (!p.active) continue;
      ctx.fillStyle = p.type === 'health' ? '#0f8' : '#ff0';
      ctx.fillRect(ox + p.x * TILE - 1, oy + p.y * TILE - 1, 2, 2);
    }
  }

  // Player dot
  const px = ox + player.x * TILE;
  const py = oy + player.y * TILE;
  ctx.fillStyle = '#0f0';
  ctx.fillRect(px - 2, py - 2, 4, 4);

  // Player direction arrow
  ctx.strokeStyle = '#0f0';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(px + player.dirX * TILE * 1.5, py + player.dirY * TILE * 1.5);
  ctx.stroke();
}
