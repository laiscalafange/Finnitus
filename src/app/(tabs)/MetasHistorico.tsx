
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";

import { RotateCcw } from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { Progress } from "../../shared/components/Progress";
import { Cores } from "../../shared/constants/Cores";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { CATEGORIAS_POR_ID } from "@/features/menuMais/constants";
import { formatarMoeda } from "@/features/menuMais/utils";
import { errorMessage } from "@/services/api";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  formatarDataCurta,
  percentualMeta,
} from "@/features/metasData";

import { styles } from "../../styles/Metashistorico";

type Filtro = "todas" | "concluida" | "cancelada";

const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "todas", rotulo: "Todas" },
  { id: "concluida", rotulo: "Concluídas" },
  { id: "cancelada", rotulo: "Canceladas" },
];

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.94)",
  "rgba(44, 27, 67, 0.90)",
];

const VERDE = Cores.destaque.limao;
const ROXO = "#A357FF";

function obterObjetivo(meta: unknown): number | null {
  const dados = meta as Record<string, unknown>;

  const bruto =
    dados.valorObjetivo ??
    dados.valorMeta ??
    dados.valorAlvo ??
    dados.valorDesejado;

  if (bruto == null) return null;

  const numero = Number(bruto);

  return Number.isFinite(numero) ? numero : null;
}

export default function MetasHistorico() {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [reabrindoId, setReabrindoId] = useState<string | null>(
    null
  );

  const { metas, reabrirMeta } = useFinanceiro();

  async function desfazer(id: string) {
    if (reabrindoId !== null) return;

    setReabrindoId(id);

    try {
      await reabrirMeta(id);
    } catch (error) {
      Alert.alert(
        "Não foi possível desfazer",
        errorMessage(error)
      );
    } finally {
      setReabrindoId(null);
    }
  }

  const lista = metas
    .filter(
      (meta) =>
        meta.status === "concluida" ||
        meta.status === "cancelada"
    )
    .filter(
      (meta) =>
        filtro === "todas" || meta.status === filtro
    )
    .sort((a, b) =>
      (b.dataFinal ?? "").localeCompare(a.dataFinal ?? "")
    );

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo="Histórico" />

        <View style={styles.conteudoSobreHeader}>
          {/* FILTROS */}
          <View style={styles.areaFiltros}>
            <AlternadorTipo
              valor={filtro}
              aoMudar={setFiltro}
              opcoes={FILTROS}
            />
          </View>

          {/* LISTA DE METAS */}
          {lista.length === 0 ? (
            <Text style={styles.vazio}>
              Nenhuma meta encontrada.
            </Text>
          ) : (
            lista.map((meta) => {
              const concluida = meta.status === "concluida";

              const categoria =
                CATEGORIAS_POR_ID[
                  meta.categoriaId ?? "outros"
                ] ?? CATEGORIAS_POR_ID.outros;

              const Icone = categoria.icone;

              const valorAtual = Number(meta.valorAtual) || 0;
              const valorObjetivo = obterObjetivo(meta);

              const percentual = Math.min(
                100,
                Math.max(0, percentualMeta(meta))
              );

              const reabrindo = reabrindoId === meta.id;

              return (
                <Card
                  key={meta.id}
                  gradiente={GRADIENTE_CARD}
                  style={styles.card}
                >
                  {/* NOME, ÍCONE E STATUS */}
                  <View style={styles.linhaCard}>
                    <View style={styles.caixaIcone}>
                      <Icone
                        size={21}
                        color={VERDE}
                      />
                    </View>

                    <View style={styles.textos}>
                      <Text
                        numberOfLines={2}
                        style={styles.nome}
                      >
                        {meta.nome}
                      </Text>

                      {meta.dataFinal ? (
                        <Text style={styles.data}>
                          {concluida
                            ? "Concluída em "
                            : "Cancelada em "}
                          {formatarDataCurta(meta.dataFinal)}
                        </Text>
                      ) : (
                        <Text style={styles.data}>
                          {concluida
                            ? "Meta concluída"
                            : "Meta cancelada"}
                        </Text>
                      )}
                    </View>

                    <View
                      style={[
                        styles.selo,
                        concluida
                          ? styles.seloConcluida
                          : styles.seloCancelada,
                      ]}
                    >
                      <Text
                        style={[
                          styles.seloTexto,
                          concluida
                            ? styles.seloTextoConcluida
                            : styles.seloTextoCancelada,
                        ]}
                      >
                        {concluida
                          ? "Concluída"
                          : "Cancelada"}
                      </Text>
                    </View>
                  </View>

                  {/* VALORES */}
                  <View style={styles.linhaValores}>
                    <View style={styles.blocoValor}>
                      <Text style={styles.rotuloValor}>
                        Guardado
                      </Text>

                      <Text style={styles.valorGuardado}>
                        {formatarMoeda(valorAtual)}
                      </Text>
                    </View>

                    <View style={styles.blocoValorDireita}>
                      <Text style={styles.rotuloValor}>
                        Objetivo
                      </Text>

                      <Text style={styles.valorObjetivo}>
                        {valorObjetivo !== null
                          ? formatarMoeda(valorObjetivo)
                          : "Não informado"}
                      </Text>
                    </View>
                  </View>

                  {/* PROGRESSO */}
                  <View style={styles.areaProgresso}>
                    <View style={styles.linhaProgresso}>
                      <Text style={styles.rotuloProgresso}>
                        Progresso alcançado
                      </Text>

                      <Text
                        style={[
                          styles.percentual,
                          concluida &&
                            styles.percentualConcluida,
                        ]}
                      >
                        {percentual}%
                      </Text>
                    </View>

                    <Progress
                      value={percentual}
                      height={6}
                      color={concluida ? VERDE : ROXO}
                      backgroundColor="#160B29"
                    />
                  </View>

                  {/* DESFAZER */}
                  <Pressable
                    onPress={() => desfazer(meta.id)}
                    disabled={reabrindoId !== null}
                    style={({ pressed }) => [
                      styles.botaoDesfazer,
                      pressed && styles.botaoPressionado,
                      reabrindoId !== null &&
                        styles.botaoDesabilitado,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={
                      concluida
                        ? "Desfazer conclusão"
                        : "Desfazer cancelamento"
                    }
                  >
                    <RotateCcw
                      size={15}
                      color="#C7A9F5"
                    />

                    <Text style={styles.textoDesfazer}>
                      {reabrindo
                        ? "Reabrindo..."
                        : concluida
                          ? "Desfazer conclusão"
                          : "Desfazer cancelamento"}
                    </Text>
                  </Pressable>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
