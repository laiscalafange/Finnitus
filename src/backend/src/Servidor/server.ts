
// Carrega as variáveis de ambiente do arquivo .env
import "dotenv/config";

// Importa as configurações do ambiente
import { env } from "../config/env.js";

// Importa a aplicação Express
import app from "./app.js";

// Define a porta configurada no ambiente
const PORT = env.PORT;

// Inicia o servidor aceitando conexões externas
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesso local: http://localhost:${PORT}`);
});
