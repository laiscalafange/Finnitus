import {
  classificarEventoFinanceiro,
} from "../../features/calendar/utils/classificarEventoFinanceiro";

import {
  Image, ScrollView,Text,TouchableOpacity,View,Modal,TextInput,
} from "react-native";

import {
listarEventosDoDispositivo, type EventoDispositivo,
} from "../../features/calendar/services/deviceCalendarService";

import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { Calendar,
  LocaleConfig,
} from "react-native-calendars";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  listarItensCalendario,
  confirmarEventoFinanceiro,
  type ItemCalendario,
} from "../../features/calendar/services/calendarService";

import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { Cores } from "../../shared/constants/Cores";
import { GRADIENTS } from "../../shared/constants/Gradientes";
import { Rotas } from "../../shared/constants/Rotas";
import { FONTS } from "../../shared/constants/Tipografia";
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
  recarregarCalendario,
  setRecarregarCalendario,
] = useState(0);
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

  eventoEmRevisao,

  setEventoEmRevisao,

] = useState<EventoDispositivo | null>(

  null

);



const [

  tipoRevisao,

  setTipoRevisao,

] = useState<"RECEITA" | "DESPESA">(

  "DESPESA"

);



const [

  valorRevisao,

  setValorRevisao,

] = useState("");



const [

  descricaoRevisao,

  setDescricaoRevisao,

] = useState("");



const [

  dataRevisao,

  setDataRevisao,

] = useState("");

const [
  decisoesEventos,
  setDecisoesEventos,
] = useState<
  Record<
    string,
    "CONFIRMADO" | "NAO_FINANCEIRO"
  >
>({});




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

  eventosDispositivo,

  setEventosDispositivo,

] = useState<EventoDispositivo[]>([]);



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
  const dataItem = obterDataCalendario(item);
  markedDates[dataItem] = {
    marked: true,
    dotColor: Cores.estado.perigo,

  };

});



eventosDispositivo.forEach((evento) => {

  const dataEvento =

    evento.dataInicio.slice(0, 10);



  markedDates[dataEvento] = {

    marked: true,

    dotColor: Cores.destaque.limao,

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

      // 1. BUSCA OS DADOS DO FINNITUS
      const itens =
        await listarItensCalendario(
          inicio,
          proximoMes
        );

      // 2. BUSCA OS EVENTOS DO DISPOSITIVO
      const eventosDoDispositivo =
        await listarEventosDoDispositivo(
          inicio,
          proximoMes
        );

      // 3. DESCOBRE QUAIS EVENTOS EXTERNOS
      // JÁ FORAM IMPORTADOS PARA O FINNITUS
      const idsEventosImportados =
        new Set(
          itens
            .filter(
              (item) =>
                item.tipo === "EVENTO" &&
                item.origem ===
                  "DISPOSITIVO" &&
                item.idEventoExterno
            )
            .map(
              (item) =>
                item.idEventoExterno as string
            )
        );

      // 4. REMOVE DA LISTA EXTERNA
      // OS QUE JÁ ESTÃO NO FINNITUS
      const eventosAindaNaoImportados =
        eventosDoDispositivo.filter(
          (evento) =>
            !idsEventosImportados.has(
              evento.id
            )
        );

      // 5. ATUALIZA OS ESTADOS
      setItensCalendario(itens);

      setEventosDispositivo(
        eventosAindaNaoImportados
      );

      // TESTE DA CLASSIFICAÇÃO
      eventosAindaNaoImportados.forEach(
        (evento) => {
          const classificacao =
            classificarEventoFinanceiro(
              evento.titulo
            );

          console.log(
            "ANÁLISE FINANCEIRA:",
            evento.titulo,
            classificacao
          );
        }
      );

      console.log(
        "Itens reais do calendário:",
        itens
      );

      console.log(
        "Eventos do dispositivo:",
        eventosDoDispositivo
      );

      console.log(
        "Eventos ainda não importados:",
        eventosAindaNaoImportados
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
}, [
  mesAtual,
  recarregarCalendario,
]);

  const eventosDoDia =
  itensCalendario.filter((item) => {
    const eventoImportadoConfirmado =
      item.tipo === "EVENTO" &&
      item.origem === "DISPOSITIVO" &&
      item.statusFinanceiro === "CONFIRMADO";

    return (
      item.tipo === "EVENTO" &&
      !eventoImportadoConfirmado &&
      dataSelecionada !== null &&
      obterDataCalendario(item) ===
        dataSelecionada
    );
  });

const eventosDispositivoDoDia =
  eventosDispositivo.filter(
    (evento) => {
      return (
        dataSelecionada !== null &&
        evento.dataInicio.slice(0, 10) ===
          dataSelecionada
      );
    }
  );

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



  function abrirRevisaoFinanceira(
    evento: EventoDispositivo
  ) {
    const classificacao =
      classificarEventoFinanceiro(
        evento.titulo
      );

    setEventoEmRevisao(evento);

    setTipoRevisao(
      classificacao.tipoProvavel ??
        "DESPESA"
    );

    setValorRevisao(
      classificacao.valorDetectado !==
        undefined
        ? classificacao.valorDetectado
            .toFixed(2)
            .replace(".", ",")
        : ""
    );

    setDescricaoRevisao(
      evento.titulo
    );

    setDataRevisao(
      evento.dataInicio.slice(0, 10)
    );
  }

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



           {eventosDoDia.length > 0 ||

eventosDispositivoDoDia.length > 0 ? (

  <>

    {/* EVENTOS DO FINNITUS */}



    {eventosDoDia.map((evento) => {

      const dataHora = new Date(

        evento.horarioInicio ?? evento.data

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

          <Text style={styles.eventoNome}>

            • {evento.titulo}

          </Text>



          {evento.descricao && (

            <Text

              style={styles.eventoDescricao}

            >

              • {evento.descricao}

            </Text>

          )}



          <Text

            style={styles.eventoDescricao}

          >

            Finnitus

          </Text>



          {!evento.diaInteiro && (

            <Text style={styles.eventoHora}>

              {hora}

            </Text>

          )}

        </View>

      );

    })}



    {/* EVENTOS DO CELULAR */}



    {eventosDispositivoDoDia.map(

      (evento) => {

        const dataHora =

          new Date(evento.dataInicio);



        const hora =

          dataHora.toLocaleTimeString(

            "pt-BR",

            {

              hour: "2-digit",

              minute: "2-digit",

            }

          );

          const classificacao =

  classificarEventoFinanceiro(

    evento.titulo

  );



const ehSuspeito =
  classificacao.status === "SUSPEITO";
        const decisao =
          decisoesEventos[evento.id];
        return (
          <View
            key={evento.id}

            style={styles.eventoItem}
          >

            <Text style={styles.eventoNome}>

              • {evento.titulo}

            </Text>



            <Text

              style={styles.eventoDescricao}

            >

              Calendário do celular

            </Text>



            <Text style={styles.eventoHora}>

              {evento.diaInteiro

                ? "Dia inteiro"

                : hora}

            </Text>

            {ehSuspeito && (
              <View
                style={{
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor:
                    Cores.destaque.limao,
                  backgroundColor:
                    "#231044",
                }}
              >
                <Text
                  style={{
                    color:
                      Cores.destaque.limao,
                    fontFamily:
                      FONTS.raleway.bold,
                    fontSize: 14,
                  }}
                >
                  Possível movimentação financeira
                </Text>

                <Text
                  style={{
                    color:
                      Cores.base.branco,
                    marginTop: 4,
                  }}
                >
                  {classificacao.tipoProvavel ===
                  "DESPESA"
                    ? "Despesa"
                    : classificacao.tipoProvavel ===
                        "RECEITA"
                      ? "Receita"
                      : "Movimentação"}

                  {classificacao.valorDetectado !==
                  undefined
                    ? ` • R$ ${classificacao.valorDetectado
                        .toFixed(2)
                        .replace(".", ",")}`
                    : ""}
                </Text>

                {!decisao && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      marginTop: 12,
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        abrirRevisaoFinanceira(
                          evento
                        )
                      }
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        borderRadius: 8,
                        backgroundColor:
                          Cores.destaque.limao,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            Cores.roxo.escuro,
                          fontFamily:
                            FONTS.raleway.bold,
                        }}
                      >
                        Confirmar
                      </Text>
                    </TouchableOpacity>
<TouchableOpacity
  activeOpacity={0.8}
  onPress={() => {
    setDecisoesEventos(
      (atual) => ({
        ...atual,
        [evento.id]:
          "NAO_FINANCEIRO",
      })
    );
  }}
  style={{
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor:
      Cores.base.branco,
    alignItems: "center",
  }}
>
  <Text
    style={{
      color:
        Cores.base.branco,
      fontFamily:
        FONTS.raleway.bold,
    }}
  >
    Não é financeiro
  </Text>
</TouchableOpacity>

{/* FECHA A LINHA DOS BOTÕES:
    CONFIRMAR / NÃO É FINANCEIRO */}
</View>
)}

{/* ======================================= */}
{/* EVENTO CONFIRMADO COMO FINANCEIRO       */}
{/* ======================================= */}

{decisao === "CONFIRMADO" && (
  <Text
    style={{
      color:
        Cores.destaque.limao,
      marginTop: 10,
      fontFamily:
        FONTS.raleway.bold,
    }}
  >
    ✓ Movimentação confirmada
  </Text>
)}

{/* ======================================= */}
{/* USUÁRIO MARCOU COMO NÃO FINANCEIRO      */}
{/* ======================================= */}

{decisao ===
  "NAO_FINANCEIRO" && (
  <View
    style={{
      marginTop: 10,
    }}
  >
    <Text
      style={{
        color:
          Cores.base.branco,
        marginBottom: 10,
      }}
    >
      Evento marcado como não financeiro.
    </Text>

    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        abrirRevisaoFinanceira(
          evento
        )
      }
      style={{
        paddingVertical: 9,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor:
          Cores.destaque.limao,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color:
            Cores.destaque.limao,
          fontFamily:
            FONTS.raleway.bold,
        }}
      >
        Tornar financeiro
      </Text>
    </TouchableOpacity>
  </View>
)}

{/* ======================================= */}
{/* FECHA O CARD "POSSÍVEL MOVIMENTAÇÃO"    */}
{/* ======================================= */}

</View>
)}

{/* ======================================= */}
{/* EVENTO NÃO DETECTADO COMO FINANCEIRO    */}
{/* ======================================= */}

{!ehSuspeito && !decisao && (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() =>
      abrirRevisaoFinanceira(
        evento
      )
    }
    style={{
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor:
        Cores.destaque.limao,
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color:
          Cores.destaque.limao,
        fontFamily:
          FONTS.raleway.bold,
      }}
    >
      Marcar como financeiro
    </Text>
  </TouchableOpacity>
)}

{/* FECHA O EVENTO DO CELULAR */}

</View>
);

}
)}

</>

) : (

<Text
  style={
    styles.eventoDescricao
  }
>
  {dataSelecionada
    ? "Nenhum evento nesta data."
    : "Selecione uma data."}
</Text>

)}

</LinearGradient>


{/* ───────────────────────────────────── */}
{/* MOVIMENTAÇÕES DO DIA                  */}
{/* ───────────────────────────────────── */}

<Text
  style={styles.secaoTitulo}
>
  Movimentações do dia
</Text>

{movimentacoesDoDia.length > 0 ? (
  movimentacoesDoDia.map(
    (item) => {
      const ehReceita =
        item.tipo ===
        "RECEITA";

      return (
        <LinearGradient
          key={`${item.tipo}-${item.id}`}
          colors={[
            "#30096e",
            "#30096e",
          ]}
          style={
            styles.gastoCard
          }
        >
          <View
            style={[
              styles.gastoIconeContainer,
              {
                backgroundColor:
                  "#5f33a77a",

                borderWidth: 1,

                borderColor:
                  "#7F3BED",

                borderRadius:
                  100,
              },
            ]}
          >
            <Text
              style={{
                color:
                  Cores.base
                    .branco,

                fontSize: 18,
              }}
            >
              {ehReceita
                ? "+"
                : "−"}
            </Text>
          </View>

          <View
            style={
              styles.gastoInfo
            }
          >
            <Text
              style={
                styles.gastoNome
              }
            >
              {item.titulo}
            </Text>

            <Text
              style={
                styles.gastoHora
              }
            >
              {ehReceita
                ? "Receita"
                : "Despesa"}
            </Text>
          </View>

          <Text
            style={[
              styles.gastoValor,
              {
                color:
                  ehReceita
                    ? Cores
                        .destaque
                        .limao
                    : Cores
                        .base
                        .branco,
              },
            ]}
          >
            {ehReceita
              ? "+ "
              : "- "}

            R${" "}

            {(item.valor ?? 0)
              .toFixed(2)
              .replace(
                ".",
                ","
              )}
          </Text>
        </LinearGradient>
      );
    }
  )
) : (
  <Text
    style={
      styles.eventoDescricao
    }
  >
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



      <Modal
        visible={eventoEmRevisao !== null}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setEventoEmRevisao(null)
        }
      >
        <View
          style={{
            flex: 1,
            backgroundColor:
              "rgba(0,0,0,0.75)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#2C1257",
              borderRadius: 18,
              padding: 20,
              borderWidth: 1,
              borderColor:
                Cores.destaque.limao,
            }}
          >
            <Text
              style={{
                color:
                  Cores.destaque.limao,
                fontFamily:
                  FONTS.raleway.bold,
                fontSize: 20,
                marginBottom: 18,
              }}
            >
              Confirmar movimentação
            </Text>

            <Text
              style={{
                color: Cores.base.branco,
                marginBottom: 6,
              }}
            >
              Tipo
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginBottom: 15,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setTipoRevisao(
                    "DESPESA"
                  )
                }
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  alignItems: "center",
                  backgroundColor:
                    tipoRevisao ===
                    "DESPESA"
                      ? Cores.destaque
                          .limao
                      : "#452078",
                }}
              >
                <Text
                  style={{
                    color:
                      tipoRevisao ===
                      "DESPESA"
                        ? Cores.roxo
                            .escuro
                        : Cores.base
                            .branco,
                  }}
                >
                  Despesa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setTipoRevisao(
                    "RECEITA"
                  )
                }
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 8,
                  alignItems: "center",
                  backgroundColor:
                    tipoRevisao ===
                    "RECEITA"
                      ? Cores.destaque
                          .limao
                      : "#452078",
                }}
              >
                <Text
                  style={{
                    color:
                      tipoRevisao ===
                      "RECEITA"
                        ? Cores.roxo
                            .escuro
                        : Cores.base
                            .branco,
                  }}
                >
                  Receita
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                color: Cores.base.branco,
                marginBottom: 6,
              }}
            >
              Valor
            </Text>

            <TextInput
              value={valorRevisao}
              onChangeText={
                setValorRevisao
              }
              placeholder="0,00"
              placeholderTextColor="#9E8CBF"
              keyboardType="decimal-pad"
              style={{
                backgroundColor: "#1D0C39",
                color: Cores.base.branco,
                padding: 12,
                borderRadius: 8,
                marginBottom: 15,
              }}
            />

            <Text
              style={{
                color: Cores.base.branco,
                marginBottom: 6,
              }}
            >
              Descrição
            </Text>

            <TextInput
              value={descricaoRevisao}
              onChangeText={
                setDescricaoRevisao
              }
              style={{
                backgroundColor: "#1D0C39",
                color: Cores.base.branco,
                padding: 12,
                borderRadius: 8,
                marginBottom: 15,
              }}
            />

            <Text
              style={{
                color: Cores.base.branco,
                marginBottom: 6,
              }}
            >
              Data
            </Text>

            <TextInput
              value={dataRevisao}
              onChangeText={
                setDataRevisao
              }
              placeholder="AAAA-MM-DD"
              placeholderTextColor="#9E8CBF"
              style={{
                backgroundColor: "#1D0C39",
                color: Cores.base.branco,
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
              }}
            />

            <TouchableOpacity
  onPress={async () => {
    if (!eventoEmRevisao) {
      return;
    }

    const valorNumerico = Number(
      valorRevisao
        .replace(/\./g, "")
        .replace(",", ".")
    );

    if (
      !valorNumerico ||
      valorNumerico <= 0
    ) {
      console.log(
        "Valor inválido."
      );

      return;
    }

    try {
      const resultado =
        await confirmarEventoFinanceiro({
          idEventoExterno:
            eventoEmRevisao.id,

          tituloEvento:
            eventoEmRevisao.titulo,

          dataInicio:
            eventoEmRevisao.dataInicio,

          dataFim:
            eventoEmRevisao.dataFim,

          diaInteiro:
            eventoEmRevisao.diaInteiro,

          tipoMovimentacao:
            tipoRevisao,

          descricao:
            descricaoRevisao,

          valor:
            valorNumerico,

          data:
            dataRevisao,
        });

      console.log(
        "Movimentação salva:",
        resultado
      );

      setDecisoesEventos(
        (atual) => ({
          ...atual,
          [eventoEmRevisao.id]:
            "CONFIRMADO",
        })
      );

      setEventoEmRevisao(null);

      setRecarregarCalendario(
        (atual) => atual + 1
      );
    } catch (error) {
      console.error(
        "Erro ao salvar movimentação:",
        error
      );
    }
  }}
  style={{
    backgroundColor:
      Cores.destaque.limao,
    padding: 13,
    borderRadius: 9,
    alignItems: "center",
    marginBottom: 10,
  }}
>
  <Text
    style={{
      color:
        Cores.roxo.escuro,
      fontFamily:
        FONTS.raleway.bold,
    }}
  >
    Confirmar movimentação
  </Text>
</TouchableOpacity>

<TouchableOpacity
  onPress={() =>
    setEventoEmRevisao(null)
  }
  style={{
    padding: 10,
    alignItems: "center",
  }}
>
  <Text
    style={{
      color:
        Cores.base.branco,
    }}
  >
    Cancelar
  </Text>
</TouchableOpacity>
          </View>
        </View>
      </Modal>

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