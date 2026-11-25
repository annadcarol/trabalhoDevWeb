// Sobe um json-server SÓ para os testes, na porta 3002, usando uma CÓPIA
// do db.json. Assim o teste nunca altera os dados reais do projeto.
import { spawn } from "node:child_process";
import { copyFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

export const PORTA_TESTE = 3002;

export default async function setup() {
  const pasta = mkdtempSync(join(tmpdir(), "petshop-teste-"));
  const dbTeste = join(pasta, "db.json");
  copyFileSync(resolve("db.json"), dbTeste);

  const bin = resolve("node_modules/json-server/lib/cli/bin.js");
  const servidor = spawn(process.execPath, [bin, dbTeste, "--port", String(PORTA_TESTE)], {
    stdio: "ignore",
  });

  // Espera a API responder (até ~15 s).
  const url = `http://localhost:${PORTA_TESTE}/tutores`;
  for (let i = 0; i < 75; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) break;
    } catch {
      /* ainda subindo */
    }
    if (i === 74) {
      servidor.kill();
      throw new Error(`A API de teste não subiu na porta ${PORTA_TESTE}. Ela está ocupada?`);
    }
    await new Promise((ok) => setTimeout(ok, 200));
  }

  return () => {
    servidor.kill();
    rmSync(pasta, { recursive: true, force: true });
  };
}
