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
import { Button } from "../../shared/components/Button";
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
// Círculos de + e − do histórico (os mesmos da Reserva de emergência)
import { styles as reserva } from "@/features/menuMais/styles/reserva";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  formatarDataCurta,
  percentualMeta,
  type Meta,
  type TipoMeta,
} from "@/features/metasData";

import MetasFrame from "./MetasFrame";

// Quantas movimentações aparecem antes de tocar em "Ver mais"
const MOVIMENTACOES_VISIVEIS = 4;

const GRADIENTE_FUNDO: [string, string, string] = [
  "#3f1e69",
  "#08070A",
  "#291444",
];

// ─────────────────────────────────────────────────────────────
// Modal "Editar meta" (mesmo visual do modal de movimentação do Calendário)
// ─────────────────────────────────────────────────────────────

type DadosEdicao = {
  nome: string;
  tipo: TipoMeta;
  valorTotal: number;
};

type ModalEditarMetaProps = {
  visivel: boolean;
  meta: Meta;
  aoFechar: () => void;
  // Salva nome, tipo e valor (quem chama fecha o modal se der certo)
  aoSalvar: (dados: DadosEdicao) => Promise<void>;
  // Zera o valor guardado na meta (quem chama fecha o modal se der certo)
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
  // Reiniciar apaga o valor guardado: pede um segundo toque pra confirmar
  const [confirmandoReinicio, setConfirmandoReinicio] = useState(false);
  const [ocupado, setOcupado] = useState(false);

  // Sempre que o modal abre, os campos começam com os dados atuais da meta
  useEffect(() => {
    if (!visivel) {
      return;
    }

    setNome(meta.nome);
    setTipo(meta.tipo);
    setValor(mascararMoeda(String(Math.round(meta.valorTotal * 100))));
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
      await aoSalvar({ nome: nome.trim(), tipo, valorTotal });
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
        <Pressable style={estilosEditar.fundo} onPress={aoFechar} />

        <Card
          gradiente={["rgba(73, 38, 155, 0.97)", "rgba(45, 17, 108, 0.97)"]}
          style={estilosEditar.card}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={estilosEditar.titulo}>Editar meta</Text>

            <Text style={estilosEditar.rotulo}>Nome</Text>
            <View style={estilosEditar.campo}>
              <TextInput
                style={estilosEditar.campoTexto}
                maxFontSizeMultiplier={1.15}
                accessibilityLabel="Nome da meta"
                placeholderTextColor={Cores.texto.desabilitado}
                autoCapitalize="sentences"
                autoCorrect={false}
                maxLength={60}
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <Text style={estilosEditar.rotulo}>Tipo</Text>
            <View style={estilosEditar.tipo}>
              {OPCOES_TIPO.map((opcao) => {
                const ativo = tipo === opcao.id;

                return (
                  <Pressable
                    key={opcao.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: ativo }}
                    onPress={() => setTipo(opcao.id)}
                    style={[
                      estilosEditar.tipoOpcao,
                      ativo && { backgroundColor: Cores.destaque.limao },
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

            <Text style={estilosEditar.rotulo}>Valor da meta</Text>
            <View style={[estilosEditar.campo, estilosEditar.campoLinha]}>
              <Text style={estilosEditar.prefixoMoeda}>R$</Text>
              <TextInput
                style={[estilosEditar.campoTexto, estilosEditar.campoValor]}
                maxFontSizeMultiplier={1.15}
                accessibilityLabel="Valor da meta"
                placeholder="0,00"
                placeholderTextColor={Cores.texto.desabilitado}
                keyboardType="numeric"
                value={valor}
                onChangeText={(texto) => setValor(mascararMoeda(texto))}
              />
            </View>

            {erro ? <Text style={estilosEditar.erro}>{erro}</Text> : null}

            {/* Reiniciar meta: zera o valor guardado (2 toques pra confirmar) */}
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={ocupado || semValorGuardado}
              onPress={reiniciar}
              style={[
                estilosEditar.botaoSecundario,
                estilosEditar.botaoReiniciar,
                semValorGuardado && estilosEditar.botaoDesabilitado,
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
                Os {formatarMoeda(meta.valorAtual)} guardados serão retirados e
                a meta volta para R$ 0,00.
              </Text>
            ) : null}

            {/* Cancelar | Salvar alterações, lado a lado */}
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
                <LinearGradient
                  colors={["#482287", "#7E3BED"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={estilosEditar.botaoPrimarioFundo}
                >
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={estilosEditar.botaoPrimarioTexto}
                  >
                    Salvar alterações
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const estilosEditar = StyleSheet.create({
  // Editar | Cancelar meta, na linha abaixo do Depositar/Retirar
  linhaAcoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 16,
    marginBottom: 20,
  },

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
    borderRadius: 28,
    borderColor: "rgba(168, 79, 255, 0.35)",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    marginBottom: 0,
  },

  titulo: {
    fontFamily: FONTS.raleway.bold,
    color: Cores.base.branco,
    fontSize: 19,
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
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    backgroundColor: Cores.fundo.principal,
  },

  campoLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  campoTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.base.branco,
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

  // Alternador Meta do mês | Longo prazo
  tipo: {
    flexDirection: "row",
    padding: 3,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    backgroundColor: Cores.overlay.cardForte,
  },

  tipoOpcao: {
    flex: 1,
    height: 32,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  tipoTexto: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  tipoTextoAtivo: {
    color: Cores.texto.contraste,
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
    color: Cores.texto.claro,
    marginTop: 8,
  },

  // Botões simples, do mesmo tamanho dos do modal do Calendário
  botaoSecundario: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Cores.overlay.intenso,
    backgroundColor: Cores.overlay.suave,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoSecundarioTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.base.branco,
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
    marginTop: 10,
  },

  botaoPrimario: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    overflow: "hidden",
  },

  botaoPrimarioFundo: {
    flex: 1,
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

// Tela "Metas > Detalhes". Recebe o id da meta pela rota
// (/MetasDetalhes?id=...) e mostra exatamente os dados dela.
export default function MetasDetalhes() {
  // Hook de navegação do Expo Router
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { metas, movimentarMeta, cancelarMeta, editarMeta } = useFinanceiro();
  const meta = metas.find((item) => item.id === id);

  // Card flutuante aberto ("depositar", "retirar", "saldoInsuficiente" ou "cancelar")
  const [modal, setModal] = useState<TipoModalReserva | null>(null);
  const [verTodas, setVerTodas] = useState(false);
  const [alcancada, setAlcancada] = useState(false);
  // Modal "Editar meta"
  const [editando, setEditando] = useState(false);

  // Meta que não existe mais (ex.: foi excluída)
  if (!meta) {
    return (
      <LinearGradient
        colors={GRADIENTE_FUNDO}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <HeaderMP titulo="Metas" subtitulo="Detalhes" />

        <View style={styles.conteudoSobreHeader}>
          <Text style={styles.nomeMeta}>Meta não encontrada</Text>
        </View>
      </LinearGradient>
    );
  }

  const percentual = percentualMeta(meta);
  const faltam = Math.max(0, meta.valorTotal - meta.valorAtual);
  const emAndamento = meta.status === "andamento";

  const movimentacoes = verTodas
    ? meta.movimentacoes
    : meta.movimentacoes.slice(0, MOVIMENTACOES_VISIVEIS);

  // Trata a confirmação de cada card
  async function confirmarModal(valor: number) {
    if (!meta) {
      return;
    }

    if (modal === "depositar") {
      const resultado = await movimentarMeta(meta.id, "deposito", valor);

      setModal(null);

      // O depósito completou o valor da meta
      if (resultado === "concluida") {
        setAlcancada(true);
      }

      return;
    }

    if (modal === "retirar") {
      const resultado = await movimentarMeta(meta.id, "retirada", valor);

      // Tentou retirar mais do que tem guardado na meta
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

  // Modal "Editar meta": salva nome, tipo e valor
  async function salvarEdicao(dados: DadosEdicao) {
    if (!meta) {
      return;
    }

    const resultado = await editarMeta(meta.id, dados);

    setEditando(false);

    // O novo valor da meta já foi alcançado pelo que estava guardado
    if (resultado === "concluida") {
      setAlcancada(true);
    }
  }

  // Modal "Editar meta": zera o valor guardado (vira uma retirada no histórico)
  async function reiniciarMeta() {
    if (!meta) {
      return;
    }

    await movimentarMeta(meta.id, "retirada", meta.valorAtual);

    setEditando(false);
  }

  return (
    <LinearGradient
      // Gradiente próprio dessa tela (mesmo estilo do Notificações/MetasFuturas),
      // não usa mais o GRADIENTS.background compartilhado
      colors={GRADIENTE_FUNDO}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho fixo do topo */}
        <HeaderMP
          titulo="Metas"
          subtitulo="Detalhes"
        />

        {/* Conteúdo posicionado por cima do header (marginTop negativo) */}
        <View style={styles.conteudoSobreHeader}>

          {/* Ícone principal da meta */}
          <View style={styles.iconeMeta}>
            <Image
              source={require("../../../assets/icones/cifrao.png")}
              style={styles.cifrao}
            />
          </View>

          {/* Nome da meta */}
          <Text style={styles.nomeMeta}>
            {meta.nome}
          </Text>

          {/* Valor já guardado */}
          <Text style={styles.valor}>
            {formatarMoeda(meta.valorAtual)}
          </Text>

          {/* Valor total da meta */}
          <Text style={styles.metaTotal}>
            De {formatarMoeda(meta.valorTotal)}
          </Text>

          {/* Barra de progresso (valor atual / valor total) + percentual */}
          <View style={styles.linhaProgresso}>
            <View style={styles.barraProgresso}>
              <Progress
                value={meta.valorAtual}
                max={meta.valorTotal}
                height={17}
                color="#8D49E1"
                backgroundColor="#482287"
              />
            </View>

            <Text style={styles.percentual}>{percentual}%</Text>
          </View>

          {/* Quanto falta pra bater a meta */}
          <Text style={styles.faltam}>
            {faltam > 0 ? `Faltam ${formatarMoeda(faltam)}` : "Meta alcançada!"}
          </Text>

          {/* Depositar, Retirar e Cancelar meta só aparecem enquanto a meta
              está em andamento */}
          {emAndamento ? (
            <>
              {/* Depositar | Retirar, lado a lado */}
              <View style={styles.linhaBotoes}>
                <View style={styles.colunaBotao}>
                  <Button
                    tamanho="compacto"
                    titulo="Depositar"
                    onPress={() => setModal("depositar")}
                  />
                </View>

                <View style={styles.colunaBotao}>
                  <Button
                    tamanho="compacto"
                    titulo="Retirar"
                    variante="secundario"
                    onPress={() => setModal("retirar")}
                  />
                </View>
              </View>

              {/* Botões discretos abaixo do Depositar/Retirar:
                  Editar meta (esquerda) e Cancelar meta (direita) */}
              <View style={estilosEditar.linhaAcoes}>
                <TouchableOpacity
                  onPress={() => setEditando(true)}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelarMeta}>Editar meta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModal("cancelar")}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelarMeta}>Cancelar meta</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}

          {/* HISTÓRICO de movimentações dessa meta */}
          <View style={styles.historico}>
            <Text style={styles.tituloHistorico}>
              Histórico
            </Text>

            {meta.movimentacoes.length === 0 ? (
              <Text style={styles.vazio}>Nenhuma movimentação ainda.</Text>
            ) : (
              movimentacoes.map((item) => {
                const deposito = item.tipo === "deposito";

                return (
                  <View key={item.id}>

                    {/* Data da movimentação */}
                    <Text style={styles.data}>
                      {formatarDataCurta(item.data)}
                    </Text>

                    {/* Card com os dados da movimentação */}
                    <Card
                      gradiente={["#482287", "#281542"]}
                      style={styles.cardHistorico}
                    >
                      <View style={styles.linhaHistorico}>

                        {/* + (depósito) ou − (retirada) */}
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
                            <Plus size={16} color={Cores.destaque.limao} />
                          ) : (
                            <Minus size={16} color={Cores.roxo.claro} />
                          )}
                        </View>

                        {/* Tipo + horário */}
                        <View>
                          <Text style={styles.tipoDeposito}>
                            {deposito ? "Depósito" : "Retirada"}
                          </Text>

                          <Text style={styles.horario}>
                            {item.horario}
                          </Text>
                        </View>

                        {/* Valor da movimentação */}
                        <Text style={styles.valorDeposito}>
                          {deposito ? "+" : "-"} {formatarMoeda(item.valor)}
                        </Text>

                      </View>
                    </Card>

                  </View>
                );
              })
            )}

            {/* "Ver mais" / "Ver menos" — só aparece se tem mais do que cabe */}
            {meta.movimentacoes.length > MOVIMENTACOES_VISIVEIS ? (
              <TouchableOpacity onPress={() => setVerTodas((atual) => !atual)}>
                <Text style={styles.verMais}>
                  {verTodas ? "Ver menos" : "Ver mais"}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

        </View>
      </ScrollView>

      {/* Cards flutuantes: depositar, retirar, aviso de saldo e cancelar meta */}
      <ModalReserva
        tipo={modal}
        saldo={meta.valorAtual}
        alvo="meta"
        aoFechar={() => setModal(null)}
        aoConfirmar={confirmarModal}
      />

      {/* Editar meta: nome, tipo, valor, reiniciar e salvar */}
      <ModalEditarMeta
        visivel={editando}
        meta={meta}
        aoFechar={() => setEditando(false)}
        aoSalvar={salvarEdicao}
        aoReiniciar={reiniciarMeta}
      />

      {/* "Meta alcançada!" quando o depósito completa o valor */}
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