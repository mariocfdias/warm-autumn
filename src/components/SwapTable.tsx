import { SWAPS } from "../constants/patterns";
import { PatternCanvas } from "./PatternCanvas";

export function SwapTable() {
  return (
    <table className="swap-table">
      <thead>
        <tr>
          <th>Padrão comum</th>
          <th>Troca para Warm Autumn</th>
        </tr>
      </thead>
      <tbody>
        {SWAPS.map((s, i) => (
          <tr key={i}>
            <td className="swap-bad">
              <div className="swap-pattern-cell">
                <div className="swap-canvas-wrap">
                  <PatternCanvas
                    type={s.pattern}
                    colors={s.badColors}
                    width={56}
                    height={36}
                    scale={0.5}
                    style={{ borderRadius: 5, border: "1px solid rgba(120,90,50,0.28)" }}
                  />
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.bad}</span>
              </div>
            </td>
            <td>
              <div className="swap-pattern-cell">
                <span style={{ fontSize: 18, color: "var(--warm-gold)", marginRight: 4 }}>→</span>
                <div className="swap-canvas-wrap">
                  <PatternCanvas
                    type={s.pattern}
                    colors={s.goodColors}
                    width={56}
                    height={36}
                    scale={0.5}
                    style={{ borderRadius: 5, border: "1px solid rgba(120,90,50,0.28)" }}
                  />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-main)" }}>{s.good}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
