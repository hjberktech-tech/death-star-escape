// js/level3/cutscene3.js — Cantina cutscene: Han Solo + Chewie dialogue (fullscreen interior)

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { drawHanSolo, drawChewie, drawCantinaTable, drawCantinaInterior } from './assets3.js';

const TALK_FPS    = 3;
const GESTURE_FPS = 2;

const LINES = [
  { speaker: 'HAN',    text: '"Word travels fast out here. We heard what\nhappened with the Death Star mission..."' },
  { speaker: 'CHEWIE', text: '*RRRAAUGH!*' },
  { speaker: 'HAN',    text: '"Yeah, yeah, Chewie agrees. Look — the Empire\nwill be hunting you. You need a fast ship."' },
  { speaker: 'CHEWIE', text: '*Enthusiastic roar*' },
  { speaker: 'HAN',    text: '"The Millennium Falcon is the fastest hunk of\njunk in the galaxy. She\'ll get you out."' },
  { speaker: 'HAN',    text: '"Meet us at Docking Bay 94. Don\'t be late —\nand try not to shoot anyone on the way."' },
];

// Dialogue box dimensions (bottom of screen)
const DLG_H  = 160;
const DLG_Y  = SCREEN_H - DLG_H;

export class Cutscene3 {
  constructor() {
    this.active            = false;
    this.lineIdx           = 0;
    this.talkTimer         = 0;
    this.talkFrame         = 0;
    this.gestureFrame      = 0;
    this.gestureTimer      = 0;
    this.done              = false;
    this._advanceCooldown  = 0;
  }

  start() {
    this.active            = true;
    this.lineIdx           = 0;
    this.done              = false;
    this._advanceCooldown  = 0.5;
  }

  // Returns true when cutscene is fully finished
  update(input) {
    if (!this.active) return false;

    // Animate mouth/gesture
    this.talkTimer += 1 / 60;
    if (this.talkTimer >= 1 / TALK_FPS) {
      this.talkTimer = 0;
      this.talkFrame = (this.talkFrame + 1) % 4;
    }
    this.gestureTimer += 1 / 60;
    if (this.gestureTimer >= 1 / GESTURE_FPS) {
      this.gestureTimer = 0;
      this.gestureFrame = (this.gestureFrame + 1) % 4;
    }

    if (this._advanceCooldown > 0) {
      this._advanceCooldown -= 1 / 60;
    } else if (input.interact || input.shoot) {
      this._advanceCooldown = 0.25;
      this.lineIdx++;
      if (this.lineIdx >= LINES.length) {
        this.active = false;
        this.done   = true;
        return true;
      }
    }

    return false;
  }

  render(ctx) {
    if (!this.active) return;

    // ── Full-screen cantina interior ────────────────────────────────────────
    drawCantinaInterior(ctx);

    const line         = LINES[Math.min(this.lineIdx, LINES.length - 1)];
    const hanTalking   = line.speaker === 'HAN';
    const chewieTalking = line.speaker === 'CHEWIE';

    // ── Characters at table — drawn at 2× scale, centered ──────────────────
    const tableX  = SCREEN_W * 0.38;  // center of scene
    const feetY   = 430;

    ctx.save();
    ctx.translate(tableX, feetY);
    ctx.scale(2, 2);
    drawCantinaTable(ctx, 0, 0);
    ctx.restore();

    // Chewie (left of table)
    const chewieX = tableX - 70;
    ctx.save();
    ctx.translate(chewieX, feetY - 10);
    ctx.scale(2, 2);
    drawChewie(ctx, 0, 0, chewieTalking ? this.gestureFrame : 2);
    ctx.restore();

    // Han (right of table)
    const hanX = tableX + 70;
    ctx.save();
    ctx.translate(hanX, feetY);
    ctx.scale(2, 2);
    drawHanSolo(ctx, 0, 0, hanTalking ? this.talkFrame : 0);
    ctx.restore();

    // Speaker indicator dot above talker
    const indicatorX = hanTalking ? hanX : chewieX;
    if (Math.floor(Date.now() / 400) % 2 === 0) {
      ctx.fillStyle = '#ffcc44';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('▼', indicatorX, feetY - 120);
      ctx.textAlign = 'left';
    }

    // ── Dialogue box at bottom ──────────────────────────────────────────────
    // Dark semi-transparent panel
    ctx.fillStyle = 'rgba(8,4,2,0.88)';
    ctx.fillRect(0, DLG_Y, SCREEN_W, DLG_H);
    // Top border
    ctx.fillStyle = '#cc9944';
    ctx.fillRect(0, DLG_Y, SCREEN_W, 3);
    // Separator between character column and text column
    const sepX = 200;
    ctx.fillStyle = '#4a3010';
    ctx.fillRect(sepX, DLG_Y + 3, 2, DLG_H - 3);

    // Speaker portrait label
    ctx.fillStyle = '#ffcc44';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(hanTalking ? 'HAN SOLO' : 'CHEWBACCA', sepX / 2, DLG_Y + 22);

    // Small portrait at bottom-left
    ctx.save();
    ctx.translate(sepX / 2, DLG_Y + DLG_H - 30);
    ctx.scale(1.2, 1.2);
    if (hanTalking) {
      drawHanSolo(ctx, 0, 0, this.talkFrame);
    } else {
      drawChewie(ctx, 0, 0, this.gestureFrame);
    }
    ctx.restore();

    // Dialogue text
    const textX = sepX + 20;
    ctx.fillStyle = '#ffcc44';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(hanTalking ? 'Han Solo:' : 'Chewbacca:', textX, DLG_Y + 22);

    ctx.fillStyle = '#eeddcc';
    ctx.font = '13px monospace';
    const textLines = line.text.split('\n');
    textLines.forEach((tl, i) => {
      ctx.fillText(tl, textX, DLG_Y + 46 + i * 22);
    });

    // Progress dots
    const dotY = DLG_Y + DLG_H - 22;
    for (let i = 0; i < LINES.length; i++) {
      ctx.fillStyle = i === this.lineIdx ? '#ffcc44' : '#664422';
      ctx.fillRect(textX + i * 14, dotY, 8, 8);
    }

    // Continue prompt (blink)
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      ctx.fillStyle = '#aaaaaa';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      const isLast = this.lineIdx === LINES.length - 1;
      ctx.fillText(isLast ? '[SPACE] Exit cantina' : '[SPACE] Continue',
                   SCREEN_W - 14, DLG_Y + DLG_H - 8);
    }

    ctx.textAlign = 'left';
  }
}
