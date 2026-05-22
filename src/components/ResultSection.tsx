import type { PieceType, FullLookPiece, ComboItem } from "../types";
import { C, COMBOS } from "../constants/colors";
import { IconClock } from "./icons";

interface ResultSectionProps {
  piece: PieceType;
  selected: string | null;
}

function SuggestionRow({ k, role, note }: { k: string; role: string; note: string }) {
  return (
    <div className="suggestion-row fade-in">
      <div className="sugg-swatch" style={{ background: C[k].hex }} />
      <div className="sugg-body">
        <div className="sugg-role">{role}</div>
        <div className="sugg-name">{C[k].name}</div>
        <div className="sugg-note">{note}</div>
      </div>
    </div>
  );
}

function FullLook({ pieces }: { pieces: FullLookPiece[] }) {
  return (
    <div className="full-look fade-in">
      <div className="full-look-header">Look completo sugerido</div>
      <div className="full-look-pieces">
        {pieces.map((p) => (
          <div key={p.role} className="look-piece">
            <div className="look-swatch" style={{ background: p.hex }} />
            <div className="look-meta">
              <div className="look-role">{p.role}</div>
              <div className="look-name">{p.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestionGroup({ items, role, label }: { items: ComboItem[]; role: string; label: string }) {
  if (!items.length) return null;
  return (
    <>
      <div className="result-sub-label">{label}</div>
      <div className="suggestions-grid">
        {items.map(({ k, note }) => (
          <SuggestionRow key={k} k={k} role={role} note={note} />
        ))}
      </div>
    </>
  );
}

function buildFullLook(piece: PieceType, selected: string): FullLookPiece[] | null {
  const c = C[selected];
  const combos = COMBOS[piece][selected] ?? {};

  if (piece === "shirt") {
    const sc = combos as { pants?: ComboItem[]; shoes?: ComboItem[] };
    if (!sc.pants?.length || !sc.shoes?.length) return null;
    return [
      { role: "Camisa",  hex: c.hex,                    name: c.name },
      { role: "Calça",   hex: C[sc.pants[0].k].hex,     name: C[sc.pants[0].k].name },
      { role: "Sapato",  hex: C[sc.shoes[0].k].hex,     name: C[sc.shoes[0].k].name },
    ];
  }
  if (piece === "pants") {
    const pc = combos as { shirts?: ComboItem[]; shoes?: ComboItem[] };
    if (!pc.shirts?.length || !pc.shoes?.length) return null;
    return [
      { role: "Camisa",  hex: C[pc.shirts[0].k].hex,    name: C[pc.shirts[0].k].name },
      { role: "Calça",   hex: c.hex,                    name: c.name },
      { role: "Sapato",  hex: C[pc.shoes[0].k].hex,     name: C[pc.shoes[0].k].name },
    ];
  }
  // shoe
  const shc = combos as { shirts?: ComboItem[]; pants?: ComboItem[] };
  if (!shc.shirts?.length || !shc.pants?.length) return null;
  return [
    { role: "Camisa",  hex: C[shc.shirts[0].k].hex,   name: C[shc.shirts[0].k].name },
    { role: "Calça",   hex: C[shc.pants[0].k].hex,    name: C[shc.pants[0].k].name },
    { role: "Sapato",  hex: c.hex,                    name: c.name },
  ];
}

export function ResultSection({ piece, selected }: ResultSectionProps) {
  if (!selected) {
    return (
      <div className="result-empty">
        <IconClock />
        Selecione uma cor acima para ver as combinações
      </div>
    );
  }

  const c = C[selected];
  const combos = COMBOS[piece][selected] ?? {};
  const fullLookPieces = buildFullLook(piece, selected);

  return (
    <div className="result-section">
      <div className="result-header fade-in">
        <div className="result-color-dot" style={{ background: c.hex }} />
        <div className="result-title">
          Combinações com <span>{c.name}</span>
        </div>
      </div>

      {piece === "shirt" && (() => {
        const sc = combos as { pants?: ComboItem[]; shoes?: ComboItem[] };
        return (
          <>
            <SuggestionGroup items={sc.pants ?? []}  role="Calça"         label="Calças que combinam" />
            <SuggestionGroup items={sc.shoes ?? []}  role="Sapato/Tênis"  label="Sapatos / Tênis" />
          </>
        );
      })()}

      {piece === "pants" && (() => {
        const pc = combos as { shirts?: ComboItem[]; shoes?: ComboItem[] };
        return (
          <>
            <SuggestionGroup items={pc.shirts ?? []} role="Camisa/Camiseta" label="Camisas / Camisetas" />
            <SuggestionGroup items={pc.shoes  ?? []} role="Sapato/Tênis"    label="Sapatos / Tênis" />
          </>
        );
      })()}

      {piece === "shoe" && (() => {
        const shc = combos as { shirts?: ComboItem[]; pants?: ComboItem[] };
        return (
          <>
            <SuggestionGroup items={shc.shirts ?? []} role="Camisa/Camiseta" label="Camisas / Camisetas" />
            <SuggestionGroup items={shc.pants  ?? []} role="Calça"           label="Calças" />
          </>
        );
      })()}

      {fullLookPieces && <FullLook pieces={fullLookPieces} />}
    </div>
  );
}
