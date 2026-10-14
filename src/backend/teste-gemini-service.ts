import { gerarRespostaGemini } from "./src/services/gemini.service.js";

async function testar() {
  try {
    const resposta = await gerarRespostaGemini(
      "Tenho uma renda mensal de R$ 1.800 e despesas de R$ 1.450. Tive uma despesa inesperada de R$ 800. Me dê uma orientação financeira curta."
    );

    console.log("Resposta do Gemini:");
    console.log(resposta);
  } catch (erro) {
    console.error("Erro:");
    console.error(erro);
  }
}

testar();