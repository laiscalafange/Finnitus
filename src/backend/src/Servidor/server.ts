// server.ts importa esse app e chama .listen(). 

import "dotenv/config";
import app from "./app.js"; // não trocar para app.ts, pois o NodeNext não permite importar arquivos TypeScript diretamente.

const PORT = process.env["PORT"] ? Number(process.env["PORT"]) : 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});