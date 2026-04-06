// js/level3/world3.js — Level data: platforms, spawns, triggers, backgrounds

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { drawBackground3, drawBuildings, drawPlatform, drawCantinaEntrance,
         drawMillenniumFalcon } from './assets3.js';

export const GROUND_Y  = 450;
export const WORLD_W   = 4400;
const CANTINA_WORLD_X  = 2660;  // world x of cantina door centre
const FALCON_WORLD_X   = 3850;  // world x of Millennium Falcon

// ── Platform list  { x, y, w }  y = top of platform surface ─────────────────
const PLATFORM_DATA = [
  // Desert rocks
  { x: 320,  y: GROUND_Y - 50,  w: 80  },
  { x: 620,  y: GROUND_Y - 55,  w: 60  },
  { x: 780,  y: GROUND_Y - 45,  w: 70  },
  // City zone 1
  { x: 1020, y: GROUND_Y - 100, w: 110 },
  { x: 1180, y: GROUND_Y - 150, w: 80  },
  { x: 1360, y: GROUND_Y - 100, w: 100 },
  { x: 1500, y: GROUND_Y - 55,  w: 90  },
  // City zone 2
  { x: 1680, y: GROUND_Y - 130, w: 100 },
  { x: 1860, y: GROUND_Y - 170, w: 80  },
  { x: 2060, y: GROUND_Y - 100, w: 110 },
  { x: 2240, y: GROUND_Y - 140, w: 90  },
  { x: 2420, y: GROUND_Y - 100, w: 80  },
  // Post-cantina
  { x: 2880, y: GROUND_Y - 120, w: 100 },
  { x: 3060, y: GROUND_Y - 160, w: 90  },
  { x: 3250, y: GROUND_Y - 110, w: 110 },
  { x: 3440, y: GROUND_Y - 60,  w: 80  },
  // Docking bay (flat)
  { x: 3620, y: GROUND_Y - 20,  w: 600 },
];

// ── Character spawn definitions ───────────────────────────────────────────────
export const SPAWN_DATA = [
  // Desert approach — first contact at city edge (~700px in, ~4s walk from start)
  { type: 'civilian',     x: 720,  patrol: 80,  variant: 2 },
  { type: 'stormtrooper', x: 780,  patrol: 130 },
  { type: 'civilian',     x: 850,  patrol: 70,  variant: 0 },
  { type: 'stormtrooper', x: 950,  patrol: 120 },
  { type: 'bountyHunter', x: 1060, patrol: 140 },
  // City entrance
  { type: 'stormtrooper', x: 1150, patrol: 140 },
  { type: 'stormtrooper', x: 1280, patrol: 130 },
  { type: 'rebelNPC',     x: 1200, patrol: 100 },
  { type: 'civilian',     x: 1340, patrol: 70,  variant: 1 },
  { type: 'civilian',     x: 1400, patrol: 60,  variant: 0 },
  // City centre
  { type: 'stormtrooper', x: 1440, patrol: 120 },
  { type: 'stormtrooper', x: 1620, patrol: 150 },
  { type: 'officer',      x: 1780, patrol: 80  },
  { type: 'stormtrooper', x: 1960, patrol: 130 },
  { type: 'bountyHunter', x: 1700, patrol: 160 },
  { type: 'civilian',     x: 1540, patrol: 70,  variant: 2 },
  { type: 'civilian',     x: 1830, patrol: 60,  variant: 1 },
  { type: 'rebelNPC',     x: 2080, patrol: 90  },
  // Pre-cantina
  { type: 'stormtrooper', x: 2220, patrol: 130 },
  { type: 'civilian',     x: 2360, patrol: 60,  variant: 0 },
  { type: 'stormtrooper', x: 2480, patrol: 110 },
  // Post-cantina
  { type: 'stormtrooper', x: 2760, patrol: 130 },
  { type: 'stormtrooper', x: 2940, patrol: 140 },
  { type: 'bountyHunter', x: 3080, patrol: 160 },
  { type: 'stormtrooper', x: 3200, patrol: 120 },
  { type: 'officer',      x: 3320, patrol: 80  },
  { type: 'civilian',     x: 2820, patrol: 60,  variant: 1 },
  { type: 'civilian',     x: 3100, patrol: 70,  variant: 2 },
  // Docking bay guards
  { type: 'stormtrooper', x: 3500, patrol: 90  },
  { type: 'stormtrooper', x: 3620, patrol: 70  },
  { type: 'stormtrooper', x: 3720, patrol: 60  },
];

// ── Background building layout ────────────────────────────────────────────────
const BUILDING_DATA = [
  // City entrance (no buildings in the open desert intro)
  { worldX: 820,  w: 90,  h: 140, variant: 1, parallax: 1.0 },
  { worldX: 940,  w: 120, h: 180, variant: 0, parallax: 1.0 },
  { worldX: 1080, w: 80,  h: 120, variant: 2, parallax: 1.0 },
  { worldX: 1180, w: 110, h: 160, variant: 0, parallax: 1.0 },
  { worldX: 1310, w: 90,  h: 130, variant: 1, parallax: 1.0 },
  // City dense
  { worldX: 1420, w: 100, h: 170, variant: 2, parallax: 1.0 },
  { worldX: 1540, w: 80,  h: 130, variant: 0, parallax: 1.0 },
  { worldX: 1640, w: 110, h: 180, variant: 1, parallax: 1.0 },
  { worldX: 1770, w: 90,  h: 150, variant: 0, parallax: 1.0 },
  { worldX: 1880, w: 120, h: 200, variant: 2, parallax: 1.0 },
  { worldX: 2020, w: 100, h: 160, variant: 0, parallax: 1.0 },
  { worldX: 2140, w: 80,  h: 140, variant: 1, parallax: 1.0 },
  { worldX: 2240, w: 100, h: 170, variant: 2, parallax: 1.0 },
  { worldX: 2360, w: 90,  h: 150, variant: 0, parallax: 1.0 },
  // Cantina building
  { worldX: 2510, w: 160, h: 190, variant: 99, parallax: 1.0 },
  // Post-cantina
  { worldX: 2700, w: 100, h: 160, variant: 1, parallax: 1.0 },
  { worldX: 2820, w: 90,  h: 140, variant: 0, parallax: 1.0 },
  { worldX: 2930, w: 110, h: 170, variant: 2, parallax: 1.0 },
  { worldX: 3060, w: 80,  h: 130, variant: 1, parallax: 1.0 },
  { worldX: 3160, w: 120, h: 190, variant: 0, parallax: 1.0 },
  { worldX: 3300, w: 100, h: 150, variant: 2, parallax: 1.0 },
  { worldX: 3420, w: 90,  h: 130, variant: 1, parallax: 1.0 },
  // Docking bay (low metal walls)
  { worldX: 3540, w: 380, h: 70,  variant: 2, parallax: 1.0 },
];

// ── World class ───────────────────────────────────────────────────────────────

export class World3 {
  constructor() {
    this.WORLD_W       = WORLD_W;
    this.GROUND_Y      = GROUND_Y;
    this.CANTINA_X     = CANTINA_WORLD_X;
    this.FALCON_X      = FALCON_WORLD_X;
    this.platforms     = PLATFORM_DATA;
    this.buildings     = BUILDING_DATA;
    this._cantinaOpen  = false; // set true after cutscene so player can't re-trigger
  }

  // Returns { dy, onGround } after applying gravity/platform collision.
  // playerX, playerY = feet centre.  vy = vertical velocity (positive = down).
  resolveY(playerX, playerY, vy, dt, playerW = 18) {
    const nextY = playerY + vy * dt;
    const half  = playerW / 2;

    // Check ground
    if (nextY >= GROUND_Y) {
      return { y: GROUND_Y, vy: 0, onGround: true };
    }

    // Check platforms (only when falling)
    if (vy > 0) {
      for (const p of this.platforms) {
        if (playerX + half > p.x && playerX - half < p.x + p.w) {
          // Was above platform last frame, now at or below?
          if (playerY <= p.y && nextY >= p.y) {
            return { y: p.y, vy: 0, onGround: true };
          }
        }
      }
    }

    return { y: nextY, vy, onGround: false };
  }

  get cantinaTriggered() { return this._cantinaOpen; }
  set cantinaTriggered(v) { this._cantinaOpen = v; }

  render(ctx, cameraX) {
    const progress = cameraX / (WORLD_W - SCREEN_W);

    // Background layers
    drawBackground3(ctx, cameraX, progress);

    // Buildings (parallax)
    drawBuildings(ctx, cameraX, this.buildings);

    // Platforms
    for (const p of this.platforms) {
      const sx = p.x - cameraX;
      if (sx > SCREEN_W + 20 || sx + p.w < -20) continue;
      drawPlatform(ctx, sx, p.y, p.w);
    }

    // Cantina entrance indicator (before triggered)
    if (!this._cantinaOpen) {
      const csx = CANTINA_WORLD_X - cameraX;
      if (csx > -50 && csx < SCREEN_W + 50) {
        drawCantinaEntrance(ctx, csx, GROUND_Y);
      }
    }

    // Millennium Falcon
    const fsx = FALCON_WORLD_X - cameraX;
    if (fsx > -240 && fsx < SCREEN_W + 240) {
      drawMillenniumFalcon(ctx, fsx, GROUND_Y - 44);
    }

    // Docking bay label
    if (fsx > 0 && fsx < SCREEN_W) {
      ctx.fillStyle = '#ffcc44';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DOCKING BAY 94', fsx, GROUND_Y - 110);
      ctx.textAlign = 'left';
    }
  }
}
