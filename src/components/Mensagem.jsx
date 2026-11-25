// Faixa de feedback (sucesso / erro).
export default function Mensagem({ mensagem }) {
  if (!mensagem) return null;
  return (
    <div role={mensagem.tipo === "erro" ? "alert" : "status"} className={`mensagem ${mensagem.tipo}`}>
      {mensagem.texto}
    </div>
  );
}
