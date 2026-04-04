// All sprites drawn programmatically — no external image files needed.
// Each function draws to a given canvas context at given dimensions.

export function drawStormtrooper(ctx, w, h, frame = 0, isDead = false) {
  ctx.clearRect(0, 0, w, h);
  if (isDead) {
    // Slumped shape
    ctx.fillStyle = '#ccc';
    ctx.fillRect(w * 0.2, h * 0.6, w * 0.6, h * 0.35);
    ctx.fillStyle = '#888';
    ctx.fillRect(w * 0.25, h * 0.65, w * 0.5, h * 0.25);
    return;
  }

  const bobY = frame % 2 === 0 ? 0 : h * 0.01;

  // Legs
  ctx.fillStyle = '#bbb';
  ctx.fillRect(w*0.3,  h*0.72 + bobY, w*0.15, h*0.25);
  ctx.fillRect(w*0.55, h*0.72 + bobY, w*0.15, h*0.25);

  // Body
  ctx.fillStyle = '#d8d8d8';
  ctx.fillRect(w*0.25, h*0.42 + bobY, w*0.5, h*0.32);

  // Chest detail
  ctx.fillStyle = '#aaa';
  ctx.fillRect(w*0.3,  h*0.45 + bobY, w*0.17, h*0.1);
  ctx.fillRect(w*0.53, h*0.45 + bobY, w*0.17, h*0.1);

  // Arms
  ctx.fillStyle = '#c8c8c8';
  ctx.fillRect(w*0.12, h*0.43 + bobY, w*0.13, h*0.28);
  ctx.fillRect(w*0.75, h*0.43 + bobY, w*0.13, h*0.28);

  // Neck
  ctx.fillStyle = '#aaa';
  ctx.fillRect(w*0.42, h*0.37 + bobY, w*0.16, h*0.07);

  // Helmet
  ctx.fillStyle = '#e0e0e0';
  // dome
  ctx.beginPath();
  ctx.ellipse(w*0.5, h*0.27 + bobY, w*0.22, h*0.15, 0, Math.PI, 0);
  ctx.fill();
  // face plate
  ctx.fillRect(w*0.3, h*0.27 + bobY, w*0.4, h*0.12);

  // Visor (dark T-shape)
  ctx.fillStyle = '#333';
  ctx.fillRect(w*0.33, h*0.28 + bobY, w*0.34, h*0.05);
  ctx.fillRect(w*0.43, h*0.28 + bobY, w*0.14, h*0.1);

  // Gun
  ctx.fillStyle = '#555';
  ctx.fillRect(w*0.75, h*0.55 + bobY, w*0.18, h*0.05);
  ctx.fillRect(w*0.82, h*0.53 + bobY, w*0.05, h*0.08);

  // Muzzle flash on fire frame
  if (frame === 3) {
    ctx.fillStyle = 'rgba(255,200,50,0.9)';
    ctx.beginPath();
    ctx.arc(w*0.94, h*0.575, w*0.04, 0, Math.PI*2);
    ctx.fill();
  }
}

export function drawDarthVader(ctx, w, h, frame = 0, phase2 = false, isDead = false) {
  ctx.clearRect(0, 0, w, h);
  if (isDead) {
    ctx.fillStyle = '#111';
    ctx.fillRect(w*0.15, h*0.55, w*0.7, h*0.4);
    return;
  }

  const bobY = frame % 2 === 0 ? 0 : h * 0.01;

  // Cape
  ctx.fillStyle = '#0a0a0a';
  ctx.beginPath();
  ctx.moveTo(w*0.1, h*0.35 + bobY);
  ctx.lineTo(w*0.05, h*1.0 + bobY);
  ctx.lineTo(w*0.95, h*1.0 + bobY);
  ctx.lineTo(w*0.9, h*0.35 + bobY);
  ctx.fill();

  // Legs
  ctx.fillStyle = '#111';
  ctx.fillRect(w*0.28, h*0.68 + bobY, w*0.18, h*0.30);
  ctx.fillRect(w*0.54, h*0.68 + bobY, w*0.18, h*0.30);

  // Body armor
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(w*0.22, h*0.38 + bobY, w*0.56, h*0.32);

  // Chest box (control panel)
  ctx.fillStyle = '#111';
  ctx.fillRect(w*0.35, h*0.43 + bobY, w*0.3, h*0.18);
  // control lights
  const lights = ['#f00','#0f0','#00f','#ff0'];
  lights.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(w*(0.37 + i*0.05), h*0.47 + bobY, w*0.03, h*0.04);
  });

  // Arms
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(w*0.08, h*0.39 + bobY, w*0.14, h*0.30);
  ctx.fillRect(w*0.78, h*0.39 + bobY, w*0.14, h*0.30);

  // Gloves
  ctx.fillStyle = '#000';
  ctx.fillRect(w*0.08, h*0.65 + bobY, w*0.14, h*0.08);
  ctx.fillRect(w*0.78, h*0.65 + bobY, w*0.14, h*0.08);

  // Helmet — dome
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.ellipse(w*0.5, h*0.24 + bobY, w*0.25, h*0.18, 0, Math.PI, 0);
  ctx.fill();
  // face mask
  ctx.fillRect(w*0.28, h*0.22 + bobY, w*0.44, h*0.18);

  // Eye lenses
  ctx.fillStyle = '#222';
  ctx.fillRect(w*0.33, h*0.25 + bobY, w*0.13, h*0.07);
  ctx.fillRect(w*0.54, h*0.25 + bobY, w*0.13, h*0.07);

  // Breathing grille
  ctx.fillStyle = '#1a1a1a';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(w*(0.38 + i*0.05), h*0.33 + bobY, w*0.02, h*0.06);
  }

  // Neck
  ctx.fillStyle = '#111';
  ctx.fillRect(w*0.42, h*0.37 + bobY, w*0.16, h*0.05);

  // Lightsaber in phase 2
  if (phase2) {
    // hilt
    ctx.fillStyle = '#555';
    ctx.fillRect(w*0.78, h*0.62 + bobY, w*0.05, h*0.14);
    // blade
    ctx.fillStyle = 'rgba(220,0,0,0.9)';
    ctx.fillRect(w*0.795, h*0.20 + bobY, w*0.025, h*0.42);
    // glow
    ctx.fillStyle = 'rgba(255,50,50,0.3)';
    ctx.fillRect(w*0.77, h*0.18 + bobY, w*0.06, h*0.46);
  } else {
    // blaster in hand
    ctx.fillStyle = '#333';
    ctx.fillRect(w*0.78, h*0.62 + bobY, w*0.16, h*0.05);
  }

  // Muzzle flash
  if (frame === 3 && !phase2) {
    ctx.fillStyle = 'rgba(255, 50, 50, 0.9)';
    ctx.beginPath();
    ctx.arc(w*0.94, h*0.625, w*0.04, 0, Math.PI*2);
    ctx.fill();
  }
}

export function drawBlaster(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  // Body
  ctx.fillStyle = '#555';
  ctx.fillRect(w*0.25, h*0.35, w*0.5, h*0.22);
  // Grip
  ctx.fillStyle = '#444';
  ctx.fillRect(w*0.35, h*0.55, w*0.18, h*0.32);
  // Barrel
  ctx.fillStyle = '#666';
  ctx.fillRect(w*0.2, h*0.38, w*0.62, h*0.1);
  // Scope
  ctx.fillStyle = '#333';
  ctx.fillRect(w*0.45, h*0.28, w*0.15, h*0.1);
  // Trigger guard
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(w*0.38, h*0.55, w*0.03, h*0.15);
  ctx.fillRect(w*0.38, h*0.68, w*0.15, h*0.03);
}

export function drawBlasterFire(ctx, w, h) {
  drawBlaster(ctx, w, h);
  // Muzzle flash
  ctx.fillStyle = 'rgba(255, 100, 0, 0.95)';
  ctx.beginPath();
  ctx.arc(w*0.17, h*0.43, w*0.06, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 200, 50, 0.8)';
  ctx.beginPath();
  ctx.arc(w*0.12, h*0.43, w*0.03, 0, Math.PI*2);
  ctx.fill();
}

export function drawHealthPack(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  // Crate / box
  ctx.fillStyle = '#2a6020';
  ctx.fillRect(w*0.15, h*0.35, w*0.7, h*0.55);
  ctx.fillStyle = '#1a4010';
  ctx.fillRect(w*0.15, h*0.35, w*0.7, h*0.08); // top shadow
  // White cross
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(w*0.42, h*0.42, w*0.16, h*0.40); // vertical
  ctx.fillRect(w*0.27, h*0.55, w*0.46, h*0.14); // horizontal
  // Glow
  ctx.fillStyle = 'rgba(100,255,80,0.18)';
  ctx.beginPath();
  ctx.ellipse(w*0.5, h*0.62, w*0.38, h*0.2, 0, 0, Math.PI*2);
  ctx.fill();
}

export function drawAmmoPack(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  // Box
  ctx.fillStyle = '#7a6010';
  ctx.fillRect(w*0.12, h*0.38, w*0.76, h*0.50);
  ctx.fillStyle = '#4a3808';
  ctx.fillRect(w*0.12, h*0.38, w*0.76, h*0.08);
  // Ammo symbol (bullet shape repeated)
  ctx.fillStyle = '#e0c040';
  for (let i = 0; i < 4; i++) {
    const bx = w*(0.20 + i*0.17);
    ctx.fillRect(bx, h*0.50, w*0.08, h*0.28);
    ctx.beginPath();
    ctx.ellipse(bx + w*0.04, h*0.50, w*0.04, h*0.06, 0, Math.PI, 0);
    ctx.fill();
  }
  // Label band
  ctx.fillStyle = '#c04010';
  ctx.fillRect(w*0.12, h*0.62, w*0.76, h*0.08);
  // Glow
  ctx.fillStyle = 'rgba(255,200,50,0.15)';
  ctx.beginPath();
  ctx.ellipse(w*0.5, h*0.65, w*0.38, h*0.18, 0, 0, Math.PI*2);
  ctx.fill();
}

// Pre-render sprites to offscreen canvases for performance
const CACHE = {};
export function getCached(key, w, h, drawFn) {
  if (!CACHE[key]) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    drawFn(c.getContext('2d'), w, h);
    CACHE[key] = c;
  }
  return CACHE[key];
}
