import { useState } from "react";
import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Minus, Plus } from "lucide-react-native";
import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { Progress } from "../../shared/components/Progress";
import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/metasdetalhes";

import { ModalReserva } from "@/features/menuMais/components/ModalReserva";
import { formatarMoeda } from "@/features/menuMais/utils";
import type { TipoModalReserva } from "@/features/menuMais/types";
// Círculos de + e − do histórico (os mesmos da Reserva de emergência)
import { styles as reserva } from "@/features/menuMais/styles/reserva";
import { useFinanceiro } from "@/features/financeiroContext";
import { formatarDataCurta, percentualMeta } from "@/features/metasData";

import MetasFrame from "./MetasFrame";

// Quantas movimentações aparecem antes de tocar em "Ver mais"
const MOVIMENTACOES_VISIVEIS = 4;

const GRADIENTE_FUNDO: [string, string, string] = [
  "#3f1e69",
  "#08070A",
  "#291444",
];

// Tela "Metas > Detalhes". Recebe o id da meta pela rota
// (/MetasDetalhes?id=...) e mostra exatamente os dados dela.
export default function MetasDetalhes() {
  // Hook de navegação do Expo Router
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const { metas, movimentarMeta, cancelarMeta } = useFinanceiro();
  const meta = metas.find((item) => item.id === id);

  // Card flutuante aberto ("depositar" ou "cancelar")
  const [modal, setModal] = useState<TipoModalReserva | null>(null);
  const [verTodas, setVerTodas] = useState(false);
  const [alcancada, setAlcancada] = useState(false);

  // Meta que não existe mais (ex.: foi excluída)
  if (!meta) {
    return (
      <LinearGradient
        colors={GRADIENTE_FUNDO}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <HeaderInterno titulo="Metas" subtitulo="Detalhes" />

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
  function confirmarModal(valor: number) {
    if (!meta) {
      return;
    }

    if (modal === "depositar") {
      const resultado = movimentarMeta(meta.id, "deposito", valor);

      setModal(null);

      // O depósito completou o valor da meta
      if (resultado === "concluida") {
        setAlcancada(true);
      }

      return;
    }

    if (modal === "cancelar") {
      cancelarMeta(meta.id);
      setModal(null);
      router.navigate("/metas");
      return;
    }

    setModal(null);
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
        <HeaderInterno
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

          {/* Depositar e Cancelar meta só aparecem enquanto a meta está em
              andamento */}
          {emAndamento ? (
            <>
              <Button
                titulo="Depositar"
                variante="secundario"
                onPress={() => setModal("depositar")}
              />

              {/* Botão discreto, no lado direito, abaixo do Depositar */}
              <View style={styles.linhaCancelar}>
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

      {/* Cards flutuantes: depositar e cancelar meta */}
      <ModalReserva
        tipo={modal}
        saldo={meta.valorAtual}
        alvo="meta"
        aoFechar={() => setModal(null)}
        aoConfirmar={confirmarModal}
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