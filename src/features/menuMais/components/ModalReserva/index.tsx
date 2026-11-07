
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Ban,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react-native";

import { Card } from "@/shared/components/Cards";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Cores } from "@/shared/constants/Cores";
import { FONTS } from "@/shared/constants/Tipografia";

import type { TipoModalReserva } from "../../types";

import {
  formatarMoeda,
  mascararMoeda,
  moedaParaNumero,
} from "../../utils";

import { styles } from "./styles";

type Props = {
  tipo: TipoModalReserva | null;
  saldo: number;
  aoFechar: () => void;
  aoConfirmar: (
    valor: number,
    acao?: "depositar" | "retirar"
  ) => void;
  alvo?: "reserva" | "meta";
  titulo?: string;
  aoVerDetalhes?: () => void;
  erroServidor?: string;
  processando?: boolean;
};

const TEXTOS = {
  reserva: {
    depositar: "Depositar na reserva",
    retirar: "Retirar da reserva",
    dicaDepositar: "Saldo atual",
    dicaRetirar: "Saldo disponível",
    insuficienteTitulo: "Valor maior que o saldo",
    insuficienteTexto:
      "O valor informado é maior que o saldo disponível na sua reserva de emergência.",
    excluirTitulo: "Excluir reserva?",
    excluirTexto:
      "Todos os dados dessa reserva serão removidos.",
  },

  meta: {
    depositar: "Depositar na meta",
    retirar: "Retirar da meta",
    dicaDepositar: "Guardado até agora",
    dicaRetirar: "Disponível para retirar",
    insuficienteTitulo: "Valor maior que o guardado",
    insuficienteTexto:
      "O valor informado é maior que o valor guardado nessa meta.",
    excluirTitulo: "Excluir meta?",
    excluirTexto:
      "Todos os dados dessa meta serão removidos.",
  },
} as const;

// Estilos já utilizados nos modais de valores das metas.
const estilosMeta = StyleSheet.create({
  card: {
    width: "94%",
    alignSelf: "center",
    borderRadius: 22,
    borderWidth: 1,
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
    paddingHorizontal: 24,
  },

  pergunta: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 14,
    color: Cores.destaque.limao,
    marginBottom: 6,
  },

  campo: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 12,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.45)",
    backgroundColor: "#20152F",
    gap: 8,
  },

  prefixo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.destaque.limao,
  },

  input: {
    flex: 1,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: "#FFFFFF",
    paddingVertical: 0,
  },

  dica: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: "#C7A9F5",
    marginBottom: 4,
  },

  erro: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: "#FF7777",
    marginBottom: 10,
  },

  botoes: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
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

  textoSecundario: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: "#C7A9F5",
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

  textoPrimario: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 13,
    color: Cores.destaque.limao,
  },

  pressionado: {
    opacity: 0.75,
  },

  desabilitado: {
    opacity: 0.45,
  },
});

export function ModalReserva({
  tipo,
  saldo,
  aoFechar,
  aoConfirmar,
  alvo = "reserva",
  titulo,
  aoVerDetalhes,
  erroServidor,
  processando = false,
}: Props) {
  const textos = TEXTOS[alvo];

  const compacto = alvo === "meta";
  const tamanho = compacto ? "compacto" : "padrao";

  const modalMetaValor =
    alvo === "meta" &&
    (tipo === "depositar" || tipo === "retirar");

  const movimentarMeta =
    tipo === "movimentar" && alvo === "meta";

  const modalValorReserva =
    alvo === "reserva" &&
    (tipo === "meta" ||
      tipo === "depositar" ||
      tipo === "retirar");

  const modalConfirmacao =
    tipo === "cancelar" || tipo === "excluir";

  const modalPersonalizado =
    movimentarMeta || modalValorReserva;

  const [valorTexto, setValorTexto] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    setValorTexto("");
    setErro("");
  }, [tipo]);

  function confirmarValor(
    acao?: "depositar" | "retirar"
  ) {
    if (processando) return;

    const valor = moedaParaNumero(valorTexto);

    if (valor <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }

    aoConfirmar(valor, acao);
  }

  function renderCampoValor() {
    if (alvo === "meta") {
      return (
        <>
          <View style={estilosMeta.campo}>
            <Text style={estilosMeta.prefixo}>
              R$
            </Text>

            <TextInput
              style={estilosMeta.input}
              accessibilityLabel="Valor da movimentação"
              placeholder="0,00"
              placeholderTextColor="#8E7BA8"
              keyboardType="numeric"
              value={valorTexto}
              onChangeText={(texto) => {
                setValorTexto(mascararMoeda(texto));
                setErro("");
              }}
              editable={!processando}
            />
          </View>

          {erro ? (
            <Text style={estilosMeta.erro}>
              {erro}
            </Text>
          ) : null}
        </>
      );
    }

    if (modalValorReserva) {
      return (
        <View style={styles.campoValorReserva}>
          <View style={styles.linhaCampoValor}>
            <Text style={styles.prefixoValorReserva}>
              R$
            </Text>

            <TextInput
              style={styles.textoValorReserva}
              placeholder="0,00"
              placeholderTextColor="#8E7BA8"
              keyboardType="numeric"
              value={valorTexto}
              onChangeText={(texto) => {
                setValorTexto(mascararMoeda(texto));
                setErro("");
              }}
              editable={!processando}
            />
          </View>

          {erro ? (
            <Text
              style={{
                color: "#FF7777",
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              {erro}
            </Text>
          ) : null}
        </View>
      );
    }

    return (
      <Input
        placeholder="0,00"
        keyboardType="numeric"
        value={valorTexto}
        onChangeText={(texto) => {
          setValorTexto(mascararMoeda(texto));
          setErro("");
        }}
        erro={erro}
        icone={
          <Text style={styles.prefixoMoeda}>
            R$
          </Text>
        }
      />
    );
  }

  function renderCardComValor(
    chave: "depositar" | "retirar" | "meta"
  ) {
    const card =
      chave === "meta"
        ? {
            titulo: "Meta da reserva",
            pergunta: "Qual valor deseja alcançar?",
            dica: "",
          }
        : {
            titulo: textos[chave],
            pergunta:
              chave === "depositar"
                ? "Quanto deseja depositar?"
                : "Quanto deseja retirar?",
            dica:
              chave === "depositar"
                ? textos.dicaDepositar
                : textos.dicaRetirar,
          };

    if (modalMetaValor) {
      return (
        <>
          <Text style={estilosMeta.titulo}>
            {card.titulo}
          </Text>

          <Text style={estilosMeta.pergunta}>
            {card.pergunta}
          </Text>

          {renderCampoValor()}

          {card.dica ? (
            <Text style={estilosMeta.dica}>
              {card.dica}: {formatarMoeda(saldo)}
            </Text>
          ) : null}

          <View style={estilosMeta.botoes}>
            <Pressable
              onPress={aoFechar}
              disabled={processando}
              accessibilityRole="button"
              style={({ pressed }) => [
                estilosMeta.botaoSecundario,
                pressed && estilosMeta.pressionado,
                processando && estilosMeta.desabilitado,
              ]}
            >
              <Text style={estilosMeta.textoSecundario}>
                Cancelar
              </Text>
            </Pressable>

            <Pressable
              onPress={() => confirmarValor()}
              disabled={processando}
              accessibilityRole="button"
              style={({ pressed }) => [
                estilosMeta.botaoPrimario,
                pressed && estilosMeta.pressionado,
                processando && estilosMeta.desabilitado,
              ]}
            >
              <Text style={estilosMeta.textoPrimario}>
                Confirmar
              </Text>
            </Pressable>
          </View>
        </>
      );
    }

    return (
      <>
        <Text style={styles.titulo}>
          {card.titulo}
        </Text>

        <Text style={styles.pergunta}>
          {card.pergunta}
        </Text>

        {renderCampoValor()}

        {card.dica ? (
          <Text style={styles.dica}>
            {card.dica}: {formatarMoeda(saldo)}
          </Text>
        ) : null}

        <View
          style={[
            styles.botoes,
            compacto && styles.botoesCompactos,
            modalValorReserva && {
              gap: 10,
              marginTop: 6,
            },
          ]}
        >
          {modalValorReserva ? (
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.botaoConfirmarReserva,
                  pressed && styles.botaoPressionado,
                ]}
                onPress={() => confirmarValor()}
                disabled={processando}
                accessibilityRole="button"
              >
                <Text style={styles.textoConfirmarReserva}>
                  Confirmar
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.botaoCancelarReserva,
                  pressed && styles.botaoPressionado,
                ]}
                onPress={aoFechar}
                disabled={processando}
                accessibilityRole="button"
              >
                <Text style={styles.textoCancelarReserva}>
                  Cancelar
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Button
                tamanho={tamanho}
                titulo="Confirmar"
                onPress={() => confirmarValor()}
              />

              <Button
                tamanho={tamanho}
                titulo="Cancelar"
                variante="botaotexto"
                onPress={aoFechar}
              />
            </>
          )}
        </View>
      </>
    );
  }

  function renderCardMovimentar() {
    return (
      <>
        <Text
          style={[
            styles.titulo,
            movimentarMeta && {
              fontSize: 21,
              marginBottom: 10,
              paddingRight: 30,
            },
          ]}
        >
          {titulo ?? "Movimentar"}
        </Text>

        <Text
          style={[
            styles.pergunta,
            movimentarMeta && {
              fontSize: 14,
              marginBottom: 12,
            },
          ]}
        >
          Quanto deseja movimentar?
        </Text>

        <View
          style={
            movimentarMeta
              ? { marginBottom: 10 }
              : undefined
          }
        >
          {renderCampoValor()}
        </View>

        <Text
          style={[
            styles.dica,
            movimentarMeta && {
              marginTop: 0,
              marginBottom: 16,
              fontSize: 13,
            },
          ]}
        >
          {textos.dicaDepositar}: {formatarMoeda(saldo)}
        </Text>

        <View
          style={[
            styles.botoes,
            !movimentarMeta &&
              compacto &&
              styles.botoesCompactos,
            movimentarMeta && { gap: 12 },
          ]}
        >
          <View
            style={[
              styles.linhaBotoes,
              movimentarMeta && {
                gap: 12,
                alignItems: "stretch",
              },
            ]}
          >
            <View style={styles.colunaBotao}>
              {movimentarMeta ? (
                <Pressable
                  onPress={() =>
                    confirmarValor("depositar")
                  }
                  disabled={processando}
                  accessibilityRole="button"
                  style={{
                    minHeight: 44,
                    backgroundColor:
                      "rgba(55, 30, 89, 0.78)",
                    borderWidth: 1,
                    borderColor:
                      "rgba(163, 87, 255, 0.25)",
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.raleway.bold,
                      fontSize: 14,
                      color: "#B7FF00",
                    }}
                  >
                    Depositar
                  </Text>
                </Pressable>
              ) : (
                <Button
                  tamanho={tamanho}
                  titulo="Depositar"
                  onPress={() =>
                    confirmarValor("depositar")
                  }
                />
              )}
            </View>

            <View style={styles.colunaBotao}>
              {movimentarMeta ? (
                <Pressable
                  onPress={() =>
                    confirmarValor("retirar")
                  }
                  disabled={processando}
                  accessibilityRole="button"
                  style={{
                    minHeight: 44,
                    backgroundColor:
                      "rgba(56, 32, 91, 0.65)",
                    borderWidth: 1,
                    borderColor:
                      "rgba(163, 87, 255, 0.25)",
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.raleway.bold,
                      fontSize: 14,
                      color: "#C7A9F5",
                    }}
                  >
                    Retirar
                  </Text>
                </Pressable>
              ) : (
                <Button
                  tamanho={tamanho}
                  titulo="Retirar"
                  variante="outline"
                  onPress={() =>
                    confirmarValor("retirar")
                  }
                />
              )}
            </View>
          </View>

          {aoVerDetalhes ? (
            <Button
              tamanho={tamanho}
              titulo="Ver detalhes"
              variante="botaotexto"
              onPress={aoVerDetalhes}
            />
          ) : null}
        </View>
      </>
    );
  }

  function renderCardComIcone(
    icone: ReactNode,
    tituloCard: string,
    texto: string,
    botoes: ReactNode
  ) {
    return (
      <View style={styles.centralizado}>
        <View style={styles.iconeTopo}>
          {icone}
        </View>

        <Text
          style={[
            styles.titulo,
            styles.tituloCentro,
          ]}
        >
          {tituloCard}
        </Text>

        <Text style={styles.texto}>
          {texto}
        </Text>

        <View
          style={[
            styles.botoes,
            compacto && styles.botoesCompactos,
          ]}
        >
          {botoes}
        </View>
      </View>
    );
  }

  // Confirmação compacta compartilhada.
  function renderConfirmacao(
    acao: "cancelar" | "excluir"
  ) {
    const cancelamento = acao === "cancelar";

    const tituloConfirmacao = cancelamento
      ? "Cancelar meta?"
      : textos.excluirTitulo;

    const descricao = cancelamento
      ? "A meta vai para o Histórico como cancelada. O valor guardado não é apagado."
      : textos.excluirTexto;

    const Icone = cancelamento ? Ban : Trash2;

    return (
      <View style={styles.conteudoConfirmacao}>
        <View style={styles.iconeConfirmacao}>
          <Icone
            size={28}
            color="#C7A9F5"
          />
        </View>

        <Text style={styles.tituloConfirmacao}>
          {tituloConfirmacao}
        </Text>

        <Text style={styles.descricaoConfirmacao}>
          {descricao}
        </Text>

        <View style={styles.botoesConfirmacao}>
          <Pressable
            onPress={aoFechar}
            disabled={processando}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.botaoVoltarConfirmacao,
              pressed && styles.botaoPressionado,
              processando && styles.botaoDesabilitado,
            ]}
          >
            <Text style={styles.textoVoltarConfirmacao}>
              {cancelamento ? "Voltar" : "Cancelar"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (!processando) {
                aoConfirmar(0);
              }
            }}
            disabled={processando}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.botaoPerigoConfirmacao,
              pressed && styles.botaoPressionado,
              processando && styles.botaoDesabilitado,
            ]}
          >
            <Text style={styles.textoPerigoConfirmacao}>
              {cancelamento ? "Cancelar meta" : "Excluir"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function renderConteudo() {
    switch (tipo) {
      case "depositar":
      case "retirar":
      case "meta":
        return renderCardComValor(tipo);

      case "movimentar":
        return renderCardMovimentar();

      case "criar":
        return renderCardComIcone(
          <Image
            source={require("../../../../../assets/icones/saco.png")}
            style={styles.imagemIcone}
            resizeMode="contain"
          />,
          "Crie sua reserva de emergência",
          "Guarde um valor para lidar com imprevistos sem comprometer seu orçamento.",
          <>
            <Button
              tamanho={tamanho}
              titulo="Criar reserva"
              onPress={() => aoConfirmar(0)}
            />

            <Button
              tamanho={tamanho}
              titulo="Agora não"
              variante="botaotexto"
              onPress={aoFechar}
            />
          </>
        );

      case "saldoInsuficiente":
        return renderCardComIcone(
          <TriangleAlert
            size={44}
            color={Cores.roxo.claro}
          />,
          textos.insuficienteTitulo,
          textos.insuficienteTexto,
          <Button
            tamanho={tamanho}
            titulo="Entendi"
            onPress={() => aoConfirmar(0)}
          />
        );

      case "excluir":
        return renderConfirmacao("excluir");

      case "cancelar":
        return renderConfirmacao("cancelar");

      default:
        return null;
    }
  }

  return (
    <Modal
      visible={tipo !== null}
      transparent
      animationType="fade"
      onRequestClose={aoFechar}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <Pressable
          style={styles.fundo}
          onPress={aoFechar}
        />

        <Card
          gradiente={
            modalConfirmacao || modalMetaValor
              ? [
                  "rgba(44, 27, 67, 0.96)",
                  "rgba(44, 27, 67, 0.96)",
                ]
              : modalPersonalizado
                ? [
                    "rgba(44, 27, 67, 0.92)",
                    "rgba(44, 27, 67, 0.92)",
                  ]
                : [
                    "rgba(58, 30, 122, 0.95)",
                    "rgba(45, 17, 108, 0.95)",
                  ]
          }
          style={[
            styles.card,
            modalPersonalizado && {
              width: "94%",
              alignSelf: "center",
              borderColor:
                "rgba(163, 87, 255, 0.25)",
              paddingHorizontal: 18,
              paddingTop: 20,
              paddingBottom: 16,
            },
            modalMetaValor && estilosMeta.card,
            modalConfirmacao && styles.cardConfirmacao,
          ]}
        >
          <Pressable
            style={styles.fechar}
            onPress={aoFechar}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <X
              size={22}
              color={Cores.texto.claro}
            />
          </Pressable>

          {renderConteudo()}

          {erroServidor ? (
            <Text
              accessibilityRole="alert"
              style={{
                color: "#FFDFDF",
                paddingTop: 8,
              }}
            >
              {erroServidor}
            </Text>
          ) : null}

          {processando ? (
            <Text style={{ color: "#FFFFFF" }}>
              Processando...
            </Text>
          ) : null}
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  );
}
