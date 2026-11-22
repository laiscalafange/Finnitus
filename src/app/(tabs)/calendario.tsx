import {
  classificarEventoFinanceiro,
} from "../../features/calendar/utils/classificarEventoFinanceiro";

import {
  Alert, Animated, Easing, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet,
  TouchableOpacity, View, Modal,
} from "react-native";
import { Text, TextInput } from "@/shared/components/Texto";
import { useMoedaVisivel } from "@/features/configuracoesContext";

import {
  listarEventosDoDispositivo,
  type EventoDispositivo,
} from "../../features/calendar/services/deviceCalendarService";

import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { Calendar, LocaleConfig } from "react-native-calendars";

import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  listarItensCalendario,
  confirmarEventoFinanceiro,
  marcarEventoNaoFinanceiro,
  type ItemCalendario,
  atualizarMovimentacaoCalendario,
} from "../../features/calendar/services/calendarService";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
// Mesmos componentes do modal "Alterar foto de perfil" e das telas de cadastro
import { Card } from "../../shared/components/Cards";
import { Cores } from "../../shared/constants/Cores";
import { GRADIENTS } from "../../shared/constants/Gradientes";
import { Rotas } from "../../shared/constants/Rotas";
import { FONTS } from "../../shared/constants/Tipografia";
import { styles } from "../../styles/calendariostyle";

// Máscaras e conversões de valor/data (mesmas das telas do botão "+")
import {
  brParaIso,
  dataValida,
  formatarCentavos,
  isoParaBr,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "../../features/menuMais/utils";

// Seletor de mês/ano e a função que gera "AAAA-MM-DD" na data local (a mesma
// usada no calendário da semana de Metas)

import { ModalMesAno } from "../../features/calendar/components/ModalMesAno";
import { chaveDia } from "../../shared/components/CalendarioSemana/CalendarioSemana";
import coroaIcon from "../../../assets/icones/coroa.png";
import { SinoNotificacoes } from "@/shared/components/SinoNotificacoes";

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

  // IMPORTANTE: a lista precisa começar no DOMINGO (índice 0 = domingo).
  // Quem define o primeiro dia da semana (domingo) é o firstDay={0} do <Calendar>.
  dayNamesShort: [
    "dom",
    "seg",
    "ter",
    "qua",
    "qui",
    "sex",
    "sáb",
  ],

  today: "Hoje",
};

LocaleConfig.defaultLocale = "pt";

// ─────────────────────────────────────────────

// ESTILOS DO CARD "EVENTOS" (Visão geral)
// Mesmo raio e espaçamento dos cards do Dashboard e do Plano B

// ─────────────────────────────────────────────

const estilosEvento = StyleSheet.create({
  // Card "Eventos": mesmo card roxo translúcido do modal de foto de perfil
  cardEvento: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    overflow: "hidden",
  },

  // Cada evento do card: só espaço entre eles (sem a linha roxa embaixo)
  eventoItem: {
    marginTop: 10,
  },

  // "Calendário do celular" à esquerda e "Dia inteiro" / hora à direita,
  // na mesma linha (antes eram duas linhas separadas)
  eventoLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  // Data do card (sem itálico: a fonte do app não tem versão itálica e o
  // Android trocava pela fonte cursiva do sistema)
  eventoData: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 16,
    color: Cores.texto.claro,
  },

  // Caixa "Possível movimentação financeira": mesmo estilo das opções do
  // modal de foto de perfil (translúcida, com borda e cantos arredondados)
  eventoMovimentacao: {
    marginTop: 8,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(72, 34, 135, 0.55)',
    backgroundColor:  'rgba(73, 34, 135, 0.32)',
  },

  eventoMovTitulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.destaque.limao,
  },

  eventoMovDetalhe: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color:Cores.texto.claro,
    marginTop: 4,
  },

  eventoMovConfirmado: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.destaque.limao,
    marginTop: 10,
  },

  eventoMovBotoes: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  // Botão principal: mesmo gradiente roxo + texto limão do <Button>
  eventoBotaoPrimario: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(91, 62, 137, 0.55)',
    overflow: "hidden",
  },

  eventoBotaoPrimarioFundo: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  eventoBotaoPrimarioTexto: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 13,
    color: Cores.destaque.limao,
  },

  // Botão secundário: mesmo visual das opções do modal de foto de perfil
  eventoBotaoSecundario: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor:'rgba(91, 62, 137, 0.55)',
    backgroundColor:'rgba(72, 34, 135, 0.55)',
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  eventoBotaoSecundarioTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.base.branco,
  },

  // "Tornar financeiro" / "Marcar como financeiro": mesmo visual do secundário
  // Botão pequeno, só do tamanho do texto (não ocupa a largura toda)
  eventoBotaoContorno: {
    alignSelf: "flex-start",
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.25)",
    backgroundColor: "rgba(72, 34, 135, 0.55)",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  eventoBotaoContornoTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.base.branco,
  },

  // ── Modal "Confirmar movimentação" (mesmo padrão do ModalFotoPerfil) ──
  // Card flutuando no meio da tela
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalFundo: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  modalCard: {
    maxHeight: "90%",
    borderRadius: 28,
    borderColor: "rgba(168, 79, 255, 0.35)",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    marginBottom: 0,
  },

  modalTitulo: {
    fontFamily: FONTS.raleway.bold,
    color: Cores.base.branco,
    fontSize: 19,
    textAlign: "center",
    marginBottom: 4,
  },

  modalSubtitulo: {
    fontFamily: FONTS.quicksand.regular,
    color: Cores.texto.claro,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 14,
  },

  // Rótulo dos campos do modal (menor que o do <Input> padrão)
  modalRotulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.destaque.limao,
    marginBottom: 6,
  },

  // Alternador Despesa | Receita (versão compacta do <AlternadorTipo>)
  modalTipo: {
    flexDirection: "row",
    padding: 3,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    backgroundColor: "#38205B",
    overflow: "hidden",
  },

  modalTipoIndicador: {
    position: "absolute",
    top: 3,
    bottom: 3,
    left: 3,
    borderRadius: 11,
    backgroundColor: Cores.destaque.limao,
  },

  modalTipoOpcao: {
    flex: 1,
    height: 32,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },

  modalTipoTexto: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  // Texto da opção marcada (roxo escuro sobre o limão)
  modalTipoTextoAtivo: {
    color: Cores.texto.contraste,
  },

  modalCampoBloco: {
    marginBottom: 12,
  },

  modalCampo: {
    height: 46,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    backgroundColor: Cores.fundo.principal,
  },

  modalCampoTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.base.branco,
    paddingVertical: 0,
  },

  // Cancelar e Confirmar lado a lado
  modalBotoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
});

// Campo do modal "Confirmar movimentação": mesmas cores e fontes do <Input>
// padrão, só que mais baixo e com menos espaço entre os campos
function CampoModal({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  maxLength,
  autoCapitalize = "none",
}: {
  label: string;
  value: string;
  onChangeText: (texto: string) => void;
  placeholder?: string;
  keyboardType?: "numeric";
  maxLength?: number;
  autoCapitalize?: "none" | "sentences";
}) {
  return (
    <View style={estilosEvento.modalCampoBloco}>
      <Text style={estilosEvento.modalRotulo} maxFontSizeMultiplier={1.15}>
        {label}
      </Text>

      <View style={estilosEvento.modalCampo}>
        <TextInput
          style={estilosEvento.modalCampoTexto}
          maxFontSizeMultiplier={1.15}
          accessibilityLabel={label}
          placeholder={placeholder}
          placeholderTextColor={Cores.texto.desabilitado}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────

// FUNÇÃO AUXILIAR DE DATA

// ─────────────────────────────────────────────

function obterDataCalendario(item: ItemCalendario): string {
  // O backend serializa as datas para ISO (AAAA-MM-DDTHH:mm:ss.sssZ).
  // Usamos o dia gravado para evitar deslocar eventos à véspera
  // quando o navegador está no fuso horário de Brasília.
  if (item.tipo === "EVENTO") {
    // Eventos com horário são instantes UTC. Exiba o dia local do usuário.
    return chaveDia(new Date(item.horarioInicio ?? item.data));
  }
  // Valores financeiros de @db.Date mantêm a data civil.
  return item.data.slice(0, 10);
}

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

// COMPONENTE PRINCIPAL

// ─────────────────────────────────────────────

export default function Calendario() {
  const router = useRouter();
  const formatarValorCalendario = useMoedaVisivel();

  // Edição de receitas e despesas já cadastradas (não interfere no modal
  // existente que confirma eventos importados do calendário do celular).
  const [movimentacaoEmEdicao, setMovimentacaoEmEdicao] = useState<ItemCalendario | null>(null);
  const [descricaoEdicao, setDescricaoEdicao] = useState("");
  const [valorEdicao, setValorEdicao] = useState("");
  const [dataEdicao, setDataEdicao] = useState("");
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [
  recarregarCalendario,
  setRecarregarCalendario,
] = useState(0);
useFocusEffect(useCallback(() => {
  setRecarregarCalendario(valor => valor + 1);
}, []));
const [

    dataSelecionada,
    setDataSelecionada,
  ] = useState<string | null>(() => chaveDia(new Date()));

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

  const deslocamentoTipo = useRef(new Animated.Value(0)).current;
  const [larguraAlternador, setLarguraAlternador] = useState(0);

  useEffect(() => {
    Animated.timing(deslocamentoTipo, {
      toValue: tipoRevisao === "RECEITA" ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [tipoRevisao, deslocamentoTipo]);

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
  let ativo = true;
  // Evita deixar eventos de outro mês na tela durante o carregamento.
  setItensCalendario([]);
  setEventosDispositivo([]);
  setDecisoesEventos({});

  async function carregarCalendario() {
    try {


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

      // 3. DESCOBRE O STATUS DOS EVENTOS
// DO DISPOSITIVO JÁ SALVOS NO FINNITUS

const statusEventosDispositivo =
  new Map<string, string>();

itens.forEach((item) => {
  if (
    item.tipo === "EVENTO" &&
    item.origem ===
      "DISPOSITIVO" &&
    item.idEventoExterno
  ) {
    statusEventosDispositivo.set(
      item.idEventoExterno,
      item.statusFinanceiro ??
        "NAO_ANALISADO"
    );
  }
});

// 4. EVENTOS CONFIRMADOS COMO RECEITA/DESPESA
// NÃO PRECISAM MAIS APARECER COMO EVENTO EXTERNO.
//
// EVENTOS MARCADOS COMO NÃO FINANCEIRO
// CONTINUAM APARECENDO NORMALMENTE.

const eventosAindaVisiveis =
  eventosDoDispositivo.filter(
    (evento) =>
      statusEventosDispositivo.get(
        evento.id
      ) !== "CONFIRMADO"
  );

// 5. RECUPERA AS DECISÕES SALVAS NO BANCO

const decisoesPersistidas: Record<
  string,
  "CONFIRMADO" | "NAO_FINANCEIRO"
> = {};

eventosAindaVisiveis.forEach(
  (evento) => {
    const status =
      statusEventosDispositivo.get(
        evento.id
      );

    if (
      status ===
      "NAO_FINANCEIRO"
    ) {
      decisoesPersistidas[
        evento.id
      ] = "NAO_FINANCEIRO";
    }
  }
);

// 6. ATUALIZA OS ESTADOS (somente se ainda for o mês atual)
if (!ativo) return;
console.log("Calendário carregado:", {
  periodo: `${inicio} a ${proximoMes}`,
  itensFinnitus: itens.length,
  eventosDispositivo: eventosDoDispositivo.length,
});
setItensCalendario(itens);

setEventosDispositivo(
  eventosAindaVisiveis
);

setDecisoesEventos(
  decisoesPersistidas
);

          } catch (error) {
      if (ativo) {
        console.error("Erro ao carregar calendário:", error);
      }
    }
  }

  carregarCalendario();
  return () => { ativo = false; };
}, [
  mesAtual,
  recarregarCalendario,
]);

  // Evita duplicar eventos disponíveis no calendário do aparelho.
  // Porém, se o navegador não consegue ler o calendário nativo,
  // eventos importados que já estão salvos no backend continuam visíveis.
  const idsEventosLidosDoDispositivo = new Set(
    eventosDispositivo.map((evento) => evento.id)
  );

  const eventosDoDia = itensCalendario.filter((item) => {
    if (
      item.tipo !== "EVENTO" ||
      !dataSelecionada ||
      obterDataCalendario(item) !== dataSelecionada
    ) {
      return false;
    }

    if (item.origem === "DISPOSITIVO") {
      // Confirmados passam a constar como receitas/despesas
      // caso a rota de confirmação tenha criado essa movimentação.
      if (item.statusFinanceiro === "CONFIRMADO") return false;
      if (
        item.idEventoExterno &&
        idsEventosLidosDoDispositivo.has(item.idEventoExterno)
      ) {
        return false;
      }
    }

    return true;
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



const despesasDoMes =
  itensCalendario.filter(
    (item) => item.tipo === "DESPESA"
  );

const receitasDoMes =
  itensCalendario.filter(
    (item) => item.tipo === "RECEITA"
  );

const totalDespesasMes =
  despesasDoMes.reduce(
    (total, item) =>
      total + (item.valor ?? 0),
    0
  );

const totalReceitasMes =
  receitasDoMes.reduce(
    (total, item) =>
      total + (item.valor ?? 0),
    0
  );

const saldoDoMes =
  totalReceitasMes -
  totalDespesasMes;

/*
 * Percentuais usados somente para desenhar
 * o gráfico circular.
 */
const baseFinanceiraMes =
  totalReceitasMes > 0
    ? totalReceitasMes
    : totalDespesasMes;

const percentualGastosMes =
  baseFinanceiraMes > 0
    ? Math.min(
        (totalDespesasMes /
          baseFinanceiraMes) *
          100,
        100
      )
    : 0;

const percentualRestanteMes =
  totalReceitasMes > 0
    ? Math.max(
        100 - percentualGastosMes,
        0
      )
    : 0;

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

    // O valor aparece já com a máscara de dinheiro (ex.: 100,00)
    setValorRevisao(
      classificacao.valorDetectado !==
        undefined
        ? formatarCentavos(
            Math.round(
              classificacao.valorDetectado * 100
            )
          )
        : ""
    );

    setDescricaoRevisao(
      evento.titulo
    );

    // A tela mostra DD/MM/AAAA; a API continua recebendo AAAA-MM-DD
    setDataRevisao(
      isoParaBr(
        evento.dataInicio.slice(0, 10)
      )
    );
  }

  // Abre o formulário já preenchido com os dados da movimentação tocada.
  function abrirEdicaoMovimentacao(item: ItemCalendario) {
    if (item.tipo !== "DESPESA" && item.tipo !== "RECEITA") return;

    setMovimentacaoEmEdicao(item);
    setDescricaoEdicao(item.titulo ?? "");
    setValorEdicao(formatarCentavos(Math.round(Number(item.valor ?? 0) * 100)));
    setDataEdicao(isoParaBr(obterDataCalendario(item)));
  }

  async function salvarEdicaoMovimentacao() {
    if (!movimentacaoEmEdicao || salvandoEdicao) return;

    const descricao = descricaoEdicao.trim();
    const valor = moedaParaNumero(valorEdicao);

    if (!descricao) {
      Alert.alert("Descrição obrigatória", "Informe uma descrição para a movimentação.");
      return;
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      Alert.alert("Valor inválido", "Informe um valor maior que zero.");
      return;
    }
    if (!dataValida(dataEdicao)) {
      Alert.alert("Data inválida", "Informe uma data válida no formato DD/MM/AAAA.");
      return;
    }

    // O backend do calendário deve enviar o ID REAL da Receita/Despesa,
    // nunca somente o ID do Evento.
    const idOrigem = movimentacaoEmEdicao.movimentacaoId;
    if (!Number.isSafeInteger(idOrigem) || !idOrigem || idOrigem <= 0) {
      Alert.alert(
        "Edição indisponível",
        "O calendário ainda não enviou o ID da receita/despesa original. " +
          "Inclua 'movimentacaoId' na resposta GET /calendario para editar com segurança."
      );
      return;
    }

    const novaData = brParaIso(dataEdicao);
    setSalvandoEdicao(true);
    try {
      await atualizarMovimentacaoCalendario({
        tipo: movimentacaoEmEdicao.tipo as "RECEITA" | "DESPESA",
        movimentacaoId: idOrigem,
        descricao,
        valor,
        data: novaData,
      });

      setMovimentacaoEmEdicao(null);
      // Se mudar de mês, mostramos o mês onde a movimentação foi salva.
      const novoMes = `${novaData.slice(0, 7)}-01`;
      if (novoMes !== mesAtual) setMesAtual(novoMes);
      setDataSelecionada(novaData);
      setRecarregarCalendario((anterior) => anterior + 1);
      Alert.alert("Alteração salva", "A movimentação foi atualizada no banco.");
    } catch (error: any) {
      console.error("Falha ao atualizar movimentação no backend:", error);
      const detalhe = error?.response?.data?.erro ?? error?.message;
      Alert.alert(
        "Não foi possível salvar",
        typeof detalhe === "string" && detalhe.length <= 250
          ? detalhe
          : "Não foi possível atualizar a movimentação no servidor."
      );
    } finally {
      setSalvandoEdicao(false);
    }
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
              <SinoNotificacoes estiloIcone={styles.headerIcone} />
            </View>
          </View>

          {/* ───────── CALENDÁRIO ───────── */}
          {calendarioAberto && (
            <Calendar
              key={mesAtual.slice(0, 7)}
              current={mesAtual}
              // O Calendar só troca de mês sozinho quando o initialDate muda

              // (o "current" é usado só na primeira vez). Assim, escolher um

              // mês no card atualiza o calendário

              initialDate={mesAtual}
              markedDates={markedDates}
              enableSwipeMonths
              hideExtraDays={false}
              firstDay={0}
              style={{
                marginTop: 10,
              }}

              onMonthChange={(month) => {
                const novoMes = month.dateString.slice(0, 7);
                if (novoMes !== mesAtual.slice(0, 7)) {
                  setMesAtual(`${novoMes}-01`);
                  setDataSelecionada(`${novoMes}-01`);
                }
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

          <Card
            gradiente={["rgba(73, 34, 135, 0.3)", "rgba(72, 34, 135, 0.55)"]}
            style={estilosEvento.cardEvento}
          >
            <View style={styles.eventoHeader}>
              <Text
                style={styles.eventoTitulo}
              >
                Eventos
              </Text>
              <Text
                style={estilosEvento.eventoData}
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
          style={estilosEvento.eventoItem}
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

          <View style={estilosEvento.eventoLinha}>
            <Text
              style={styles.eventoDescricao}
            >
              {evento.origem === "DISPOSITIVO"
                ? "Importado do calendário do celular"
                : "Finnitus"}
            </Text>

            {!evento.diaInteiro && (
              <Text style={styles.eventoHora}>
                {hora}
              </Text>
            )}
          </View>
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

            style={estilosEvento.eventoItem}
          >

            <Text style={styles.eventoNome}>

              • {evento.titulo}

            </Text>
            <View style={estilosEvento.eventoLinha}>
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
            </View>

            {ehSuspeito && (
              <View
                style={estilosEvento.eventoMovimentacao}
              >
                <Text
                  style={estilosEvento.eventoMovTitulo}
                >
                  Possível movimentação financeira
                </Text>

                <Text
                  style={estilosEvento.eventoMovDetalhe}
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
                    ? ` • ${formatarValorCalendario(classificacao.valorDetectado)}`
                    : ""}
                </Text>

                {!decisao && (
                  <View
                    style={estilosEvento.eventoMovBotoes}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        abrirRevisaoFinanceira(
                          evento
                        )
                      }
                      style={estilosEvento.eventoBotaoPrimario}
                    >
                      <LinearGradient
                        colors={["#482287", "#482287"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={estilosEvento.eventoBotaoPrimarioFundo}
                      >
                        <Text
                          numberOfLines={1}
                          adjustsFontSizeToFit
                          style={estilosEvento.eventoBotaoPrimarioTexto}
                        >
                          Confirmar
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
<TouchableOpacity
  activeOpacity={0.8}
  onPress={async () => {
  try {
    await marcarEventoNaoFinanceiro({
      idEventoExterno:
        evento.id,

      tituloEvento:
        evento.titulo,

      dataInicio:
        evento.dataInicio,

      dataFim:
        evento.dataFim,

      diaInteiro:
        evento.diaInteiro,
    });

    setDecisoesEventos(
      (atual) => ({
        ...atual,

        [evento.id]:
          "NAO_FINANCEIRO",
      })
    );

    setRecarregarCalendario(
      (atual) =>
        atual + 1
    );
  } catch (error) {
    console.error(
      "Erro ao marcar evento como não financeiro:",
      error
    );
  }
}}
  style={estilosEvento.eventoBotaoSecundario}
>
  <Text
    numberOfLines={1}
    adjustsFontSizeToFit
    style={estilosEvento.eventoBotaoSecundarioTexto}
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
    style={estilosEvento.eventoMovConfirmado}
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
      style={estilosEvento.eventoMovDetalhe}
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
      style={[
        estilosEvento.eventoBotaoContorno,
        { marginTop: 10 },
      ]}
    >
      <Text
        style={estilosEvento.eventoBotaoContornoTexto}
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
    style={[
      estilosEvento.eventoBotaoContorno,
      { marginTop: 10 },
    ]}
  >
    <Text
      style={estilosEvento.eventoBotaoContornoTexto}
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

</Card>


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
        <TouchableOpacity
          key={`${item.tipo}-${item.id}`}
          activeOpacity={0.75}
          onPress={() => abrirEdicaoMovimentacao(item)}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${ehReceita ? "receita" : "despesa"}: ${item.titulo}`}
          accessibilityHint="Abre os campos de descrição, valor e data para edição"
        >
          <LinearGradient
            colors={["rgba(72, 34, 135, 0.55)", "rgba(72, 34, 135, 0.55)"]}
            style={styles.gastoCard}
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

            {formatarValorCalendario(item.valor ?? 0)}
          </Text>
          </LinearGradient>
        </TouchableOpacity>
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



{/* ───────── GASTOS DO MÊS ───────── */}

<Text style={styles.secaoTitulo}>
  Gastos do mês
</Text>

<LinearGradient
  colors={["rgba(72, 34, 135, 0.55)", "rgba(72, 34, 135, 0.55)"]}
  style={styles.card}
>
  <View style={styles.gastosMesCorpo}>
    <GaugeCircular
      tamanho={140}
      label={formatarValorCalendario(
        totalDespesasMes
      )}
      sublabel="Gastos"
      segmentos={[
        {
          cor: "#FF8800",
          pct:
            percentualGastosMes,
        },
        {
          cor:
            Cores.destaque.limao,
          pct:
            percentualRestanteMes,
        },
      ]}
    />

    <View style={styles.estatsList}>
      {[
        {
          label:
            "Receitas do\nmês",

          valor:
            formatarValorCalendario(
              totalReceitasMes
            ),

          cor:
            Cores.destaque.limao,
        },

        {
          label:
            "Despesas do\nmês",

          valor:
            formatarValorCalendario(
              totalDespesasMes
            ),

          cor: "#FF8800",
        },

        {
          label:
            "Saldo do\nmês",

          valor:
            formatarValorCalendario(
              saldoDoMes
            ),

          cor:
            saldoDoMes >= 0
              ? Cores.roxo.claro
              : Cores.estado.perigo,
        },
      ].map((item) => (
        <View
          key={item.label}
          style={styles.estatsItem}
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
        cor: "#FF8800",
        label: "Gastos",
      },

      {
        cor:
          Cores.destaque.limao,
        label: "Restante",
      },
    ].map((item) => (
      <View
        key={item.label}
        style={styles.legendaItem}
      >
        <View
          style={[
            styles.legendaPonto,
            {
              backgroundColor:
                item.cor,
            },
          ]}
        />

        <Text
          style={
            styles.legendaTexto
          }
        >
          {item.label}
        </Text>
      </View>
    ))}
  </View>
</LinearGradient>

        </View>

      </ScrollView>


      {/* Editar uma receita ou despesa existente a partir de "Movimentações do dia". */}
      <Modal
        visible={movimentacaoEmEdicao !== null}
        transparent
        animationType="fade"
        onRequestClose={() => { if (!salvandoEdicao) setMovimentacaoEmEdicao(null); }}
      >
        <KeyboardAvoidingView
          style={estilosEvento.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable
            style={estilosEvento.modalFundo}
            onPress={() => { if (!salvandoEdicao) setMovimentacaoEmEdicao(null); }}
          />
          <Card
            gradiente={["#2C1B43", "#2C1B43"]}
            style={estilosEvento.modalCard}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={estilosEvento.modalTitulo}>
                {movimentacaoEmEdicao?.tipo === "RECEITA" ? "Editar receita" : "Editar despesa"}
              </Text>
              <Text style={estilosEvento.modalSubtitulo}>
                Altere os dados e salve para atualizar suas finanças.
              </Text>

              <CampoModal
                label="Descrição"
                autoCapitalize="sentences"
                placeholder="Descrição da movimentação"
                value={descricaoEdicao}
                onChangeText={setDescricaoEdicao}
              />
              <CampoModal
                label="Valor"
                placeholder="0,00"
                keyboardType="numeric"
                value={valorEdicao}
                onChangeText={(texto) => setValorEdicao(mascararMoeda(texto))}
              />
              <CampoModal
                label="Data"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
                value={dataEdicao}
                onChangeText={(texto) => setDataEdicao(mascararData(texto))}
              />

              <View style={estilosEvento.modalBotoes}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={salvandoEdicao}
                  onPress={() => setMovimentacaoEmEdicao(null)}
                  style={[estilosEvento.eventoBotaoSecundario, { opacity: salvandoEdicao ? 0.6 : 1 }]}
                >
                  <Text style={estilosEvento.eventoBotaoSecundarioTexto}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={salvandoEdicao}
                  onPress={salvarEdicaoMovimentacao}
                  style={[estilosEvento.eventoBotaoPrimario, { opacity: salvandoEdicao ? 0.6 : 1 }]}
                >
                  <LinearGradient
                    colors={["rgba(73, 34, 135, 0.26)", "rgba(72, 34, 135, 0.55)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={estilosEvento.eventoBotaoPrimarioFundo}
                  >
                    <Text style={estilosEvento.eventoBotaoPrimarioTexto}>
                      {salvandoEdicao ? "Salvando..." : "Salvar alterações"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Card>
        </KeyboardAvoidingView>
      </Modal>

      {/* Confirmar movimentação: card roxo flutuando no meio da tela, com o
          mesmo visual do modal "Alterar foto de perfil" (fundo escurecido,
          tocar fora fecha) */}
      <Modal
        visible={eventoEmRevisao !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEventoEmRevisao(null)}
      >
        <KeyboardAvoidingView
          style={estilosEvento.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable
            style={estilosEvento.modalFundo}
            onPress={() => setEventoEmRevisao(null)}
          />

          <Card
            gradiente={["#2c1b43d3", "#2C1B43"]}
            style={estilosEvento.modalCard}
          >
            {/* Rolagem: se o teclado abrir, ainda dá pra chegar nos botões */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={estilosEvento.modalTitulo}>
                Confirmar movimentação
              </Text>

              <Text style={estilosEvento.modalSubtitulo}>
                Revise os dados antes de salvar.
              </Text>

              <Text style={estilosEvento.modalRotulo}>Tipo</Text>

              <View
                style={estilosEvento.modalTipo}
                onLayout={(event) => setLarguraAlternador(event.nativeEvent.layout.width)}
              >
                {larguraAlternador > 0 && (
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      estilosEvento.modalTipoIndicador,
                      {
                        width: (larguraAlternador - 6) / 2,
                        transform: [{
                          translateX: deslocamentoTipo.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, (larguraAlternador - 6) / 2],
                          }),
                        }],
                      },
                    ]}
                  />
                )}
                {(["DESPESA", "RECEITA"] as const).map((opcao) => {
                  const ativo = tipoRevisao === opcao;

                  return (
                    <Pressable
                      key={opcao}
                      accessibilityRole="button"
                      accessibilityState={{ selected: ativo }}
                      onPress={() => setTipoRevisao(opcao)}
                      style={[
                        estilosEvento.modalTipoOpcao,
                      ]}
                    >
                      <Text
                        style={[
                          estilosEvento.modalTipoTexto,
                          ativo && estilosEvento.modalTipoTextoAtivo,
                        ]}
                      >
                        {opcao === "DESPESA" ? "Despesa" : "Receita"}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <CampoModal
                label="Valor"
                placeholder="0,00"
                keyboardType="numeric"
                value={valorRevisao}
                onChangeText={(texto) => setValorRevisao(mascararMoeda(texto))}
              />

              <CampoModal
                label="Descrição"
                autoCapitalize="sentences"
                value={descricaoRevisao}
                onChangeText={setDescricaoRevisao}
              />

              <CampoModal
                label="Data"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
                value={dataRevisao}
                onChangeText={(texto) => setDataRevisao(mascararData(texto))}
              />

              {/* Cancelar e Confirmar lado a lado, no mesmo tamanho dos
                  botões do card de eventos */}
              <View style={estilosEvento.modalBotoes}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setEventoEmRevisao(null)}
                  style={estilosEvento.eventoBotaoSecundario}
                >
                  <Text style={estilosEvento.eventoBotaoSecundarioTexto}>
                    Cancelar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={async () => {
                if (!eventoEmRevisao) {
                  return;
                }

                const valorNumerico =
                  moedaParaNumero(valorRevisao);

                if (
                  !valorNumerico ||
                  valorNumerico <= 0
                ) {
                  console.log(
                    "Valor inválido."
                  );

                  return;
                }

                // A data digitada precisa ser uma data real (ex.: 31/02 não vale)
                if (!dataValida(dataRevisao)) {
                  console.log(
                    "Data inválida."
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

                      // A API continua recebendo AAAA-MM-DD
                      data:
                        brParaIso(dataRevisao),
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
                  style={estilosEvento.eventoBotaoPrimario}
                >
                  <LinearGradient
                    colors={['rgba(72, 34, 135, 0.55)','rgba(72, 34, 135, 0.55)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={estilosEvento.eventoBotaoPrimarioFundo}
                  >
                    <Text style={estilosEvento.eventoBotaoPrimarioTexto}>
                      Confirmar
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Card>
        </KeyboardAvoidingView>
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

          const novoMes = `${ano}-${String(mes + 1).padStart(2, "0")}`;
          setMesAtual(`${novoMes}-01`);
          setDataSelecionada(`${novoMes}-01`);
          setModalMesAno(false);

        }}

      />

    </View>

  );

}
