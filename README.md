# Pet Shop - Aplicação ReactJS com API REST

**Integrantes:** Anna Carolina Strack Haus e Francisco Galvão Coloda

Aplicação desenvolvida em **ReactJS (Vite)** para cadastro, edição e listagem de tutores e pets, utilizando uma **API REST simulada com json-server**. Os dados são armazenados no arquivo `db.json`.

## 1. Pré-requisitos e execução

- Node.js (versão 18 ou superior).
- npm.

Na pasta do projeto, execute:

```bash
# Instalar as dependências
npm install

# Iniciar a aplicação e a API
npm start
```

A aplicação estará disponível em `http://localhost:5173` e a API em `http://localhost:3001`.

Para iniciar os serviços separadamente:

```bash
npm run api
npm run dev
```

## 2. Funcionalidades

**Tutores**
- Cadastro, edição e listagem.
- Busca por nome.
- Exclusão de tutores sem pets vinculados.
- Visualização dos pets associados.

**Pets**
- Cadastro e edição.
- Listagem e busca por nome.
- Associação a um tutor.
- Identificação do status de vacinação.

**Validações e recursos**
- E-mail único para cada tutor.
- Bloqueio da exclusão de tutores que possuem pets.
- Formulários em pop-ups com opções de salvar e cancelar.
- Atualização das listas após as operações realizadas.

## 3. Testes

Os testes automatizados podem ser executados com:

```bash
npm test
```

A suíte verifica as operações da API, incluindo cadastro, edição, listagem, buscas e validações de tutores e pets.

Os testes utilizam uma API temporária na porta `3002` e uma cópia do `db.json`, preservando os dados originais.

**Resultado esperado:** 14 testes aprovados.

## 4. Estrutura do projeto

```text
├── db.json
├── public/
│   └── favicon.svg
├── src/
│   ├── api.js
│   ├── App.jsx
│   ├── styles.css
│   ├── assets/
│   ├── pages/
│   │   ├── TutoresPage.jsx
│   │   └── PetsPage.jsx
│   └── components/
│       ├── Modal.jsx
│       ├── Mensagem.jsx
│       └── PataIcone.jsx
├── tests/
│   ├── setup-api.js
│   └── api.test.js
└── package.json
```

## 5. Documentação da API

**URL base:** `http://localhost:3001`

A API utiliza JSON como formato de dados e disponibiliza as seguintes rotas:

### Tutores — `/tutores`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/tutores` | Lista todos os tutores |
| GET | `/tutores?nome_like=ana` | Busca por nome |
| GET | `/tutores/{id}` | Busca por ID |
| POST | `/tutores` | Cadastra um tutor |
| PATCH | `/tutores/{id}` | Atualiza um tutor |
| DELETE | `/tutores/{id}` | Exclui um tutor |

### Pets — `/pets`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/pets` | Lista todos os pets |
| GET | `/pets?nome_like=thor` | Busca por nome |
| GET | `/pets?tutorId=1` | Lista pets de um tutor |
| GET | `/pets/{id}` | Busca por ID |
| POST | `/pets` | Cadastra um pet |
| PATCH | `/pets/{id}` | Atualiza um pet |

### Modelos de dados

**Tutor**
- `id`: identificador gerado automaticamente.
- `nome`: nome do tutor.
- `email`: e-mail único.
- `endereco`: endereço do tutor.

**Pet**
- `id`: identificador gerado automaticamente.
- `nome`: nome do pet (até 80 caracteres).
- `descricao`: descrição do pet.
- `vacinado`: indica se o pet está vacinado (boolean).
- `tutorId`: identificador do tutor associado.

**Relacionamento:** um tutor pode possuir vários pets (1:N).

**Observação:** as validações de e-mail único e bloqueio de exclusão de tutores com pets são implementadas na camada `src/api.js`, pois não são regras nativas do json-server.

## 6. Problemas comuns

- **Não foi possível conectar à API:** verifique se os serviços estão rodando com `npm start`.
- **Porta em uso:** verifique se as portas `3001`, `3002` ou `5173` estão sendo utilizadas por outro processo.
