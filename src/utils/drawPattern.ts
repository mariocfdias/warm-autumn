import type { PatternDrawType } from "../types";

export function drawPattern(
  canvas: HTMLCanvasElement,
  type: PatternDrawType | string,
  colors: string[],
  scale = 1
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  switch (type) {
    case "stripes": {
      const [c1, c2] = colors;
      const sw = Math.round(10 * scale);
      let x = 0;
      while (x < w) {
        ctx.fillStyle = c1; ctx.fillRect(x, 0, sw, h); x += sw;
        ctx.fillStyle = c2; ctx.fillRect(x, 0, sw, h); x += sw;
      }
      break;
    }
    case "stripes-h": {
      const [c1, c2] = colors;
      const sw = Math.round(9 * scale);
      let y = 0;
      while (y < h) {
        ctx.fillStyle = c1; ctx.fillRect(0, y, w, sw); y += sw;
        ctx.fillStyle = c2; ctx.fillRect(0, y, w, sw); y += sw;
      }
      break;
    }
    case "check": {
      const [c1, c2, c3] = colors;
      const sz = Math.round(14 * scale);
      ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += sz * 2) {
        for (let x = 0; x < w; x += sz * 2) {
          ctx.fillStyle = c2;
          ctx.fillRect(x, y, sz, sz);
          ctx.fillRect(x + sz, y + sz, sz, sz);
        }
      }
      if (c3) {
        ctx.strokeStyle = c3; ctx.lineWidth = 1.5 * scale;
        for (let x = 0; x <= w; x += sz) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y <= h; y += sz) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      }
      break;
    }
    case "herringbone": {
      const [c1, c2] = colors;
      ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
      const sz = Math.round(8 * scale);
      ctx.strokeStyle = c2; ctx.lineWidth = sz * 0.55;
      for (let y = -h; y < h * 2; y += sz * 2) {
        for (let x = -w; x < w * 2; x += sz * 4) {
          ctx.beginPath(); ctx.moveTo(x, y);        ctx.lineTo(x + sz * 2, y + sz * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + sz * 2, y); ctx.lineTo(x, y + sz * 2);         ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + sz * 2, y + sz * 2); ctx.lineTo(x + sz * 4, y); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + sz * 4, y + sz * 2); ctx.lineTo(x + sz * 2, y); ctx.stroke();
        }
      }
      break;
    }
    case "houndstooth": {
      const [c1, c2] = colors;
      const sz = Math.round(10 * scale);
      ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = c2;
      for (let y = 0; y < h + sz * 2; y += sz * 2) {
        for (let x = 0; x < w + sz * 2; x += sz * 2) {
          ctx.beginPath();
          ctx.moveTo(x, y);                    ctx.lineTo(x + sz, y);
          ctx.lineTo(x + sz, y + sz * 0.5);   ctx.lineTo(x + sz * 1.5, y);
          ctx.lineTo(x + sz * 2, y);           ctx.lineTo(x + sz * 2, y + sz);
          ctx.lineTo(x + sz * 1.5, y + sz);   ctx.lineTo(x + sz * 2, y + sz * 1.5);
          ctx.lineTo(x + sz * 2, y + sz * 2); ctx.lineTo(x + sz, y + sz * 2);
          ctx.lineTo(x + sz, y + sz * 1.5);   ctx.lineTo(x + sz * 0.5, y + sz * 2);
          ctx.lineTo(x, y + sz * 2);           ctx.lineTo(x, y + sz);
          ctx.lineTo(x + sz * 0.5, y + sz);   ctx.lineTo(x, y + sz * 0.5);
          ctx.closePath(); ctx.fill();
        }
      }
      break;
    }
    case "windowpane": {
      const [c1, c2] = colors;
      ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
      const sz = Math.round(18 * scale);
      ctx.strokeStyle = c2; ctx.lineWidth = 1.5 * scale;
      for (let x = 0; x <= w; x += sz) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y <= h; y += sz) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      break;
    }
    case "polka": {
      const [c1, c2] = colors;
      ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
      const r  = Math.round(4 * scale);
      const sp = Math.round(14 * scale);
      ctx.fillStyle = c2;
      for (let y = r; y < h; y += sp) {
        for (let x = r; x < w; x += sp) {
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        }
      }
      break;
    }
    case "floral": {
      const [c1, c2, c3] = colors;
      ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
      const petals = 5;
      const r  = Math.max(4, Math.round(5 * scale));
      const sp = Math.max(16, Math.round(20 * scale));
      for (let y = sp / 2; y < h; y += sp) {
        for (let x = sp / 2; x < w; x += sp) {
          ctx.fillStyle = c2;
          for (let p = 0; p < petals; p++) {
            const a = (p / petals) * Math.PI * 2;
            ctx.beginPath();
            ctx.ellipse(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8, Math.max(1, r * 0.7), Math.max(1, r * 0.4), a, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = c3 ?? c2;
          ctx.beginPath(); ctx.arc(x, y, Math.max(1, r * 0.45), 0, Math.PI * 2); ctx.fill();
        }
      }
      break;
    }
    case "camo": {
      ctx.fillStyle = colors[0]; ctx.fillRect(0, 0, w, h);
      const seed = (x: number, y: number) => Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
      for (let i = 0; i < 80; i++) {
        const sx = seed(i, 0) * w;
        const sy = seed(0, i) * h;
        const sz = Math.max(4, seed(i, i) * 20 * scale + 6 * scale);
        const ci = Math.floor(seed(i, i * 2) * 3) % colors.length;
        ctx.fillStyle = colors[ci];
        ctx.beginPath();
        ctx.ellipse(sx, sy, sz, Math.max(2, sz * 0.55), seed(i, i * 3) * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "linen": {
      const [c1, c2] = colors;
      ctx.fillStyle = c1; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = c2; ctx.lineWidth = 0.8 * scale; ctx.globalAlpha = 0.35;
      const sp = 3 * scale;
      for (let x = 0; x < w; x += sp) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += sp) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.globalAlpha = 1;
      break;
    }
    case "tie-dye": {
      const [c1, c2, c3] = colors;
      const cx = w / 2, cy = h / 2;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
      grad.addColorStop(0, c1);
      grad.addColorStop(0.4, c2);
      grad.addColorStop(0.7, c3 ?? c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1.5 * scale;
      for (let r = 4; r < Math.max(w, h); r += 6 * scale) {
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      }
      break;
    }
    default:
      break;
  }
}
