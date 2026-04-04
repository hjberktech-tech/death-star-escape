import { SCREEN_W, SCREEN_H, HALF_H, FOV } from './constants.js';
import { drawStormtrooper, drawDarthVader, drawHealthPack, drawAmmoPack } from './assets.js';
import { EnemyState } from './enemies.js';

const SPRITE_CANVAS_SIZE = 128;
const SPRITE_CACHE = {};

function getSpriteCanvas(key, drawFn) {
  if (!SPRITE_CACHE[key]) {
    const c = document.createElement('canvas');
    c.width = SPRITE_CANVAS_SIZE;
    c.height = SPRITE_CANVAS_SIZE;
    drawFn(c.getContext('2d'), SPRITE_CANVAS_SIZE, SPRITE_CANVAS_SIZE);
    SPRITE_CACHE[key] = c;
  }
  return SPRITE_CACHE[key];
}

export function renderSprites(ctx, entities, player, zBuffer) {
  // Compute angle and distance for each entity
  const visible = [];
  for (const e of entities) {
    if (!e.active) continue;

    const dx = e.x - player.x;
    const dy = e.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.1) continue;

    // Angle of sprite relative to player direction
    // Using atan2 of sprite in camera space
    const invDet = 1.0 / (player.planeX * player.dirY - player.dirX * player.planeY);
    const transformX = invDet * (player.dirY * dx - player.dirX * dy);
    const transformY = invDet * (-player.planeY * dx + player.planeX * dy);

    if (transformY <= 0.1) continue; // behind player

    const screenX = (SCREEN_W / 2) * (1 + transformX / transformY);

    const spriteHeight = Math.abs(Math.floor(SCREEN_H / transformY));
    const spriteWidth = spriteHeight; // 1:1 aspect

    const drawStartX = Math.floor(screenX - spriteWidth / 2);
    const drawEndX   = Math.floor(screenX + spriteWidth / 2);
    const drawStartY = Math.floor(HALF_H - spriteHeight / 2);

    visible.push({ e, dist, transformY, screenX, spriteHeight, spriteWidth, drawStartX, drawEndX, drawStartY });
  }

  // Sort farthest first (painter's algorithm)
  visible.sort((a, b) => b.dist - a.dist);

  for (const s of visible) {
    const { e, transformY, spriteHeight, spriteWidth, drawStartX, drawEndX, drawStartY } = s;

    // Get sprite canvas
    const isDead = e.state === EnemyState.DEAD;
    const frame = isDead ? 0 : e.animFrame;
    const isPhase2 = e.phase2 || false;

    let spriteCanvas;
    if (e.type === 'health') {
      spriteCanvas = getSpriteCanvas('health', (ctx2, w, h) => drawHealthPack(ctx2, w, h));
    } else if (e.type === 'ammo') {
      spriteCanvas = getSpriteCanvas('ammo', (ctx2, w, h) => drawAmmoPack(ctx2, w, h));
    } else if (e.type === 'vader') {
      const key = `vader_${frame}_${isPhase2}_${isDead}`;
      spriteCanvas = getSpriteCanvas(key, (ctx2, w, h) =>
        drawDarthVader(ctx2, w, h, frame, isPhase2, isDead));
    } else {
      const key = `trooper_${frame}_${isDead}`;
      spriteCanvas = getSpriteCanvas(key, (ctx2, w, h) =>
        drawStormtrooper(ctx2, w, h, frame, isDead));
    }

    // Draw column by column, clipping against zBuffer
    for (let sx = Math.max(0, drawStartX); sx < Math.min(SCREEN_W, drawEndX); sx++) {
      if (transformY >= zBuffer[sx]) continue; // wall in front

      // Source x in sprite texture
      const texX = Math.floor((sx - drawStartX) / spriteWidth * SPRITE_CANVAS_SIZE);
      if (texX < 0 || texX >= SPRITE_CANVAS_SIZE) continue;

      ctx.drawImage(
        spriteCanvas,
        texX, 0, 1, SPRITE_CANVAS_SIZE,     // source strip
        sx, drawStartY, 1, spriteHeight      // dest strip
      );
    }
  }
}
