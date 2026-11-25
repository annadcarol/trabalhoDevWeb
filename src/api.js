// Camada de acesso à API REST (json-server rodando em db.json).
const BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Ela está rodando? (use: npm start)"
    );
  }

  if (response.status === 404) {
    throw new Error("Registro não encontrado (ele pode ter sido excluído). Atualize a lista.");
  }
  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao acessar a API.`);
  }

  if (response.status === 204) return null;
  return response.json();
}

const filtro = (chave, valor) =>
  valor && valor.trim() ? `${chave}=${encodeURIComponent(valor.trim())}` : "";

const query = (...partes) => {
  const q = partes.filter(Boolean).join("&");
  return q ? `?${q}` : "";
};

// ---------- Tutores ----------
export const listarTutores = (nome) =>
  request(`/tutores${query(filtro("nome_like", nome))}`);

const dadosTutor = (tutor) => ({
  nome: tutor.nome.trim(),
  email: tutor.email.trim().toLowerCase(),
  endereco: (tutor.endereco ?? "").trim(),
});

// A API mock não valida e-mail único, então verificamos aqui.
// "ignorarId" permite que o próprio tutor mantenha o e-mail dele na edição.
async function garantirEmailUnico(email, ignorarId = null) {
  const existentes = await request("/tutores");
  const conflito = existentes.some(
    (t) => String(t.id) !== String(ignorarId) && t.email.toLowerCase() === email
  );
  if (conflito) {
    throw new Error(`Já existe um tutor cadastrado com o e-mail: ${email}`);
  }
}

export async function cadastrarTutor(tutor) {
  const dados = dadosTutor(tutor);
  await garantirEmailUnico(dados.email);
  return request("/tutores", { method: "POST", body: JSON.stringify(dados) });
}

// PATCH /tutores/{id}: altera só os campos enviados.
export async function atualizarTutor(id, tutor) {
  const dados = dadosTutor(tutor);
  await garantirEmailUnico(dados.email, id);
  return request(`/tutores/${id}`, { method: "PATCH", body: JSON.stringify(dados) });
}

export async function excluirTutor(id) {
  // A API mock não protege contra exclusão de tutor com pets.
  const pets = await listarPetsDoTutor(id);
  if (pets.length > 0) {
    throw new Error("Não é possível excluir: o tutor possui pets cadastrados.");
  }
  return request(`/tutores/${id}`, { method: "DELETE" });
}

// Filtro simples por chave estrangeira: GET /pets?tutorId=1
export const listarPetsDoTutor = (id) => request(`/pets?tutorId=${id}`);

// ---------- Pets ----------
// O json-server não "expande" relações automaticamente aqui, então
// buscamos os tutores e anexamos o objeto "tutor" em cada pet.
export async function listarPets(nome) {
  const [pets, tutores] = await Promise.all([
    request(`/pets${query(filtro("nome_like", nome))}`),
    request("/tutores"),
  ]);
  return pets.map((pet) => ({
    ...pet,
    tutor: tutores.find((t) => String(t.id) === String(pet.tutorId)) ?? null,
  }));
}

const dadosPet = (pet) => ({
  nome: pet.nome.trim(),
  descricao: pet.descricao.trim(),
  vacinado: Boolean(pet.vacinado),
  tutorId: Number(pet.tutorId),
});

export const cadastrarPet = (pet) =>
  request("/pets", { method: "POST", body: JSON.stringify(dadosPet(pet)) });

// PATCH /pets/{id}: altera só os campos enviados.
export const atualizarPet = (id, pet) =>
  request(`/pets/${id}`, { method: "PATCH", body: JSON.stringify(dadosPet(pet)) });
