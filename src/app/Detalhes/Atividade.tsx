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

const NIVEIS = NIVEIS_ATIVIDADE;

const LETRAS_SEMANA = ["S", "T", "Q", "Q", "S", "S", "D"];

const GRADIENTE_CARD: [string, string] = [
  "rgba(49, 26, 87, 0.90)",
  "rgba(42, 23, 72, 0.90)",
];

type Celula = {
  dia: number;
  nivel: NivelAtividade;
} | null;

function montarSemanas(
  dias: { data: string; nivel: NivelAtividade }[]
): Celula[][] {
  if (dias.length === 0) {
    return [];
  }

  const [ano, mes] = dias[0].data.split("-").map(Number);

  const primeiroDia =
    (new Date(ano, mes - 1, 1).getDay() + 6) % 7;

  const celulas: Celula[] = [
    ...Array.from(
      { length: primeiroDia },
      () => null
    ),

    ...dias.map((item) => ({
      dia: Number(item.data.split("-")[2]),
      nivel: item.nivel,
    })),
  ];

  while (celulas.length % 7 !== 0) {
    celulas.push(null);
  }

  const semanas: Celula[][] = [];

  for (let i = 0; i < celulas.length; i += 7) {
    semanas.push(celulas.slice(i, i + 7));
  }

  return semanas;
}

export default function Atividade() {
  const { transacoes, metas } = useFinanceiro();

  const { mes, ano, dias } = calcularAtividade(
    transacoes,
    metas
  );

  const semanas = montarSemanas(dias);

  const semAtividade = dias.every(
    (dia) => dia.nivel === "nenhuma"
  );

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* CABEÇALHO */}

        <HeaderInterno
          titulo="Atividade"
          subtitulo={`${mes} ${ano}`}
        />

        <View style={styles.conteudoSobreHeader}>

          {/* CALENDÁRIO */}

          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.cardCalendario}
          >
            <Text style={styles.tituloCalendario}>
              Atividade mensal
            </Text>

            <Text style={styles.subtituloCalendario}>
              Acompanhe suas movimentações financeiras
            </Text>

            <View style={styles.calendarioContainer}>

              {/* DIAS DA SEMANA */}

              <View style={styles.linhaSemana}>
                {LETRAS_SEMANA.map((letra, indice) => (
                  <Text
                    key={indice}
                    style={styles.letraSemana}
                  >
                    {letra}
                  </Text>
                ))}
              </View>

              {semAtividade ? (
                <Text style={styles.vazio}>
                  Nenhuma atividade neste mês.
                </Text>
              ) : null}

              {/* DIAS DO MÊS */}

              {semanas.map((semana, indiceSemana) => (
                <View
                  key={indiceSemana}
                  style={styles.linhaDias}
                >
                  {semana.map((celula, indiceDia) => {
                    if (!celula) {
                      return (
                        <View
                          key={indiceDia}
                          style={styles.diaVazio}
                        />
                      );
                    }

                    const nivel =
                      NIVEIS.find(
                        (item) => item.id === celula.nivel
                      ) ?? NIVEIS[0];

                    return (
                      <View
                        key={indiceDia}
                        accessible
                        accessibilityLabel={
                          `Dia ${celula.dia}, atividade ${nivel.rotulo.toLowerCase()}`
                        }
                        style={[
                          styles.dia,
                          {
                            backgroundColor: nivel.cor,
                          },
                        ]}
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
            </View>
          </Card>

          {/* LEGENDA */}

          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.cardLegenda}
          >
            <Text style={styles.tituloLegenda}>
              Níveis de atividade
            </Text>

            <Text style={styles.subtituloLegenda}>
              Intensidade das movimentações do dia
            </Text>

            <View style={styles.linhaLegenda}>
              {NIVEIS.map((nivel) => (
                <View
                  key={nivel.id}
                  style={styles.itemLegenda}
                >
                  <View
                    style={[
                      styles.quadradoLegenda,
                      {
                        backgroundColor: nivel.cor,
                      },
                    ]}
                  />

                  <Text style={styles.textoLegenda}>
                    {nivel.rotulo}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

        </View>
      </ScrollView>
    </View>
  );
}