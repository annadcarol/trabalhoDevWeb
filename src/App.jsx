import { useState } from "react";
import TutoresPage from "./pages/TutoresPage.jsx";
import PetsPage from "./pages/PetsPage.jsx";
import logo from "./assets/logo.svg";
import animais from "./assets/animais.png";

const ABAS = [
  { id: "tutores", rotulo: "Tutores" },
  { id: "pets", rotulo: "Pets" },
];

export default function App() {
  const [aba, setAba] = useState("tutores");

  return (
    <div className="app">
      <header className="topo">
        <svg aria-hidden="true" className="topo-patas">
          <defs>
            <pattern id="patas" width="150" height="150" patternUnits="userSpaceOnUse">
              <g fill="#ffffff" transform="translate(34,34) scale(0.6)">
                <ellipse cx="32" cy="42" rx="15" ry="12" />
                <ellipse cx="12" cy="26" rx="6" ry="8" transform="rotate(-25 12 26)" />
                <ellipse cx="25" cy="14" rx="6" ry="8.5" transform="rotate(-8 25 14)" />
                <ellipse cx="39" cy="14" rx="6" ry="8.5" transform="rotate(8 39 14)" />
                <ellipse cx="52" cy="26" rx="6" ry="8" transform="rotate(25 52 26)" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#patas)" />
        </svg>

        <div className="topo-barra">
          <button
            type="button"
            onClick={() => setAba("tutores")}
            aria-label="Pet Shop, início"
            style={{ background: "none", border: 0, padding: 0, lineHeight: 0 }}
          >
            <img src={logo} alt="Pet Shop" width="64" height="64" className="topo-logo" />
          </button>
          <nav aria-label="Principal" className="abas">
            {ABAS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`aba ${aba === a.id ? "ativa" : ""}`}
                aria-current={aba === a.id ? "page" : undefined}
                onClick={() => setAba(a.id)}
              >
                {a.rotulo}
              </button>
            ))}
          </nav>
        </div>

        <div className="hero">
          <div className="hero-texto">
            <div className="hero-chamada">Cuidado que faz o rabinho balançar</div>
            <h1>Pet Shop</h1>
            <p>Tutores e pets em um só lugar. Cadastre, busque e acompanhe quem cuida de quem.</p>
          </div>
          <img
            src={animais}
            alt="Um cachorro corgi e um gato preto e branco olhando para cima"
            className="hero-imagem"
          />
        </div>

        <svg aria-hidden="true" viewBox="0 0 1280 56" preserveAspectRatio="none" className="topo-onda">
          <path
            d="M0 34 C 60 8, 120 48, 190 24 S 320 6, 390 30 S 520 50, 600 22 S 740 8, 820 32 S 950 50, 1030 20 S 1170 10, 1280 34 L1280 56 L0 56 Z"
            fill="#fdf8ea"
          />
        </svg>
      </header>

      {aba === "tutores" ? <TutoresPage /> : <PetsPage />}

      <footer className="rodape">
        <strong>Pet Shop</strong>
        <span>Anna Carolina Strack Haus e Francisco Galvão Coloda</span>
      </footer>
    </div>
  );
}
