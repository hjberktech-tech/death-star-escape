import { SCREEN_W, SCREEN_H, HALF_H, MAX_DEPTH, COLORS, CELL } from './constants.js';
import { getCellRaw, getDoorState } from './map.js';

// Returns zBuffer array (length SCREEN_W) and draws walls to ctx
export function castAndRender(ctx, player) {
  const zBuffer = new Float32Array(SCREEN_W);

  // Draw ceiling and floor first
  ctx.fillStyle = COLORS.CEILING;
  ctx.fillRect(0, 0, SCREEN_W, HALF_H);
  ctx.fillStyle = COLORS.FLOOR;
  ctx.fillRect(0, HALF_H, SCREEN_W, HALF_H);

  for (let x = 0; x < SCREEN_W; x++) {
    const cameraX = (2 * x / SCREEN_W) - 1;
    const rayDirX = player.dirX + player.planeX * cameraX;
    const rayDirY = player.dirY + player.planeY * cameraX;

    let mapX = Math.floor(player.x);
    let mapY = Math.floor(player.y);

    const deltaDistX = Math.abs(1 / rayDirX);
    const deltaDistY = Math.abs(1 / rayDirY);

    let stepX, stepY, sideDistX, sideDistY;
    if (rayDirX < 0) { stepX = -1; sideDistX = (player.x - mapX) * deltaDistX; }
    else             { stepX =  1; sideDistX = (mapX + 1 - player.x) * deltaDistX; }
    if (rayDirY < 0) { stepY = -1; sideDistY = (player.y - mapY) * deltaDistY; }
    else             { stepY =  1; sideDistY = (mapY + 1 - player.y) * deltaDistY; }

    let hit = false;
    let side = 0;
    let cellType = 0;
    let depth = 0;

    while (!hit && depth < MAX_DEPTH) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      depth++;
      const c = getCellRaw(mapX, mapY);
      if (c === CELL.WALL || c === CELL.WALL2) {
        hit = true;
        cellType = c;
      } else if (c === CELL.DOOR || c === CELL.BOSS_DOOR) {
        const state = getDoorState(mapX, mapY);
        if (state !== 'open') {
          hit = true;
          cellType = c;
        }
      }
    }

    if (!hit) { zBuffer[x] = MAX_DEPTH; continue; }

    const perpDist = side === 0
      ? sideDistX - deltaDistX
      : sideDistY - deltaDistY;

    zBuffer[x] = perpDist;

    const lineHeight = Math.floor(SCREEN_H / perpDist);
    const drawStart = Math.max(0, HALF_H - lineHeight / 2) | 0;
    const drawEnd   = Math.min(SCREEN_H, HALF_H + lineHeight / 2) | 0;

    // Pick color based on cell type and side
    let color;
    if (cellType === CELL.WALL2) {
      color = side === 1 ? COLORS.WALL2_DARK : COLORS.WALL2_LIGHT;
    } else if (cellType === CELL.BOSS_DOOR) {
      color = side === 1 ? COLORS.BOSS_DOOR_DARK : COLORS.BOSS_DOOR_LIGHT;
    } else if (cellType === CELL.DOOR) {
      color = side === 1 ? COLORS.DOOR_DARK : COLORS.DOOR_LIGHT;
    } else {
      color = side === 1 ? COLORS.WALL_DARK : COLORS.WALL_LIGHT;
    }

    // Distance fog: blend toward fog color
    const fogFactor = Math.min(perpDist / MAX_DEPTH, 1);
    color = blendHex(color, COLORS.FOG, fogFactor * 0.7);

    ctx.fillStyle = color;
    ctx.fillRect(x, drawStart, 1, drawEnd - drawStart);
  }

  return zBuffer;
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function blendHex(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = (a[0] + (b[0] - a[0]) * t) | 0;
  const g = (a[1] + (b[1] - a[1]) * t) | 0;
  const bv = (a[2] + (b[2] - a[2]) * t) | 0;
  return `rgb(${r},${g},${bv})`;
}
