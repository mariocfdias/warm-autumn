import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { PaletteContext } from "./WarmAutumn";

// ─────────────────────────────────────────────
// COLOR MATH — deltaE2000 (no external library)
// ─────────────────────────────────────────────

function rgbToLab(r, g, b) {
  let R = r / 255, G = g / 255, B = b / 255;
  R = R <= 0.04045 ? R / 12.92 : Math.pow((R + 0.055) / 1.055, 2.4);
  G = G <= 0.04045 ? G / 12.92 : Math.pow((G + 0.055) / 1.055, 2.4);
  B = B <= 0.04045 ? B / 12.92 : Math.pow((B + 0.055) / 1.055, 2.4);
  const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const Y = (R * 0.2126 + G * 0.7152 + B * 0.0722) / 1.00000;
  const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = v => v > 0.008856 ? Math.cbrt(v) : (7.787 * v + 16 / 116);
  const fx = f(X), fy = f(Y), fz = f(Z);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function hexToLab(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return rgbToLab(r, g, b);
}

function deltaE2000(lab1, lab2) {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const Cbar = (C1 + C2) / 2;
  const Cbar7 = Math.pow(Cbar, 7);
  const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + 6103515625)));
  const a1p = a1 * (1 + G), a2p = a2 * (1 + G);
  const C1p = Math.sqrt(a1p * a1p + b1 * b1);
  const C2p = Math.sqrt(a2p * a2p + b2 * b2);
  const h1p = (Math.atan2(b1, a1p) * 180 / Math.PI + 360) % 360;
  const h2p = (Math.atan2(b2, a2p) * 180 / Math.PI + 360) % 360;
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  let dhp = 0;
  if (C1p !== 0 && C2p !== 0) {
    dhp = Math.abs(h2p - h1p) <= 180 ? h2p - h1p :
      h2p - h1p > 180 ? h2p - h1p - 360 : h2p - h1p + 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(dhp * Math.PI / 360);
  const Lbar = (L1 + L2) / 2;
  const Cbarp = (C1p + C2p) / 2;
  let hbarp = h1p + h2p;
  if (C1p !== 0 && C2p !== 0) {
    hbarp = Math.abs(h1p - h2p) <= 180 ? (h1p + h2p) / 2 :
      h1p + h2p < 360 ? (h1p + h2p + 360) / 2 : (h1p + h2p - 360) / 2;
  }
  const T = 1
    - 0.17 * Math.cos((hbarp - 30) * Math.PI / 180)
    + 0.24 * Math.cos(2 * hbarp * Math.PI / 180)
    + 0.32 * Math.cos((3 * hbarp + 6) * Math.PI / 180)
    - 0.20 * Math.cos((4 * hbarp - 63) * Math.PI / 180);
  const dL50 = Lbar - 50;
  const SL = 1 + 0.015 * dL50 * dL50 / Math.sqrt(20 + dL50 * dL50);
  const SC = 1 + 0.045 * Cbarp;
  const SH = 1 + 0.015 * Cbarp * T;
  const Cbarp7 = Math.pow(Cbarp, 7);
  const RC = 2 * Math.sqrt(Cbarp7 / (Cbarp7 + 6103515625));
  const hm275 = (hbarp - 275) / 25;
  const dt = 30 * Math.exp(-(hm275 * hm275));
  const RT = -Math.sin(2 * dt * Math.PI / 180) * RC;
  const tL = dLp / SL, tC = dCp / SC, tH = dHp / SH;
  return Math.sqrt(tL * tL + tC * tC + tH * tH + RT * tC * tH);
}

// ─────────────────────────────────────────────
// IMAGE UTILITIES
// ─────────────────────────────────────────────

function drawVideoToCanvas(video, canvas) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
}

function getROI(canvas, size) {
  const ctx = canvas.getContext("2d");
  const x = Math.floor((canvas.width - size) / 2);
  const y = Math.floor((canvas.height - size) / 2);
  return ctx.getImageData(x, y, size, size);
}

function isValidPixel(r, g, b, a) {
  if (a < 200) return false;
  const bright = (r + g + b) / 3;
  return bright >= 20 && bright <= 245;
}

function medianValue(arr) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function getMedianRGB(imageData) {
  const { data } = imageData;
  const rs = [], gs = [], bs = [];
  for (let i = 0; i < data.length; i += 4) {
    if (isValidPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) {
      rs.push(data[i]);
      gs.push(data[i + 1]);
      bs.push(data[i + 2]);
    }
  }
  if (rs.length === 0) return null;
  return [medianValue(rs), medianValue(gs), medianValue(bs)];
}

function toHex(r, g, b) {
  return `#${[r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

// ─────────────────────────────────────────────
// COLOR MATCHING
// ─────────────────────────────────────────────

function buildPreparedPalette(C) {
  return Object.entries(C).map(([key, { hex, name }]) => ({
    key, hex, name, lab: hexToLab(hex),
  }));
}

function matchColorToPalette(rgb, preparedPalette) {
  if (!rgb) return null;
  const inputLab = rgbToLab(...rgb);
  return preparedPalette
    .map(item => ({ ...item, deltaE: deltaE2000(inputLab, item.lab) }))
    .sort((a, b) => a.deltaE - b.deltaE);
}

function classifyConfidence(deltaE) {
  if (deltaE <= 10) return "matched";
  if (deltaE <= 18) return "approximate";
  return "unknown";
}

// ─────────────────────────────────────────────
// PATTERN HEURISTICS
// ─────────────────────────────────────────────

function toGrayscale(imageData) {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
  }
  return gray;
}

function sobelEdges(gray, width, height) {
  const edgesH = new Float32Array(width * height);
  const edgesV = new Float32Array(width * height);
  const edgesMag = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x;
      const gx =
        -gray[(y - 1) * width + (x - 1)] + gray[(y - 1) * width + (x + 1)] +
        -2 * gray[y * width + (x - 1)] + 2 * gray[y * width + (x + 1)] +
        -gray[(y + 1) * width + (x - 1)] + gray[(y + 1) * width + (x + 1)];
      const gy =
        -gray[(y - 1) * width + (x - 1)] - 2 * gray[(y - 1) * width + x] - gray[(y - 1) * width + (x + 1)] +
        gray[(y + 1) * width + (x - 1)] + 2 * gray[(y + 1) * width + x] + gray[(y + 1) * width + (x + 1)];
      edgesV[i] = Math.abs(gx);
      edgesH[i] = Math.abs(gy);
      edgesMag[i] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  return { edgesH, edgesV, edgesMag };
}

function rowMeans(gray, width, height) {
  const means = new Float32Array(height);
  for (let y = 0; y < height; y++) {
    let s = 0;
    for (let x = 0; x < width; x++) s += gray[y * width + x];
    means[y] = s / width;
  }
  return means;
}

function colMeans(gray, width, height) {
  const means = new Float32Array(width);
  for (let x = 0; x < width; x++) {
    let s = 0;
    for (let y = 0; y < height; y++) s += gray[y * width + x];
    means[x] = s / height;
  }
  return means;
}

function variance(arr) {
  const n = arr.length;
  if (n === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  return arr.reduce((s, v) => s + (v - mean) * (v - mean), 0) / n;
}

function autocorrelationPeak(arr) {
  const n = arr.length;
  const mean = arr.reduce((a, b) => a + b, 0) / n;
  const centered = arr.map(v => v - mean);
  const varr = centered.reduce((s, v) => s + v * v, 0);
  if (varr < 1e-6) return 0;
  let maxAC = 0;
  const minLag = Math.max(3, Math.floor(n * 0.04));
  const maxLag = Math.floor(n * 0.5);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    for (let i = 0; i < n - lag; i++) sum += centered[i] * centered[i + lag];
    const ac = sum / varr;
    if (ac > maxAC) maxAC = ac;
  }
  return Math.min(maxAC, 1);
}

function rowEdgeSums(edgesH, width, height) {
  const sums = new Float32Array(height);
  for (let y = 0; y < height; y++) {
    let s = 0;
    for (let x = 0; x < width; x++) s += edgesH[y * width + x];
    sums[y] = s / width;
  }
  return sums;
}

function colEdgeSums(edgesV, width, height) {
  const sums = new Float32Array(width);
  for (let x = 0; x < width; x++) {
    let s = 0;
    for (let y = 0; y < height; y++) s += edgesV[y * width + x];
    sums[x] = s / height;
  }
  return sums;
}

function globalContrast(gray) {
  let min = Infinity, max = -Infinity;
  for (const v of gray) { if (v < min) min = v; if (v > max) max = v; }
  return (max - min) / 255;
}

function meanEdgeDensity(edgesMag) {
  return edgesMag.reduce((a, b) => a + b, 0) / edgesMag.length / 255;
}

function diagonalEdgeScores(gray, width, height) {
  let d1 = 0, d2 = 0, count = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      d1 += Math.abs(gray[(y - 1) * width + (x - 1)] - gray[(y + 1) * width + (x + 1)]);
      d2 += Math.abs(gray[(y - 1) * width + (x + 1)] - gray[(y + 1) * width + (x - 1)]);
      count++;
    }
  }
  const s = count * 255;
  return { diag1: d1 / s, diag2: d2 / s };
}

function blobScore(gray, width, height) {
  let blobs = 0, count = 0;
  const step = 4;
  for (let y = step; y < height - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      const center = gray[y * width + x];
      const nbrs = [
        gray[(y - step) * width + x], gray[(y + step) * width + x],
        gray[y * width + (x - step)], gray[y * width + (x + step)],
      ];
      const avg = nbrs.reduce((a, b) => a + b, 0) / nbrs.length;
      if (Math.abs(center - avg) > 25) blobs++;
      count++;
    }
  }
  return count > 0 ? blobs / count : 0;
}

function gradientSmoothness(gray, width, height) {
  let smooth = 0, count = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const diff = Math.abs(gray[y * width + x] - gray[(y - 1) * width + x]) +
        Math.abs(gray[y * width + x] - gray[y * width + (x - 1)]);
      if (diff < 15) smooth++;
      count++;
    }
  }
  return count > 0 ? smooth / count : 0;
}

function laplacianFrequency(gray, width, height) {
  let total = 0, count = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      total += Math.abs(
        4 * gray[y * width + x]
        - gray[(y - 1) * width + x] - gray[(y + 1) * width + x]
        - gray[y * width + (x - 1)] - gray[y * width + (x + 1)]
      );
      count++;
    }
  }
  return count > 0 ? (total / count) / 255 : 0;
}

function clamp(v) { return Math.max(0, Math.min(1, v)); }

function classifyPattern(imageData) {
  const { width, height } = imageData;
  const gray = toGrayscale(imageData);
  const { edgesH, edgesV, edgesMag } = sobelEdges(gray, width, height);

  const rMeans = rowMeans(gray, width, height);
  const cMeans = colMeans(gray, width, height);
  const MAX_VAR = (255 * 255) / 4;
  const normRowVar = Math.min(variance(Array.from(rMeans)) / MAX_VAR, 1);
  const normColVar = Math.min(variance(Array.from(cMeans)) / MAX_VAR, 1);

  const rEdges = rowEdgeSums(edgesH, width, height);
  const cEdges = colEdgeSums(edgesV, width, height);
  const hEdgeTotal = rEdges.reduce((a, b) => a + b, 0) / height;
  const vEdgeTotal = cEdges.reduce((a, b) => a + b, 0) / width;
  const edgeRatioH = hEdgeTotal / (hEdgeTotal + vEdgeTotal + 1e-6);
  const edgeRatioV = 1 - edgeRatioH;

  const hPer = autocorrelationPeak(Array.from(rMeans));
  const vPer = autocorrelationPeak(Array.from(cMeans));
  const hEdgePer = autocorrelationPeak(Array.from(rEdges));
  const vEdgePer = autocorrelationPeak(Array.from(cEdges));

  const contrast = globalContrast(gray);
  const edgeDensity = meanEdgeDensity(edgesMag);
  const { diag1, diag2 } = diagonalEdgeScores(gray, width, height);
  const diagScore = (diag1 + diag2) / 2;
  const blobs = blobScore(gray, width, height);
  const smoothness = gradientSmoothness(gray, width, height);
  const hfTexture = laplacianFrequency(gray, width, height);

  const scores = {
    "horizontal-stripes": clamp(
      0.35 * normRowVar +
      0.25 * hPer +
      0.25 * hEdgePer +
      0.15 * edgeRatioH
    ),
    "vertical-stripes": clamp(
      0.35 * normColVar +
      0.25 * vPer +
      0.25 * vEdgePer +
      0.15 * edgeRatioV
    ),
    "plaid": clamp(
      0.25 * Math.min(normRowVar, normColVar) +
      0.20 * hPer +
      0.20 * vPer +
      0.20 * (edgeDensity > 0.10 ? 1 : edgeDensity * 10) +
      0.15 * contrast
    ),
    "windowpane": clamp(
      0.30 * (edgeDensity < 0.07 ? (1 - edgeDensity * 14) : 0) +
      0.25 * hPer +
      0.25 * vPer +
      0.20 * (1 - blobs)
    ),
    "polka-dots": clamp(
      0.40 * blobs +
      0.25 * Math.max(hPer, vPer) +
      0.20 * contrast +
      0.15 * (edgeDensity < 0.18 ? 1 : 0)
    ),
    "floral": clamp(
      0.25 * blobs +
      0.20 * (1 - Math.max(hPer, vPer)) +
      0.20 * edgeDensity +
      0.20 * contrast +
      0.15 * Math.min(diagScore * 6, 1)
    ),
    "camouflage": clamp(
      0.30 * blobs * (1 - Math.max(hPer, vPer)) +
      0.25 * (1 - hEdgePer) * (1 - vEdgePer) +
      0.25 * (contrast > 0.25 && contrast < 0.85 ? 1 : 0) +
      0.20 * (edgeDensity < 0.20 ? 1 : 0)
    ),
    "tie-dye": clamp(
      0.40 * smoothness +
      0.25 * Math.max(0, 1 - edgeDensity * 8) +
      0.20 * (diagScore < 0.04 ? 1 : 0) +
      0.15 * contrast
    ),
    "linen-twill-texture": clamp(
      0.35 * Math.min(hfTexture * 3, 1) +
      0.25 * (1 - contrast) +
      0.20 * (edgeDensity < 0.12 ? 1 : 0) +
      0.20 * Math.min(Math.max(hPer, vPer) * 2, 1)
    ),
    "herringbone": clamp(
      0.35 * Math.min(diagScore * 6, 1) +
      0.25 * Math.min(Math.min(diag1, diag2) * 15, 1) +
      0.20 * contrast +
      0.20 * (hPer > 0.15 && vPer > 0.15 ? 1 : 0)
    ),
    "houndstooth": clamp(
      0.30 * contrast +
      0.30 * Math.min(diagScore * 6, 1) +
      0.20 * Math.max(hPer, vPer) +
      0.20 * Math.min(edgeDensity * 4, 1)
    ),
  };

  const sorted = Object.entries(scores)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);

  const best = sorted[0];
  const status = best.score >= 0.50 ? "matched" : "unknown";

  return {
    status,
    bestMatch: status === "matched" ? best.id : undefined,
    confidence: best.score,
    top3: sorted.slice(0, 3),
  };
}

// ─────────────────────────────────────────────
// PATTERN NAMES MAP
// ─────────────────────────────────────────────

const PATTERN_NAMES = {
  "horizontal-stripes": "Listras horizontais",
  "vertical-stripes": "Listras verticais",
  "plaid": "Xadrez",
  "herringbone": "Espinha de peixe",
  "houndstooth": "Pied-de-poule",
  "windowpane": "Windowpane",
  "polka-dots": "Poá / Bolinhas",
  "floral": "Floral / Folhagem",
  "camouflage": "Camuflado",
  "linen-twill-texture": "Textura linho/sarja",
  "tie-dye": "Tie-dye",
};

// ─────────────────────────────────────────────
// COLOR RESULT COMPONENT
// ─────────────────────────────────────────────

function ColorResult({ result }) {
  const { capturedHex, status, deltaE, top3 } = result;

  const statusLabel = {
    matched: "Cor identificada",
    approximate: "Cor aproximada",
    unknown: "Cor não encontrada na paleta",
  }[status];

  const statusColor = {
    matched: "var(--cam-ok)",
    approximate: "var(--warm-gold)",
    unknown: "var(--cam-err)",
  }[status];

  return (
    <div className="cam-result fade-in">
      <div className="section-label">Resultado — Cor</div>

      <div className="cam-captured-row">
        <div className="cam-captured-swatch" style={{ background: capturedHex }} />
        <div>
          <div className="cam-captured-hex">{capturedHex.toUpperCase()}</div>
          <div className="cam-status" style={{ color: statusColor }}>{statusLabel}</div>
          {deltaE !== undefined && (
            <div className="cam-delta">ΔE2000: {deltaE.toFixed(1)}</div>
          )}
        </div>
      </div>

      {top3.length > 0 && (
        <>
          <div className="result-sub-label">Top 3 cores mais próximas da paleta</div>
          <div className="suggestions-grid">
            {top3.map((c, i) => (
              <div key={c.key} className="suggestion-row" style={{ opacity: i === 0 ? 1 : 0.72 }}>
                <div className="sugg-swatch" style={{ background: c.hex }} />
                <div className="sugg-body">
                  <div className="sugg-role">#{i + 1}</div>
                  <div className="sugg-name">{c.name}</div>
                  <div className="sugg-note">ΔE2000: {c.deltaE.toFixed(1)}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {status === "unknown" && (
        <div className="cam-unknown-note">
          Nenhuma cor da paleta está próxima o suficiente (ΔE &gt; 18). Tente em melhor iluminação
          ou aponte para uma área mais uniforme.
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PATTERN RESULT COMPONENT
// ─────────────────────────────────────────────

function PatternResult({ result }) {
  const { status, bestMatch, confidence, top3 } = result;

  return (
    <div className="cam-result fade-in">
      <div className="section-label">Resultado — Padrão / Estampa</div>

      {status === "matched" ? (
        <div className="cam-pattern-best">
          <div className="cam-pattern-name">{PATTERN_NAMES[bestMatch] || bestMatch}</div>
          <div className="cam-conf-label">Confiança: {Math.round(confidence * 100)}%</div>
          <div className="cam-conf-bar">
            <div className="cam-conf-fill" style={{ width: `${confidence * 100}%` }} />
          </div>
        </div>
      ) : (
        <div className="cam-unknown-note">
          Padrão não identificado com confiança suficiente. Tente capturar em iluminação mais
          uniforme, com a câmera mais próxima do tecido.
        </div>
      )}

      <div className="result-sub-label">Top 3 padrões detectados</div>
      <div className="cam-top3-patterns">
        {top3.map((p, i) => (
          <div key={p.id} className="cam-pattern-row">
            <div className="cam-pattern-rank">#{i + 1}</div>
            <div className="cam-pattern-label">{PATTERN_NAMES[p.id] || p.id}</div>
            <div className="cam-pattern-bar-wrap">
              <div className="cam-pattern-bar-fill" style={{ width: `${p.score * 100}%` }} />
            </div>
            <div className="cam-pattern-score">{Math.round(p.score * 100)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN CAMERA COMPONENT
// ─────────────────────────────────────────────

const ROI_COLOR = 80;
const ROI_PATTERN = 200;
const PREVIEW_INTERVAL_MS = 300;

export function CameraCapture() {
  const cfg = useContext(PaletteContext);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  const preparedPaletteRef = useRef(null);

  const [mode, setMode] = useState("color");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [liveColor, setLiveColor] = useState(null);
  const [colorResult, setColorResult] = useState(null);
  const [patternResult, setPatternResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Rebuild palette when palette config changes
  useEffect(() => {
    preparedPaletteRef.current = buildPreparedPalette(cfg.C);
    setColorResult(null);
    setPatternResult(null);
  }, [cfg.C]);

  // ── Camera controls ──────────────────────────

  const stopCamera = useCallback(() => {
    clearInterval(intervalRef.current);
    const video = videoRef.current;
    if (video?.srcObject) {
      video.srcObject.getTracks().forEach(t => t.stop());
      video.srcObject = null;
    }
    setCameraActive(false);
    setLiveColor(null);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setCameraActive(true);
    } catch {
      setCameraError(
        "Não foi possível acessar a câmera. Verifique se você concedeu permissão e se o site está em HTTPS."
      );
    }
  }, []);

  // ── Live color preview (color mode only) ────

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!cameraActive || mode !== "color") return;

    intervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2 || video.videoWidth === 0) return;
      drawVideoToCanvas(video, canvas);
      const roi = getROI(canvas, ROI_COLOR);
      const rgb = getMedianRGB(roi);
      if (rgb) setLiveColor({ hex: toHex(...rgb), rgb });
    }, PREVIEW_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [cameraActive, mode]);

  // ── Capture color ────────────────────────────

  const captureColor = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    setAnalyzing(true);
    setColorResult(null);

    try {
      // Sample 10 frames for stability
      const samples = [];
      for (let i = 0; i < 10; i++) {
        drawVideoToCanvas(video, canvas);
        const roi = getROI(canvas, ROI_COLOR);
        const rgb = getMedianRGB(roi);
        if (rgb) samples.push(rgb);
        await new Promise(r => setTimeout(r, 30));
      }

      if (samples.length === 0) return;

      const finalRGB = [
        medianValue(samples.map(s => s[0])),
        medianValue(samples.map(s => s[1])),
        medianValue(samples.map(s => s[2])),
      ];

      const capturedHex = toHex(...finalRGB);
      const matches = matchColorToPalette(finalRGB, preparedPaletteRef.current);
      if (!matches) return;

      const best = matches[0];
      const status = classifyConfidence(best.deltaE);

      setColorResult({
        capturedHex,
        status,
        deltaE: best.deltaE,
        top3: matches.slice(0, 3),
      });
    } finally {
      setAnalyzing(false);
    }
  }, []);

  // ── Analyze pattern ──────────────────────────

  const analyzePattern = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return;

    setAnalyzing(true);
    setPatternResult(null);

    // Defer heavy work off the main paint
    setTimeout(() => {
      try {
        drawVideoToCanvas(video, canvas);
        const roi = getROI(canvas, ROI_PATTERN);

        // Scale to 200×200 for consistent analysis
        const offscreen = document.createElement("canvas");
        offscreen.width = 200;
        offscreen.height = 200;
        const tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = roi.width;
        tmpCanvas.height = roi.height;
        tmpCanvas.getContext("2d").putImageData(roi, 0, 0);
        offscreen.getContext("2d").drawImage(tmpCanvas, 0, 0, 200, 200);

        const scaled = offscreen.getContext("2d").getImageData(0, 0, 200, 200);
        setPatternResult(classifyPattern(scaled));
      } finally {
        setAnalyzing(false);
      }
    }, 50);
  }, []);

  // ── Cleanup on unmount ───────────────────────

  useEffect(() => {
    return () => {
      stopCamera();
      clearInterval(intervalRef.current);
    };
  }, [stopCamera]);

  // ── Mode change ──────────────────────────────

  const handleModeChange = (m) => {
    setMode(m);
    setColorResult(null);
    setPatternResult(null);
    setLiveColor(null);
  };

  const roiSize = mode === "color" ? ROI_COLOR : ROI_PATTERN;

  // ── Render ───────────────────────────────────

  return (
    <div className="cam-section">

      {/* ── Camera viewport ── */}
      <div className="cam-viewport">
        <video
          ref={videoRef}
          className="cam-video"
          playsInline
          muted
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {cameraActive && (
          <div
            className="cam-roi"
            style={{ width: roiSize, height: roiSize }}
            aria-label="Região de interesse"
          >
            <div className="roi-corner tl" />
            <div className="roi-corner tr" />
            <div className="roi-corner bl" />
            <div className="roi-corner br" />
          </div>
        )}

        {cameraActive && liveColor && mode === "color" && (
          <div className="cam-live-badge">
            <div className="cam-live-dot" style={{ background: liveColor.hex }} />
            <span className="cam-live-hex">{liveColor.hex.toUpperCase()}</span>
          </div>
        )}

        {!cameraActive && (
          <div className="cam-placeholder">
            <div className="cam-placeholder-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <p>Câmera inativa</p>
            <p className="cam-placeholder-sub">Ative para começar a detecção</p>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {cameraError && (
        <div className="cam-error" role="alert">{cameraError}</div>
      )}

      {/* ── Camera toggle ── */}
      <div className="cam-controls">
        {!cameraActive ? (
          <button className="cam-btn cam-btn-primary" onClick={startCamera}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            Ativar câmera
          </button>
        ) : (
          <button className="cam-btn cam-btn-secondary" onClick={stopCamera}>
            Desativar câmera
          </button>
        )}
      </div>

      <div className="divider" />

      {/* ── Mode selector ── */}
      <div className="section-label">O que deseja detectar?</div>
      <div className="cam-mode-row">
        <button
          className={`cam-mode-btn${mode === "color" ? " active" : ""}`}
          onClick={() => handleModeChange("color")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
          Detectar cor
        </button>
        <button
          className={`cam-mode-btn${mode === "pattern" ? " active" : ""}`}
          onClick={() => handleModeChange("pattern")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
          Detectar padrão / estampa
        </button>
      </div>

      {/* ── Instruction ── */}
      <p className="cam-instruction">
        {mode === "color"
          ? "Aponte a câmera para uma área uniforme do tecido. Evite sombras, reflexos e estampas."
          : "Aponte a câmera para uma área maior do tecido para capturar a repetição da estampa."}
      </p>

      {/* ── ROI size hint ── */}
      <div className="cam-roi-hint">
        Região de análise: {roiSize}×{roiSize} px
        {mode === "color" ? " (pequena — captura cor uniforme)" : " (ampla — captura repetição do padrão)"}
      </div>

      {/* ── Action button ── */}
      {cameraActive && (
        <div className="cam-action-wrap">
          <button
            className="cam-btn cam-btn-primary cam-btn-lg"
            onClick={mode === "color" ? captureColor : analyzePattern}
            disabled={analyzing}
            aria-busy={analyzing}
          >
            {analyzing ? (
              <>
                <span className="cam-spinner" />
                Analisando…
              </>
            ) : mode === "color" ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
                </svg>
                Capturar cor
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Analisar estampa
              </>
            )}
          </button>
        </div>
      )}

      <div className="divider" />

      {/* ── Results ── */}
      {mode === "color" && colorResult && <ColorResult result={colorResult} />}
      {mode === "pattern" && patternResult && <PatternResult result={patternResult} />}

      {/* ── Empty state ── */}
      {!colorResult && !patternResult && (
        <div className="result-empty">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
          </svg>
          {cameraActive
            ? `Clique em "${mode === "color" ? "Capturar cor" : "Analisar estampa"}" para ver o resultado`
            : "Ative a câmera e aponte para um tecido"}
        </div>
      )}
    </div>
  );
}
