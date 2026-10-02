import { ScrollView, Text, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Cores } from "../../shared/constants/Cores";
import { ATIVIDADE_HEATMAP_MOCK } from "../../shared/components/Mocks";
import { styles } from "../../styles/atividade";

type Nivel = "alta" | "media" | "baixa" | "nenhuma";

// Cor e nome de cada nível de atividade (iguais ao protótipo).
// A ordem daqui é a ordem da legenda.
const NIVEIS: { id: Nivel; rotulo: string; cor: string }[] = [
  { id: "nenhuma", rotulo: "Nenhuma", cor: "#1B1530" },
  { id: "baixa", rotulo: "Baixa", cor: Cores.destaque.limao },
  { id: "alta", rotulo: "Alta", cor: "#FF8800" },
  { id: "media", rotulo: "Média", cor: "#F2E01B" },
];

const LETRAS_SEMANA = ["S", "T", "Q", "Q", "S", "S", "D"];

const GRADIENTE_FUNDO: [string, string, string] = [
  "#160B24",
  "#08070A",
  "#160B24",
];
const GRADIENTE_CARD: [string, string] = [
  Cores.fundo.cardAlt,
  Cores.fundo.navBarra,
];

// Dia do calendário (ou null = espaço vazio pra alinhar com o dia da semana)
type Celula = { dia: number; nivel: Nivel } | null;

// Monta as linhas do calendário (semana começa na segunda, como no protótipo).
// Cada dia vem do mock como { data: "AAAA-MM-DD", nivel }.
function montarSemanas(
  dias: { data: string; nivel: string }[]
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
      nivel: item.nivel as Nivel,
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
export default function Atividade() {
  const { mes, ano, dias } = ATIVIDADE_HEATMAP_MOCK;

  const semanas = montarSemanas(dias);

  return (
    <LinearGradient
      colors={GRADIENTE_FUNDO}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho: seta de voltar, título e mês, igual ao protótipo */}
        <HeaderInterno
          titulo="Atividade"
          subtitulo={`${mes} ${ano}`}
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        {/* Conteúdo (sobe por cima da faixa roxa do header) */}
        <View style={styles.conteudoSobreHeader}>
          {/* Letras dos dias da semana */}
          <View style={styles.linhaSemana}>
            {LETRAS_SEMANA.map((letra, indice) => (
              <Text key={indice} style={styles.letraSemana}>
                {letra}
              </Text>
            ))}
          </View>

          {semanas.length === 0 ? (
            <Text style={styles.vazio}>Nenhuma atividade neste mês.</Text>
          ) : (
            semanas.map((semana, indiceSemana) => (
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
            ))
          )}

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
    </LinearGradient>
  );
}