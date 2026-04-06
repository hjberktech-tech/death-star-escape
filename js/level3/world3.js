// js/level3/world3.js — Level data: platforms, spawns, triggers, backgrounds

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { drawBackground3, drawBuildings, drawPlatform, drawCantinaEntrance,
         drawMillenniumFalcon, drawCrate, drawLowWall, drawPillar } from './assets3.js';

export const GROUND_Y  = 450;
export const WORLD_W   = 4400;
const CANTINA_WORLD_X  = 2590;  // world x of cantina door centre (building 2510 + w/2 80)
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
  { type: 'civilian',     x: 730,  patrol: 80,  variant: 2 },
  { type: 'stormtrooper', x: 820,  patrol: 130 },
  { type: 'bountyHunter', x: 1000, patrol: 140 },
  // City entrance
  { type: 'stormtrooper', x: 1160, patrol: 130 },
  { type: 'rebelNPC',     x: 1250, patrol: 90  },
  { type: 'civilian',     x: 1380, patrol: 70,  variant: 1 },
  // City centre
  { type: 'stormtrooper', x: 1560, patrol: 130 },
  { type: 'officer',      x: 1720, patrol: 80  },
  { type: 'bountyHunter', x: 1880, patrol: 150 },
  { type: 'civilian',     x: 2000, patrol: 70,  variant: 0 },
  // Pre-cantina
  { type: 'stormtrooper', x: 2200, patrol: 130 },
  { type: 'stormtrooper', x: 2450, patrol: 110 },
  // Post-cantina
  { type: 'stormtrooper', x: 2780, patrol: 130 },
  { type: 'bountyHunter', x: 2980, patrol: 150 },
  { type: 'officer',      x: 3180, patrol: 80  },
  { type: 'civilian',     x: 2880, patrol: 60,  variant: 2 },
  // Docking bay guards
  { type: 'stormtrooper', x: 3520, patrol: 90  },
  { type: 'stormtrooper', x: 3680, patrol: 70  },
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

// ── Obstacle / cover layout  { x, w, h, type }  ──────────────────────────────
// type: 'crate' | 'wall' | 'pillar'   h = height above ground
const OBSTACLE_DATA = [
  { x: 870,  w: 55, h: 32, type: 'wall'   },
  { x: 1050, w: 28, h: 28, type: 'crate'  },
  { x: 1210, w: 16, h: 70, type: 'pillar' },
  { x: 1340, w: 55, h: 32, type: 'wall'   },
  { x: 1490, w: 28, h: 28, type: 'crate'  },
  { x: 1630, w: 28, h: 28, type: 'crate'  },
  { x: 1770, w: 55, h: 32, type: 'wall'   },
  { x: 1920, w: 16, h: 70, type: 'pillar' },
  { x: 2060, w: 55, h: 32, type: 'wall'   },
  { x: 2190, w: 28, h: 28, type: 'crate'  },
  { x: 2340, w: 28, h: 28, type: 'crate'  },
  { x: 2480, w: 55, h: 32, type: 'wall'   },
  // Post-cantina
  { x: 2750, w: 28, h: 28, type: 'crate'  },
  { x: 2880, w: 55, h: 32, type: 'wall'   },
  { x: 3030, w: 16, h: 70, type: 'pillar' },
  { x: 3180, w: 28, h: 28, type: 'crate'  },
  { x: 3330, w: 55, h: 32, type: 'wall'   },
  { x: 3470, w: 28, h: 28, type: 'crate'  },
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
    this.obstacles     = OBSTACLE_DATA;
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

  // Deactivates any bullets (world coords) that intersect an obstacle.
  stopBulletsAtObstacles(bullets) {
    for (const b of bullets) {
      if (!b.active) continue;
      for (const o of OBSTACLE_DATA) {
        if (b.x >= o.x && b.x <= o.x + o.w &&
            b.y >= GROUND_Y - o.h - 4 && b.y <= GROUND_Y + 4) {
          b.active = false;
          break;
        }
      }
    }
  }

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

    // Obstacles / cover
    for (const o of OBSTACLE_DATA) {
      const sx = o.x - cameraX;
      if (sx > SCREEN_W + 20 || sx + o.w < -20) continue;
      if (o.type === 'crate')  drawCrate(ctx, sx, GROUND_Y);
      else if (o.type === 'pillar') drawPillar(ctx, sx, GROUND_Y, o.h);
      else                    drawLowWall(ctx, sx, GROUND_Y, o.w, o.h);
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
