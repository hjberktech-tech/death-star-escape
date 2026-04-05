import { SCREEN_W, SCREEN_H } from './constants.js';
import { LEVEL_META, lockDoor, resetDoors } from './map.js';
import { Input } from './input.js';
import { Player } from './player.js';
import { Enemy, updateAllEnemies, EnemyState } from './enemies.js';
import { DarthVader } from './boss.js';
import { Weapon } from './weapons.js';
import { renderFrame, GameState } from './renderer.js';
import AudioManager from './audio.js';
import { initLevel2, updateLevel2, renderLevel2, getState2, L2State } from './level2/main2.js';

const canvas = document.getElementById('game');
canvas.width  = SCREEN_W;
canvas.height = SCREEN_H;
const ctx = canvas.getContext('2d');

let gameState, player, enemies, boss, weapon, bossActive, pickups;
let pendingLockDoor  = null; // { x, y, threshold } — locked once player crosses in
let vaderWasPhase2   = false;
let lastTime = null;

function initGame() {
  resetDoors();
  player    = new Player();
  enemies   = LEVEL_META.enemies.map(d => new Enemy(d));
  boss      = new DarthVader();
  weapon    = new Weapon();
  bossActive      = false;
  pendingLockDoor = null;
  vaderWasPhase2  = false;

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
      AudioManager.playPickup();
    }
  }
}

function update(dt) {
  player.update(dt, allEnemiesDead, onBossRoomEntered);
  weapon.update(dt, player, enemies, boss);
  if (weapon.firedThisFrame) AudioManager.playBlaster();

  updateAllEnemies(enemies, player, dt);
  for (const e of enemies) {
    if (e.alertSoundPending) { e.alertSoundPending = false; AudioManager.playTrooperAlert(); }
    if (e.deathSoundPending) { e.deathSoundPending = false; AudioManager.playTrooperDeath(); }
  }

  if (bossActive) boss.update(dt, player);
  collectPickups();

  // Lock boss door and spawn Vader once player has crossed into the room
  if (pendingLockDoor && player.y >= pendingLockDoor.threshold) {
    lockDoor(pendingLockDoor.x, pendingLockDoor.y);
    pendingLockDoor = null;
    bossActive = true;
    boss.activate();
    AudioManager.playMusic('imperial');
    AudioManager.startVaderBreath(false);
  }

  // Vader phase 2 — heavier breathing
  if (bossActive && boss.phase2 && !vaderWasPhase2) {
    vaderWasPhase2 = true;
    AudioManager.updateVaderBreathPhase(true);
  }

  // Player breathing reacts to health
  AudioManager.updatePlayerBreath(player.health);

  if (player.isDead()) {
    gameState = GameState.DEAD;
    AudioManager.stopMusic();
    AudioManager.stopVaderBreath();
    AudioManager.stopPlayerBreath();
  } else if (bossActive && boss.isDefeated()) {
    gameState = GameState.WIN;
    AudioManager.stopMusic();
    AudioManager.stopVaderBreath();
  }
}

function checkDebugSkip() {
  const target = Input.debugLevel;
  if (!target) return;
  Input.debugLevel = 0;
  AudioManager.stopMusic();
  AudioManager.stopVaderBreath();
  AudioManager.stopPlayerBreath();
  if (target === 1) {
    initGame();
    gameState = GameState.PLAYING;
    AudioManager.init();
    AudioManager.playMusic('main');
  } else if (target === 2) {
    initLevel2();
    gameState = GameState.LEVEL2;
    AudioManager.init();
  }
  // add more levels here as they are created
}

function gameLoop(timestamp) {
  requestAnimationFrame(gameLoop);
  const dt = lastTime === null ? 0 : Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  checkDebugSkip();

  if (gameState === GameState.LEVEL2) {
    updateLevel2(dt);
    renderLevel2(ctx);
  } else {
    if (gameState === GameState.PLAYING) update(dt);
    renderFrame(ctx, { gameState, player, enemies, boss, weapon, bossActive, pickups });
  }
}

canvas.addEventListener('click', () => {
  if (gameState === GameState.TITLE) {
    AudioManager.init();
    initGame();
    gameState = GameState.PLAYING;
    AudioManager.playMusic('main');
  } else if (gameState === GameState.DEAD) {
    AudioManager.stopMusic();
    AudioManager.stopVaderBreath();
    AudioManager.stopPlayerBreath();
    initGame();
    gameState = GameState.PLAYING;
    AudioManager.playMusic('main');
  } else if (gameState === GameState.WIN) {
    AudioManager.stopMusic();
    AudioManager.stopVaderBreath();
    initLevel2();
    gameState = GameState.LEVEL2;
  } else if (gameState === GameState.LEVEL2) {
    const s = getState2();
    if (s === L2State.DEAD) { initLevel2(); }
    else if (s === L2State.WIN) { initGame(); gameState = GameState.TITLE; AudioManager.stopMusic(); }
  }
});

Input.init(canvas);
initGame();
gameState = GameState.TITLE;
requestAnimationFrame(gameLoop);
