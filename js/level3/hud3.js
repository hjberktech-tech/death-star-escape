// js/level3/hud3.js — HUD for Level 3 (Mos Eisley platformer)

import { SCREEN_W, SCREEN_H } from '../constants.js';

let friendlyFireTimer = 0;
let lastScore = 0;

export function renderHUD3(ctx, player, score, world, dt = 0) {
  ctx.save();

  // Friendly-fire warning
  if (score < lastScore) {
    friendlyFireTimer = 2.0;
  }
  lastScore = score;
  if (friendlyFireTimer > 0) {
    friendlyFireTimer = Math.max(0, friendlyFireTimer - dt);
    const alpha = Math.min(1, friendlyFireTimer);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = '#ff4444';
    ctx.font        = 'bold 18px monospace';
    ctx.textAlign   = 'center';
    ctx.fillText('⚠ FRIENDLY FIRE!  −POINTS', SCREEN_W / 2, 80);
    ctx.restore();
  }

  // ── Top-left: HP hearts ───────────────────────────────────────────────────
  ctx.font = '18px monospace';
  for (let i = 0; i < player.maxHp; i++) {
    const filled = i < player.hp;
    ctx.fillStyle = filled ? '#ff4444' : '#442222';
    ctx.fillText('♥', 12 + i * 24, 28);
  }

  // ── Bottom-left: Score ────────────────────────────────────────────────────
  ctx.fillStyle = '#ffcc44';
  ctx.font      = '13px monospace';
  ctx.textAlign = 'left';
  const scoreColor = score < 0 ? '#ff4444' : '#ffcc44';
  ctx.fillStyle = scoreColor;
  ctx.fillText(`SCORE: ${score >= 0 ? '+' : ''}${score}`, 12, SCREEN_H - 12);

  // ── Bottom-right: controls hint ───────────────────────────────────────────
  ctx.fillStyle = '#667788';
  ctx.font      = '10px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('W=Jump  A/D=Move  Space=Shoot', SCREEN_W - 10, SCREEN_H - 12);

  // ── Progress chevron (where is player on the map) ─────────────────────────
  const progress = Math.min(1, Math.max(0, player.x / world.WORLD_W));
  const pbW = 220, pbH = 6;
  const pbX = (SCREEN_W - pbW) / 2;
  const pbY = SCREEN_H - 16;

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(pbX - 2, pbY - 2, pbW + 4, pbH + 4);
  ctx.fillStyle = '#334455';
  ctx.fillRect(pbX, pbY, pbW, pbH);
  ctx.fillStyle = '#44aaff';
  ctx.fillRect(pbX, pbY, pbW * progress, pbH);

  // Cantina marker
  const cantX = pbX + (world.CANTINA_X / world.WORLD_W) * pbW;
  ctx.fillStyle = '#cc2200';
  ctx.fillRect(cantX - 1, pbY - 4, 2, pbH + 8);

  // Falcon marker
  const falcX = pbX + (world.FALCON_X / world.WORLD_W) * pbW;
  ctx.fillStyle = '#ffcc44';
  ctx.fillRect(falcX - 1, pbY - 4, 2, pbH + 8);

  ctx.textAlign = 'left';
  ctx.restore();
}
