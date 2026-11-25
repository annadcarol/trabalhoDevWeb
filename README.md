# Pet Shop - Aplicação ReactJS com API REST

Integrantes: Anna Carolina Strack Haus e Francisco Galvão Coloda

Aplicação em **ReactJS (Vite)** para **cadastro, edição e listagem de tutores e pets**,
consumindo uma **API REST** simulada com **json-server** (Mock API, conforme permitido no enunciado).
Os dados ficam no arquivo `db.json`.

---

## Passo a passo para executar

### 1. Instalar o Node.js (só na primeira vez)

1. Acesse https://nodejs.org e baixe a versão **LTS** (botão verde).
2. Instale com as opções padrão (Avançar, Avançar, Concluir).
3. Abra um terminal novo e confira:

   ```bash
   node -v
   npm -v
   ```

   Os dois comandos devem mostrar um número de versão (Node 18 ou mais novo).

> **Windows:** use o **Prompt de Comando (cmd)** ou o terminal do VS Code.
> Se o PowerShell reclamar de "execução de scripts desabilitada", use o `cmd`
> ou rode `npm.cmd` no lugar de `npm`.

### 2. Abrir a pasta do projeto

1. Extraia o `.zip` (botão direito > **Extrair tudo...**).
2. No terminal, entre na pasta extraída (a que tem o `package.json`):

   ```bash
   cd caminho\para\petshop-react
   ```

   Dica: no VS Code, use **Arquivo > Abrir Pasta...** e depois **Terminal > Novo Terminal**,
   que ele já abre na pasta certa.

### 3. Instalar as dependências (só na primeira vez)

```bash
npm install
```

Isso cria a pasta `node_modules`. Pode demorar um pouco na primeira vez.

### 4. Rodar o programa

```bash
npm start
```

Esse comando sobe **a API (porta 3001)** e **o React (porta 5173)** juntos e abre o
navegador em http://localhost:5173. Para parar, aperte `Ctrl + C` no terminal.

> Se preferir, use dois terminais: `npm run api` em um e `npm run dev` no outro.

---

## Teste antes de entregar

### 1. Teste automatizado (`npm test`)

Com as dependências instaladas, rode:

```bash
npm test
```

O teste sobe **sozinho** uma API de teste na porta **3002** usando uma **cópia temporária**
do `db.json` (os dados reais não são alterados) e testa as funções do front (`src/api.js`)
contra essa API. Não precisa deixar o `npm start` rodando.

Resultado esperado: `Tests  14 passed (14)`.

O que ele verifica:

- listagem e busca de tutores (`nome_like`);
- cadastro de tutor (POST) e bloqueio de e-mail repetido;
- **PATCH /tutores/{id}**: o tutor pode manter o próprio e-mail, não pode usar o e-mail
  de outro tutor e pode trocar para um e-mail livre;
- a lista mostra os dados novos depois de salvar;
- bloqueio de exclusão de tutor que tem pets;
- cadastro de pet (POST) e listagem com o tutor anexado;
- **PATCH /pets/{id}**: edição de dados, troca de tutor e PATCH parcial (só um campo);
- id inexistente responde 404.

### 2. Roteiro manual na tela (2 minutos)

Com `npm start` rodando:

1. **Tutores > Cadastrar tutor**: o pop-up "Novo tutor" abre. Cadastre um tutor e veja ele na lista.
2. Clique em **Editar** em um tutor: o pop-up abre como **"Editar tutor"**, já preenchido e com o botão **Cancelar**.
3. Mude só o nome e salve **mantendo o mesmo e-mail**: deve salvar e a lista atualiza.
4. Edite de novo e coloque o **e-mail de outro tutor**: deve aparecer o erro "Já existe um tutor cadastrado com o e-mail...".
5. Edite, mude algo e clique em **Cancelar**: nada é salvo.
6. **Pets > Editar** em um pet: troque o tutor e marque/desmarque "Vacinado". Salve e confira na lista.
7. Na aba **Tutores**, clique em **Ver pets** do tutor novo do pet e confira se ele aparece lá.
8. Tente **Excluir** um tutor que tem pets: deve aparecer o aviso de bloqueio.

O pop-up também fecha com `Esc`, clicando fora dele ou no `×`.

> Os testes manuais alteram o `db.json`. Para voltar aos dados originais, desfaça as
> alterações no arquivo (ou guarde uma cópia dele antes de testar).

---

## Funcionalidades

- **Tutores:** cadastrar, **editar**, listar, buscar por nome, excluir e ver os pets de cada tutor.
- **Pets:** cadastrar (escolhendo o tutor), **editar**, listar e buscar por nome.
- Formulários abrem em **pop-up (overlay)** pelos botões "Cadastrar tutor" / "Cadastrar pet".
- Botão **Editar** em cada tutor e em cada pet: o pop-up muda para "Editar tutor" /
  "Editar pet", vem preenchido e ganha o botão **Cancelar**.
- Validações: e-mail de tutor único (na edição, o próprio tutor pode manter o dele) e bloqueio
  de exclusão de tutor que possui pets.
- A lista é recarregada da API depois de cada cadastro, edição ou exclusão.

## Estrutura

```
├── db.json                     # "banco de dados" da API mock
├── public/favicon.svg
├── src/
│   ├── api.js                  # chamadas à API (fetch) + regras de negócio
│   ├── App.jsx                 # cabeçalho, abas e rodapé
│   ├── styles.css              # visual (cores, fontes, cards, modal)
│   ├── assets/                 # logo, imagem do topo e fontes
│   ├── pages/TutoresPage.jsx
│   ├── pages/PetsPage.jsx
│   └── components/
│       ├── Modal.jsx           # pop-up dos formulários
│       ├── Mensagem.jsx        # faixa de sucesso/erro
│       └── PataIcone.jsx
├── tests/
│   ├── setup-api.js            # sobe a API de teste (porta 3002)
│   └── api.test.js             # testes (npm test)
└── package.json
```

## Descrição da API

URL base: `http://localhost:3001` (json-server). Formato de dados: JSON.

### Tutores - `/tutores`

| Método | Rota                       | Descrição                              | Resposta  |
|--------|----------------------------|----------------------------------------|-----------|
| GET    | `/tutores`                 | Lista todos os tutores                 | 200       |
| GET    | `/tutores?nome_like=ana`   | Busca tutores pelo nome (contém)       | 200       |
| GET    | `/tutores/{id}`            | Busca um tutor pelo id                 | 200 / 404 |
| POST   | `/tutores`                 | Cadastra um tutor                      | 201       |
| **PATCH** | **`/tutores/{id}`**     | **Atualiza um tutor (só os campos enviados)** | **200 / 404** |
| DELETE | `/tutores/{id}`            | Exclui um tutor                        | 200 / 404 |

Corpo do `POST /tutores`:

```json
{ "nome": "Maria Silva", "email": "maria@email.com", "endereco": "Rua das Flores, 120" }
```

Corpo do `PATCH /tutores/{id}` (exemplo: `PATCH /tutores/1`):

```json
{ "nome": "Mariana Souza Lima", "email": "mariana@petshop.com", "endereco": "Rua Nova, 99" }
```

Resposta `200`: o tutor completo já atualizado.

```json
{ "id": 1, "nome": "Mariana Souza Lima", "email": "mariana@petshop.com", "endereco": "Rua Nova, 99" }
```

Regra: o e-mail continua único. Antes do PATCH, o front verifica se existe **outro** tutor
(id diferente) com o mesmo e-mail; o próprio tutor pode manter o e-mail dele.

### Pets - `/pets`

| Método | Rota                    | Descrição                              | Resposta  |
|--------|-------------------------|----------------------------------------|-----------|
| GET    | `/pets`                 | Lista todos os pets                    | 200       |
| GET    | `/pets?nome_like=thor`  | Busca pets pelo nome (contém)          | 200       |
| GET    | `/pets?tutorId=1`       | Lista os pets de um tutor              | 200       |
| GET    | `/pets/{id}`            | Busca um pet pelo id                   | 200 / 404 |
| POST   | `/pets`                 | Cadastra um pet                        | 201       |
| **PATCH** | **`/pets/{id}`**     | **Atualiza um pet (só os campos enviados)** | **200 / 404** |

Corpo do `POST /pets`:

```json
{ "nome": "Thor", "descricao": "Cachorro golden retriever, 3 anos.", "vacinado": true, "tutorId": 1 }
```

Corpo do `PATCH /pets/{id}` (exemplo: `PATCH /pets/2`, trocando o tutor e a vacina):

```json
{ "nome": "Mia", "descricao": "Gata siamesa, 2 anos.", "vacinado": true, "tutorId": 2 }
```

Também aceita só um campo, por exemplo `{ "vacinado": false }`: os outros ficam como estavam.

### Modelos

**Tutor:** `id` (gerado automaticamente), `nome`, `email` (único, validado no front), `endereco`.

**Pet:** `id` (gerado automaticamente), `nome` (até 80 caracteres), `descricao`,
`vacinado` (boolean), `tutorId` (chave estrangeira para `Tutor.id`; relação 1 tutor : N pets).

> Observação: a API mock não valida e-mail duplicado nem protege a exclusão de tutores com pets;
> essas regras de negócio foram implementadas na camada `src/api.js` do front.

## Problemas comuns

- **"Não foi possível conectar à API"**: a API não está rodando. Use `npm start` (ou `npm run api`).
- **Porta 3001 ou 5173 em uso**: feche outro terminal que esteja rodando o projeto e tente de novo.
- **`npm test` diz que a API de teste não subiu**: a porta 3002 está ocupada; feche o que estiver usando ela.
