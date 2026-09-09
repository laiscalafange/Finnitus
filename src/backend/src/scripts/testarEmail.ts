import "dotenv/config";
import { sendEmail } from "../services/emailService.js";

async function main() {
  await sendEmail({
    to: "laiscalafange@gmail.com",
    subject: "Teste Finnitus",
    html: "<p>Funcionou! 🎉</p>",
  });
  console.log("E-mail enviado com sucesso!");
}

main().catch((err) => {
  console.error("Erro ao enviar e-mail:", err);
});