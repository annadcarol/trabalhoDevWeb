// Teste de integração: usa as MESMAS funções do front (src/api.js)
// contra um json-server de verdade (cópia temporária do db.json).
// Rode com: npm test
import { describe, it, expect } from "vitest";
import {
  listarTutores,
  cadastrarTutor,
  atualizarTutor,
  excluirTutor,
  listarPets,
  cadastrarPet,
  atualizarPet,
} from "../src/api.js";

const API = "http://localhost:3002";

describe("Tutores", () => {
  it("lista os tutores iniciais do db.json", async () => {
    const tutores = await listarTutores();
    expect(tutores.map((t) => t.email)).toEqual(
      expect.arrayContaining(["mariana@petshop.com", "carlos@petshop.com"])
    );
  });

  it("cadastra tutor (POST) e bloqueia e-mail repetido", async () => {
    const novo = await cadastrarTutor({
      nome: "Ana Teste",
      email: "Ana.Teste@Email.com",
      endereco: "Rua A, 1",
    });
    expect(novo.id).toBeDefined();
    expect(novo.email).toBe("ana.teste@email.com"); // normalizado

    await expect(
      cadastrarTutor({ nome: "Outra", email: "ana.teste@email.com", endereco: "" })
    ).rejects.toThrow(/Já existe um tutor/);
  });

  it("PATCH /tutores/{id}: edita mantendo o próprio e-mail", async () => {
    const atualizado = await atualizarTutor(1, {
      nome: "Mariana Souza Lima",
      email: "mariana@petshop.com", // o mesmo e-mail dele: precisa ser aceito
      endereco: "Rua Nova, 99 - Ponta Grossa/PR",
    });
    expect(atualizado).toMatchObject({ id: 1, nome: "Mariana Souza Lima" });
  });

  it("PATCH /tutores/{id}: recusa e-mail de OUTRO tutor", async () => {
    await expect(
      atualizarTutor(1, { nome: "Mariana", email: "carlos@petshop.com", endereco: "" })
    ).rejects.toThrow(/Já existe um tutor/);
  });

  it("PATCH /tutores/{id}: troca para um e-mail livre", async () => {
    const t = await atualizarTutor(2, {
      nome: "Carlos Pereira",
      email: "carlos.novo@petshop.com",
      endereco: "Av. Visconde de Mauá, 450 - Ponta Grossa/PR",
    });
    expect(t.email).toBe("carlos.novo@petshop.com");
  });

  it("a lista reflete a edição (como a tela faz depois de salvar)", async () => {
    const lista = await listarTutores();
    const mariana = lista.find((t) => t.id === 1);
    expect(mariana.nome).toBe("Mariana Souza Lima");
    expect(mariana.endereco).toBe("Rua Nova, 99 - Ponta Grossa/PR");
  });

  it("busca por nome (nome_like)", async () => {
    const r = await listarTutores("lima");
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(1);
  });

  it("não exclui tutor que tem pets", async () => {
    await expect(excluirTutor(1)).rejects.toThrow(/possui pets/);
  });

  it("PATCH em id inexistente dá erro amigável (404)", async () => {
    await expect(
      atualizarTutor(9999, { nome: "X", email: "x@x.com", endereco: "" })
    ).rejects.toThrow(/não encontrado/);
  });
});

describe("Pets", () => {
  it("lista pets com o tutor anexado", async () => {
    const pets = await listarPets();
    const thor = pets.find((p) => p.nome === "Thor");
    expect(thor.tutor?.id).toBe(1);
  });

  it("cadastra pet (POST)", async () => {
    const p = await cadastrarPet({
      nome: "Pipoca",
      descricao: "Hamster, 1 ano.",
      vacinado: false,
      tutorId: "2", // vem do <select> como texto
    });
    expect(p).toMatchObject({ nome: "Pipoca", tutorId: 2, vacinado: false });
  });

  it("PATCH /pets/{id}: edita dados e troca o tutor", async () => {
    const p = await atualizarPet(2, {
      nome: "Mia",
      descricao: "Gata siamesa, 2 anos. Já tomou vacina.",
      vacinado: true,
      tutorId: "2",
    });
    expect(p).toMatchObject({ id: 2, vacinado: true, tutorId: 2 });

    const lista = await listarPets();
    const mia = lista.find((x) => x.id === 2);
    expect(mia.tutor.id).toBe(2);
    expect(mia.descricao).toMatch(/2 anos/);
  });

  it("PATCH parcial direto na API altera só o campo enviado", async () => {
    const r = await fetch(`${API}/pets/3`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vacinado: false }),
    });
    expect(r.status).toBe(200);
    const bidu = await r.json();
    expect(bidu).toMatchObject({ id: 3, nome: "Bidu", vacinado: false, tutorId: 2 });
  });

  it("PATCH /pets/{id} inexistente responde 404", async () => {
    const r = await fetch(`${API}/pets/9999`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "X" }),
    });
    expect(r.status).toBe(404);
  });
});
