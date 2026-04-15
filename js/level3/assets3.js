// js/level3/assets3.js — Pixel-art drawing for Level 3 (Mos Eisley platformer)

const S = 3; // pixel block size (3 real px = 1 "pixel")

// ── Helpers ───────────────────────────────────────────────────────────────────

function px(ctx, x, y, w, h, col) {
  ctx.fillStyle = col;
  ctx.fillRect(x, y, w, h);
}

// ── Rebel Player ─────────────────────────────────────────────────────────────
// x, y = feet-center  |  facing: 1=right −1=left  |  frame 0-3  |  shooting bool
export function drawRebel(ctx, x, y, facing, frame, shooting = false) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (facing < 0) ctx.scale(-1, 1);

  const liftL = (frame % 4 === 1) ? S : 0;
  const liftR = (frame % 4 === 3) ? S : 0;

  // Legs
  px(ctx, S,    -5*S - liftR, 3*S, 4*S, '#1e3055'); // right leg
  px(ctx, S,    -S   - liftR, 3*S, S,   '#0a0a14'); // right boot
  px(ctx, -4*S, -5*S - liftL, 3*S, 4*S, '#1e3055'); // left leg
  px(ctx, -4*S, -S   - liftL, 3*S, S,   '#0a0a14'); // left boot

  // Body
  px(ctx, -3*S, -11*S, 7*S, 5*S, '#993311'); // jacket
  px(ctx, -3*S,  -7*S, 7*S,  S,  '#662200'); // jacket shadow band
  px(ctx, -3*S,  -6*S, 7*S,  S,  '#331100'); // belt

  // Arms
  px(ctx, -5*S, -11*S, 2*S, 4*S, '#993311'); // left arm
  px(ctx,  3*S, -11*S, 2*S, 4*S, '#993311'); // right arm
  // Gun (extends when shooting)
  px(ctx,  4*S,  -9*S, shooting ? 7*S : 5*S, 2*S, '#1a1a1a');

  // Neck + Face
  px(ctx, -S,   -12*S, 2*S, S,   '#c88050');
  px(ctx, -2*S, -15*S, 5*S, 3*S, '#c88050');

  // Helmet
  px(ctx, -3*S, -17*S, 7*S, 3*S, '#778899');
  px(ctx, -2*S, -16*S, 5*S, 2*S, '#334455'); // visor

  ctx.restore();
}

// ── Stormtrooper ──────────────────────────────────────────────────────────────
// x, y = feet-center  |  facing  |  frame 0-3  |  alerted = bool
export function drawStormtrooper(ctx, x, y, facing, frame, alerted = false) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (facing < 0) ctx.scale(-1, 1);

  const liftL = (frame % 4 === 1) ? S : 0;
  const liftR = (frame % 4 === 3) ? S : 0;

  // Legs (black joints between white armor)
  px(ctx,  S,    -5*S - liftR, 3*S, 4*S, '#ddeeff'); // right leg armor
  px(ctx,  S,    -3*S - liftR, 3*S, S,   '#222222'); // knee joint
  px(ctx,  S,    -S   - liftR, 3*S, S,   '#ccddee'); // right boot
  px(ctx, -4*S,  -5*S - liftL, 3*S, 4*S, '#ddeeff');
  px(ctx, -4*S,  -3*S - liftL, 3*S, S,   '#222222');
  px(ctx, -4*S,  -S   - liftL, 3*S, S,   '#ccddee');

  // Torso armor
  px(ctx, -3*S, -11*S, 7*S, 5*S, '#ddeeff');
  px(ctx, -2*S,  -9*S, 5*S, 2*S, '#ccddee'); // chest detail
  px(ctx, -3*S,  -7*S, 7*S, S,   '#222222'); // waist gap
  px(ctx, -3*S,  -6*S, 7*S, S,   '#aabbcc'); // belt/cod piece

  // Arms
  px(ctx, -5*S, -11*S, 2*S, 4*S, '#ddeeff');
  px(ctx,  3*S, -11*S, 2*S, 4*S, '#ddeeff');
  // Blaster (raised if alerted)
  const gunY = alerted ? -11*S : -9*S;
  px(ctx,  4*S, gunY,  4*S, 2*S, '#333333');

  // Neck
  px(ctx, -S, -12*S, 2*S, S, '#444444');

  // Helmet — iconic TIE-style
  px(ctx, -3*S, -17*S, 7*S, 6*S, '#ddeeff'); // main dome
  px(ctx, -4*S, -15*S, S,   3*S, '#ddeeff'); // left cheek
  px(ctx,  3*S, -15*S, S,   3*S, '#ddeeff'); // right cheek
  px(ctx, -2*S, -16*S, 5*S, 2*S, '#222222'); // visor strip
  px(ctx, -S,   -15*S, 3*S, S,   '#333300'); // yellow visor tint
  px(ctx, -3*S, -12*S, 7*S, S,   '#aabbcc'); // chin guard

  ctx.restore();
}

// ── Bounty Hunter ─────────────────────────────────────────────────────────────
export function drawBountyHunter(ctx, x, y, facing, frame) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (facing < 0) ctx.scale(-1, 1);

  const liftL = (frame % 4 === 1) ? S : 0;
  const liftR = (frame % 4 === 3) ? S : 0;

  // Legs + boots (dark green/grey)
  px(ctx,  S,    -5*S - liftR, 3*S, 4*S, '#3a4a3a');
  px(ctx,  S,    -S   - liftR, 3*S, S,   '#1a1a1a');
  px(ctx, -4*S,  -5*S - liftL, 3*S, 4*S, '#3a4a3a');
  px(ctx, -4*S,  -S   - liftL, 3*S, S,   '#1a1a1a');

  // Cape (back layer)
  px(ctx,  3*S, -13*S, 2*S, 8*S, '#221a1a');
  px(ctx,  4*S,  -6*S, 2*S, 4*S, '#1a1212'); // cape flare

  // Body armor
  px(ctx, -3*S, -12*S, 7*S, 6*S, '#445544');
  px(ctx, -2*S, -10*S, 5*S, 2*S, '#334433');
  px(ctx, -3*S,  -7*S, 7*S, S,   '#1a1a1a');
  px(ctx, -3*S,  -6*S, 7*S, S,   '#334433');

  // Arms
  px(ctx, -5*S, -12*S, 2*S, 4*S, '#445544');
  px(ctx,  3*S, -12*S, 2*S, 4*S, '#445544');
  px(ctx,  4*S,  -9*S, 5*S, 2*S, '#222222'); // blaster

  // Helmet (T-shaped visor — Mandalorian style)
  px(ctx, -3*S, -18*S, 7*S, 6*S, '#445544'); // dome
  px(ctx, -4*S, -15*S, S,   3*S, '#3a4a3a');
  px(ctx,  3*S, -15*S, S,   3*S, '#3a4a3a');
  px(ctx, -2*S, -16*S, 5*S, S,   '#1a1a1a'); // horizontal T-visor
  px(ctx,  0,   -17*S, S,   2*S, '#1a1a1a'); // vertical T-visor

  ctx.restore();
}

// ── Civilian Alien (3 variants) ───────────────────────────────────────────────
export function drawCivilian(ctx, x, y, facing, frame, variant = 0) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (facing < 0) ctx.scale(-1, 1);

  const liftL = (frame % 4 === 1) ? S : 0;
  const liftR = (frame % 4 === 3) ? S : 0;

  const PALETTES = [
    { skin: '#5a8a4a', robe: '#7a6a3a', head: '#4a7a3a' }, // green alien
    { skin: '#8a4a6a', robe: '#4a3a7a', head: '#7a3a5a' }, // purple alien
    { skin: '#c8a050', robe: '#6a4a2a', head: '#b89040' }, // desert human
  ];
  const { skin, robe, head } = PALETTES[variant];

  // Legs (robe covers most, just show feet)
  px(ctx,  S,    -S   - liftR, 2*S, S,   '#1a1a1a');
  px(ctx, -3*S,  -S   - liftL, 2*S, S,   '#1a1a1a');

  // Robe/robes
  px(ctx, -3*S, -9*S, 6*S, 8*S, robe);
  px(ctx, -2*S, -7*S, 4*S, 4*S, skin); // lighter centre

  // Arms
  px(ctx, -4*S, -9*S, S, 4*S, robe);
  px(ctx,  3*S, -9*S, S, 4*S, robe);

  // Head (variant shapes)
  px(ctx, -2*S, -12*S, 5*S, 3*S, skin);
  if (variant === 0) {
    // Ridged forehead
    px(ctx, -2*S, -14*S, 5*S, 2*S, head);
    px(ctx, -S,   -15*S, 3*S, S,   head);
  } else if (variant === 1) {
    // Wide dome head
    px(ctx, -3*S, -15*S, 7*S, 3*S, head);
    px(ctx, -2*S, -16*S, 5*S, S,   head);
  } else {
    // Hood
    px(ctx, -3*S, -15*S, 7*S, 3*S, '#5a4a2a');
    px(ctx, -3*S, -12*S, S,   2*S, '#5a4a2a'); // hood drape
  }

  ctx.restore();
}

// ── Rebel NPC (friendly — same look as player but blue jacket) ────────────────
export function drawRebelNPC(ctx, x, y, facing, frame) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (facing < 0) ctx.scale(-1, 1);

  const liftL = (frame % 4 === 1) ? S : 0;
  const liftR = (frame % 4 === 3) ? S : 0;

  px(ctx,  S,    -5*S - liftR, 3*S, 4*S, '#1e3055');
  px(ctx,  S,    -S   - liftR, 3*S, S,   '#0a0a14');
  px(ctx, -4*S,  -5*S - liftL, 3*S, 4*S, '#1e3055');
  px(ctx, -4*S,  -S   - liftL, 3*S, S,   '#0a0a14');

  px(ctx, -3*S, -11*S, 7*S, 5*S, '#1a4a88'); // blue rebel jacket
  px(ctx, -3*S,  -7*S, 7*S,  S,  '#113366');
  px(ctx, -3*S,  -6*S, 7*S,  S,  '#221100');

  px(ctx, -5*S, -11*S, 2*S, 4*S, '#1a4a88');
  px(ctx,  3*S, -11*S, 2*S, 4*S, '#1a4a88');
  px(ctx,  4*S,  -9*S, 5*S, 2*S, '#1a1a1a');

  px(ctx, -S,   -12*S, 2*S, S,   '#c88050');
  px(ctx, -2*S, -15*S, 5*S, 3*S, '#c88050');

  // Rebel helmet (orange stripe)
  px(ctx, -3*S, -17*S, 7*S, 3*S, '#ddeeff');
  px(ctx, -2*S, -16*S, 5*S, S,   '#ff6600'); // orange stripe
  px(ctx, -2*S, -15*S, 5*S, S,   '#334455'); // visor

  ctx.restore();
}

// ── Imperial Officer ──────────────────────────────────────────────────────────
export function drawOfficer(ctx, x, y, facing, frame) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (facing < 0) ctx.scale(-1, 1);

  const liftL = (frame % 4 === 1) ? S : 0;
  const liftR = (frame % 4 === 3) ? S : 0;

  px(ctx,  S,    -5*S - liftR, 3*S, 4*S, '#111a11');
  px(ctx,  S,    -S   - liftR, 3*S, S,   '#050505');
  px(ctx, -4*S,  -5*S - liftL, 3*S, 4*S, '#111a11');
  px(ctx, -4*S,  -S   - liftL, 3*S, S,   '#050505');

  // Grey-green uniform
  px(ctx, -3*S, -12*S, 7*S, 6*S, '#2a3a2a');
  px(ctx, -2*S, -10*S, 4*S, 2*S, '#cc1100'); // rank badges
  px(ctx, -2*S, -10*S, S,   S,   '#ffcc00');
  px(ctx, -S,   -10*S, S,   S,   '#ffcc00');
  px(ctx,  0,   -10*S, S,   S,   '#0044cc');
  px(ctx, -3*S,  -7*S, 7*S, S,   '#1a2a1a');
  px(ctx, -3*S,  -6*S, 7*S, S,   '#111a11');

  px(ctx, -5*S, -12*S, 2*S, 5*S, '#2a3a2a');
  px(ctx,  3*S, -12*S, 2*S, 5*S, '#2a3a2a');
  px(ctx,  4*S,  -9*S, 4*S, 2*S, '#222222');

  px(ctx, -S,   -13*S, 2*S, S,   '#c88050');
  px(ctx, -2*S, -16*S, 5*S, 3*S, '#c88050');

  // Officer cap
  px(ctx, -3*S, -17*S, 7*S, S,   '#111a11'); // cap brim
  px(ctx, -2*S, -20*S, 5*S, 3*S, '#1a2a1a'); // cap crown
  px(ctx, -S,   -20*S, 3*S, S,   '#cc1100'); // red band

  ctx.restore();
}

// ── Han Solo (seated, for cutscene) ──────────────────────────────────────────
// x, y = body center  |  talkFrame 0-3
export function drawHanSolo(ctx, x, y, talkFrame) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  const mouth = talkFrame % 2 === 0;

  // Legs (seated, extend forward)
  px(ctx, -14, 8, 12, 8, '#1e3055');
  px(ctx,   2, 8, 12, 8, '#1e3055');
  px(ctx,  12, 8,  8, 6, '#0a0a14'); // right boot forward

  // Body
  px(ctx, -12, -24, 24, 24, '#f0f0f0'); // white shirt
  px(ctx, -12, -24, 24, 12, '#111111'); // black vest over top half
  px(ctx,  -6, -24,  3, 12, '#f0f0f0'); // shirt stripe in vest
  px(ctx,   3, -24,  3, 12, '#f0f0f0');
  // Pants
  px(ctx, -12,   0, 12, 12, '#1e3055');
  px(ctx,   0,   0, 12, 12, '#1e3055');
  // Belt
  px(ctx, -12,   0, 24,  3, '#331100');

  // Arms (resting on table)
  px(ctx, -18, -12, 6, 8, '#f0f0f0');
  px(ctx,  12, -12, 6, 8, '#f0f0f0');

  // Head
  px(ctx, -9, -36, 18, 12, '#d8a070'); // face
  // Hair (dark brown, swept to side)
  px(ctx, -9, -42, 18, 6, '#3a2010');
  px(ctx,  6, -38, 6,  4, '#3a2010'); // swept side
  // Eyes
  px(ctx, -6, -32, 4, 3, '#552200');
  px(ctx,  2, -32, 4, 3, '#552200');
  // Mouth
  if (mouth) {
    px(ctx, -3, -26, 6, 2, '#331100');
  }
  // Chin / jawline
  px(ctx, -6, -25, 3, 2, '#c89060');
  px(ctx,  3, -25, 3, 2, '#c89060');

  ctx.restore();
}

// ── Chewbacca (seated, for cutscene) ─────────────────────────────────────────
export function drawChewie(ctx, x, y, gestureFrame) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  const g = gestureFrame % 4;

  // Big furry body (seated)
  px(ctx, -18, -30, 36, 38, '#7a4e20'); // main fur body
  px(ctx, -14, -28, 8,  16, '#5a3a10'); // fur shadow left
  px(ctx,   6, -28, 8,  16, '#5a3a10'); // fur shadow right
  px(ctx,  -8, -18, 16, 10, '#6a4218'); // chest lighter band

  // Bandolier
  px(ctx,  -2, -30,  4, 36, '#5a3a10');
  px(ctx,  -8, -10, 20,  4, '#3a2808'); // horizontal strap

  // Arms (g=0,1 = gesturing, 2,3 = resting)
  if (g < 2) {
    // Arm raised
    px(ctx, -26, -36, 10, 20, '#7a4e20');
    px(ctx,  16, -16, 10, 14, '#7a4e20');
  } else {
    px(ctx, -26, -16, 10, 14, '#7a4e20');
    px(ctx,  16, -16, 10, 14, '#7a4e20');
  }

  // Head (large, rounded)
  px(ctx, -14, -54, 28, 24, '#7a4e20');
  px(ctx, -16, -46, 6,  12, '#5a3a10'); // left cheek fur
  px(ctx,  10, -46, 6,  12, '#5a3a10');
  // Face: dark fur brow, lighter muzzle
  px(ctx,  -8, -50, 16, 6,  '#3a2010'); // dark brow
  px(ctx,  -6, -44, 12, 10, '#b88040'); // lighter muzzle
  // Eyes (small, wide-set)
  px(ctx,  -9, -46, 4, 4,   '#1a0a00');
  px(ctx,   5, -46, 4, 4,   '#1a0a00');
  // Nose
  px(ctx,  -2, -40, 4, 3,   '#1a0a00');
  // Mouth (open if gestureFrame 1 or 3)
  if (g === 1 || g === 3) {
    px(ctx, -5, -36, 10, 4,  '#1a0a00');
    px(ctx, -3, -35, 6,  2,  '#cc2200'); // tongue
  }

  ctx.restore();
}

// ── Cantina table (for cutscene) ──────────────────────────────────────────────
export function drawCantinaTable(ctx, x, y) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  // Table top
  px(ctx, -50, -8, 100, 8, '#5a3a18');
  px(ctx, -48, -10, 96, 4, '#7a5a28'); // top highlight
  // Table leg
  px(ctx, -4, 0, 8, 20, '#3a2210');
  // Mugs/cups
  px(ctx, -30, -16, 8, 8, '#445566');
  px(ctx, -28, -18, 6, 4, '#334455');
  px(ctx,  18, -16, 8, 8, '#664422');
  px(ctx,  20, -18, 6, 4, '#553311');

  ctx.restore();
}

// ── Millennium Falcon (side view) ─────────────────────────────────────────────
export function drawMillenniumFalcon(ctx, x, y) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));

  // Main saucer hull
  px(ctx, -110,  -20, 220, 40, '#8a8880'); // main disc
  px(ctx,  -90,  -30,  180, 10, '#9a9890'); // upper hull
  px(ctx,  -80,  -36,  140, 8,  '#7a7870'); // upper ridge
  px(ctx,  -90,   20,  180, 8,  '#7a7870'); // lower ridge

  // Cockpit (offset to right)
  px(ctx,   60,  -12,  50, 24, '#9a9890'); // cockpit arm
  px(ctx,   96,  -16,  28, 32, '#aaa89a'); // cockpit pod
  px(ctx,  100,  -12,  20, 14, '#334455'); // cockpit windows
  px(ctx,  102,  -10,  6,  4,  '#88aaff'); // window glow

  // Dish (offset left, top)
  px(ctx, -100,  -50,  40, 40, '#888680'); // dish base
  px(ctx,  -90,  -44,  20, 28, '#9a9890'); // dish centre
  px(ctx,  -84,  -40,  8,  20, '#aaa89a'); // dish highlight

  // Engine blocks (right side)
  px(ctx,  110,  -18,  20, 36, '#6a6860');
  px(ctx,  128,  -12,  10, 24, '#aaccff'); // engine glow left
  px(ctx,  130,   -8,  6,  16, '#ddeeff');
  px(ctx,  118,  -18,  12, 36, '#5a5850');

  // Hull detail lines (pixel stripes)
  for (let i = 0; i < 5; i++) {
    px(ctx, -80 + i * 28, -20, 4, 40, '#6a6860');
  }

  ctx.restore();
}

// ── Laser bolt ────────────────────────────────────────────────────────────────
export function drawBullet3(ctx, x, y, facing) {
  const bx = facing > 0 ? x : x - 14;
  px(ctx, bx,     y - 2, 14, 4, '#44ff88');
  px(ctx, bx + 2, y - 1, 10, 2, '#aaffcc');
}

// ── Background: sky + desert/city ─────────────────────────────────────────────
export function drawBackground3(ctx, cameraX, progress) {
  const W = 960, H = 540;

  // Fill entire canvas first — prevents trail artifacts in the horizon band
  ctx.fillStyle = '#c8a860';
  ctx.fillRect(0, 0, W, H);

  // Sky: Tatooine haze (layered on top)
  ctx.fillStyle = '#c8a860';
  ctx.fillRect(0, 0, W, H * 0.55);
  ctx.fillStyle = '#e8c880';
  ctx.fillRect(0, 0, W, H * 0.25);
  ctx.fillStyle = '#f0d890';
  ctx.fillRect(0, 0, W, H * 0.12);

  // Suns (parallax slow)
  const sunX1 = 180 - cameraX * 0.02;
  const sunX2 = 680 - cameraX * 0.02;
  ctx.fillStyle = '#ffffaa';
  ctx.fillRect(sunX1 - 16, 30, 32, 32);
  ctx.fillStyle = '#ffeecc';
  ctx.fillRect(sunX1 - 24, 20, 48, 48);
  ctx.fillStyle = '#ffcc55';
  ctx.fillRect(sunX2 - 10, 48, 20, 20);

  // Ground colour (sand/stone)
  const groundY = 450;
  ctx.fillStyle = '#b89850';
  ctx.fillRect(0, groundY, W, H - groundY);
  ctx.fillStyle = '#a88840';
  ctx.fillRect(0, groundY, W, 6);
  // Ground texture lines
  ctx.fillStyle = '#a07830';
  for (let tx = (-cameraX * 0.8) % 60; tx < W; tx += 60) {
    ctx.fillRect(tx, groundY + 10, 40, 3);
    ctx.fillRect(tx + 20, groundY + 22, 30, 2);
  }
}

// ── Background buildings (parallax) ──────────────────────────────────────────
export function drawBuildings(ctx, cameraX, buildings) {
  for (const b of buildings) {
    const sx = b.worldX - cameraX * b.parallax;
    if (sx > 970 || sx + b.w < -10) continue;
    drawBuilding(ctx, sx, 450, b.w, b.h, b.variant);
  }
}

// Pixel-art stepped dome — centerX/baseY are the dome's base center point
function _mossDome(ctx, cx, baseY, dw, lite, base, shad) {
  cx = Math.round(cx);
  const steps = [
    { fw: 1.0, fh: 0.28 },
    { fw: 0.78, fh: 0.26 },
    { fw: 0.54, fh: 0.22 },
    { fw: 0.30, fh: 0.16 },
    { fw: 0.12, fh: 0.12 },
  ];
  const totalH = Math.round(dw * 0.52);
  let y = baseY;
  for (const s of steps) {
    const sw = Math.max(4, Math.round(dw * s.fw));
    const sh = Math.max(3, Math.round(totalH * s.fh));
    y -= sh;
    ctx.fillStyle = base;
    ctx.fillRect(cx - Math.floor(sw / 2), y, sw, sh);
    // Top highlight strip
    ctx.fillStyle = lite;
    ctx.fillRect(cx - Math.floor(sw / 2), y, sw, Math.max(2, Math.floor(sh * 0.35)));
    // Right shadow strip
    ctx.fillStyle = shad;
    const ssx = Math.floor(sw * 0.72);
    ctx.fillRect(cx - Math.floor(sw / 2) + ssx, y, sw - ssx, sh);
  }
}

// Pixel-art arch doorway (rectangular with bevelled top header)
function _archDoor(ctx, cx, groundY, dw, dh, wallCol) {
  cx = Math.round(cx);
  const dx = cx - Math.floor(dw / 2);
  // Frame (wall-coloured surround)
  ctx.fillStyle = wallCol;
  ctx.fillRect(dx - 4, groundY - dh - 5, dw + 8, dh + 5);
  // Dark interior
  ctx.fillStyle = '#1a0a00';
  ctx.fillRect(dx, groundY - dh, dw, dh);
  // Stepped arch top (3-step pixel curve)
  ctx.fillStyle = '#1a0a00';
  ctx.fillRect(dx + 2, groundY - dh - 4, dw - 4, 4);
  ctx.fillRect(dx + 4, groundY - dh - 6, dw - 8, 2);
  // Faint warm glow inside
  ctx.fillStyle = 'rgba(255,150,60,0.12)';
  ctx.fillRect(dx + 2, groundY - dh + 4, dw - 4, dh - 8);
}

function drawBuilding(ctx, x, groundY, w, h, variant) {
  const bx = Math.round(x);
  const by = groundY - h;

  // Mos Eisley sandstone palette (3 colour variants)
  const PALS = [
    { base: '#d4b878', lite: '#ecdaa0', shad: '#a88848', edge: '#7a6030' },
    { base: '#c8a868', lite: '#dcc088', shad: '#987030', edge: '#705020' },
    { base: '#dfc890', lite: '#f0dcb0', shad: '#b09050', edge: '#907040' },
  ];

  // ── Cantina building (special) ──────────────────────────────────────────────
  if (variant === 99) {
    const p = PALS[0];
    // Main wall
    ctx.fillStyle = p.base;
    ctx.fillRect(bx, by, w, h);
    ctx.fillStyle = p.shad;
    ctx.fillRect(bx + w - Math.floor(w * 0.2), by, Math.floor(w * 0.2), h);
    ctx.fillStyle = p.edge;
    ctx.fillRect(bx, by, 3, h);
    // Big center dome
    _mossDome(ctx, bx + w * 0.5, by, w * 0.58, p.lite, p.base, p.shad);
    // Smaller side dome
    _mossDome(ctx, bx + w * 0.2, by, w * 0.28, p.lite, p.base, p.shad);
    // Sign panel
    ctx.fillStyle = '#5a1a00';
    ctx.fillRect(bx + w / 2 - 40, by + 12, 80, 20);
    ctx.fillStyle = '#cc3300';
    ctx.fillRect(bx + w / 2 - 38, by + 13, 76, 18);
    ctx.fillStyle = '#ffcc44';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CANTINA', bx + w / 2, by + 27);
    ctx.textAlign = 'left';
    // Arch doorway
    _archDoor(ctx, bx + w * 0.5, groundY, 32, 54, p.base);
    return;
  }

  const v = variant % 3;
  const p = PALS[v];

  if (v === 0) {
    // ── Style A: Single dome building ────────────────────────────────────────
    ctx.fillStyle = p.base;
    ctx.fillRect(bx, by, w, h);
    ctx.fillStyle = p.shad;
    ctx.fillRect(bx + w - Math.floor(w * 0.22), by, Math.floor(w * 0.22), h);
    ctx.fillStyle = p.edge;
    ctx.fillRect(bx, by, 3, h);
    // Dome
    _mossDome(ctx, bx + w * 0.5, by, w * 0.52, p.lite, p.base, p.shad);
    // Small round porthole window
    if (w > 60) {
      const wx = bx + Math.floor(w * 0.28), wy = by + Math.floor(h * 0.38);
      ctx.fillStyle = p.edge;
      ctx.fillRect(wx - 5, wy - 5, 10, 10);
      ctx.fillStyle = '#1e2a38';
      ctx.fillRect(wx - 3, wy - 3, 6, 6);
    }
    // Arch door
    _archDoor(ctx, bx + w * 0.5, groundY, 26, 46, p.base);

  } else if (v === 1) {
    // ── Style B: Two-dome compound (two connected boxes) ─────────────────────
    const lw = Math.floor(w * 0.58);
    const rw = w - lw - 3;
    const rh = Math.floor(h * 0.68);
    // Taller left box
    ctx.fillStyle = p.base;
    ctx.fillRect(bx, by, lw, h);
    ctx.fillStyle = p.shad;
    ctx.fillRect(bx + lw - Math.floor(lw * 0.2), by, Math.floor(lw * 0.2), h);
    ctx.fillStyle = p.edge;
    ctx.fillRect(bx, by, 3, h);
    _mossDome(ctx, bx + lw * 0.5, by, lw * 0.46, p.lite, p.base, p.shad);
    // Shorter right box
    const rbx = bx + lw + 3;
    const rby = groundY - rh;
    ctx.fillStyle = p.lite;
    ctx.fillRect(rbx, rby, rw, rh);
    ctx.fillStyle = p.base;
    ctx.fillRect(rbx + rw - Math.floor(rw * 0.22), rby, Math.floor(rw * 0.22), rh);
    _mossDome(ctx, rbx + rw * 0.5, rby, rw * 0.44, p.lite, p.base, p.shad);
    // Arch door in left box
    _archDoor(ctx, bx + lw * 0.45, groundY, 24, 44, p.base);

  } else {
    // ── Style C: Stepped terrace ──────────────────────────────────────────────
    // Ground level
    ctx.fillStyle = p.base;
    ctx.fillRect(bx, by, w, h);
    ctx.fillStyle = p.shad;
    ctx.fillRect(bx + w - Math.floor(w * 0.2), by, Math.floor(w * 0.2), h);
    ctx.fillStyle = p.edge;
    ctx.fillRect(bx, by, 3, h);
    // Second level (70% width, centered)
    const tw = Math.floor(w * 0.7);
    const tx = bx + Math.floor((w - tw) / 2);
    const th = Math.floor(h * 0.42);
    ctx.fillStyle = p.lite;
    ctx.fillRect(tx, by - th, tw, th);
    ctx.fillStyle = p.base;
    ctx.fillRect(tx + tw - Math.floor(tw * 0.2), by - th, Math.floor(tw * 0.2), th);
    // Parapet lips
    ctx.fillStyle = p.edge;
    ctx.fillRect(bx,      by,      w,  4);  // first level parapet top
    ctx.fillRect(tx,      by - th, tw, 4);  // second level parapet top
    // Dome on top level
    _mossDome(ctx, tx + tw * 0.5, by - th, tw * 0.42, p.lite, p.base, p.shad);
    // Arch door
    _archDoor(ctx, bx + w * 0.42, groundY, 22, 42, p.base);
  }
}

// ── Cover obstacles ───────────────────────────────────────────────────────────
export function drawCrate(ctx, x, groundY) {
  const W = 28, H = 28;
  const bx = Math.round(x), by = groundY - H;
  px(ctx, bx,       by,   W,   H,   '#7a5520');
  px(ctx, bx,       by,   W,   4,   '#aa8040'); // top highlight
  px(ctx, bx,       by,   4,   H,   '#9a7030'); // left face
  px(ctx, bx+W-4,   by,   4,   H,   '#4a3010'); // right shadow
  px(ctx, bx+11,    by,   6,   H,   '#5a3a10'); // vertical plank
  px(ctx, bx,       by+11, W,  6,   '#5a3a10'); // horizontal plank
  px(ctx, bx+2,     by+2,  4,  4,   '#cc9930'); // corner bolts
  px(ctx, bx+W-6,   by+2,  4,  4,   '#cc9930');
  px(ctx, bx+2,     by+H-6, 4, 4,   '#cc9930');
  px(ctx, bx+W-6,   by+H-6, 4, 4,   '#cc9930');
}

export function drawLowWall(ctx, x, groundY, w = 55, h = 32) {
  const bx = Math.round(x), by = groundY - h;
  px(ctx, bx,       by,   w,   h,   '#c4a060'); // sandstone
  px(ctx, bx,       by,   w,   4,   '#e0c080'); // top highlight
  px(ctx, bx,       by,   4,   h,   '#d4b070'); // left face
  px(ctx, bx+w-5,   by,   5,   h,   '#8a6030'); // right shadow
  px(ctx, bx+4,     by+12, w-8, 2,  '#b09050'); // brick joints
  px(ctx, bx+4,     by+22, w-8, 2,  '#b09050');
  px(ctx, bx+Math.floor(w/2), by+4,  2, 8, '#b09050');
  px(ctx, bx+Math.floor(w/4), by+14, 2, 8, '#b09050');
  px(ctx, bx+Math.floor(3*w/4), by+14, 2, 8, '#b09050');
}

export function drawPillar(ctx, x, groundY, h = 70) {
  const W = 16, bx = Math.round(x), by = groundY - h;
  px(ctx, bx-3, by,        W+6, 6,  '#d4b878'); // capital top
  px(ctx, bx-3, by,        W+6, 2,  '#f0d890'); // highlight
  px(ctx, bx,   by+6,      W,   h-12, '#c4a060'); // shaft
  px(ctx, bx+W-4, by+6,    4,   h-12, '#8a6030'); // shaft shadow
  px(ctx, bx-3, groundY-6, W+6, 6,  '#d4b878'); // base
}

// ── Platform tile ─────────────────────────────────────────────────────────────
export function drawPlatform(ctx, screenX, y, w) {
  // Stone/sandstone ledge
  ctx.fillStyle = '#c8a860';
  ctx.fillRect(screenX, y, w, 12);
  ctx.fillStyle = '#a07830';
  ctx.fillRect(screenX, y, w, 3);       // top edge
  ctx.fillStyle = '#dfc890';
  ctx.fillRect(screenX + 2, y + 1, w - 4, 2); // highlight
  ctx.fillStyle = '#907030';
  ctx.fillRect(screenX, y + 12, w, 2);  // bottom shadow
}

// ── Cantina door trigger indicator ───────────────────────────────────────────
export function drawCantinaEntrance(ctx, screenX, groundY) {
  // Arch
  ctx.fillStyle = '#5a3a10';
  ctx.fillRect(screenX - 16, groundY - 60, 4, 60);
  ctx.fillRect(screenX + 12, groundY - 60, 4, 60);
  // Doorway glow (beckoning)
  ctx.fillStyle = 'rgba(255,180,80,0.25)';
  ctx.fillRect(screenX - 12, groundY - 56, 24, 56);
  ctx.fillStyle = '#ffcc66';
  ctx.fillRect(screenX - 8, groundY - 2, 16, 2);
}

// ── Full-screen Cantina Interior (cutscene background) ────────────────────────
export function drawCantinaInterior(ctx) {
  const W = 960, H = 540;

  // Dark warm base
  ctx.fillStyle = '#180c06';
  ctx.fillRect(0, 0, W, H);

  // Floor — worn stone
  ctx.fillStyle = '#2a1e12';
  ctx.fillRect(0, 360, W, H - 360);
  ctx.fillStyle = '#221608';
  for (let x = 0; x < W; x += 90) ctx.fillRect(x, 360, 2, H - 360);
  for (let y = 360; y < H; y += 40) ctx.fillRect(0, y, W, 1);

  // Back wall with stone texture
  ctx.fillStyle = '#1e1208';
  ctx.fillRect(0, 0, W, 365);
  ctx.fillStyle = '#261a0e';
  for (let y = 40; y < 360; y += 50) {
    for (let x = (y % 100 === 0 ? 0 : 45); x < W; x += 90) {
      ctx.fillStyle = '#2e1e10';
      ctx.fillRect(x, y, 84, 44);
      ctx.fillStyle = '#1a1008';
      ctx.fillRect(x, y, 84, 2);
      ctx.fillRect(x + 84, y, 2, 44);
    }
  }

  // Background arch doorways (left and right of scene)
  function _archBg(cx, baseY, w, h) {
    ctx.fillStyle = '#100806';
    ctx.fillRect(cx - w/2, baseY - h, w, h);
    ctx.fillStyle = '#0a0604';
    ctx.fillRect(cx - w/2 + 2, baseY - h + 2, w - 4, h - 2);
    // Warm glow inside arch
    ctx.fillStyle = 'rgba(200,100,20,0.08)';
    ctx.fillRect(cx - w/2 + 4, baseY - h + 4, w - 8, h - 6);
  }
  _archBg(90,  360, 70, 160);
  _archBg(870, 360, 70, 160);
  _archBg(250, 360, 50, 120);
  _archBg(710, 360, 50, 120);

  // Background alien silhouettes at booths
  const silColors = ['#2a1a0e', '#1e1408', '#261608'];
  const patrons = [
    { x: 70,  y: 320, w: 20, hd: 14 },
    { x: 110, y: 325, w: 18, hd: 18 },
    { x: 240, y: 318, w: 22, hd: 16 },
    { x: 700, y: 320, w: 20, hd: 20 },
    { x: 740, y: 322, w: 18, hd: 14 },
    { x: 860, y: 318, w: 22, hd: 16 },
    { x: 900, y: 320, w: 20, hd: 18 },
  ];
  for (let i = 0; i < patrons.length; i++) {
    const p = patrons[i];
    ctx.fillStyle = silColors[i % 3];
    ctx.fillRect(p.x - p.w/2, p.y - 40, p.w, 40);    // body
    ctx.fillRect(p.x - p.hd/2, p.y - 40 - p.hd, p.hd, p.hd); // head
  }

  // Hanging lights — warm glows
  const lampX = [160, 320, 480, 640, 800];
  for (const lx of lampX) {
    // Cord
    ctx.fillStyle = '#3a2a18';
    ctx.fillRect(lx - 1, 0, 2, 80);
    // Lamp fixture
    ctx.fillStyle = '#aa7730';
    ctx.fillRect(lx - 10, 76, 20, 12);
    ctx.fillRect(lx - 6, 88, 12, 6);
    // Glow (layered radial approximation with rectangles)
    ctx.fillStyle = 'rgba(255,160,40,0.30)';
    ctx.fillRect(lx - 60, 82, 120, 80);
    ctx.fillStyle = 'rgba(255,180,60,0.20)';
    ctx.fillRect(lx - 100, 82, 200, 140);
    ctx.fillStyle = 'rgba(255,200,80,0.10)';
    ctx.fillRect(lx - 150, 82, 300, 220);
  }

  // Band silhouette — top-right corner
  ctx.fillStyle = '#140e06';
  ctx.fillRect(760, 200, 200, 160);
  ctx.fillStyle = '#1e1408';
  ctx.fillRect(762, 202, 196, 156);
  // Band members (silhouettes)
  const band = [{x:790,y:355,hw:10},{x:820,y:348,hw:14},{x:855,y:352,hw:10},{x:885,y:350,hw:12}];
  for (const m of band) {
    ctx.fillStyle = '#0e0806';
    ctx.fillRect(m.x - m.hw/2, m.y - 38, m.hw, 38);
    ctx.fillRect(m.x - 8, m.y - 38 - 14, 16, 14);
    // Instrument outline
    ctx.fillStyle = '#1a100a';
    ctx.fillRect(m.x + m.hw/2, m.y - 32, 16, 6);
  }
  ctx.fillStyle = '#3a2810';
  ctx.font = '9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MOS EISLEY CANTINA', 860, 215);
  ctx.textAlign = 'left';

  // Bar counter (right side)
  ctx.fillStyle = '#3a2210';
  ctx.fillRect(620, 280, 140, 80);
  ctx.fillStyle = '#5a3820';
  ctx.fillRect(620, 278, 140, 8);
  // Bottles on bar
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = ['#2244aa','#448822','#aa4422','#226644','#884422'][i];
    ctx.fillRect(628 + i * 22, 252, 10, 28);
    ctx.fillRect(631 + i * 22, 248, 4, 6);
  }

  // Atmospheric ambient glow overlay (centre warm light from above)
  ctx.fillStyle = 'rgba(180,80,10,0.06)';
  ctx.fillRect(200, 0, 560, 540);
  ctx.fillStyle = 'rgba(200,100,20,0.04)';
  ctx.fillRect(0, 0, 960, 540);
}

// ── Full-screen Docking Bay Interior (battle background) ─────────────────────
// Brownstone adobe style, Tatooine daytime sky through open roof
export function drawDockingBayInterior(ctx, falconScreenX) {
  const W = 960, H = 540;
  const groundY = 450;

  // ── Sandy stone floor ───────────────────────────────────────────────────────
  ctx.fillStyle = '#b89050';
  ctx.fillRect(0, groundY, W, H - groundY);
  // Floor grout lines
  ctx.fillStyle = '#a07838';
  for (let x = 0; x < W; x += 100) ctx.fillRect(x, groundY, 2, H - groundY);
  ctx.fillStyle = '#c8a860';
  for (let y = groundY + 18; y < H; y += 36) ctx.fillRect(0, y, W, 2);
  // Floor highlight at wall base
  ctx.fillStyle = '#d4b870';
  ctx.fillRect(0, groundY, W, 4);

  // Bay floor markings (yellow painted lines)
  ctx.fillStyle = '#cc9900';
  ctx.fillRect(50, groundY + 6, 220, 5);
  ctx.fillRect(W - 270, groundY + 6, 220, 5);
  ctx.fillRect(50, groundY + 6, 5, 36);
  ctx.fillRect(W - 55, groundY + 6, 5, 36);
  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DOCKING BAY 94', W / 2, groundY + 30);
  ctx.textAlign = 'left';

  // ── Sandstone walls (sides and back) ───────────────────────────────────────
  // Full interior back wall
  ctx.fillStyle = '#c4a060';
  ctx.fillRect(0, 0, W, groundY);
  // Stone block texture on back wall
  ctx.fillStyle = '#b89050';
  for (let y = 20; y < groundY; y += 48) {
    const offset = (y % 96 === 0) ? 0 : 50;
    for (let x = offset - 100; x < W; x += 100) {
      ctx.fillRect(x, y, 96, 44);
      // Block face
      ctx.fillStyle = '#c8aa68';
      ctx.fillRect(x + 2, y + 2, 92, 40);
      ctx.fillStyle = '#a88840';
      ctx.fillRect(x + 2, y + 2, 92, 4);   // top shadow under highlight
      ctx.fillRect(x + 88, y + 2, 4, 40);  // right shadow
      ctx.fillStyle = '#b89050';
    }
  }

  // ── Open roof section — Tatooine daytime sky ────────────────────────────────
  const openW = 380, openX = (W - openW) / 2;

  // Sky gradient approximation (layered)
  ctx.fillStyle = '#e8c070';
  ctx.fillRect(openX, 0, openW, 30);
  ctx.fillStyle = '#d4a850';
  ctx.fillRect(openX, 30, openW, 30);
  ctx.fillStyle = '#c49040';
  ctx.fillRect(openX, 60, openW, 40);
  ctx.fillStyle = '#b88030';
  ctx.fillRect(openX, 100, openW, 20);

  // Twin suns (small, high up)
  ctx.fillStyle = '#ffffaa';
  ctx.fillRect(openX + 80, 12, 18, 18);
  ctx.fillStyle = '#ffeecc';
  ctx.fillRect(openX + 76, 8, 26, 26);
  ctx.fillStyle = '#ffcc55';
  ctx.fillRect(openX + 240, 22, 12, 12);
  ctx.fillStyle = '#ffddaa';
  ctx.fillRect(openX + 237, 19, 18, 18);

  // Haze/heat near bottom of sky opening
  ctx.fillStyle = 'rgba(200,140,40,0.35)';
  ctx.fillRect(openX, 90, openW, 30);

  // ── Roof structure framing the sky opening ──────────────────────────────────
  // Ceiling on both sides of opening — sandstone
  ctx.fillStyle = '#9a7838';
  ctx.fillRect(0, 0, openX, 130);
  ctx.fillRect(openX + openW, 0, W - openX - openW, 130);
  // Ceiling stone texture
  ctx.fillStyle = '#b08840';
  ctx.fillRect(0, 0, openX, 4);
  ctx.fillRect(openX + openW, 0, W - openX - openW, 4);

  // Thick sandstone arch beams at opening edges
  ctx.fillStyle = '#c4a060';
  ctx.fillRect(openX - 18, 0, 18, 145);
  ctx.fillRect(openX + openW, 0, 18, 145);
  // Beam shadow/highlight
  ctx.fillStyle = '#a88040';
  ctx.fillRect(openX - 18, 0, 4, 145);
  ctx.fillStyle = '#dcc078';
  ctx.fillRect(openX - 4, 0, 4, 145);
  ctx.fillRect(openX + openW + 14, 0, 4, 145);

  // Horizontal stone ledge under the roof opening
  ctx.fillStyle = '#b89050';
  ctx.fillRect(0, 120, W, 22);
  ctx.fillStyle = '#d4b870';
  ctx.fillRect(0, 120, W, 4);
  ctx.fillStyle = '#8a6828';
  ctx.fillRect(0, 140, W, 2);

  // ── Sandstone side walls (foreground, left and right) ──────────────────────
  ctx.fillStyle = '#c8a860';
  ctx.fillRect(0, 142, 52, groundY - 142);
  ctx.fillStyle = '#dcc078';
  ctx.fillRect(0, 142, 5, groundY - 142);
  ctx.fillStyle = '#a88040';
  ctx.fillRect(48, 142, 4, groundY - 142);
  // Brick courses on left wall
  for (let y = 155; y < groundY; y += 50) {
    ctx.fillStyle = '#b89050';
    ctx.fillRect(6, y, 40, 2);
  }

  ctx.fillStyle = '#c8a860';
  ctx.fillRect(W - 52, 142, 52, groundY - 142);
  ctx.fillStyle = '#a88040';
  ctx.fillRect(W - 52, 142, 4, groundY - 142);
  ctx.fillStyle = '#dcc078';
  ctx.fillRect(W - 5, 142, 5, groundY - 142);
  for (let y = 155; y < groundY; y += 50) {
    ctx.fillStyle = '#b89050';
    ctx.fillRect(W - 46, y, 40, 2);
  }

  // ── Bay entrance (arch doorway, left side) ──────────────────────────────────
  const doorH = 160, doorW = 50;
  ctx.fillStyle = '#8a6020';
  ctx.fillRect(0, groundY - doorH, doorW, doorH);
  // Arch interior
  ctx.fillStyle = '#c8a860';
  ctx.fillRect(2, groundY - doorH + 4, doorW - 4, doorH - 4);
  // Warm outside glow through door
  ctx.fillStyle = 'rgba(230,180,60,0.30)';
  ctx.fillRect(4, groundY - doorH + 6, doorW - 8, doorH - 10);
  // Door step/threshold
  ctx.fillStyle = '#a88840';
  ctx.fillRect(0, groundY - 5, doorW, 5);

  // ── Warm Tatooine ambient light overlay ────────────────────────────────────
  ctx.fillStyle = 'rgba(210,150,40,0.06)';
  ctx.fillRect(0, 0, W, H);

  // ── Engine glow from Falcon ────────────────────────────────────────────────
  if (falconScreenX !== undefined) {
    ctx.fillStyle = 'rgba(100,160,255,0.07)';
    ctx.fillRect(falconScreenX + 80, groundY - 90, 110, 90);
    ctx.fillStyle = 'rgba(150,200,255,0.04)';
    ctx.fillRect(falconScreenX + 60, groundY - 140, 150, 140);
  }
}
