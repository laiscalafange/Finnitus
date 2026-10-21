import { ScrollView, Text, View } from "react-native";


import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { Cores } from "../../shared/constants/Cores";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  calcularAtividade,
  NIVEIS_ATIVIDADE,
  type NivelAtividade,
} from "@/features/sumarioData";
import { styles } from "../../styles/atividade";

// Cor e nome de cada nível de atividade (iguais ao protótipo) ficam em
// NIVEIS_ATIVIDADE, os mesmos usados no card do Plano-B e do Dashboard.
const NIVEIS = NIVEIS_ATIVIDADE;

const LETRAS_SEMANA = ["S", "T", "Q", "Q", "S", "S", "D"];

const GRADIENTE_CARD: [string, string] = [
  Cores.fundo.cardAlt,
  Cores.fundo.navBarra,
];

// Dia do calendário (ou null = espaço vazio pra alinhar com o dia da semana)
type Celula = { dia: number; nivel: NivelAtividade } | null;

// Monta as linhas do calendário (semana começa na segunda, como no protótipo).
// Cada dia vem como { data: "AAAA-MM-DD", nivel }.
function montarSemanas(
  dias: { data: string; nivel: NivelAtividade }[]
): Celula[][] {
  if (dias.length === 0) {
    return [];
  }

  const [ano, mes] = dias[0].data.split("-").map(Number);

  // getDay(): 0 = domingo ... 6 = sábado. Converte pra 0 = segunda ... 6 = domingo
  const primeiroDia = (new Date(ano, mes - 1, 1).getDay() + 6) % 7;

  const celulas: Celula[] = [
    ...Array.from({ length: primeiroDia }, () => null),
    ...dias.map((item) => ({
      dia: Number(item.data.split("-")[2]),
      nivel: item.nivel,
    })),
  ];

  // Completa a última semana com espaços vazios
  while (celulas.length % 7 !== 0) {
    celulas.push(null);
  }

  const semanas: Celula[][] = [];

  for (let i = 0; i < celulas.length; i += 7) {
    semanas.push(celulas.slice(i, i + 7));
  }

  return semanas;
}

// Tela "Atividade": aberta ao tocar no card Atividade do Dashboard e do Plano-B.
// Mostra quantas movimentações a pessoa teve em cada dia do mês (gastos e
// entradas do Novo gasto + depósitos e retiradas das Metas).
export default function Atividade() {
  // Gastos, entradas e metas registrados no app (FinanceiroProvider)
  const { transacoes, metas } = useFinanceiro();

  const { mes, ano, dias } = calcularAtividade(transacoes, metas);

  const semanas = montarSemanas(dias);

  // Mês sem nenhuma movimentação
  const semAtividade = dias.every((dia) => dia.nivel === "nenhuma");

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho: seta de voltar, título e mês, igual ao protótipo */}
        <HeaderInterno
          titulo="Atividade"
          subtitulo={`${mes} ${ano}`}
        />

        {/* Conteúdo (logo abaixo do cabeçalho) */}
        <View style={styles.conteudoSobreHeader}>
          {/* Letras dos dias da semana */}
          <View style={styles.linhaSemana}>
            {LETRAS_SEMANA.map((letra, indice) => (
              <Text key={indice} style={styles.letraSemana}>
                {letra}
              </Text>
            ))}
          </View>

          {semAtividade ? (
            <Text style={styles.vazio}>Nenhuma atividade neste mês.</Text>
          ) : null}

          {semanas.map((semana, indiceSemana) => (
            <View key={indiceSemana} style={styles.linhaDias}>
              {semana.map((celula, indiceDia) => {
                if (!celula) {
                  return <View key={indiceDia} style={styles.diaVazio} />;
                }

                const nivel =
                  NIVEIS.find((item) => item.id === celula.nivel) ??
                  NIVEIS[0];

                return (
                  <View
                    key={indiceDia}
                    accessible
                    accessibilityLabel={`Dia ${celula.dia}, atividade ${nivel.rotulo.toLowerCase()}`}
                    style={[styles.dia, { backgroundColor: nivel.cor }]}
                  >
                    <Text
                      style={[
                        styles.diaNumero,
                        {
                          color:
                            nivel.id === "nenhuma"
                              ? Cores.texto.claro
                              : Cores.texto.contraste,
                        },
                      ]}
                    >
                      {celula.dia}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}

          {/* Legenda */}
          <Card gradiente={GRADIENTE_CARD} style={{ marginTop: 8 }}>
            <Text style={styles.tituloLegenda}>Legenda</Text>

            <View style={styles.linhaLegenda}>
              {NIVEIS.map((nivel) => (
                <View key={nivel.id} style={styles.itemLegenda}>
                  <View
                    style={[
                      styles.quadradoLegenda,
                      { backgroundColor: nivel.cor },
                    ]}
                  />
                  <Text style={styles.textoLegenda}>{nivel.rotulo}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}