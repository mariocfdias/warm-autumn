import { useState } from "react";
import { ColorsTab } from "./ColorsTab";
import { PatternsTab } from "./PatternsTab";
import "../styles/warmAutumn.css";

type TabId = "colors" | "patterns";

const TABS: { id: TabId; label: string }[] = [
  { id: "colors",   label: "Cores sólidas" },
  { id: "patterns", label: "Padrões & Estampas" },
];

export function WarmAutumn() {
  const [activeTab, setActiveTab] = useState<TabId>("colors");

  return (
    <>
      <header>
        <div className="header-inner">
          <div className="header-eyebrow">Coloração Pessoal · Guia de Estilo</div>
          <h1>
            Warm <em>Autumn</em>
          </h1>
          <div className="header-sub">Paleta interativa para montagem de looks</div>
        </div>
      </header>

      <div className="tab-bar">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`tab-btn${activeTab === id ? " active" : ""}`}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="main">
        {activeTab === "colors" ? <ColorsTab /> : <PatternsTab />}
      </div>

      <footer>Warm Autumn · Guia de Coloração Pessoal · Paleta baseada em Pantone TCX</footer>
    </>
  );
}

export default WarmAutumn;
