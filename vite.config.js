import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  test: {
    // npm test: sobe um json-server de teste (porta 3002) com cópia do db.json
    globalSetup: "./tests/setup-api.js",
    env: { VITE_API_URL: "http://localhost:3002" },
    environment: "node",
    fileParallelism: false,
  },
});
