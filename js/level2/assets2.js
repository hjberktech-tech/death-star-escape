// js/level2/assets2.js — Pure canvas 2D drawing functions for Level 2

// Draw an X-Wing fighter, side view, ~54×24px
// flipped=true means facing left, hitFlash shows bright tint
export function drawXWing(ctx, x, y, flipped = false, hitFlash = false) {
  ctx.save();
  ctx.translate(x, y);
  if (flipped) ctx.scale(-1, 1);

  // Body
  ctx.fillStyle = hitFlash ? '#ffffff' : '#8899aa';
  // Main fuselage
  ctx.fillRect(-27, -5, 48, 10);
  // Nose triangle
  ctx.beginPath();
  ctx.moveTo(21, -4);
  ctx.lineTo(27, 0);
  ctx.lineTo(21, 4);
  ctx.closePath();
  ctx.fill();

  // Red stripe
  ctx.fillStyle = hitFlash ? '#ffaaaa' : '#cc2233';
  ctx.fillRect(-10, -5, 30, 2);
  ctx.fillRect(-10, 3, 30, 2);

  // Upper wings (pair)
  ctx.fillStyle = hitFlash ? '#cccccc' : '#667788';
  // Upper-front wing
  ctx.beginPath();
  ctx.moveTo(10, -5);
  ctx.lineTo(18, -22);
  ctx.lineTo(4, -22);
  ctx.lineTo(-4, -5);
  ctx.closePath();
  ctx.fill();
  // Upper-back wing
  ctx.beginPath();
  ctx.moveTo(-4, -5);
  ctx.lineTo(-14, -20);
  ctx.lineTo(-22, -20);
  ctx.lineTo(-16, -5);
  ctx.closePath();
  ctx.fill();
  // Lower-front wing
  ctx.beginPath();
  ctx.moveTo(10, 5);
  ctx.lineTo(18, 22);
  ctx.lineTo(4, 22);
  ctx.lineTo(-4, 5);
  ctx.closePath();
  ctx.fill();
  // Lower-back wing
  ctx.beginPath();
  ctx.moveTo(-4, 5);
  ctx.lineTo(-14, 20);
  ctx.lineTo(-22, 20);
  ctx.lineTo(-16, 5);
  ctx.closePath();
  ctx.fill();

  // Wing tip red stripe
  ctx.fillStyle = hitFlash ? '#ffaaaa' : '#cc2233';
  ctx.fillRect(5, -22, 14, 2);
  ctx.fillRect(5, 20, 14, 2);
  ctx.fillRect(-21, -20, 8, 2);
  ctx.fillRect(-21, 18, 8, 2);

  // R2 dome on top of fuselage
  ctx.fillStyle = hitFlash ? '#eeeeff' : '#aabbcc';
  ctx.beginPath();
  ctx.ellipse(0, -7, 5, 4, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = hitFlash ? '#8888ff' : '#4466aa';
  ctx.beginPath();
  ctx.ellipse(0, -7, 3, 2.5, 0, Math.PI, 0);
  ctx.fill();

  // Engine glow (blue)
  ctx.fillStyle = hitFlash ? '#aaffff' : '#44aaff';
  ctx.beginPath();
  ctx.ellipse(-27, 0, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hitFlash ? '#ffffff' : '#aaddff';
  ctx.beginPath();
  ctx.ellipse(-27, 0, 2, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw a TIE Fighter: sphere cockpit + 2 rectangular solar panels
export function drawTIEFighter(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  // Left solar panel
  ctx.fillStyle = '#334455';
  ctx.fillRect(-30, -14, 12, 28);
  // Grid lines on left panel
  ctx.strokeStyle = '#556677';
  ctx.lineWidth = 1;
  for (let i = 1; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(-30, -14 + i * 9.3); ctx.lineTo(-18, -14 + i * 9.3); ctx.stroke();
  }
  for (let i = 1; i < 2; i++) {
    ctx.beginPath(); ctx.moveTo(-30 + i * 6, -14); ctx.lineTo(-30 + i * 6, 14); ctx.stroke();
  }

  // Right solar panel
  ctx.fillStyle = '#334455';
  ctx.fillRect(18, -14, 12, 28);
  ctx.strokeStyle = '#556677';
  for (let i = 1; i < 3; i++) {
    ctx.beginPath(); ctx.moveTo(18, -14 + i * 9.3); ctx.lineTo(30, -14 + i * 9.3); ctx.stroke();
  }
  for (let i = 1; i < 2; i++) {
    ctx.beginPath(); ctx.moveTo(18 + i * 6, -14); ctx.lineTo(18 + i * 6, 14); ctx.stroke();
  }

  // Cockpit sphere
  const grad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 12);
  grad.addColorStop(0, '#667788');
  grad.addColorStop(1, '#223344');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();

  // Cockpit window
  ctx.fillStyle = '#cc4400';
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff6622';
  ctx.beginPath();
  ctx.arc(-1, -1, 3, 0, Math.PI * 2);
  ctx.fill();

  // Panel connectors (struts)
  ctx.fillStyle = '#445566';
  ctx.fillRect(-18, -3, 6, 6);
  ctx.fillRect(12, -3, 6, 6);

  ctx.restore();
}

// Draw a TIE Interceptor: angled bent wing panels, smaller cockpit
export function drawTIEInterceptor(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  // Left wing — bent/angled
  ctx.fillStyle = '#2d3f52';
  ctx.beginPath();
  ctx.moveTo(-12, -4);
  ctx.lineTo(-28, -20);
  ctx.lineTo(-34, -18);
  ctx.lineTo(-22, -2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-12, 4);
  ctx.lineTo(-28, 20);
  ctx.lineTo(-34, 18);
  ctx.lineTo(-22, 2);
  ctx.closePath();
  ctx.fill();

  // Right wing — bent/angled
  ctx.beginPath();
  ctx.moveTo(12, -4);
  ctx.lineTo(28, -20);
  ctx.lineTo(34, -18);
  ctx.lineTo(22, -2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(12, 4);
  ctx.lineTo(28, 20);
  ctx.lineTo(34, 18);
  ctx.lineTo(22, 2);
  ctx.closePath();
  ctx.fill();

  // Wing grid lines
  ctx.strokeStyle = '#445566';
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(-14, -8); ctx.lineTo(-30, -18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-14, 8); ctx.lineTo(-30, 18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(14, -8); ctx.lineTo(30, -18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(14, 8); ctx.lineTo(30, 18); ctx.stroke();

  // Cockpit (smaller than TIE Fighter)
  const grad = ctx.createRadialGradient(-2, -2, 1, 0, 0, 9);
  grad.addColorStop(0, '#557799');
  grad.addColorStop(1, '#1a2d3d');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();

  // Cockpit window
  ctx.fillStyle = '#aa3300';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff5511';
  ctx.beginPath();
  ctx.arc(-1, -1, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Struts
  ctx.fillStyle = '#334455';
  ctx.fillRect(-12, -2.5, 5, 5);
  ctx.fillRect(7, -2.5, 5, 5);

  ctx.restore();
}

// Draw an 8-bit pixel-art asteroid — chunky stone shape, not round
export function drawAsteroid(ctx, x, y, r, angle, seed) {
  const PS = 4; // pixel block size
  // Stone palette: cool grey-browns, no green tint
  const PAL = ['#1e1c1a', '#302c28', '#484440', '#5e5a54', '#74706a'];

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const gridR = Math.ceil(r / PS);
  for (let gy = -gridR; gy <= gridR; gy++) {
    for (let gx = -gridR; gx <= gridR; gx++) {
      // Use max(abs) = square base, blended slightly with circle for less-sharp corners
      const dSquare = Math.max(Math.abs(gx), Math.abs(gy)) / gridR;
      const dCircle = Math.hypot(gx, gy) / gridR;
      const baseDist = dSquare * 0.65 + dCircle * 0.35;
      if (baseDist > 1.0) continue;

      // Heavy jagged edge: cut out many border cells for a chunky rock silhouette
      const hash = Math.sin(seed * 127.1 + gx * 311.7 + gy * 74.3) * 0.5 + 0.5;
      if (baseDist > 0.62 && hash < 0.62) continue;

      // Hard faceted shading — distinct flat faces like stone, not a smooth gradient
      let ci;
      if      (gy < -gridR * 0.25)  ci = 4; // top face — lightest
      else if (gx >  gridR * 0.15)  ci = 1; // right face — darkest
      else if (gy >  gridR * 0.30)  ci = 2; // bottom face
      else                           ci = 3; // middle

      // Small noise to break up flat colour bands
      const noise = Math.sin(seed * 55.3 + gx * 17.1 + gy * 31.4) * 0.5 + 0.5;
      if (noise < 0.18) ci = Math.max(0, ci - 1);

      ctx.fillStyle = PAL[ci];
      ctx.fillRect(gx * PS - PS / 2, gy * PS - PS / 2, PS, PS);
    }
  }

  ctx.restore();
}

// Draw Imperial Cruiser — 8-bit pixel-art wedge pointing LEFT, engine glow on right
export function drawImperialCruiser(ctx, x, y, w, h, phase2 = false) {
  const PS = 6; // pixel block size
  ctx.save();
  ctx.translate(x, y);

  const hw = w / 2;
  const hh = h / 2;

  // Color palette: darker in phase2 (battle damage)
  const PAL = phase2
    ? ['#1a1e24', '#2a3038', '#3a4048', '#4a5058', '#3a5060']
    : ['#1a2028', '#2d3a45', '#3d4a55', '#4d5a65', '#5d7080'];

  // Draw wedge row by row — nose at (-hw, 0), back at (+hw, ±hh)
  // At column gx, the half-height = (gx + hw) / w * hh
  // So row gy is inside if Math.abs(gy_center) <= halfH at that gx
  for (let gy = -hh; gy < hh; gy += PS) {
    const rowCY = gy + PS / 2;
    const absY  = Math.abs(rowCY);
    // Leftmost gx where this row enters the wedge
    const minGX    = (absY / hh) * w - hw;
    const startGX  = Math.ceil(minGX / PS) * PS;

    for (let gx = startGX; gx < hw; gx += PS) {
      const progress = (gx + hw) / w; // 0 = nose tip, 1 = back
      const hash     = Math.sin(gx * 7.3 + gy * 13.1) * 0.5 + 0.5;
      let ci;
      if (progress < 0.22)        ci = 4; // bright nose highlight
      else if (hash < 0.08)       ci = 0; // dark panel detail pixel
      else if (rowCY < 0)         ci = 2; // upper hull slightly lighter
      else                        ci = 1; // lower hull
      ctx.fillStyle = PAL[ci];
      ctx.fillRect(gx, gy, PS, PS);
    }
  }

  // Bridge tower — pixel blocks
  const tX = Math.round(hw / 2);
  const tY = -Math.round(hh / 2);
  ctx.fillStyle = PAL[3];
  for (let ty = tY - 18; ty < tY; ty += PS) {
    for (let tx = tX - 12; tx < tX + 12; tx += PS) {
      ctx.fillRect(tx, ty, PS, PS);
    }
  }
  // Tower top cap
  ctx.fillStyle = PAL[4];
  for (let tx = tX - 8; tx < tX + 8; tx += PS) {
    ctx.fillRect(tx, tY - 24, PS, PS);
    ctx.fillRect(tx, tY - 18, PS, PS);
  }
  // Tower windows
  ctx.fillStyle = '#aaccee';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(tX - 8 + i * 4, tY - 10, 3, 2);
  }

  // Engine glow — pixel rows approximating an oval
  const ec1 = phase2 ? '#ff5500' : '#3377ff';
  const ec2 = phase2 ? '#ffaa33' : '#77aaff';
  const ENGINE_ROWS = [
    { dy: -24, bw: 4 }, { dy: -18, bw: 7 }, { dy: -12, bw: 10 }, { dy: -6, bw: 12 },
    { dy:   0, bw: 12 }, { dy:  6, bw: 12 }, { dy:  12, bw: 10 }, { dy:  18, bw: 7 }, { dy:  24, bw: 4 },
  ];
  for (const row of ENGINE_ROWS) {
    ctx.fillStyle = ec1;
    ctx.fillRect(hw - row.bw, row.dy, row.bw, PS);
    if (row.bw >= 8) {
      ctx.fillStyle = ec2;
      ctx.fillRect(hw - row.bw + 2, row.dy + 1, row.bw - 4, PS - 2);
    }
  }

  // Phase 2 damage blotches — orange/red pixel clusters
  if (phase2) {
    for (let i = 0; i < 10; i++) {
      const hx = Math.sin(i * 347.1) * 0.5 + 0.5;
      const hy = Math.sin(i * 911.3) * 0.5 + 0.5;
      const dx = (hx - 0.5) * w * 0.55;
      const dy = (hy - 0.5) * h * 0.55;
      // Only paint pixels that are inside the wedge
      const neededX = (Math.abs(dy) / hh) * w - hw;
      if (dx > neededX) {
        ctx.fillStyle = i % 3 === 0 ? '#ff3300' : '#ff7700';
        ctx.fillRect(Math.round(dx / PS) * PS, Math.round(dy / PS) * PS, PS * 2, PS * 2);
      }
    }
  }

  ctx.restore();
}

// Draw a homing missile — 8-bit pixel art torpedo, oriented by angle
export function drawHomingMissile(ctx, x, y, angle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Body
  ctx.fillStyle = '#cc2200';
  ctx.fillRect(-12, -4, 20, 8);
  // Nose cone
  ctx.fillStyle = '#ff4400';
  ctx.fillRect(-16, -2, 4, 4);
  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(-18, -1, 2, 2);
  // Tail fins
  ctx.fillStyle = '#881100';
  ctx.fillRect(-10, -7, 5, 3);
  ctx.fillRect(-10,  4, 5, 3);
  // Exhaust plume — three pixel layers
  ctx.fillStyle = '#ff8800';
  ctx.fillRect(8,  -3, 6, 6);
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(14, -2, 5, 4);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(19, -1, 3, 2);

  ctx.restore();
}

// Draw a turret with circular base and rotating barrel
export function drawTurret(ctx, x, y, angle, hp, maxHp) {
  ctx.save();
  ctx.translate(x, y);

  // Color by health ratio
  const ratio = hp / maxHp;
  const baseR = Math.floor(60 + (1 - ratio) * 140);
  const baseG = Math.floor(80 * ratio);
  const baseB = Math.floor(70 * ratio);
  const baseColor = `rgb(${baseR},${baseG},${baseB})`;

  // Base circle
  ctx.fillStyle = baseColor;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#aabbcc';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Rotating barrel
  ctx.rotate(angle);
  ctx.fillStyle = hp > 0 ? '#889999' : '#553333';
  ctx.fillRect(0, -3, 18, 6);
  ctx.fillStyle = '#aabbcc';
  ctx.fillRect(14, -2, 5, 4);

  ctx.restore();
}

// Draw reactor core — glowing orange sphere
export function drawReactor(ctx, x, y, r, flash = false) {
  ctx.save();
  ctx.translate(x, y);

  // Outer glow
  const glowColor = flash ? 'rgba(255,255,100,0.4)' : 'rgba(255,120,0,0.3)';
  const glowGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2.0);
  glowGrad.addColorStop(0, glowColor);
  glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
  ctx.fill();

  // Core gradient
  const coreGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  if (flash) {
    coreGrad.addColorStop(0, '#ffffff');
    coreGrad.addColorStop(0.4, '#ffff66');
    coreGrad.addColorStop(1, '#ff8800');
  } else {
    coreGrad.addColorStop(0, '#ffcc44');
    coreGrad.addColorStop(0.4, '#ff8800');
    coreGrad.addColorStop(1, '#cc4400');
  }
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Inner bright spot
  ctx.fillStyle = flash ? '#ffffff' : '#ffeeaa';
  ctx.beginPath();
  ctx.arc(-r * 0.25, -r * 0.25, r * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Ring detail
  ctx.strokeStyle = flash ? '#ffff00' : '#ff6600';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Draw Death Star — grey sphere with equatorial line + superlaser dish
export function drawDeathStar(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);

  // Main body gradient
  const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#7a8090');
  grad.addColorStop(0.5, '#555f6a');
  grad.addColorStop(1, '#2a3038');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Equatorial trench line
  ctx.strokeStyle = '#3a4450';
  ctx.lineWidth = Math.max(2, r * 0.04);
  ctx.beginPath();
  ctx.moveTo(-r, 0);
  ctx.lineTo(r, 0);
  ctx.stroke();

  // Surface details (horizontal lines)
  ctx.strokeStyle = '#4a5560';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const ly = (i / 4) * r;
    const hw = Math.sqrt(Math.max(0, r * r - ly * ly));
    if (hw > 2) {
      ctx.beginPath(); ctx.moveTo(-hw, -ly); ctx.lineTo(hw, -ly); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-hw, ly); ctx.lineTo(hw, ly); ctx.stroke();
    }
  }

  // Superlaser dish — upper-left quadrant
  const dishX = -r * 0.25;
  const dishY = -r * 0.3;
  const dishR = r * 0.28;
  ctx.fillStyle = '#3a4450';
  ctx.beginPath();
  ctx.arc(dishX, dishY, dishR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#556070';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // Dish center
  ctx.fillStyle = '#667788';
  ctx.beginPath();
  ctx.arc(dishX, dishY, dishR * 0.35, 0, Math.PI * 2);
  ctx.fill();

  // Clip to sphere
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  ctx.restore();
}

// Draw Tatooine — desert planet with radial gradient + bands
export function drawTatooine(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);

  // Base gradient — orange-brown desert
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#e8882a');
  grad.addColorStop(0.35, '#cc6618');
  grad.addColorStop(0.7, '#a84410');
  grad.addColorStop(1, '#6a2808');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Surface bands
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = 'rgba(180, 100, 30, 0.35)';
  for (let i = 0; i < 5; i++) {
    const by = -r * 0.6 + i * r * 0.3;
    ctx.fillRect(-r, by, r * 2, r * 0.12);
  }

  // Highlight arc (atmosphere)
  ctx.fillStyle = 'rgba(240, 160, 80, 0.2)';
  ctx.beginPath();
  ctx.arc(-r * 0.15, -r * 0.15, r * 0.85, Math.PI * 1.1, Math.PI * 1.7);
  ctx.lineTo(-r * 0.15, -r * 0.15);
  ctx.fill();

  ctx.restore();

  ctx.restore();
}
