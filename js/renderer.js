import { castAndRender } from './raycaster.js';
import { renderSprites } from './sprites.js';
import { renderHUD } from './hud.js';
import { renderMinimap } from './minimap.js';
import { renderTitleScreen, renderDeathScreen, renderWinScreen } from './screens.js';

export const GameState = {
  TITLE: 'title',
  PLAYING: 'playing',
  DEAD: 'dead',
  WIN: 'win',
  LEVEL2: 'level2',
  LEVEL3: 'level3',
};

export function renderFrame(ctx, state) {
  const { gameState, player, enemies, boss, weapon, bossActive, pickups } = state;

  if (gameState === GameState.TITLE) {
    renderTitleScreen(ctx);
    return;
  }

  // 1. Raycast walls (also draws ceiling/floor)
  const zBuffer = castAndRender(ctx, player);

  // 2. Sprites (enemies + boss + pickups)
  const spriteEntities = [...enemies];
  if (boss) spriteEntities.push(boss);
  if (pickups) for (const p of pickups) if (p.active) spriteEntities.push(p);
  renderSprites(ctx, spriteEntities, player, zBuffer);

  // 3. HUD
  renderHUD(ctx, player, weapon, boss, bossActive);

  // 4. Minimap
  renderMinimap(ctx, player, enemies, boss, pickups);

  // 5. Overlays
  if (gameState === GameState.DEAD) {
    renderDeathScreen(ctx);
  } else if (gameState === GameState.WIN) {
    renderWinScreen(ctx);
  }
}
