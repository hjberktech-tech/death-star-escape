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

// Draw an irregular asteroid polygon, seeded for consistent shape
export function drawAsteroid(ctx, x, y, r, angle, seed) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Generate vertices using seed
  const numPts = 9;
  const pts = [];
  for (let i = 0; i < numPts; i++) {
    const baseAngle = (i / numPts) * Math.PI * 2;
    // Pseudo-random radius variation based on seed
    const hash = Math.sin(seed * 9301 + i * 49297 + 233720) * 0.5 + 0.5;
    const rr = r * (0.65 + hash * 0.45);
    pts.push({ x: Math.cos(baseAngle) * rr, y: Math.sin(baseAngle) * rr });
  }

  // Main body fill
  const grad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
  grad.addColorStop(0, '#667055');
  grad.addColorStop(0.6, '#4a5040');
  grad.addColorStop(1, '#2a2e22');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < numPts; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.fill();

  // Dark edge stroke
  ctx.strokeStyle = '#1a1e14';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Crater details
  const craterSeed1 = Math.sin(seed * 1234.5) * 0.5 + 0.5;
  const craterSeed2 = Math.sin(seed * 5678.9) * 0.5 + 0.5;
  const cr1 = { cx: (craterSeed1 - 0.5) * r * 0.6, cy: (craterSeed2 - 0.5) * r * 0.6, r: r * 0.18 };
  ctx.strokeStyle = '#1e2218';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cr1.cx, cr1.cy, cr1.r, 0, Math.PI * 2);
  ctx.stroke();

  const craterSeed3 = Math.sin(seed * 2345.6) * 0.5 + 0.5;
  const craterSeed4 = Math.sin(seed * 6789.0) * 0.5 + 0.5;
  const cr2 = { cx: (craterSeed3 - 0.5) * r * 0.5, cy: (craterSeed4 - 0.5) * r * 0.5, r: r * 0.12 };
  ctx.beginPath();
  ctx.arc(cr2.cx, cr2.cy, cr2.r, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

// Draw Imperial Cruiser — large wedge pointing LEFT, engine glow on right
export function drawImperialCruiser(ctx, x, y, w, h, phase2 = false) {
  ctx.save();
  ctx.translate(x, y);

  // Main wedge hull (nose pointing left = negative x)
  ctx.fillStyle = '#3d4a55';
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);          // nose tip (leftmost)
  ctx.lineTo(w / 2, -h / 2);      // top-right
  ctx.lineTo(w / 2, h / 2);       // bottom-right
  ctx.closePath();
  ctx.fill();

  // Hull plating details
  ctx.strokeStyle = '#506070';
  ctx.lineWidth = 1.5;
  // Horizontal lines across the hull
  for (let i = 1; i < 4; i++) {
    const frac = i / 4;
    const leftX = -w / 2 + (w * frac);
    const halfH = (h / 2) * frac;
    ctx.beginPath();
    ctx.moveTo(leftX, -halfH);
    ctx.lineTo(leftX, halfH);
    ctx.stroke();
  }
  // Top edge highlight
  ctx.strokeStyle = '#607888';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(w / 2, -h / 2);
  ctx.stroke();

  // Bridge tower on upper portion
  const towerX = w / 4;
  const towerY = -h / 4;
  ctx.fillStyle = '#4a5a66';
  ctx.fillRect(towerX - 12, towerY - 18, 24, 16);
  ctx.fillStyle = '#5a6a77';
  ctx.fillRect(towerX - 8, towerY - 22, 16, 6);
  // Tower windows
  ctx.fillStyle = '#aaccee';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(towerX - 9 + i * 5, towerY - 14, 3, 2);
  }

  // Engine glow on right side
  const engineGlow = phase2 ? '#ff6600' : '#4488ff';
  const engineGlow2 = phase2 ? '#ffaa44' : '#88bbff';
  ctx.fillStyle = engineGlow;
  ctx.beginPath();
  ctx.ellipse(w / 2, 0, 12, h * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = engineGlow2;
  ctx.beginPath();
  ctx.ellipse(w / 2, 0, 6, h * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Phase 2 damage marks
  if (phase2) {
    ctx.fillStyle = 'rgba(255,100,0,0.4)';
    ctx.beginPath(); ctx.arc(-w / 4, h * 0.1, 8, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -h * 0.2, 6, 0, Math.PI * 2); ctx.fill();
  }

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
