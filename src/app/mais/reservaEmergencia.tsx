
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Text } from "@/shared/components/Texto";
import axios from "axios";
import { Minus, Plus, Trash2 } from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Cards";
import { Progress } from "../../shared/components/Progress";
import { Cores } from "../../shared/constants/Cores";
import { ModalReserva } from "@/features/menuMais/components/ModalReserva";
import { useVoltar } from "@/features/menuMais/useVoltar";
import { useMoedaVisivel } from "@/features/configuracoesContext";
import type { Reserva, TipoModalReserva } from "@/features/menuMais/types";
import { styles as base } from "@/features/menuMais/styles/formulario";
import { styles } from "@/features/menuMais/styles/reserva";
import { reservaApi } from "@/services/reserva";

const MAX_MOVIMENTACOES = 5;

const GRADIENTE_CARD: [string, string] = [
  Cores.fundo.cardAlt,
  Cores.fundo.cardAlt,
];

function mensagemErro(erro: unknown): string {
  if (axios.isAxiosError(erro)) {
    const dados: unknown = erro.response?.data;

    if (
      dados !== null &&
      typeof dados === "object" &&
      "mensagem" in dados &&
      typeof dados.mensagem === "string"
    ) {
      return dados.mensagem;
    }

    if (!erro.response) {
      return "Não foi possível conectar ao servidor. Verifique sua internet e a API.";
    }
  }

  return "Não foi possível concluir a operação. Tente novamente.";
}

export default function ReservaEmergencia() {
  const moedaVisivel = useMoedaVisivel();
  const voltar = useVoltar();

  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [modal, setModal] = useState<TipoModalReserva | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [erroModal, setErroModal] = useState("");
  const bloqueioEnvio = useRef(false);

  const carregarReserva = useCallback(async () => {
    setCarregando(true);
    setErroCarregamento("");

    try {
      const dados = await reservaApi.buscar();
      setReserva(dados);
      setModal(dados ? null : "criar");
    } catch (erro) {
      setErroCarregamento(mensagemErro(erro));
      setModal(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarReserva();
  }, [carregarReserva]);

  const saldo = reserva?.saldo ?? 0;
  const meta = reserva?.meta;

  const percentual =
    meta && meta > 0
      ? Math.min(100, Math.round((saldo / meta) * 100))
      : 0;

  function abrirModal(tipo: TipoModalReserva) {
    setErroModal("");
    setModal(tipo);
  }

  function fecharModal() {
    if (processando) return;

    setErroModal("");

    if (!reserva) {
      voltar();
      return;
    }

    setModal(null);
  }

  async function confirmarModal(valor: number) {
    const acao = modal;

    if (!acao || bloqueioEnvio.current) return;

    if (acao === "saldoInsuficiente") {
      setModal(null);
      return;
    }

    if (acao !== "criar" && !reserva) return;

    if (
      acao === "retirar" &&
      Math.round(valor * 100) > Math.round(saldo * 100)
    ) {
      abrirModal("saldoInsuficiente");
      return;
    }

    bloqueioEnvio.current = true;
    setProcessando(true);
    setErroModal("");

    try {
      let novaReserva: Reserva;

      switch (acao) {
        case "criar":
          novaReserva = await reservaApi.criar();
          break;

        case "depositar":
          novaReserva = await reservaApi.depositar(valor);
          break;

        case "retirar":
          novaReserva = await reservaApi.retirar(valor);
          break;

        case "meta":
          novaReserva = await reservaApi.definirMeta(valor);
          break;

        case "excluir":
          await reservaApi.excluir();
          setReserva(null);
          setModal(null);
          voltar();
          return;

        default:
          return;
      }

      setReserva(novaReserva);
      setModal(null);
    } catch (erro) {
      if (
        acao === "retirar" &&
        axios.isAxiosError(erro) &&
        erro.response?.status === 409
      ) {
        abrirModal("saldoInsuficiente");
      } else if (
        acao === "criar" &&
        axios.isAxiosError(erro) &&
        erro.response?.status === 409
      ) {
        await carregarReserva();
      } else {
        setErroModal(mensagemErro(erro));
      }
    } finally {
      bloqueioEnvio.current = false;
      setProcessando(false);
    }
  }

  return (
    <View style={base.container}>
      <BackgroundGradient variante="funcional" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={base.conteudo}
      >
        <HeaderInterno titulo="Reserva de emergência" />

        {carregando ? (
          <ActivityIndicator
            style={{ marginTop: 32 }}
            size="large"
            color={Cores.destaque.limao}
          />
        ) : erroCarregamento ? (
          <View style={{ padding: 24, gap: 16 }}>
            <Text style={{ color: Cores.texto.claro }}>
              {erroCarregamento}
            </Text>

            <Button
              titulo="Tentar novamente"
              onPress={() => void carregarReserva()}
            />
          </View>
        ) : reserva ? (
          <View style={base.formulario}>
            {/* RESERVA DISPONÍVEL */}
            <Card
              gradiente={GRADIENTE_CARD}
              style={[styles.card, styles.cardSaldo]}
            >
              <View style={styles.linhaSaldo}>
                <Text style={styles.rotuloPequeno}>
                  Reserva disponível
                </Text>

                <Text style={styles.valorSaldo}>
                  {moedaVisivel(saldo)}
                </Text>
              </View>
            </Card>

            {/* META DA RESERVA */}
            <Card gradiente={GRADIENTE_CARD} style={styles.card}>
              <View style={styles.linhaMeta}>
                <Text style={styles.rotuloPequeno}>
                  Meta da reserva
                </Text>

                <Pressable
                  style={styles.chipMeta}
                  onPress={() => abrirModal("meta")}
                  accessibilityRole="button"
                >
                  <Text style={styles.textoChipMeta}>
                    Definir meta
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.valorMeta}>
                {meta ? moedaVisivel(meta) : "Sem meta definida"}
              </Text>

              <View style={styles.linhaProgresso}>
                <View style={styles.barraProgresso}>
                  <Progress
                    value={saldo}
                    max={meta ?? 1}
                    height={10}
                    color={Cores.roxo.claro}
                    backgroundColor={"#16082baf"}
                  />
                </View>

                <Text style={styles.percentual}>
                  {percentual}%
                </Text>
              </View>
            </Card>

            {/* DEPOSITAR E RETIRAR */}
            <View style={styles.linhaBotoes}>
              <Pressable
                style={({ pressed }) => [
                  styles.botaoDepositar,
                  pressed && styles.botaoPressionado,
                ]}
                onPress={() => abrirModal("depositar")}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotaoDepositar}>
                  Depositar
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.botaoRetirar,
                  pressed && styles.botaoPressionado,
                ]}
                onPress={() => abrirModal("retirar")}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotaoRetirar}>
                  Retirar
                </Text>
              </Pressable>
            </View>

            {/* ÚLTIMAS MOVIMENTAÇÕES */}
            <Text style={styles.tituloSecao}>
              Últimas movimentações
            </Text>

            {reserva.movimentacoes.length === 0 ? (
              <Text style={styles.semMovimentacoes}>
                Nenhuma movimentação ainda.
              </Text>
            ) : (
              reserva.movimentacoes
                .slice(0, MAX_MOVIMENTACOES)
                .map((mov) => {
                  const deposito = mov.tipo === "deposito";

                  return (
                    <Card
                      key={mov.id}
                      gradiente={GRADIENTE_CARD}
                      style={styles.card}
                    >
                      <View style={styles.linhaMovimentacao}>
                        <View
                          style={[
                            styles.circuloMovimentacao,
                            deposito
                              ? styles.circuloDeposito
                              : styles.circuloRetirada,
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

                        <View style={styles.textosMovimentacao}>
                          <Text
                            style={[
                              styles.valorMovimentacao,
                              !deposito && styles.valorRetirada,
                            ]}
                          >
                            {deposito ? "+" : "-"}{" "}
                            {moedaVisivel(mov.valor)}
                          </Text>

                          <Text style={styles.tipoMovimentacao}>
                            {deposito ? "Depósito" : "Retirada"}
                          </Text>
                        </View>

                        <Text style={styles.dataMovimentacao}>
                          {mov.data}
                        </Text>
                      </View>
                    </Card>
                  );
                })
            )}

            {/* EXCLUIR RESERVA */}
            <Pressable
              style={({ pressed }) => [
                styles.botaoExcluir,
                pressed && styles.botaoPressionado,
              ]}
              onPress={() => abrirModal("excluir")}
              accessibilityRole="button"
            >
              <Trash2 size={20} color="#FF7777" />

              <Text style={styles.textoExcluir}>
                Excluir reserva
              </Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <ModalReserva
        tipo={modal}
        saldo={saldo}
        aoFechar={fecharModal}
        aoConfirmar={confirmarModal}
        erroServidor={erroModal}
        processando={processando}
      />
    </View>
  );
}
