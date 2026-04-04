import { SCREEN_W, SCREEN_H } from './constants.js';

export function renderTitleScreen(ctx) {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  // Star field
  ctx.fillStyle = '#fff';
  for (let i = 0; i < 120; i++) {
    const sx = (i * 137.5) % SCREEN_W;
    const sy = (i * 97.3 + i * 0.5) % SCREEN_H;
    ctx.fillRect(sx, sy, 1, 1);
  }

  // Title
  ctx.fillStyle = '#ffe81f'; // Star Wars yellow
  ctx.font = 'bold 52px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DEATH STAR', SCREEN_W / 2, SCREEN_H / 2 - 80);
  ctx.font = 'bold 32px monospace';
  ctx.fillStyle = '#ccc';
  ctx.fillText('ESCAPE', SCREEN_W / 2, SCREEN_H / 2 - 38);

  ctx.fillStyle = '#888';
  ctx.font = '14px monospace';
  ctx.fillText('A Star Wars Fan Game', SCREEN_W / 2, SCREEN_H / 2);

  ctx.fillStyle = '#ffe81f';
  ctx.font = '18px monospace';
  ctx.fillText('CLICK TO PLAY', SCREEN_W / 2, SCREEN_H / 2 + 60);

  ctx.fillStyle = '#555';
  ctx.font = '13px monospace';
  ctx.fillText('WASD / Arrows: Move   Mouse: Look   Space / Click: Shoot   F: Open Doors', SCREEN_W / 2, SCREEN_H - 30);

  ctx.textAlign = 'left';
}

export function renderDeathScreen(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  ctx.fillStyle = '#c00';
  ctx.font = 'bold 64px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('YOU DIED', SCREEN_W / 2, SCREEN_H / 2 - 30);
  ctx.fillStyle = '#888';
  ctx.font = '20px monospace';
  ctx.fillText('The Empire has won... this time.', SCREEN_W / 2, SCREEN_H / 2 + 20);
  ctx.fillStyle = '#ffe81f';
  ctx.font = '16px monospace';
  ctx.fillText('Click to try again', SCREEN_W / 2, SCREEN_H / 2 + 70);
  ctx.textAlign = 'left';
}

export function renderWinScreen(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.82)';
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  ctx.fillStyle = '#ffe81f';
  ctx.font = 'bold 52px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('YOU WIN!', SCREEN_W / 2, SCREEN_H / 2 - 60);

  ctx.fillStyle = '#ccc';
  ctx.font = '20px monospace';
  ctx.fillText('Darth Vader has been defeated.', SCREEN_W / 2, SCREEN_H / 2);
  ctx.fillText('The Rebellion lives!', SCREEN_W / 2, SCREEN_H / 2 + 30);

  ctx.fillStyle = '#ffe81f';
  ctx.font = '16px monospace';
  ctx.fillText('Click to play again', SCREEN_W / 2, SCREEN_H / 2 + 90);
  ctx.textAlign = 'left';
}
