import { useEffect, useRef } from "react";
import PataIcone from "./PataIcone.jsx";

// Pop-up (overlay) que envolve os formulários de cadastro/edição.
// Fecha com Esc, clicando fora ou no "×".
export default function Modal({ titulo, aberto, onFechar, children }) {
  const caixaRef = useRef(null);
  // Guarda a função num ref para o efeito abaixo rodar só ao abrir/fechar.
  const fecharRef = useRef(onFechar);
  fecharRef.current = onFechar;

  useEffect(() => {
    if (!aberto) return;

    const anterior = document.activeElement;
    document.body.classList.add("travado");

    // Foca o primeiro campo do formulário ao abrir.
    const primeiro = caixaRef.current?.querySelector("input, textarea, select");
    primeiro?.focus();

    const aoTeclar = (e) => {
      if (e.key === "Escape") fecharRef.current();
    };
    document.addEventListener("keydown", aoTeclar);

    return () => {
      document.body.classList.remove("travado");
      document.removeEventListener("keydown", aoTeclar);
      anterior?.focus?.(); // devolve o foco para o botão que abriu
    };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onFechar();
      }}
    >
      <div
        ref={caixaRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
      >
        <button type="button" className="modal-fechar" aria-label="Fechar" onClick={onFechar}>
          ×
        </button>
        <PataIcone tamanho={30} cor="#f6b53f" className="pata-canto" style={{ right: 64 }} />
        <h2 id="modal-titulo">{titulo}</h2>
        {children}
      </div>
    </div>
  );
}
