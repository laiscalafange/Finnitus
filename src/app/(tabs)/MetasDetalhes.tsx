
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Minus, Plus } from "lucide-react-native";

import { HeaderMP } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Progress } from "../../shared/components/Progress";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";
import { styles } from "../../styles/metasdetalhes";

import { ModalReserva } from "@/features/menuMais/components/ModalReserva";
import {
  formatarMoeda,
  mascararMoeda,
  moedaParaNumero,
} from "@/features/menuMais/utils";
import { errorMessage } from "@/services/api";
import type { TipoModalReserva } from "@/features/menuMais/types";
import { styles as reserva } from "@/features/menuMais/styles/reserva";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  formatarDataCurta,
  percentualMeta,
  type Meta,
  type TipoMeta,
} from "@/features/metasData";

import MetasFrame from "./MetasFrame";

const MOVIMENTACOES_VISIVEIS = 4;

// Cores originais do background preservadas
const GRADIENTE_FUNDO: [string, string, string] = [
  "#3f1e69",
  "#08070A",
  "#291444",
];

type DadosEdicao = {
  nome: string;
  tipo: TipoMeta;
  valorTotal: number;
};

type ModalEditarMetaProps = {
  visivel: boolean;
  meta: Meta;
  aoFechar: () => void;
  aoSalvar: (dados: DadosEdicao) => Promise<void>;
  aoReiniciar: () => Promise<void>;
};

const OPCOES_TIPO: { id: TipoMeta; rotulo: string }[] = [
  { id: "mes", rotulo: "Meta do mês" },
  { id: "longoPrazo", rotulo: "Longo prazo" },
];

function ModalEditarMeta({
  visivel,
  meta,
  aoFechar,
  aoSalvar,
  aoReiniciar,
}: ModalEditarMetaProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoMeta>("longoPrazo");
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState("");
  const [confirmandoReinicio, setConfirmandoReinicio] =
    useState(false);
  const [ocupado, setOcupado] = useState(false);

  useEffect(() => {
    if (!visivel) return;

    setNome(meta.nome);
    setTipo(meta.tipo);
    setValor(
      mascararMoeda(String(Math.round(meta.valorTotal * 100)))
    );
    setErro("");
    setConfirmandoReinicio(false);
    setOcupado(false);
  }, [visivel, meta.id]);

  async function salvar() {
    if (!nome.trim()) {
      setErro("Informe o nome da meta.");
      return;
    }

    const valorTotal = moedaParaNumero(valor);

    if (valorTotal <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }

    setErro("");
    setOcupado(true);

    try {
      await aoSalvar({
        nome: nome.trim(),
        tipo,
        valorTotal,
      });
    } catch (error) {
      setErro(errorMessage(error));
    } finally {
      setOcupado(false);
    }
  }

  async function reiniciar() {
    if (!confirmandoReinicio) {
      setConfirmandoReinicio(true);
      return;
    }

    setOcupado(true);

    try {
      await aoReiniciar();
    } catch (error) {
      setConfirmandoReinicio(false);
      setErro(errorMessage(error));
    } finally {
      setOcupado(false);
    }
  }

  const semValorGuardado = meta.valorAtual <= 0;

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={aoFechar}
    >
      <KeyboardAvoidingView
        style={estilosEditar.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable
          style={estilosEditar.fundo}
          onPress={aoFechar}
        />

        <Card
          gradiente={[
            "rgba(44, 27, 67, 0.96)",
            "rgba(44, 27, 67, 0.96)",
          ]}
          style={estilosEditar.card}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={estilosEditar.titulo}>
              Editar meta
            </Text>

            <Text style={estilosEditar.rotulo}>
              Nome
            </Text>

            <View style={estilosEditar.campo}>
              <TextInput
                style={estilosEditar.campoTexto}
                maxFontSizeMultiplier={1.15}
                accessibilityLabel="Nome da meta"
                placeholderTextColor="#8E7BA8"
                autoCapitalize="sentences"
                autoCorrect={false}
                maxLength={60}
                value={nome}
                onChangeText={setNome}
                editable={!ocupado}
              />
            </View>

            <Text style={estilosEditar.rotulo}>
              Tipo
            </Text>

            <View style={estilosEditar.tipo}>
              {OPCOES_TIPO.map((opcao) => {
                const ativo = tipo === opcao.id;

                return (
                  <Pressable
                    key={opcao.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: ativo }}
                    onPress={() => setTipo(opcao.id)}
                    disabled={ocupado}
                    style={[
                      estilosEditar.tipoOpcao,
                      ativo && estilosEditar.tipoOpcaoAtiva,
                    ]}
                  >
                    <Text
                      style={[
                        estilosEditar.tipoTexto,
                        ativo && estilosEditar.tipoTextoAtivo,
                      ]}
                    >
                      {opcao.rotulo}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={estilosEditar.rotulo}>
              Valor da meta
            </Text>

            <View
              style={[
                estilosEditar.campo,
                estilosEditar.campoLinha,
              ]}
            >
              <Text style={estilosEditar.prefixoMoeda}>
                R$
              </Text>

              <TextInput
                style={[
                  estilosEditar.campoTexto,
                  estilosEditar.campoValor,
                ]}
                maxFontSizeMultiplier={1.15}
                accessibilityLabel="Valor da meta"
                placeholder="0,00"
                placeholderTextColor="#8E7BA8"
                keyboardType="numeric"
                value={valor}
                onChangeText={(texto) =>
                  setValor(mascararMoeda(texto))
                }
                editable={!ocupado}
              />
            </View>

            {erro ? (
              <Text style={estilosEditar.erro}>
                {erro}
              </Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={ocupado || semValorGuardado}
              onPress={reiniciar}
              style={[
                estilosEditar.botaoSecundario,
                estilosEditar.botaoReiniciar,
                semValorGuardado &&
                  estilosEditar.botaoDesabilitado,
              ]}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={estilosEditar.botaoSecundarioTexto}
              >
                {confirmandoReinicio
                  ? "Toque de novo para zerar"
                  : "Reiniciar meta"}
              </Text>
            </TouchableOpacity>

            {confirmandoReinicio ? (
              <Text style={estilosEditar.aviso}>
                Os {formatarMoeda(meta.valorAtual)} guardados
                serão retirados e a meta volta para R$ 0,00.
              </Text>
            ) : null}

            <View style={estilosEditar.botoes}>
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={ocupado}
                onPress={aoFechar}
                style={estilosEditar.botaoSecundario}
              >
                <Text style={estilosEditar.botaoSecundarioTexto}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={ocupado}
                onPress={salvar}
                style={estilosEditar.botaoPrimario}
              >
                <Text style={estilosEditar.botaoPrimarioTexto}>
                  Salvar alterações
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilosEditar = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  fundo: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },

  card: {
    maxHeight: "90%",
    borderRadius: 22,
    borderColor: "rgba(163, 87, 255, 0.25)",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 0,
  },

  titulo: {
    fontFamily: FONTS.raleway.bold,
    color: Cores.destaque.limao,
    fontSize: 21,
    textAlign: "center",
    marginBottom: 14,
  },

  rotulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.destaque.limao,
    marginBottom: 6,
  },

  campo: {
    height: 46,
    justifyContent: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.45)",
    backgroundColor: "#20152F",
  },

  campoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  campoTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: "#FFFFFF",
    paddingVertical: 0,
  },

  campoValor: {
    flex: 1,
  },

  prefixoMoeda: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.destaque.limao,
  },

  tipo: {
    flexDirection: "row",
    padding: 3,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.35)",
    backgroundColor: "#20152F",
  },

  tipoOpcao: {
    flex: 1,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  tipoOpcaoAtiva: {
    backgroundColor: "#38205B",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.45)",
  },

  tipoTexto: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 13,
    color: "#C7A9F5",
  },

  tipoTextoAtivo: {
    color: Cores.destaque.limao,
  },

  erro: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.estado.erro,
    marginBottom: 10,
  },

  aviso: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: "#C7A9F5",
    marginTop: 8,
  },

  botaoSecundario: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.3)",
    backgroundColor: "rgba(163, 87, 255, 0.06)",
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoSecundarioTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: "#C7A9F5",
  },

  botaoReiniciar: {
    flex: 0,
    alignSelf: "stretch",
  },

  botaoDesabilitado: {
    opacity: 0.4,
  },

  botoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  botaoPrimario: {
    flex: 1,
    minHeight: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.45)",
    backgroundColor: "#38205B",
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoPrimarioTexto: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 13,
    color: Cores.destaque.limao,
  },
});

export default function MetasDetalhes() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const {
    metas,
    movimentarMeta,
    cancelarMeta,
    editarMeta,
  } = useFinanceiro();

  const meta = metas.find((item) => item.id === id);

  const [modal, setModal] =
    useState<TipoModalReserva | null>(null);

  const [verTodas, setVerTodas] = useState(false);
  const [alcancada, setAlcancada] = useState(false);
  const [editando, setEditando] = useState(false);

  if (!meta) {
    return (
      <LinearGradient
        colors={GRADIENTE_FUNDO}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <HeaderMP
          titulo="Metas"
          subtitulo="Detalhes"
        />

        <View style={styles.conteudoSobreHeader}>
          <Text style={styles.nomeMeta}>
            Meta não encontrada
          </Text>
        </View>
      </LinearGradient>
    );
  }

  const percentual = percentualMeta(meta);
  const faltam = Math.max(
    0,
    meta.valorTotal - meta.valorAtual
  );
  const emAndamento = meta.status === "andamento";

  const movimentacoes = verTodas
    ? meta.movimentacoes
    : meta.movimentacoes.slice(
        0,
        MOVIMENTACOES_VISIVEIS
      );

  async function confirmarModal(valor: number) {
    if (!meta) return;

    if (modal === "depositar") {
      const resultado = await movimentarMeta(
        meta.id,
        "deposito",
        valor
      );

      setModal(null);

      if (resultado === "concluida") {
        setAlcancada(true);
      }
      return;
    }

    if (modal === "retirar") {
      const resultado = await movimentarMeta(
        meta.id,
        "retirada",
        valor
      );

      if (resultado === "saldoInsuficiente") {
        setModal("saldoInsuficiente");
        return;
      }

      setModal(null);
      return;
    }

    if (modal === "cancelar") {
      await cancelarMeta(meta.id);
      setModal(null);
      router.navigate("/metas");
      return;
    }

    setModal(null);
  }

  async function salvarEdicao(dados: DadosEdicao) {
    if (!meta) return;

    const resultado = await editarMeta(
      meta.id,
      dados
    );

    setEditando(false);

    if (resultado === "concluida") {
      setAlcancada(true);
    }
  }

  async function reiniciarMeta() {
    if (!meta) return;

    await movimentarMeta(
      meta.id,
      "retirada",
      meta.valorAtual
    );

    setEditando(false);
  }

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
        <HeaderMP
          titulo="Metas"
          subtitulo="Detalhes"
        />

        <View style={styles.conteudoSobreHeader}>
          <View style={styles.iconeMeta}>
            <Image
              source={require("../../../assets/icones/cifrao.png")}
              style={[
                styles.cifrao,
                { tintColor: "#DCC8FF" },
              ]}
            />
          </View>

          <Text style={styles.nomeMeta}>
            {meta.nome}
          </Text>

          <Text style={styles.valor}>
            {formatarMoeda(meta.valorAtual)}
          </Text>

          <Text style={styles.metaTotal}>
            De {formatarMoeda(meta.valorTotal)}
          </Text>

          <View style={styles.linhaProgresso}>
            <View style={styles.barraProgresso}>
              <Progress
               value={meta.configurada ? meta.valorAtual : 0}
               max={meta.configurada ? meta.valorTotal : 1}
               height={17}
               color="#8D49E1"
               backgroundColor="#20112F"
             />
            </View>

            <Text style={styles.percentual}>
              {percentual}%
            </Text>
          </View>

         <Text style={styles.faltam}>
         {!meta.configurada
           ? "Registre o valor limite a ser alcançado"
           : faltam > 0
             ? `Faltam ${formatarMoeda(faltam)}`
             : "Meta alcançada!"}
         </Text>

          {emAndamento ? (
            <>
              {/* Depositar e Retirar lado a lado */}
              <View style={styles.linhaBotoes}>
                <View style={styles.colunaBotao}>
                  <Pressable
                    onPress={() => setModal("depositar")}
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.botaoPrincipal,
                      pressed && styles.botaoPressionado,
                    ]}
                  >
                    <Text style={styles.textoBotaoPrincipal}>
                      Depositar
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.colunaBotao}>
                  <Pressable
                    onPress={() => setModal("retirar")}
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.botaoSecundario,
                      pressed && styles.botaoPressionado,
                    ]}
                  >
                    <Text style={styles.textoBotaoSecundario}>
                      Retirar
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Editar meta: botão grande abaixo */}
              <Pressable
                onPress={() => setEditando(true)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.botaoSecundario,
                  { marginTop: 12, marginBottom: 14 },
                  pressed && styles.botaoPressionado,
                ]}
              >
                <Text style={styles.textoBotaoSecundario}>
                  Editar meta
                </Text>
              </Pressable>
            </>
          ) : null}

          {/* Histórico */}
          <View style={styles.historico}>
            <Text style={styles.tituloHistorico}>
              Histórico
            </Text>

            {meta.movimentacoes.length === 0 ? (
              <Text style={styles.vazio}>
                Nenhuma movimentação ainda.
              </Text>
            ) : (
              movimentacoes.map((item) => {
                const deposito = item.tipo === "deposito";

                return (
                  <View key={item.id}>
                    <Text style={styles.data}>
                      {formatarDataCurta(item.data)}
                    </Text>

                    <Card
                      gradiente={[
                        "rgba(44, 27, 67, 0.92)",
                        "rgba(44, 27, 67, 0.92)",
                      ]}
                      style={styles.cardHistorico}
                    >
                      <View style={styles.linhaHistorico}>
                        <View
                          style={[
                            reserva.circuloMovimentacao,
                            deposito
                              ? reserva.circuloDeposito
                              : reserva.circuloRetirada,
                            styles.circuloHistorico,
                          ]}
                        >
                          {deposito ? (
                            <Plus
                              size={18}
                              color={Cores.destaque.limao}
                            />
                          ) : (
                            <Minus
                              size={18}
                              color={Cores.roxo.claro}
                            />
                          )}
                        </View>

                        <View style={{ flexShrink: 1 }}>
                          <Text style={styles.tipoDeposito}>
                            {deposito
                              ? "Depósito"
                              : "Retirada"}
                          </Text>

                          <Text style={styles.horario}>
                            {item.horario}
                          </Text>
                        </View>

                        <Text
                          style={styles.valorDeposito}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                        >
                          {deposito ? "+" : "-"}{" "}
                          {formatarMoeda(item.valor)}
                        </Text>
                      </View>
                    </Card>
                  </View>
                );
              })
            )}

            {meta.movimentacoes.length >
            MOVIMENTACOES_VISIVEIS ? (
              <TouchableOpacity
                onPress={() =>
                  setVerTodas((atual) => !atual)
                }
              >
                <Text style={styles.verMais}>
                  {verTodas ? "Ver menos" : "Ver mais"}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Cancelar meta: depois de todo o Histórico */}
          {emAndamento && (
            <Pressable
              onPress={() => setModal("cancelar")}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.botaoCancelar,
                {
                  marginTop: 24,
                  marginBottom: 12,
                },
                pressed && styles.botaoPressionado,
              ]}
            >
              <Text style={styles.textoBotaoCancelar}>
                Cancelar meta
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      <ModalReserva
        tipo={modal}
        saldo={meta.valorAtual}
        alvo="meta"
        aoFechar={() => setModal(null)}
        aoConfirmar={confirmarModal}
      />

      <ModalEditarMeta
        visivel={editando}
        meta={meta}
        aoFechar={() => setEditando(false)}
        aoSalvar={salvarEdicao}
        aoReiniciar={reiniciarMeta}
      />

      <MetasFrame
        visible={alcancada}
        tipo="alcancada"
        nome={meta.nome}
        valor={meta.valorAtual}
        onClose={() => setAlcancada(false)}
      />
    </LinearGradient>
  );
}
