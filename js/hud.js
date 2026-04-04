import { SCREEN_W, SCREEN_H } from './constants.js';
import { drawBlaster, drawBlasterFire } from './assets.js';

const BLASTER_W = 220;
const BLASTER_H = 160;
let blasterCanvas = null;
let blasterFireCanvas = null;

function getBlasterCanvas() {
  if (!blasterCanvas) {
    blasterCanvas = document.createElement('canvas');
    blasterCanvas.width = BLASTER_W; blasterCanvas.height = BLASTER_H;
    drawBlaster(blasterCanvas.getContext('2d'), BLASTER_W, BLASTER_H);
  }
  return blasterCanvas;
}

function getBlasterFireCanvas() {
  if (!blasterFireCanvas) {
    blasterFireCanvas = document.createElement('canvas');
    blasterFireCanvas.width = BLASTER_W; blasterFireCanvas.height = BLASTER_H;
    drawBlasterFire(blasterFireCanvas.getContext('2d'), BLASTER_W, BLASTER_H);
  }
  return blasterFireCanvas;
}

export function renderHUD(ctx, player, weapon, boss, bossActive) {
  const padX = 14, padY = 10;

  // Red screen flash on damage
  if (player.damageFX > 0) {
    ctx.fillStyle = `rgba(180,0,0,${Math.min(0.45, player.damageFX * 1.5)})`;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  }

  // Crosshair
  const cx = SCREEN_W / 2, cy = SCREEN_H / 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy); ctx.lineTo(cx - 4, cy);
  ctx.moveTo(cx + 4,  cy); ctx.lineTo(cx + 12, cy);
  ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy - 4);
  ctx.moveTo(cx, cy + 4);  ctx.lineTo(cx, cy + 12);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(cx - 1, cy - 1, 2, 2);

  // Blocked-door message
  if (player.blockedTimer > 0) {
    ctx.fillStyle = `rgba(255,80,80,${Math.min(1, player.blockedTimer)})`;
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(player.blockedMessage, SCREEN_W / 2, SCREEN_H / 2 - 50);
    ctx.textAlign = 'left';
  }

  // Weapon sprite (bottom right)
  const wx = SCREEN_W - BLASTER_W + 20;
  const wy = SCREEN_H - BLASTER_H + 30;
  const src = weapon.isFiring ? getBlasterFireCanvas() : getBlasterCanvas();
  ctx.drawImage(src, wx, wy);

  // HUD bar background
  const barY = SCREEN_H - 44;
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fillRect(0, barY, SCREEN_W, 44);

  // Health
  ctx.fillStyle = '#aaa';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('HEALTH', padX, barY + 14);
  _drawBar(ctx, padX, barY + 18, 160, 14, player.health / player.maxHealth, '#c00', '#400');

  // Ammo
  ctx.fillStyle = '#aaa';
  ctx.fillText('AMMO', padX + 180, barY + 14);
  _drawBar(ctx, padX + 180, barY + 18, 120, 14, player.ammo / player.maxAmmo, '#f90', '#530');
  ctx.fillStyle = '#fff';
  ctx.font = '12px monospace';
  ctx.fillText(`${player.ammo}`, padX + 310, barY + 31);

  // Boss HP bar (top center)
  if (bossActive && boss && !boss.isDefeated()) {
    const bw = 320;
    const bx = (SCREEN_W - bw) / 2;
    const by = 12;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(bx - 8, by - 4, bw + 16, 34);
    ctx.fillStyle = boss.phase2 ? '#f44' : '#a22';
    ctx.font = 'bold 13px monospace';
    const label = boss.phase2 ? 'DARTH VADER  [PHASE 2]' : 'DARTH VADER';
    ctx.fillText(label, bx, by + 12);
    _drawBar(ctx, bx, by + 16, bw, 10, boss.health / boss.maxHealth, boss.phase2 ? '#f22' : '#c00', '#300');

    // Phase 2 alert
    if (boss.getPhase2AlertTimer && boss.getPhase2AlertTimer() > 0) {
      ctx.fillStyle = `rgba(200,0,0,${Math.min(1, boss.getPhase2AlertTimer())})`;
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText("HE'S DRAWN HIS SABER!", SCREEN_W / 2, SCREEN_H / 2 - 60);
      ctx.textAlign = 'left';
    }
  }
}

function _drawBar(ctx, x, y, w, h, fraction, colorFull, colorEmpty) {
  ctx.fillStyle = colorEmpty;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = colorFull;
  ctx.fillRect(x, y, Math.max(0, w * Math.min(1, fraction)), h);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);
}
