// server.ts importa esse app e chama .listen(). 

import "dotenv/config";
import { env } from "../config/env.js";
import app from "./app.js"; // não trocar para app.ts, pois o NodeNext não permite importar arquivos TypeScript diretamente.

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});