import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Minus, PiggyBank, Plus, Trash2 } from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Cards";
import { Progress } from "../../shared/components/Progress";
import { Cores } from "../../shared/constants/Cores";

import { ModalReserva } from "@/features/menuMais/components/ModalReserva";
import { useVoltar } from "@/features/menuMais/useVoltar";
import { formatarMoeda, hojeFormatado } from "@/features/menuMais/utils";
import type {
  Reserva,
  TipoModalReserva,
} from "@/features/menuMais/types";
import { styles as base } from "@/features/menuMais/styles/formulario";
import { styles } from "@/features/menuMais/styles/reserva";

// Quantas movimentações aparecem em "Últimas movimentações"
const MAX_MOVIMENTACOES = 5;

// Gradiente dos cards (mesma família de roxos do resto do app)
const GRADIENTE_CARD: [string, string] = [
  Cores.fundo.cardAlt,
  Cores.fundo.navBarra,
];

// Tela "Reserva de emergência": é a única reserva do usuário. Mostra o valor
// disponível, a meta e o progresso, e permite depositar ou retirar dinheiro.
export default function ReservaEmergencia() {
  const voltar = useVoltar();

  // null = o usuário ainda não criou a reserva.
  // TODO (backend): não existe endpoint de reserva ainda. Hoje os dados ficam
  // só na memória da tela; quando existir, carregar a reserva da API aqui e
  // chamar a API em cada ação (criar, depositar, retirar, definir meta, excluir).
  const [reserva, setReserva] = useState<Reserva | null>(null);

  // Card flutuante aberto. Começa em "criar" porque ainda não há reserva
  const [modal, setModal] = useState<TipoModalReserva | null>("criar");

  const saldo = reserva?.saldo ?? 0;
  const meta = reserva?.meta;

  // Progresso em % (0 se não há meta), limitado a 100
  const percentual = meta
    ? Math.min(100, Math.round((saldo / meta) * 100))
    : 0;

  // Fecha o card. Sem reserva criada, fechar o convite de criação
  // ("Agora não" ou X) equivale a sair da tela
  function fecharModal() {
    if (!reserva) {
      voltar();
      return;
    }

    setModal(null);
  }

  // Trata a confirmação de cada card
  function confirmarModal(valor: number) {
    if (modal === "criar") {
      setReserva({ saldo: 0, movimentacoes: [] });
      setModal(null);
      return;
    }

    if (!reserva) {
      return;
    }

    switch (modal) {
      case "depositar":
        setReserva({
          ...reserva,
          saldo: Math.round((reserva.saldo + valor) * 100) / 100,
          movimentacoes: [
            {
              id: String(Date.now()),
              tipo: "deposito",
              valor,
              data: hojeFormatado(),
            },
            ...reserva.movimentacoes,
          ],
        });
        setModal(null);
        break;

      case "retirar":
        // Compara em centavos pra não errar por arredondamento
        if (Math.round(valor * 100) > Math.round(reserva.saldo * 100)) {
          setModal("saldoInsuficiente");
          break;
        }

        setReserva({
          ...reserva,
          saldo: Math.round((reserva.saldo - valor) * 100) / 100,
          movimentacoes: [
            {
              id: String(Date.now()),
              tipo: "retirada",
              valor,
              data: hojeFormatado(),
            },
            ...reserva.movimentacoes,
          ],
        });
        setModal(null);
        break;

      case "meta":
        setReserva({ ...reserva, meta: valor });
        setModal(null);
        break;

      case "excluir":
        setReserva(null);
        setModal(null);
        voltar();
        break;

      // "Entendi" no aviso de saldo insuficiente
      default:
        setModal(null);
    }
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={base.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={base.conteudo}
      >
        {/* Cabeçalho: só a seta de voltar e o título. O título vai em duas
            linhas (título + subtítulo) porque "Reserva de emergência" não
            cabe numa linha só ao lado da seta */}
        <HeaderInterno
          titulo="Reserva"
          subtitulo="de emergência"
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        {/* Conteúdo (sobe por cima da faixa roxa do header). Só aparece
            depois que a reserva foi criada */}
        {reserva ? (
          <View style={base.formulario}>
            {/* Reserva disponível */}
            <Card gradiente={GRADIENTE_CARD} style={styles.card}>
              <View style={styles.linhaSaldo}>
                <PiggyBank size={40} color={Cores.destaque.limao} />

                <View>
                  <Text style={styles.rotuloPequeno}>Reserva disponível</Text>
                  <Text style={styles.valorSaldo}>
                    {formatarMoeda(saldo)}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Meta e progresso */}
            <Card gradiente={GRADIENTE_CARD} style={styles.card}>
              <View style={styles.linhaMeta}>
                <Text style={styles.rotuloPequeno}>Meta da reserva</Text>

                <Pressable
                  style={styles.chipMeta}
                  onPress={() => setModal("meta")}
                  accessibilityRole="button"
                >
                  <Text style={styles.textoChipMeta}>Definir meta</Text>
                </Pressable>
              </View>

              <Text style={styles.valorMeta}>
                {meta ? formatarMoeda(meta) : "Sem meta definida"}
              </Text>

              <View style={styles.linhaProgresso}>
                <View style={styles.barraProgresso}>
                  <Progress
                    value={saldo}
                    max={meta ?? 1}
                    height={10}
                    color={Cores.destaque.limao}
                  />
                </View>

                <Text style={styles.percentual}>{percentual}%</Text>
              </View>
            </Card>

            {/* Depositar | Retirar */}
            <View style={styles.linhaBotoes}>
              <View style={styles.colunaBotao}>
                <Button
                  titulo="Depositar"
                  onPress={() => setModal("depositar")}
                />
              </View>

              <View style={styles.colunaBotao}>
                <Button
                  titulo="Retirar"
                  onPress={() => setModal("retirar")}
                />
              </View>
            </View>

            {/* Últimas movimentações */}
            <Text style={styles.tituloSecao}>Últimas movimentações</Text>

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
                            <Plus size={18} color={Cores.destaque.limao} />
                          ) : (
                            <Minus size={18} color={Cores.roxo.claro} />
                          )}
                        </View>

                        <View style={styles.textosMovimentacao}>
                          <Text
                            style={[
                              styles.valorMovimentacao,
                              !deposito && styles.valorRetirada,
                            ]}
                          >
                            {deposito ? "+" : "-"} {formatarMoeda(mov.valor)}
                          </Text>

                          <Text style={styles.tipoMovimentacao}>
                            {deposito ? "Depósito" : "Retirada"}
                          </Text>
                        </View>

                        <Text style={styles.dataMovimentacao}>{mov.data}</Text>
                      </View>
                    </Card>
                  );
                })
            )}

            {/* Excluir reserva */}
            <Button
              titulo="Excluir reserva"
              variante="botaotexto"
              icone={<Trash2 size={16} color="#A357FF" />}
              onPress={() => setModal("excluir")}
            />
          </View>
        ) : null}
      </ScrollView>

      {/* Cards flutuantes (criar, depositar, retirar, meta, aviso, excluir) */}
      <ModalReserva
        tipo={modal}
        saldo={saldo}
        aoFechar={fecharModal}
        aoConfirmar={confirmarModal}
      />
    </LinearGradient>
  );
}