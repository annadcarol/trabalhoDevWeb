import { useEffect, useState } from "react";
import { listarPets, cadastrarPet, atualizarPet, listarTutores } from "../api.js";
import Mensagem from "../components/Mensagem.jsx";
import Modal from "../components/Modal.jsx";
import PataIcone from "../components/PataIcone.jsx";

const FORM_VAZIO = { nome: "", descricao: "", vacinado: true, tutorId: "" };

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [form, setForm] = useState(FORM_VAZIO);
  const [editandoId, setEditandoId] = useState(null); // null = cadastrando um novo
  const [modalAberto, setModalAberto] = useState(false);
  const [erroForm, setErroForm] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const avisar = (tipo, texto) => setMensagem({ tipo, texto });

  async function carregar(filtro = filtroAtivo) {
    setCarregando(true);
    try {
      setPets(await listarPets(filtro));
      setFiltroAtivo(filtro);
    } catch (e) {
      avisar("erro", e.message);
    } finally {
      setCarregando(false);
    }
  }

  const carregarTutores = () =>
    listarTutores().then(setTutores).catch((e) => avisar("erro", e.message));

  useEffect(() => {
    carregar("");
    carregarTutores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function abrirNovo() {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErroForm(null);
    carregarTutores();
    setModalAberto(true);
  }

  function abrirEdicao(pet) {
    setEditandoId(pet.id);
    setForm({
      nome: pet.nome,
      descricao: pet.descricao ?? "",
      vacinado: Boolean(pet.vacinado),
      tutorId: String(pet.tutorId ?? ""),
    });
    setErroForm(null);
    carregarTutores();
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErroForm(null);
  }

  async function enviar(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      if (editandoId !== null) {
        await atualizarPet(editandoId, form);
        avisar("sucesso", "Pet atualizado com sucesso!");
      } else {
        await cadastrarPet(form);
        avisar("sucesso", "Pet cadastrado com sucesso!");
      }
      fecharModal();
      carregar();
    } catch (e) {
      setErroForm({ tipo: "erro", texto: e.message });
    } finally {
      setSalvando(false);
    }
  }

  const editando = editandoId !== null;

  return (
    <main className="conteudo">
      <section className="painel" aria-labelledby="painel-pet">
        <PataIcone tamanho={30} cor="#f6b53f" className="pata-canto" />
        <h2 id="painel-pet">Novo pet</h2>
        <p>Cadastre o pet com descrição, situação da vacina e o tutor responsável.</p>
        <button type="button" className="btn btn-amarelo btn-bloco" onClick={abrirNovo}>
          Cadastrar pet
        </button>
      </section>

      <section className="lista-secao" aria-labelledby="lista-pets">
        <h2 id="lista-pets">Pets cadastrados</h2>
        <Mensagem mensagem={mensagem} />

        <form
          className="busca"
          onSubmit={(e) => {
            e.preventDefault();
            carregar(busca);
          }}
        >
          <input
            aria-label="Buscar por nome do pet"
            placeholder="Buscar por nome do pet..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit" className="btn btn-roxo">Buscar</button>
          {(busca || filtroAtivo) && (
            <button
              type="button"
              className="btn-contorno"
              onClick={() => {
                setBusca("");
                carregar("");
              }}
            >
              Limpar
            </button>
          )}
        </form>

        {carregando && pets.length === 0 && <p className="vazio">Carregando...</p>}
        {!carregando && pets.length === 0 && (
          <p className="vazio">Nenhum pet encontrado.</p>
        )}

        <ul className="lista">
          {pets.map((pet) => (
            <li key={pet.id} className={`item ${editando && editandoId === pet.id ? "editando" : ""}`}>
              <div className="item-topo">
                <div>
                  <div className="item-nome">{pet.nome}</div>
                  <div className="item-sub">tutor: {pet.tutor?.nome ?? "-"}</div>
                </div>
                <div className="acoes">
                  <span className={`selo ${pet.vacinado ? "ok" : "semvacina"}`}>
                    {pet.vacinado ? "Vacinado" : "Sem vacina"}
                  </span>
                  <button type="button" className="btn-contorno" onClick={() => abrirEdicao(pet)}>
                    Editar
                  </button>
                </div>
              </div>
              <p className="item-texto">{pet.descricao}</p>
            </li>
          ))}
        </ul>
      </section>

      <Modal
        titulo={editando ? "Editar pet" : "Novo pet"}
        aberto={modalAberto}
        onFechar={fecharModal}
      >
        <form onSubmit={enviar}>
          <Mensagem mensagem={erroForm} />
          <label>
            Nome do pet
            <input
              maxLength={80}
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </label>
          <label>
            Descrição (espécie, raça, cuidados)
            <textarea
              rows={4}
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              required
            />
          </label>
          <label>
            Tutor
            <select
              value={form.tutorId}
              onChange={(e) => setForm({ ...form, tutorId: e.target.value })}
              required
            >
              <option value="">Selecione um tutor...</option>
              {tutores.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={form.vacinado}
              onChange={(e) => setForm({ ...form, vacinado: e.target.checked })}
            />
            Vacinado
          </label>
          {tutores.length === 0 && (
            <p className="dica">Cadastre um tutor primeiro na aba “Tutores”.</p>
          )}
          <div className="modal-botoes">
            <button type="submit" className="btn btn-amarelo" disabled={salvando}>
              {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar pet"}
            </button>
            {editando && (
              <button type="button" className="btn btn-fantasma" onClick={fecharModal}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </Modal>
    </main>
  );
}
