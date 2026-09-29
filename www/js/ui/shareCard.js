// Carte à partager après une épreuve (D21) : une image 1080×1350 dessinée
// sur le téléphone, aux couleurs et polices du thème actif. Aucun serveur,
// aucun classement : un souvenir que le joueur choisit de montrer.

const W = 1080;
const H = 1350;

function token(name, fallback) {
  try {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  } catch { return fallback; }
}

/** Découpe un texte en lignes qui tiennent dans `maxW` (au plus `maxLines`). */
export function wrapLines(ctx, text, maxW, maxLines) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width <= maxW || !cur) cur = next;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s,.;:!?]+$/, '')}…`;
    return kept;
  }
  return lines;
}

function cairn(ctx, cx, cy, color) {
  ctx.fillStyle = color;
  const stones = [[0, 0, 110, 34, 0.95], [-6, -58, 80, 28, 0.8], [8, -106, 54, 22, 0.65], [0, -142, 30, 16, 0.5]];
  for (const [dx, dy, rx, ry, a] of stones) {
    ctx.globalAlpha = a;
    ctx.beginPath();
    ctx.ellipse(cx + dx, cy + dy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/**
 * @param {{ kicker:string, level:number, levelLabel:string, title:string, text:string,
 *   item:string, name:string, brand:string, tagline:string }} c
 * @returns {Promise<string>} image PNG en base64 (sans préfixe data:)
 */
export async function renderOrdealCard(c) {
  const paper = token('--paper', '#f3e7cf');
  const paper2 = token('--paper2', '#e8d8b8');
  const ink = token('--ink', '#2a2218');
  const inkDim = token('--ink-dim', '#6b5b45');
  const gold = token('--gold', '#b8862b');
  const seal = token('--seal', '#8e3b2e');
  const fDisplay = token('--font-display', 'serif');
  const fBody = token('--font-body', 'serif');
  const fBrand = token('--font-brand', fDisplay);
  try {
    await Promise.all([`700 80px ${fDisplay}`, `40px ${fBody}`, `italic 40px ${fBody}`, `72px ${fBrand}`]
      .map((f) => document.fonts.load(f)));
  } catch { /* polices système en repli */ }

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, paper); bg.addColorStop(1, paper2);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = gold; ctx.lineWidth = 6; ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.globalAlpha = 0.5; ctx.lineWidth = 2; ctx.strokeRect(60, 60, W - 120, H - 120); ctx.globalAlpha = 1;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = gold;
  ctx.font = `72px ${fBrand}`;
  ctx.fillText(c.brand, W / 2, 170);

  cairn(ctx, W / 2, 400, gold);

  ctx.fillStyle = gold;
  ctx.font = `700 34px ${fDisplay}`;
  ctx.fillText(c.kicker.toUpperCase(), W / 2, 520);

  ctx.fillStyle = ink;
  ctx.font = `700 120px ${fDisplay}`;
  ctx.fillText(`${c.levelLabel} ${c.level}`, W / 2, 660);

  ctx.fillStyle = seal;
  ctx.font = `700 64px ${fDisplay}`;
  let y = 770;
  for (const line of wrapLines(ctx, c.title, W - 220, 2)) { ctx.fillText(line, W / 2, y); y += 76; }

  ctx.fillStyle = ink;
  ctx.font = `italic 40px ${fBody}`;
  y += 20;
  for (const line of wrapLines(ctx, c.text, W - 240, 5)) { ctx.fillText(line, W / 2, y); y += 54; }

  ctx.fillStyle = gold;
  ctx.font = `40px ${fBody}`;
  ctx.fillText(c.item, W / 2, Math.max(y + 40, 1150));

  ctx.fillStyle = inkDim;
  ctx.font = `32px ${fBody}`;
  ctx.fillText(`${c.name} · ${c.tagline}`, W / 2, H - 110);

  return canvas.toDataURL('image/png').split(',')[1];
}
