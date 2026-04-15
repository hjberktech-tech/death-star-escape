// js/level3/world3.js — Level data: platforms, spawns, triggers, backgrounds

import { SCREEN_W, SCREEN_H } from '../constants.js';
import { drawBackground3, drawBuildings, drawPlatform, drawCantinaEntrance,
         drawMillenniumFalcon, drawCrate, drawLowWall, drawPillar } from './assets3.js';

export const GROUND_Y     = 450;
export const WORLD_W      = 13200;
const CANTINA_WORLD_X     = 7610;  // building worldX 7530 + w/2 80
const FALCON_WORLD_X      = 11550; // world x of Millennium Falcon
const DOCKINGBAY_WORLD_X  = 10800; // entrance to docking bay (battle trigger)

// ── Platform list  { x, y, w }  y = top of platform surface ─────────────────
const PLATFORM_DATA = [
  // Desert rocks
  { x: 960,   y: GROUND_Y - 50,  w: 80  },
  { x: 1860,  y: GROUND_Y - 55,  w: 60  },
  { x: 2340,  y: GROUND_Y - 45,  w: 70  },
  // City zone 1
  { x: 3060,  y: GROUND_Y - 100, w: 110 },
  { x: 3540,  y: GROUND_Y - 150, w: 80  },
  { x: 4080,  y: GROUND_Y - 100, w: 100 },
  { x: 4500,  y: GROUND_Y - 55,  w: 90  },
  // City zone 2
  { x: 5040,  y: GROUND_Y - 130, w: 100 },
  { x: 5580,  y: GROUND_Y - 170, w: 80  },
  { x: 6180,  y: GROUND_Y - 100, w: 110 },
  { x: 6720,  y: GROUND_Y - 140, w: 90  },
  { x: 7260,  y: GROUND_Y - 100, w: 80  },
  // Post-cantina
  { x: 8640,  y: GROUND_Y - 120, w: 100 },
  { x: 9180,  y: GROUND_Y - 160, w: 90  },
  { x: 9750,  y: GROUND_Y - 110, w: 110 },
  { x: 10320, y: GROUND_Y - 60,  w: 80  },
  // Docking bay (flat raised floor)
  { x: 10860, y: GROUND_Y - 20,  w: 800 },
];

// ── Character spawn definitions ───────────────────────────────────────────────
export const SPAWN_DATA = [
  // Desert approach
  { type: 'civilian',     x: 2190,  patrol: 80,  variant: 2 },
  { type: 'stormtrooper', x: 2460,  patrol: 130 },
  { type: 'bountyHunter', x: 3000,  patrol: 140 },
  // City entrance
  { type: 'stormtrooper', x: 3480,  patrol: 130 },
  { type: 'rebelNPC',     x: 3750,  patrol: 90  },
  { type: 'civilian',     x: 4140,  patrol: 70,  variant: 1 },
  // City centre
  { type: 'stormtrooper', x: 4680,  patrol: 130 },
  { type: 'officer',      x: 5160,  patrol: 80  },
  { type: 'bountyHunter', x: 5640,  patrol: 150 },
  { type: 'civilian',     x: 6000,  patrol: 70,  variant: 0 },
  // Pre-cantina
  { type: 'stormtrooper', x: 6600,  patrol: 130 },
  { type: 'stormtrooper', x: 7350,  patrol: 110 },
  // Post-cantina
  { type: 'stormtrooper', x: 8340,  patrol: 130 },
  { type: 'bountyHunter', x: 8940,  patrol: 150 },
  { type: 'officer',      x: 9540,  patrol: 80  },
  { type: 'civilian',     x: 8640,  patrol: 60,  variant: 2 },
  // Docking bay guards
  { type: 'stormtrooper', x: 10560, patrol: 90  },
  { type: 'stormtrooper', x: 11040, patrol: 70  },
];

// ── Background building layout ────────────────────────────────────────────────
// Heights reduced to match squat Mos Eisley adobe style (~50-75px)
const BUILDING_DATA = [
  // City entrance
  { worldX: 2460,  w: 90,  h: 60, variant: 1, parallax: 1.0 },
  { worldX: 2820,  w: 120, h: 70, variant: 0, parallax: 1.0 },
  { worldX: 3240,  w: 80,  h: 55, variant: 2, parallax: 1.0 },
  { worldX: 3540,  w: 110, h: 65, variant: 0, parallax: 1.0 },
  { worldX: 3930,  w: 90,  h: 58, variant: 1, parallax: 1.0 },
  // City dense
  { worldX: 4260,  w: 100, h: 68, variant: 2, parallax: 1.0 },
  { worldX: 4620,  w: 80,  h: 58, variant: 0, parallax: 1.0 },
  { worldX: 4920,  w: 110, h: 72, variant: 1, parallax: 1.0 },
  { worldX: 5310,  w: 90,  h: 62, variant: 0, parallax: 1.0 },
  { worldX: 5640,  w: 120, h: 75, variant: 2, parallax: 1.0 },
  { worldX: 6060,  w: 100, h: 65, variant: 0, parallax: 1.0 },
  { worldX: 6420,  w: 80,  h: 60, variant: 1, parallax: 1.0 },
  { worldX: 6720,  w: 100, h: 68, variant: 2, parallax: 1.0 },
  { worldX: 7080,  w: 90,  h: 62, variant: 0, parallax: 1.0 },
  // Cantina building
  { worldX: 7530,  w: 160, h: 78, variant: 99, parallax: 1.0 },
  // Post-cantina
  { worldX: 8100,  w: 100, h: 65, variant: 1, parallax: 1.0 },
  { worldX: 8460,  w: 90,  h: 60, variant: 0, parallax: 1.0 },
  { worldX: 8790,  w: 110, h: 68, variant: 2, parallax: 1.0 },
  { worldX: 9180,  w: 80,  h: 58, variant: 1, parallax: 1.0 },
  { worldX: 9480,  w: 120, h: 72, variant: 0, parallax: 1.0 },
  { worldX: 9900,  w: 100, h: 62, variant: 2, parallax: 1.0 },
  { worldX: 10260, w: 90,  h: 58, variant: 1, parallax: 1.0 },
  // Docking bay (low metal walls — drawn as background, not blocking)
  { worldX: 10620, w: 380, h: 40, variant: 2, parallax: 1.0 },
];

// ── Obstacle / cover layout  { x, w, h, type }  ──────────────────────────────
// ALL obstacles are now solid — block bullets AND horizontal player movement.
// Player must jump over them (low crates/walls) or use platforms to bypass.
const OBSTACLE_DATA = [
  { x: 2610,  w: 55, h: 32, type: 'wall'   },
  { x: 3150,  w: 28, h: 28, type: 'crate'  },
  { x: 3630,  w: 16, h: 70, type: 'pillar' },
  { x: 4020,  w: 55, h: 32, type: 'wall'   },
  { x: 4470,  w: 28, h: 28, type: 'crate'  },
  { x: 4890,  w: 28, h: 28, type: 'crate'  },
  { x: 5310,  w: 55, h: 32, type: 'wall'   },
  { x: 5760,  w: 16, h: 70, type: 'pillar' },
  { x: 6180,  w: 55, h: 32, type: 'wall'   },
  { x: 6570,  w: 28, h: 28, type: 'crate'  },
  { x: 7020,  w: 28, h: 28, type: 'crate'  },
  { x: 7440,  w: 55, h: 32, type: 'wall'   },
  // Post-cantina
  { x: 8250,  w: 28, h: 28, type: 'crate'  },
  { x: 8640,  w: 55, h: 32, type: 'wall'   },
  { x: 9090,  w: 16, h: 70, type: 'pillar' },
  { x: 9540,  w: 28, h: 28, type: 'crate'  },
  { x: 9990,  w: 55, h: 32, type: 'wall'   },
  { x: 10410, w: 28, h: 28, type: 'crate'  },
];

// ── World class ───────────────────────────────────────────────────────────────

export class World3 {
  constructor() {
    this.WORLD_W       = WORLD_W;
    this.GROUND_Y      = GROUND_Y;
    this.CANTINA_X     = CANTINA_WORLD_X;
    this.FALCON_X      = FALCON_WORLD_X;
    this.DOCKINGBAY_X  = DOCKINGBAY_WORLD_X;
    this.platforms     = PLATFORM_DATA;
    this.buildings     = BUILDING_DATA;
    this.obstacles     = OBSTACLE_DATA;
    this._cantinaOpen  = false;
  }

  // Returns resolved y after gravity/platform and obstacle-top collision.
  resolveY(playerX, playerY, vy, dt, playerW = 18) {
    const nextY = playerY + vy * dt;
    const half  = playerW / 2;

    if (nextY >= GROUND_Y) {
      return { y: GROUND_Y, vy: 0, onGround: true };
    }

    if (vy > 0) {
      // Check platforms
      for (const p of this.platforms) {
        if (playerX + half > p.x && playerX - half < p.x + p.w) {
          if (playerY <= p.y && nextY >= p.y) {
            return { y: p.y, vy: 0, onGround: true };
          }
        }
      }
      // Check obstacle tops — player can land and stand on any obstacle
      for (const o of OBSTACLE_DATA) {
        const obsTop = GROUND_Y - o.h;
        if (playerX + half > o.x && playerX - half < o.x + o.w) {
          // Use a slightly looser check (+ 6px) to catch fast falls
          if (playerY <= obsTop + 6 && nextY >= obsTop) {
            return { y: obsTop, vy: 0, onGround: true };
          }
        }
      }
    }

    return { y: nextY, vy, onGround: false };
  }

  // Returns resolved x after checking solid obstacle collision.
  // All obstacles block horizontal movement — player must jump over them.
  resolveX(playerX, playerY, moveAmount, playerHalfW = 9) {
    if (moveAmount === 0) return playerX;
    const nextX = playerX + moveAmount;
    for (const o of OBSTACLE_DATA) {
      const obsTop = GROUND_Y - o.h;
      // Player body: feet at playerY, head ~54px above feet
      const playerBottom = playerY;
      const playerTop    = playerY - 54;
      // Skip if player is at or above the obstacle top (standing on it or jumping over)
      // 4px tolerance so floating-point landings don't cause side-blocking
      if (playerBottom <= obsTop + 4 || playerTop >= GROUND_Y) continue;
      // Check horizontal overlap in new position
      if (nextX + playerHalfW > o.x && nextX - playerHalfW < o.x + o.w) {
        // Only push if player was NOT already inside (avoids teleport on spawn)
        const wasInside = playerX + playerHalfW > o.x && playerX - playerHalfW < o.x + o.w;
        if (!wasInside) {
          return moveAmount > 0 ? o.x - playerHalfW : o.x + o.w + playerHalfW;
        }
      }
    }
    return nextX;
  }

  get cantinaTriggered() { return this._cantinaOpen; }
  set cantinaTriggered(v) { this._cantinaOpen = v; }

  // Deactivates bullets that hit an obstacle.
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

    drawBackground3(ctx, cameraX, progress);
    drawBuildings(ctx, cameraX, this.buildings);

    for (const p of this.platforms) {
      const sx = p.x - cameraX;
      if (sx > SCREEN_W + 20 || sx + p.w < -20) continue;
      drawPlatform(ctx, sx, p.y, p.w);
    }

    for (const o of OBSTACLE_DATA) {
      const sx = o.x - cameraX;
      if (sx > SCREEN_W + 20 || sx + o.w < -20) continue;
      if (o.type === 'crate')       drawCrate(ctx, sx, GROUND_Y);
      else if (o.type === 'pillar') drawPillar(ctx, sx, GROUND_Y, o.h);
      else                          drawLowWall(ctx, sx, GROUND_Y, o.w, o.h);
    }

    if (!this._cantinaOpen) {
      const csx = CANTINA_WORLD_X - cameraX;
      if (csx > -50 && csx < SCREEN_W + 50) {
        drawCantinaEntrance(ctx, csx, GROUND_Y);
      }
    }

    const fsx = FALCON_WORLD_X - cameraX;
    if (fsx > -240 && fsx < SCREEN_W + 240) {
      drawMillenniumFalcon(ctx, fsx, GROUND_Y - 44);
    }

    if (fsx > 0 && fsx < SCREEN_W) {
      ctx.fillStyle = '#ffcc44';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DOCKING BAY 94', fsx, GROUND_Y - 110);
      ctx.textAlign = 'left';
    }
  }
}
