import { useState } from "react";
import type { PatternPieceType } from "../types";
import { C } from "../constants/colors";
import { PATTERN_TYPES, PATTERN_COMBOS } from "../constants/patterns";
import { PatternCanvas } from "./PatternCanvas";
import { SwapTable } from "./SwapTable";
import { IconShirt, IconPants, IconClock } from "./icons";

const PIECE_CONFIG: { id: PatternPieceType; label: string; Icon: () => JSX.Element }[] = [
  { id: "shirt", label: "Camisa / Camiseta", Icon: IconShirt },
  { id: "pants", label: "Calça",             Icon: IconPants },
];

const ROLE_DISPLAY: Record<string, string> = {
  shirt: "Camisa / Camiseta",
  pants: "Calça",
  shoe:  "Sapato / Tênis",
};

export function PatternsTab() {
  const [patternPiece, setPatternPiece]     = useState<PatternPieceType>("shirt");
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const handleSetPatternPiece = (p: PatternPieceType) => {
    setPatternPiece(p);
    setSelectedPattern(null);
  };

  const availablePatterns = PATTERN_TYPES.filter(
    (pt) => (PATTERN_COMBOS[patternPiece]?.[pt.id] ?? []).length > 0
  );

  const combos = selectedPattern
    ? (PATTERN_COMBOS[patternPiece]?.[selectedPattern] ?? [])
    : [];

  const pieceLabel = patternPiece === "shirt" ? "Camisa / Camiseta" : "Calça";

  return (
    <div>
      {/* Piece selector */}
      <div className="section-label">Selecione o tipo de peça</div>
      <div className="pattern-piece-selector">
        {PIECE_CONFIG.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`piece-btn${patternPiece === id ? " active" : ""}`}
            onClick={() => handleSetPatternPiece(id)}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>

      {/* Pattern type grid */}
      <div className="section-label">Escolha o padrão</div>
      <div className="pattern-types-grid">
        {availablePatterns.map((pt) => {
          const previewColors = (PATTERN_COMBOS[patternPiece][pt.id] ?? [])[0]?.colors ?? ["#ccc"];
          return (
            <div
              key={pt.id}
              className={`pattern-type-chip${selectedPattern === pt.id ? " selected" : ""}`}
              onClick={() => setSelectedPattern(selectedPattern === pt.id ? null : pt.id)}
            >
              <PatternCanvas
                type={pt.id}
                colors={previewColors}
                width={110}
                height={72}
                scale={1.1}
                style={{ borderRadius: "8px 8px 0 0" }}
              />
              <div className="pattern-type-label">{pt.name}</div>
            </div>
          );
        })}
      </div>

      <div className="divider" />

      {/* Pattern combos */}
      {!selectedPattern ? (
        <div className="result-empty">
          <IconClock />
          Selecione um padrão acima para ver os looks
        </div>
      ) : combos.length === 0 ? (
        <div className="result-empty">Nenhuma combinação disponível para este padrão/peça.</div>
      ) : (
        combos.map((combo, i) => {
          const others = combo.look.filter((p) => p.role !== patternPiece);
          return (
            <div key={i} className="pattern-combo-card fade-in">
              <div className="pattern-combo-header">
                <PatternCanvas
                  type={selectedPattern}
                  colors={combo.colors}
                  width={80}
                  height={56}
                  scale={0.85}
                  style={{ borderRadius: 6, border: "1px solid rgba(120,90,50,0.28)", flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", color: "var(--warm-gold)", marginBottom: 4 }}>
                    {pieceLabel} com padrão
                  </div>
                  <div className="pattern-combo-title">{combo.name}</div>
                  <div className="pattern-combo-desc">{combo.note}</div>
                </div>
              </div>
              <div className="pattern-combo-body">
                <div style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: 2, textTransform: "uppercase", color: "var(--warm-gold)", marginBottom: 8 }}>
                  Combina com
                </div>
                <div className="pattern-combo-look">
                  {others.length === 0 ? (
                    <span style={{ fontSize: 12, color: "var(--text-light)", fontStyle: "italic" }}>
                      Veja as sugestões de cores sólidas na outra aba
                    </span>
                  ) : (
                    others.map((p) => {
                      const cc = C[p.ck];
                      return (
                        <div key={p.role} className="look-pill">
                          <div className="look-pill-dot" style={{ background: cc?.hex ?? "#ccc" }} />
                          <span style={{ fontSize: 11, color: "var(--text-light)" }}>
                            {ROLE_DISPLAY[p.role] ?? p.role}:
                          </span>
                          &nbsp;{cc?.name ?? p.ck}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

      <div className="divider" />

      {/* Swap table */}
      <div className="section-label">Trocas inteligentes — padrões para Warm Autumn</div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: "1.25rem", fontStyle: "italic" }}>
        Substitua os padrões frios clássicos por versões quentes que favorecem sua coloração:
      </p>
      <SwapTable />
    </div>
  );
}
