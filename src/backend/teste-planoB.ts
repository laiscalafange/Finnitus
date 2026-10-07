import { analisarPlanoB } from "./src/services/planoB.service.js";

async function testar() {
  try {
    const resultado = await analisarPlanoB({
      renda: 1800,
      despesas: 1450,
      dividas: 200,
      reserva: 300,

      imprevisto: {
        tipo: "DESPESA_INESPERADA",
        valor: 800,
        duracao_meses: 1,
        descricao: "Meu carro quebrou e preciso pagar o conserto.",
      },
    });

    console.log("Resultado do Plano B:");
    console.log(resultado);
  } catch (erro) {
    console.error("Erro:");
    console.error(erro);
  }
}

testar();