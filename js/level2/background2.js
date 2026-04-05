// js/level2/background2.js — Parallax starfield + planet backgrounds

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { drawDeathStar, drawTatooine } from './assets2.js';

function makeStars(count, speed, minSize, maxSize) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * SCREEN_W,
      y: Math.random() * SCREEN_H,
      size: minSize + Math.random() * (maxSize - minSize),
      speed,
      // Vary color slightly: white to light-blue
      blue: Math.random() > 0.6,
    });
  }
  return stars;
}

export class Background2 {
  constructor() {
    // 3 star layers: 60/80/40 stars at speeds 20/45/80 px/s
    this.layers = [
      makeStars(60, 20, 0.8, 1.2),
      makeStars(80, 45, 1.0, 1.6),
      makeStars(40, 80, 1.4, 2.2),
    ];
  }

  update(dt) {
    for (const layer of this.layers) {
      for (const s of layer) {
        s.x -= s.speed * dt;
        if (s.x < 0) {
          s.x = SCREEN_W + Math.random() * 20;
          s.y = Math.random() * SCREEN_H;
        }
      }
    }
  }

  render(ctx, progress) {
    // 1. Background fill
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // 2. Death Star — top-right, visible progress 0→0.45, shrinks r=200→0
    if (progress < 0.45) {
      // t=0 → r=200; t=0.45 → r=0
      const t = progress / 0.45; // 0..1
      const r = 200 * (1 - t);
      if (r > 1) {
        drawDeathStar(ctx, SCREEN_W - 80, 80, r);
      }
    }

    // 3. Tatooine — bottom-left, visible progress 0.35→1, grows r=20→200
    if (progress > 0.35) {
      const t = (progress - 0.35) / 0.65; // 0..1
      const r = 20 + t * 180;
      drawTatooine(ctx, 80, SCREEN_H - 80, r);
    }

    // 4. Draw stars on top of planets (feels more atmospheric)
    for (const layer of this.layers) {
      for (const s of layer) {
        ctx.fillStyle = s.blue ? '#ccddff' : '#ffffff';
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
    }
  }
}
