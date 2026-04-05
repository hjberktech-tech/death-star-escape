// js/level2/hud2.js — HUD rendering for Level 2

import { SCREEN_W, SCREEN_H } from '../constants.js';

const ZONE_LABELS = [
  { p: 0.0,  label: 'Departure' },
  { p: 0.32, label: 'Asteroid Belt' },
  { p: 0.68, label: 'Imperial Space' },
  { p: 1.0,  label: 'Tatooine' },
];

// Draw a tiny X-Wing icon for lives display
function drawTinyXWing(ctx, x, y, scale = 0.55) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.fillStyle = '#8899aa';
  ctx.fillRect(-27, -5, 48, 10);
  ctx.beginPath();
  ctx.moveTo(21, -4); ctx.lineTo(27, 0); ctx.lineTo(21, 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#667788';
  ctx.beginPath();
  ctx.moveTo(10, -5); ctx.lineTo(18, -18); ctx.lineTo(4, -18); ctx.lineTo(-4, -5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(10, 5); ctx.lineTo(18, 18); ctx.lineTo(4, 18); ctx.lineTo(-4, 5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-4, -5); ctx.lineTo(-14, -16); ctx.lineTo(-20, -16); ctx.lineTo(-16, -5);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-4, 5); ctx.lineTo(-14, 16); ctx.lineTo(-20, 16); ctx.lineTo(-16, 5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#cc2233';
  ctx.fillRect(-10, -5, 30, 2);
  ctx.fillRect(-10, 3, 30, 2);

  ctx.restore();
}

export function renderHUD2(ctx, player, score, progress, boss) {
  ctx.save();

  // ── Top-left: Lives + HP ──────────────────────────────────────────────────

  // Lives as tiny X-Wing icons
  for (let i = 0; i < player.lives; i++) {
    drawTinyXWing(ctx, 24 + i * 38, 22);
  }

  // HP dots below lives
  const maxHp = player.maxHp;
  for (let i = 0; i < maxHp; i++) {
    const filled = i < player.hp;
    ctx.beginPath();
    ctx.arc(24 + i * 18, 42, 6, 0, Math.PI * 2);
    if (filled) {
      ctx.fillStyle = i === 0 ? '#ff4444' : i === 1 ? '#ffaa44' : '#44ff88';
      ctx.fill();
    } else {
      ctx.strokeStyle = '#446655';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // ── Center-top: Boss HP bar ───────────────────────────────────────────────

  if (boss) {
    const barW     = 320;
    const barH     = 16;
    const bx       = (SCREEN_W - barW) / 2;
    const by       = 10;
    const hpRatio  = Math.max(0, boss.totalHp / boss.totalMaxHp);

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(bx - 2, by - 2, barW + 4, barH + 22);

    // Label
    ctx.fillStyle = '#ff8844';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('IMPERIAL CRUISER', SCREEN_W / 2, by + barH + 14);

    // Bar background
    ctx.fillStyle = '#331111';
    ctx.fillRect(bx, by, barW, barH);

    // Bar fill
    ctx.fillStyle = hpRatio > 0.5 ? '#cc2222' : '#ff4400';
    ctx.fillRect(bx, by, barW * hpRatio, barH);

    // Bar border
    ctx.strokeStyle = '#aa4444';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(bx, by, barW, barH);
  }

  // ── Bottom-center: Progress bar ───────────────────────────────────────────

  const pbW  = 300;
  const pbH  = 10;
  const pbX  = (SCREEN_W - pbW) / 2;
  const pbY  = SCREEN_H - 28;

  // Background
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(pbX - 2, pbY - 16, pbW + 4, pbH + 22);

  // Zone color bands
  const zoneBands = [
    { p0: 0.00, p1: 0.32, color: 'rgba(60,80,100,0.6)' },
    { p0: 0.32, p1: 0.68, color: 'rgba(80,70,60,0.6)' },
    { p0: 0.68, p1: 1.00, color: 'rgba(80,50,50,0.6)' },
  ];
  for (const band of zoneBands) {
    ctx.fillStyle = band.color;
    ctx.fillRect(pbX + band.p0 * pbW, pbY, (band.p1 - band.p0) * pbW, pbH);
  }

  // Progress fill
  ctx.fillStyle = '#44aaff';
  ctx.fillRect(pbX, pbY, pbW * progress, pbH);

  // Border
  ctx.strokeStyle = '#445566';
  ctx.lineWidth = 1;
  ctx.strokeRect(pbX, pbY, pbW, pbH);

  // Zone dividers + labels
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  for (const zone of ZONE_LABELS) {
    const zx = pbX + zone.p * pbW;
    if (zone.p > 0 && zone.p < 1) {
      ctx.strokeStyle = '#778899';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(zx, pbY);
      ctx.lineTo(zx, pbY + pbH);
      ctx.stroke();
    }
    ctx.fillStyle = '#8899aa';
    ctx.fillText(zone.label, zx + (zone.p === 0 ? 30 : zone.p === 1 ? -30 : 0), pbY - 4);
  }

  // ── Top-right: Facing indicator ───────────────────────────────────────────

  ctx.textAlign = 'right';
  if (player.facing > 0) {
    ctx.fillStyle = '#44ff88';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('→ FORWARD', SCREEN_W - 12, 20);
  } else {
    ctx.fillStyle = '#ffaa44';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('← REVERSE', SCREEN_W - 12, 20);
  }

  // ── Bottom-left: Score ────────────────────────────────────────────────────

  ctx.textAlign = 'left';
  ctx.fillStyle = '#aaddff';
  ctx.font = '14px monospace';
  ctx.fillText(`SCORE: ${score}`, 12, SCREEN_H - 12);

  ctx.restore();
}
