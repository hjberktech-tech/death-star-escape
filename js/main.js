import { SCREEN_W, SCREEN_H } from './constants.js';
import { LEVEL_META, lockDoor, resetDoors } from './map.js';
import { Input } from './input.js';
import { Player } from './player.js';
import { Enemy, updateAllEnemies, EnemyState } from './enemies.js';
import { DarthVader } from './boss.js';
import { Weapon } from './weapons.js';
import { renderFrame, GameState } from './renderer.js';

const canvas = document.getElementById('game');
canvas.width  = SCREEN_W;
canvas.height = SCREEN_H;
const ctx = canvas.getContext('2d');

let gameState, player, enemies, boss, weapon, bossActive, pickups;
let pendingLockDoor = null; // { x, y, threshold } — locked once player crosses in
let lastTime = null;

function initGame() {
  resetDoors();
  player    = new Player();
  enemies   = LEVEL_META.enemies.map(d => new Enemy(d));
  boss      = new DarthVader();
  weapon    = new Weapon();
  bossActive = false;
  pendingLockDoor = null;

  // Clone pickup list with active flag
  pickups = LEVEL_META.pickups.map(p => ({ ...p, active: true }));
}

function allEnemiesDead() {
  return enemies.every(e => !e.active || e.state === EnemyState.DEAD);
}

function onBossRoomEntered(doorX, doorY) {
  // Delay both the lock and the boss spawn until the player has crossed in
  pendingLockDoor = { x: doorX, y: doorY, threshold: doorY + 1.0 };
}

function collectPickups() {
  const COLLECT_RADIUS = 0.6;
  for (const p of pickups) {
    if (!p.active) continue;
    const dist = Math.hypot(player.x - p.x, player.y - p.y);
    if (dist < COLLECT_RADIUS) {
      if (p.type === 'health') player.heal(p.amount);
      else                     player.addAmmo(p.amount);
      p.active = false;
    }
  }
}

function update(dt) {
  player.update(dt, allEnemiesDead, onBossRoomEntered);
  weapon.update(dt, player, enemies, boss);
  updateAllEnemies(enemies, player, dt);
  if (bossActive) boss.update(dt, player);
  collectPickups();

  // Lock boss door and spawn Vader once player has crossed into the room
  if (pendingLockDoor && player.y >= pendingLockDoor.threshold) {
    lockDoor(pendingLockDoor.x, pendingLockDoor.y);
    pendingLockDoor = null;
    bossActive = true;
    boss.activate();
  }

  if (player.isDead())            gameState = GameState.DEAD;
  else if (bossActive && boss.isDefeated()) gameState = GameState.WIN;
}

function gameLoop(timestamp) {
  requestAnimationFrame(gameLoop);
  const dt = lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  if (gameState === GameState.PLAYING) update(dt);

  renderFrame(ctx, { gameState, player, enemies, boss, weapon, bossActive, pickups });
}

canvas.addEventListener('click', () => {
  if (gameState === GameState.TITLE) {
    initGame();
    gameState = GameState.PLAYING;
  } else if (gameState === GameState.DEAD || gameState === GameState.WIN) {
    initGame();
    gameState = GameState.PLAYING;
  }
});

Input.init(canvas);
initGame();
gameState = GameState.TITLE;
requestAnimationFrame(gameLoop);
