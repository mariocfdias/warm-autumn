import { useState } from "react";
import type { PieceType } from "../types";
import { C, PALETTES, PIECE_LABELS, AVOID_COLORS, METALS } from "../constants/colors";
import { ResultSection } from "./ResultSection";
import { IconShirt, IconPants, IconShoe } from "./icons";

const PIECE_CONFIG: { id: PieceType; label: string; Icon: () => JSX.Element }[] = [
  { id: "shirt", label: "Camisa / Camiseta", Icon: IconShirt },
  { id: "pants", label: "Calça",             Icon: IconPants },
  { id: "shoe",  label: "Sapato / Tênis",    Icon: IconShoe  },
];

export function ColorsTab() {
  const [piece, setPiece]     = useState<PieceType>("shirt");
  const [selected, setSelected] = useState<string | null>(null);

  const handleSetPiece = (p: PieceType) => {
    setPiece(p);
    setSelected(null);
  };

  return (
    <div>
      {/* Piece selector */}
      <div className="section-label">Selecione a peça</div>
      <div className="piece-selector">
        {PIECE_CONFIG.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`piece-btn${piece === id ? " active" : ""}`}
            onClick={() => handleSetPiece(id)}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>

      {/* Color palette */}
      <div className="palette-section">
        <div className="section-label">{PIECE_LABELS[piece]}</div>
        <div className="palette-grid">
          {PALETTES[piece].map((k) => (
            <div
              key={k}
              className={`color-chip${selected === k ? " selected" : ""}`}
              onClick={() => setSelected(selected === k ? null : k)}
            >
              <div className="chip-swatch" style={{ background: C[k].hex }} />
              <div className="chip-label">{C[k].name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* Combinations result */}
      <ResultSection piece={piece} selected={selected} />

      <div className="divider" />

      {/* Avoid */}
      <div>
        <div className="section-label">Cores que costumam destoar em Warm Autumn</div>
        <div className="avoid-grid">
          {AVOID_COLORS.map(({ hex, label }) => (
            <div key={label} className="avoid-chip">
              <div className="avoid-swatch" style={{ background: hex }} />
              <div className="avoid-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Metals */}
      <div className="info-box" style={{ marginTop: "2rem" }}>
        <div className="info-box-title">Metais que favorecem</div>
        <div className="info-tags">
          {METALS.map(({ grad, label }) => (
            <div key={label} className="info-tag">
              <div className="dot" style={{ background: grad }} />
              {label}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: ".75rem", fontStyle: "italic" }}>
          Prata muito fria pesa menos bem; prata envelhecida ou champanhe pode funcionar dependendo do conjunto.
        </p>
      </div>
    </div>
  );
}
