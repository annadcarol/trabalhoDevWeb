import { useEffect, useState } from "react";
import {
  listarTutores,
  cadastrarTutor,
  atualizarTutor,
  excluirTutor,
  listarPetsDoTutor,
} from "../api.js";
import Mensagem from "../components/Mensagem.jsx";
import Modal from "../components/Modal.jsx";
import PataIcone from "../components/PataIcone.jsx";

const FORM_VAZIO = { nome: "", email: "", endereco: "" };

export default function TutoresPage() {
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
  const [aberto, setAberto] = useState(null); // id do tutor com pets expandidos
  const [petsAberto, setPetsAberto] = useState([]);

  const avisar = (tipo, texto) => setMensagem({ tipo, texto });

  async function carregar(filtro = filtroAtivo) {
    setCarregando(true);
    try {
      setTutores(await listarTutores(filtro));
      setFiltroAtivo(filtro);
    } catch (e) {
      avisar("erro", e.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alterar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  function abrirNovo() {
    setEditandoId(null);
    setForm(FORM_VAZIO);
    setErroForm(null);
    setModalAberto(true);
  }

  function abrirEdicao(tutor) {
    setEditandoId(tutor.id);
    setForm({ nome: tutor.nome, email: tutor.email, endereco: tutor.endereco ?? "" });
    setErroForm(null);
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
        await atualizarTutor(editandoId, form);
        avisar("sucesso", "Tutor atualizado com sucesso!");
      } else {
        await cadastrarTutor(form);
        avisar("sucesso", "Tutor cadastrado com sucesso!");
      }
      fecharModal();
      carregar();
    } catch (e) {
      setErroForm({ tipo: "erro", texto: e.message });
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(tutor) {
    if (!window.confirm(`Excluir o tutor "${tutor.nome}"?`)) return;
    try {
      await excluirTutor(tutor.id);
      avisar("sucesso", "Tutor excluído.");
      if (aberto === tutor.id) setAberto(null);
      carregar();
    } catch (e) {
      avisar("erro", e.message);
    }
  }

  async function alternarPets(tutor) {
    if (aberto === tutor.id) {
      setAberto(null);
      return;
    }
    try {
      setPetsAberto(await listarPetsDoTutor(tutor.id));
      setAberto(tutor.id);
    } catch (e) {
      avisar("erro", e.message);
    }
  }

  const editando = editandoId !== null;
  const primeiroNome = (nome) => nome.split(" ")[0];

  return (
    <main className="conteudo">
      <section className="painel" aria-labelledby="painel-tutor">
        <PataIcone tamanho={30} cor="#f6b53f" className="pata-canto" />
        <h2 id="painel-tutor">Novo tutor</h2>
        <p>Cadastre quem cuida dos pets: nome, e-mail e endereço.</p>
        <button type="button" className="btn btn-amarelo btn-bloco" onClick={abrirNovo}>
          Cadastrar tutor
        </button>
      </section>

      <section className="lista-secao" aria-labelledby="lista-tutores">
        <h2 id="lista-tutores">Tutores cadastrados</h2>
        <Mensagem mensagem={mensagem} />

        <form
          className="busca"
          onSubmit={(e) => {
            e.preventDefault();
            carregar(busca);
          }}
        >
          <input
            aria-label="Buscar por nome"
            placeholder="Buscar por nome..."
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

        {carregando && tutores.length === 0 && <p className="vazio">Carregando...</p>}
        {!carregando && tutores.length === 0 && (
          <p className="vazio">Nenhum tutor encontrado.</p>
        )}

        <ul className="lista">
          {tutores.map((t) => (
            <li key={t.id} className={`item ${editando && editandoId === t.id ? "editando" : ""}`}>
              <div className="item-topo">
                <div>
                  <div className="item-nome">{t.nome}</div>
                  <div className="item-sub">{t.email}</div>
                </div>
                <div className="acoes">
                  <button type="button" className="btn-contorno" onClick={() => abrirEdicao(t)}>
                    Editar
                  </button>
                  <button type="button" className="btn-contorno" onClick={() => alternarPets(t)}>
                    {aberto === t.id ? "Ocultar pets" : "Ver pets"}
                  </button>
                  <button type="button" className="btn-contorno perigo" onClick={() => excluir(t)}>
                    Excluir
                  </button>
                </div>
              </div>
              {t.endereco && <p className="item-texto">{t.endereco}</p>}
              {aberto === t.id && (
                <div className="sublista">
                  <div className="sublista-titulo">Pets de {primeiroNome(t.nome)}</div>
                  {petsAberto.length === 0 ? (
                    <em>Este tutor ainda não tem pets.</em>
                  ) : (
                    <div className="chips">
                      {petsAberto.map((pet) => (
                        <span key={pet.id} className="chip">
                          <PataIcone cor="#2b2a4a" />
                          {pet.nome}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <Modal
        titulo={editando ? "Editar tutor" : "Novo tutor"}
        aberto={modalAberto}
        onFechar={fecharModal}
      >
        <form onSubmit={enviar}>
          <Mensagem mensagem={erroForm} />
          <label>
            Nome
            <input value={form.nome} onChange={alterar("nome")} required />
          </label>
          <label>
            E-mail
            <input type="email" value={form.email} onChange={alterar("email")} required />
          </label>
          <label>
            Endereço
            <textarea rows={4} value={form.endereco} onChange={alterar("endereco")} />
          </label>
          <div className="modal-botoes">
            <button type="submit" className="btn btn-amarelo" disabled={salvando}>
              {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar tutor"}
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
