
function dataLocal(valor) {
  if (!valor) return null;

  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? null : new Date(valor);
  }

  if (typeof valor === "string") {
    const match = valor.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
      const data = new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
      );

      return Number.isNaN(data.getTime()) ? null : data;
    }
  }

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

// Ajuste estes campos conforme o formato real do financeiroContext.
function normalizarDespesa(transacao) {
  const tipo = String(
    transacao.tipo ?? transacao.tipo_transacao ?? ""
  ).toUpperCase();

  // Contabilizar somente despesas, nunca receitas.
  if (!["DESPESA", "GASTO", "SAIDA", "SAÍDA"].includes(tipo)) {
    return null;
  }

  const data = dataLocal(
    transacao.data ?? transacao.data_transacao
  );

  const valor = Number(
    transacao.valor ?? transacao.valor_total
  );

  if (!data || !Number.isFinite(valor) || valor < 0) {
    return null;
  }

  return { data, valor };
}

function inicioSemana(data) {
  const inicio = new Date(data);
  const dia = inicio.getDay();

  inicio.setDate(
    inicio.getDate() - ((dia + 6) % 7)
  );

  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

function criarSeries(transacoes, periodo, referencia) {
  const despesas = (Array.isArray(transacoes) ? transacoes : [])
    .map(normalizarDespesa)
    .filter(Boolean);

  const dataReferencia = dataLocal(referencia);

  if (!dataReferencia) {
    return { atual: [], anterior: [], labels: [] };
  }

  if (periodo === "semanal") {
    const inicioAtual = inicioSemana(dataReferencia);
    const inicioAnterior = new Date(inicioAtual);

    inicioAnterior.setDate(inicioAnterior.getDate() - 7);

    const atual = Array(7).fill(0);
    const anterior = Array(7).fill(0);

    for (const despesa of despesas) {
      const diferencaAtual = Math.floor(
        (Date.UTC(
          despesa.data.getFullYear(),
          despesa.data.getMonth(),
          despesa.data.getDate()
        ) - Date.UTC(
          inicioAtual.getFullYear(),
          inicioAtual.getMonth(),
          inicioAtual.getDate()
        )) / 86400000
      );

      if (diferencaAtual >= 0 && diferencaAtual < 7) {
        atual[diferencaAtual] += despesa.valor;
      }

      if (diferencaAtual >= -7 && diferencaAtual < 0) {
        anterior[diferencaAtual + 7] += despesa.valor;
      }
    }

    return {
      atual,
      anterior,
      labels: ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]
    };
  }

  // Mensal: agrupar dias 1-7, 8-14, 15-21, 22-28 e 29-31.
  const atual = Array(5).fill(0);
  const anterior = Array(5).fill(0);

  const inicioMesAtual = new Date(
    dataReferencia.getFullYear(),
    dataReferencia.getMonth(),
    1
  );

  const inicioMesAnterior = new Date(
    dataReferencia.getFullYear(),
    dataReferencia.getMonth() - 1,
    1
  );

  for (const despesa of despesas) {
    const data = despesa.data;
    const grupo = Math.min(
      4,
      Math.floor((data.getDate() - 1) / 7)
    );

    const mesmoMesAtual =
      data.getFullYear() === inicioMesAtual.getFullYear() &&
      data.getMonth() === inicioMesAtual.getMonth();

    const mesmoMesAnterior =
      data.getFullYear() === inicioMesAnterior.getFullYear() &&
      data.getMonth() === inicioMesAnterior.getMonth();

    if (mesmoMesAtual) atual[grupo] += despesa.valor;
    if (mesmoMesAnterior) anterior[grupo] += despesa.valor;
  }

  return {
    atual,
    anterior,
    labels: ["1-7", "8-14", "15-21", "22-28", "29+"]
  };
}

export function calcularEstatisticasDashboard(
  transacoes,
  periodo,
  referencia
) {
  const { atual, anterior, labels } = criarSeries(
    transacoes,
    periodo,
    referencia
  );

  return {
    labels,
    dadosBarras: atual.map((y, i) => ({
      x: i + 1,
      y
    })),
    dadosBarrasPassadas: anterior.map((y, i) => ({
      x: i + 1.15,
      y
    })),
    dadosLinhaVerde: atual.map((y, i) => ({
      x: i + 1,
      y
    })),
    dadosLinha: anterior.map((y, i) => ({
      x: i + 1.15,
      y
    }))
  };
}
