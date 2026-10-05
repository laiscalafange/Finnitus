import {
  listarCalendariosDoDispositivo,
} from "../../features/calendar/services/deviceCalendarService";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";

import {
  Calendar,
  LocaleConfig,
} from "react-native-calendars";

import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import {
  listarItensCalendario,
  type ItemCalendario,
} from "../../features/calendar/services/calendarService";

import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { GRADIENTS } from "../../shared/constants/Gradientes";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";
import { Rotas } from "../../shared/constants/Rotas";

import { styles } from "../../styles/calendariostyle";

// Seletor de mês/ano e a função que gera "AAAA-MM-DD" na data local (a mesma
// usada no calendário da semana de Metas)
import { ModalMesAno } from "../../features/calendar/components/ModalMesAno";
import { chaveDia } from "../../shared/components/CalendarioSemana/CalendarioSemana";

import coroaIcon from "../../../assets/icones/coroa.png";
import sinoIcon from "../../../assets/icones/sino.png";

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

type SegmentoGauge = {
  cor: string;
  pct: number;
};

type GaugeCircularProps = {
  tamanho?: number;
  label: string;
  sublabel: string;
  segmentos: SegmentoGauge[];
};

type MarcacaoData = {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
};

type MarcacoesCalendario = Record<string, MarcacaoData>;


// ─────────────────────────────────────────────
// LOCALE
// ─────────────────────────────────────────────

LocaleConfig.locales["pt"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],

  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],

  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],

  dayNamesShort: [
    "seg",
    "ter",
    "qua",
    "qui",
    "sex",
    "sáb",
    "dom",
  ],

  today: "Hoje",
};

LocaleConfig.defaultLocale = "pt";


// ─────────────────────────────────────────────
// DATAS MOCK
// ─────────────────────────────────────────────

const markedDatesBase: MarcacoesCalendario = {
  "2026-02-18": {
    marked: true,
    dotColor: Cores.estado.perigo,
  },

  "2026-02-21": {
    marked: true,
    dotColor: Cores.estado.perigo,
  },
};

function obterDataCalendario(
  item: ItemCalendario
): string {
  if (item.tipo === "EVENTO") {
    const data = new Date(item.data);

    const ano = data.getFullYear();

    const mes = String(
      data.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
      data.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  return item.data.slice(0, 10);
}

// ─────────────────────────────────────────────
// GAUGE
// ─────────────────────────────────────────────

function GaugeCircular({
  tamanho = 100,
  label,
  sublabel,
  segmentos,
}: GaugeCircularProps) {
  const r = (tamanho - 25) / 2;
  const cx = tamanho / 2;
  const cy = tamanho / 2;
  const circ = 2 * Math.PI * r;

  return (
    <View
      style={{
        width: tamanho,
        height: tamanho,
      }}
    >
      <Svg
        width={tamanho}
        height={tamanho}
        style={{
          transform: [{ rotate: "-90deg" }],
        }}
      >
        {segmentos.map((seg, i) => {
          const len = (seg.pct / 100) * circ;

          const offset = segmentos
            .slice(0, i)
            .reduce(
              (acc, s) =>
                acc + (s.pct / 100) * circ,
              0
            );

          return (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.cor}
              strokeWidth={15}
              strokeDasharray={`${len} ${circ - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
        })}
      </Svg>

      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.gaugeLabel}>
          {label}
        </Text>

        <Text style={styles.gaugeSublabel}>
          {sublabel}
        </Text>
      </View>
    </View>
  );
}


// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────

export default function Calendario() {
  const router = useRouter();

  const [
    dataSelecionada,
    setDataSelecionada,
  ] = useState<string | null>(null);

  // Mês que o calendário mostra. Começa no mês de hoje
  const [
  mesAtual,
  setMesAtual,
] = useState<string>(() => {
    const hoje = new Date();

    return `${hoje.getFullYear()}-${String(
      hoje.getMonth() + 1
    ).padStart(2, "0")}-01`;
  });

  // Card "Escolher mês e ano" aberto?
  const [
    modalMesAno,
    setModalMesAno,
  ] = useState<boolean>(false);

  // A seta embaixo do header esconde e mostra o calendário
  const [
    calendarioAberto,
    setCalendarioAberto,
  ] = useState<boolean>(true);

  const [
    itensCalendario,
    setItensCalendario,
  ] = useState<ItemCalendario[]>([]);

  const [
    carregandoCalendario,
    setCarregandoCalendario,
  ] = useState<boolean>(false);


  // ─────────────────────────────────────────
  // INFORMAÇÕES DO MÊS
  // ─────────────────────────────────────────

  const dataMes = new Date(
    `${mesAtual}T12:00:00`
  );

  const anoAtual = dataMes.getFullYear();

  // Dia de hoje (AAAA-MM-DD): fica em roxo claro no calendário
  const hoje = chaveDia(new Date());


  // ─────────────────────────────────────────
  // MARCAÇÕES DO CALENDÁRIO
  // ─────────────────────────────────────────

 const markedDates: MarcacoesCalendario = {};

itensCalendario.forEach((item) => {
  const dataItem =
    obterDataCalendario(item);

  markedDates[dataItem] = {
    marked: true,
    dotColor: Cores.estado.perigo,
  };
});

if (dataSelecionada) {
  markedDates[dataSelecionada] = {
    ...markedDates[dataSelecionada],

    selected: true,
    selectedColor:
      Cores.destaque.limao,
  };
}


  // ─────────────────────────────────────────
  // CARREGAR DADOS REAIS DO BACKEND
  // ─────────────────────────────────────────

  useEffect(() => {
  async function testarCalendarioDispositivo() {
    const calendarios =
      await listarCalendariosDoDispositivo();

    console.log(
      "TESTE CALENDÁRIO DO CELULAR:",
      calendarios
    );
  }

  testarCalendarioDispositivo();
}, []);

  useEffect(() => {
    async function carregarCalendario() {
      try {
        setCarregandoCalendario(true);

        const [ano, mes] = mesAtual
          .split("-")
          .map(Number);

        const inicio =
          `${ano}-${String(mes).padStart(
            2,
            "0"
          )}-01`;

        const proximoMes =
          mes === 12
            ? `${ano + 1}-01-01`
            : `${ano}-${String(
                mes + 1
              ).padStart(2, "0")}-01`;

        const itens =
          await listarItensCalendario(
            inicio,
            proximoMes
          );

        setItensCalendario(itens);

        console.log(
          "Itens reais do calendário:",
          itens
        );
      } catch (error) {
        console.error(
          "Erro ao carregar calendário:",
          error
        );
      } finally {
        setCarregandoCalendario(false);
      }
    }

    carregarCalendario();
  }, [mesAtual]);

  const eventosDoDia =
  itensCalendario.filter((item) => {
    return (
      item.tipo === "EVENTO" &&
      dataSelecionada !== null &&
      obterDataCalendario(item) ===
        dataSelecionada
    );
  });

  const movimentacoesDoDia =
  itensCalendario.filter((item) => {
    return (
      (item.tipo === "DESPESA" ||
        item.tipo === "RECEITA") &&
      dataSelecionada !== null &&
      obterDataCalendario(item) ===
        dataSelecionada
    );
  });

  const compromissosDoDia =
  itensCalendario.filter((item) => {
    return (
      (item.tipo === "META" ||
        item.tipo === "DIVIDA") &&
      dataSelecionada !== null &&
      obterDataCalendario(item) ===
        dataSelecionada
    );
  });

  // ─────────────────────────────────────────
  // TELA
  // ─────────────────────────────────────────

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <ScrollView style={styles.scroll}>

        {/* ───────── HEADER ───────── */}

        <LinearGradient
          colors={GRADIENTS.header.colors}
          start={GRADIENTS.header.start}
          end={GRADIENTS.header.end}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <View>
              <Text
                style={[
                  styles.headerAno,
                  {
                    fontFamily:
                      FONTS.raleway.extrabold,

                    fontSize: 27,
                  },
                ]}
              >
                Plano do mês
              </Text>

              {/* Tocar no ano ou no mês abre o card pra escolher outro */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setModalMesAno(true)
                }
                accessibilityRole="button"
                accessibilityLabel="Escolher mês e ano"
              >
                <Text style={styles.headerAno}>
                  {anoAtual}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.headerIcones}>
              <TouchableOpacity
                onPress={() =>
                  router.push(Rotas.premium)
                }
              >
                <Image
                  source={coroaIcon}
                  style={styles.headerIcone}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.push(
                    Rotas.notificacao
                  )
                }
              >
                <Image
                  source={sinoIcon}
                  style={styles.headerIcone}
                />
              </TouchableOpacity>
            </View>
          </View>


          {/* ───────── CALENDÁRIO ───────── */}

          {calendarioAberto && (
            <Calendar
              current={mesAtual}
              // O Calendar só troca de mês sozinho quando o initialDate muda
              // (o "current" é usado só na primeira vez). Assim, escolher um
              // mês no card atualiza o calendário
              initialDate={mesAtual}
              markedDates={markedDates}
              enableSwipeMonths
              hideExtraDays={false}
              firstDay={1}
              style={{
                marginTop: 10,
              }}
              onMonthChange={(month) => {
                setMesAtual(
                  month.dateString
                );
              }}
              // Título do calendário também abre o card de mês/ano
              renderHeader={(month) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() =>
                    setModalMesAno(true)
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Escolher mês e ano"
                >
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontFamily:
                        FONTS.raleway.extrabold,

                      fontSize: 26,

                      color:
                        Cores.destaque.limao,

                      margin: 10,
                    }}
                  >
                    {month
                      ? `${
                          LocaleConfig.locales["pt"]
                            .monthNames[
                            month.getMonth()
                          ]
                        } ${month.getFullYear()}`
                      : ""}
                  </Text>
                </TouchableOpacity>
              )}
              renderArrow={(direction) => (
                <Text
                  style={{
                    color:
                      Cores.destaque.limao,

                    fontSize: 20,
                  }}
                >
                  {direction === "left"
                    ? "‹"
                    : "›"}
                </Text>
              )}
              dayComponent={({
                date,
                state,
                marking,
              }) => {
                const isSelected =
                  date?.dateString ===
                  dataSelecionada;

                const isHoje =
                  date?.dateString === hoje;

                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      if (date?.dateString) {
                        setDataSelecionada(
                          date.dateString
                        );
                      }
                    }}
                    style={{
                      width: 42,
                      height: 42,
                      margin: 2,
                      borderRadius: 100,

                      justifyContent:
                        "center",

                      alignItems: "center",

                      backgroundColor:
                        isSelected
                          ? Cores.destaque
                              .limao
                          : isHoje
                            ? Cores.fundo.navBarra
                            : "#53269D",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily:
                          FONTS.raleway.bold,

                        fontSize: 13,

                        color: isSelected
                          ? Cores.roxo.escuro
                          : isHoje
                            ? Cores.texto
                                .claro
                            : state ===
                              "disabled"
                            ? "#36166C"
                            : "#A966FBF8",
                      }}
                    >
                      {date?.day}
                    </Text>

                    {marking?.marked &&
                      !isSelected && (
                        <View
                          style={{
                            width: 5,
                            height: 5,

                            borderRadius: 3,

                            backgroundColor:
                              marking.dotColor ||
                              Cores.estado
                                .perigo,

                            marginTop: 3,
                          }}
                        />
                      )}
                  </TouchableOpacity>
                );
              }}
              theme={{
                calendarBackground:
                  "transparent",

                textSectionTitleColor:
                  "#e3d9ff",

                monthTextColor:
                  Cores.destaque.limao,

                textMonthFontFamily:
                  FONTS.raleway.extrabold,

                textMonthFontSize: 18,

                textDayHeaderFontFamily:
                  FONTS.quicksand.regular,

                textDayHeaderFontSize: 14,

                arrowColor:
                  Cores.destaque.limao,
              }}
            />
          )}
        </LinearGradient>


        {/* ───────── SETA ───────── */}

        <View style={styles.setaContainer}>
          <TouchableOpacity
            style={styles.setaCirculo}
            activeOpacity={0.8}
            onPress={() =>
              setCalendarioAberto(
                (atual) => !atual
              )
            }
            accessibilityRole="button"
            accessibilityLabel={
              calendarioAberto
                ? "Esconder calendário"
                : "Mostrar calendário"
            }
          >
            <Text style={styles.setaTexto}>
              {calendarioAberto ? "⌃" : "⌄"}
            </Text>
          </TouchableOpacity>
        </View>


        {/* ───────── CONTEÚDO ───────── */}

        <View style={styles.conteudo}>

          <Text style={styles.secaoTitulo}>
            Visão geral
          </Text>


          {/* ───────── EVENTOS ───────── */}

          <LinearGradient
            colors={[
              "#3c1e75",
              "#30096e",
            ]}
            style={styles.card}
          >
            <View style={styles.eventoHeader}>
              <Text
                style={styles.eventoTitulo}
              >
                Eventos
              </Text>

              <Text
                style={styles.eventoData}
              >
                {dataSelecionada
  ? dataSelecionada
      .split("-")
      .reverse()
      .join("/")
  : "Selecione uma data"}
              </Text>
            </View>

            {eventosDoDia.length > 0 ? (
  eventosDoDia.map((evento) => {
    const dataHora = new Date(
      evento.horarioInicio ??
        evento.data
    );

    const hora =
      dataHora.toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    return (
      <View
        key={`${evento.tipo}-${evento.id}`}
        style={styles.eventoItem}
      >
        <Text
          style={styles.eventoNome}
        >
          • {evento.titulo}
        </Text>

        {evento.descricao && (
          <Text
            style={
              styles.eventoDescricao
            }
          >
            • {evento.descricao}
          </Text>
        )}

        {!evento.diaInteiro && (
          <Text
            style={styles.eventoHora}
          >
            {hora}
          </Text>
        )}
      </View>
    );
  })
) : (
  <Text
    style={styles.eventoDescricao}
  >
    {dataSelecionada
      ? "Nenhum evento nesta data."
      : "Selecione uma data."}
  </Text>
)}
          </LinearGradient>


          {/* ───────── GASTOS DO DIA ───────── */}

          <Text style={styles.secaoTitulo}>
            Movimentações do dia
            </Text>

          {movimentacoesDoDia.length > 0 ? (
  movimentacoesDoDia.map((item) => {
    const ehReceita =
      item.tipo === "RECEITA";

    return (
      <LinearGradient
        key={`${item.tipo}-${item.id}`}
        colors={[
          "#30096e",
          "#30096e",
        ]}
        style={styles.gastoCard}
      >
        <View
          style={[
            styles.gastoIconeContainer,
            {
              backgroundColor: "#5f33a77a",
              borderWidth: 1,
              borderColor: "#7F3BED",
              borderRadius: 100,
            },
          ]}
        >
          <Text
            style={{
              color: Cores.base.branco,
              fontSize: 18,
            }}
          >
            {ehReceita ? "+" : "−"}
          </Text>
        </View>

        <View style={styles.gastoInfo}>
          <Text style={styles.gastoNome}>
            {item.titulo}
          </Text>

          <Text style={styles.gastoHora}>
            {ehReceita
              ? "Receita"
              : "Despesa"}
          </Text>
        </View>

        <Text
          style={[
            styles.gastoValor,
            {
              color: ehReceita
                ? Cores.destaque.limao
                : Cores.base.branco,
            },
          ]}
        >
          {ehReceita ? "+ " : "- "}
          R${" "}
          {(item.valor ?? 0)
            .toFixed(2)
            .replace(".", ",")}
        </Text>
      </LinearGradient>
    );
  })
) : (
  <Text style={styles.eventoDescricao}>
    {dataSelecionada
      ? "Nenhuma movimentação nesta data."
      : "Selecione uma data."}
  </Text>
)}

<Text style={styles.secaoTitulo}>
  Compromissos financeiros
</Text>

{compromissosDoDia.length > 0 ? (
  compromissosDoDia.map((item) => {
    const ehMeta = item.tipo === "META";

    return (
      <LinearGradient
        key={`${item.tipo}-${item.id}`}
        colors={[
          "#30096e",
          "#30096e",
        ]}
        style={styles.gastoCard}
      >
        <View
          style={[
            styles.gastoIconeContainer,
            {
              backgroundColor: "#5f33a77a",
              borderWidth: 1,
              borderColor: "#7F3BED",
              borderRadius: 100,
            },
          ]}
        >
          <Text
            style={{
              color: Cores.base.branco,
              fontSize: 16,
            }}
          >
            {ehMeta ? "M" : "D"}
          </Text>
        </View>

        <View style={styles.gastoInfo}>
          <Text style={styles.gastoNome}>
            {item.titulo}
          </Text>

          <Text style={styles.gastoHora}>
            {ehMeta
              ? "Prazo da meta"
              : "Vencimento da dívida"}
          </Text>
        </View>

        <Text style={styles.gastoValor}>
          R${" "}
          {(item.valor ?? 0)
            .toFixed(2)
            .replace(".", ",")}
        </Text>
      </LinearGradient>
    );
  })
) : (
  <Text style={styles.eventoDescricao}>
    {dataSelecionada
      ? "Nenhum compromisso financeiro nesta data."
      : "Selecione uma data."}
  </Text>
)}


          {/* ───────── GASTOS DO MÊS ───────── */}

          <Text style={styles.secaoTitulo}>
            Gastos do mês
          </Text>

          <LinearGradient
            colors={[
              "#34176b",
              "#30096e",
            ]}
            style={styles.card}
          >
            <View
              style={styles.gastosMesCorpo}
            >
              <GaugeCircular
                tamanho={140}
                label="R$100"
                sublabel="Restante"
                segmentos={[
                  {
                    cor:
                      Cores.destaque
                        .limao,

                    pct: 40,
                  },

                  {
                    cor: "#FF8800",
                    pct: 30,
                  },

                  {
                    cor:
                      Cores.roxo.claro,

                    pct: 30,
                  },
                ]}
              />

              <View
                style={styles.estatsList}
              >
                {[
                  {
                    label:
                      "Renda da\núltima semana",

                    valor: "↓ 4,6%",

                    cor:
                      Cores.destaque
                        .limao,
                  },

                  {
                    label:
                      "Gastos da\núltima semana",

                    valor: "↑ 19%",

                    cor: "#FF8800",
                  },

                  {
                    label:
                      "Economias da\núltima semana",

                    valor: "↓ 19%",

                    cor:
                      Cores.roxo.claro,
                  },
                ].map((item) => (
                  <View
                    key={item.label}
                    style={
                      styles.estatsItem
                    }
                  >
                    <Text
                      style={
                        styles.estatsLabel
                      }
                    >
                      {item.label}
                    </Text>

                    <Text
                      style={[
                        styles.estatsValor,
                        {
                          color:
                            item.cor,
                        },
                      ]}
                    >
                      {item.valor}
                    </Text>
                  </View>
                ))}
              </View>
            </View>


            {/* ───────── LEGENDA ───────── */}

            <View style={styles.legenda}>
              {[
                {
                  cor:
                    Cores.destaque
                      .limao,

                  label: "Renda",
                },

                {
                  cor: "#FF8800",

                  label: "Gastos",
                },

                {
                  cor:
                    Cores.roxo.claro,

                  label: "Economias",
                },
              ].map((l) => (
                <View
                  key={l.label}
                  style={
                    styles.legendaItem
                  }
                >
                  <View
                    style={[
                      styles.legendaPonto,
                      {
                        backgroundColor:
                          l.cor,
                      },
                    ]}
                  />

                  <Text
                    style={
                      styles.legendaTexto
                    }
                  >
                    {l.label}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>

        </View>
      </ScrollView>

      {/* Escolher mês e ano do calendário */}
      <ModalMesAno
        visible={modalMesAno}
        mes={dataMes.getMonth()}
        ano={anoAtual}
        nomesMeses={
          LocaleConfig.locales["pt"]
            .monthNamesShort
        }
        aoFechar={() =>
          setModalMesAno(false)
        }
        aoConfirmar={(mes, ano) => {
          // Sempre dia 01, pra nunca cair num dia que não existe no mês
          setMesAtual(
            `${ano}-${String(
              mes + 1
            ).padStart(2, "0")}-01`
          );

          setModalMesAno(false);
        }}
      />
    </View>
  );
}