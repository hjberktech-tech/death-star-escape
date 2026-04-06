// js/level3/cutscene3.js — Cantina cutscene: Han Solo + Chewie dialogue

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { drawHanSolo, drawChewie, drawCantinaTable } from './assets3.js';

const PANEL_H      = 220;  // overlay height from bottom
const PANEL_Y      = SCREEN_H - PANEL_H;
const TALK_FPS     = 3;    // mouth animation speed
const GESTURE_FPS  = 2;

const LINES = [
  { speaker: 'HAN',   text: '"Word travels fast out here. We heard what\nhappened with the Death Star mission..."' },
  { speaker: 'CHEWIE', text: '*RRRAAUGH!*' },
  { speaker: 'HAN',   text: '"Yeah, yeah, Chewie agrees. Look — the Empire\nwill be hunting you. You need a fast ship."' },
  { speaker: 'CHEWIE', text: '*Enthusiastic roar*' },
  { speaker: 'HAN',   text: '"The Millennium Falcon is the fastest hunk of\njunk in the galaxy. She\'ll get you out."' },
  { speaker: 'HAN',   text: '"Meet us at Docking Bay 94. Don\'t be late —\nand try not to shoot anyone on the way."' },
];

export class Cutscene3 {
  constructor() {
    this.active      = false;
    this.lineIdx     = 0;
    this.talkTimer   = 0;
    this.talkFrame   = 0;
    this.gestureFrame = 0;
    this.gestureTimer = 0;
    this.done        = false;
    this._slideY     = SCREEN_H; // panel slides up from bottom
    this._slideTarget = PANEL_Y;
  }

  start() {
    this.active       = true;
    this.lineIdx      = 0;
    this.done         = false;
    this._slideY      = SCREEN_H;
    this._slideTarget = PANEL_Y;
  }

  // Returns true when cutscene is fully finished
  update(input) {
    if (!this.active) return false;

    // Slide in
    const slideSpeed = 900;
    if (this._slideY > this._slideTarget) {
      this._slideY = Math.max(this._slideTarget, this._slideY - slideSpeed * (1/60));
    }

    // Animate mouth/gesture
    this.talkTimer += 1/60;
    if (this.talkTimer >= 1 / TALK_FPS) {
      this.talkTimer = 0;
      this.talkFrame = (this.talkFrame + 1) % 4;
    }
    this.gestureTimer += 1/60;
    if (this.gestureTimer >= 1 / GESTURE_FPS) {
      this.gestureTimer = 0;
      this.gestureFrame = (this.gestureFrame + 1) % 4;
    }

    // Advance on interact/shoot
    if (input.interact || input.shoot) {
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

    const py = Math.round(this._slideY);

    // Darken game world above panel
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, SCREEN_W, py);

    // Panel background
    ctx.fillStyle = '#0d0a08';
    ctx.fillRect(0, py, SCREEN_W, PANEL_H);
    // Panel top border
    ctx.fillStyle = '#cc9944';
    ctx.fillRect(0, py, SCREEN_W, 3);

    // ── Left: characters at table ─────────────────────────────────────────────
    const leftW = SCREEN_W * 0.45;

    // Cantina ambience: dark red/orange background
    ctx.fillStyle = '#1a0808';
    ctx.fillRect(0, py, leftW, PANEL_H);
    ctx.fillStyle = '#2a1010';
    ctx.fillRect(0, py, leftW * 0.6, PANEL_H);

    // Table
    drawCantinaTable(ctx, leftW * 0.5, py + PANEL_H - 30);

    // Who's talking drives the animation
    const line = LINES[Math.min(this.lineIdx, LINES.length - 1)];
    const hanTalking   = line.speaker === 'HAN';
    const chewieTalking = line.speaker === 'CHEWIE';

    // Chewie (left side of table)
    const chewieX = leftW * 0.22;
    drawChewie(ctx, chewieX, py + PANEL_H - 55,
      chewieTalking ? this.gestureFrame : 2);

    // Han (right side of table)
    const hanX = leftW * 0.72;
    drawHanSolo(ctx, hanX, py + PANEL_H - 55,
      hanTalking ? this.talkFrame : 0);

    // Speaker label above characters
    ctx.fillStyle = '#ffcc44';
    ctx.font      = 'bold 11px monospace';
    ctx.textAlign = 'center';
    if (chewieTalking) {
      ctx.fillText('CHEWBACCA', chewieX, py + 14);
      // Draw arrow below name
      ctx.fillText('▼', chewieX, py + 26);
    } else {
      ctx.fillText('HAN SOLO', hanX, py + 14);
      ctx.fillText('▼', hanX, py + 26);
    }

    // Divider
    ctx.fillStyle = '#4a3010';
    ctx.fillRect(leftW - 2, py, 3, PANEL_H);

    // ── Right: dialogue text ──────────────────────────────────────────────────
    const textX = leftW + 24;
    const textW = SCREEN_W - leftW - 40;

    // Speaker name
    ctx.fillStyle = '#ffcc44';
    ctx.font      = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(line.speaker === 'HAN' ? 'Han Solo:' : 'Chewbacca:', textX, py + 30);

    // Dialogue text (word-wrapped manually via newlines)
    ctx.fillStyle = '#eeddcc';
    ctx.font      = '13px monospace';
    const textLines = line.text.split('\n');
    textLines.forEach((tl, i) => {
      ctx.fillText(tl, textX, py + 56 + i * 20);
    });

    // Line counter dots
    const dotY = py + PANEL_H - 28;
    for (let i = 0; i < LINES.length; i++) {
      ctx.fillStyle = i === this.lineIdx ? '#ffcc44' : '#664422';
      ctx.fillRect(textX + i * 14, dotY, 8, 8);
    }

    // Continue prompt (blink)
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      ctx.fillStyle = '#aaaaaa';
      ctx.font      = '11px monospace';
      ctx.textAlign = 'right';
      const isLast = this.lineIdx === LINES.length - 1;
      ctx.fillText(isLast ? '[SPACE] Exit cantina' : '[SPACE] Continue',
                   SCREEN_W - 14, py + PANEL_H - 10);
    }

    ctx.textAlign = 'left';
  }
}
