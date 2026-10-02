import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Cores } from "../../shared/constants/Cores";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { CATEGORIAS_POR_ID } from "@/features/menuMais/constants";
import { formatarMoeda } from "@/features/menuMais/utils";
import { METAS_FINALIZADAS } from "@/features/metasData";
import { styles } from "../../styles/Metashistorico";

type Filtro = "todas" | "concluida" | "cancelada";

// Opções do filtro (reaproveita o alternador do Novo gasto)
const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "todas", rotulo: "Todas" },
  { id: "concluida", rotulo: "Concluídas" },
  { id: "cancelada", rotulo: "Canceladas" },
];

// Gradientes iguais aos das outras telas de Metas
const GRADIENTE_FUNDO: [string, string, string] = [
  "#3f1e69",
  "#08070A",
  "#291444",
];
const GRADIENTE_CARD: [string, string] = [
  Cores.fundo.cardAlt,
  Cores.fundo.navBarra,
];

// Tela "Histórico" de Metas: metas que já foram concluídas ou canceladas,
// com filtro por situação. Aberta pelo botão "Histórico" da tela Metas.
export default function MetasHistorico() {
  const [filtro, setFiltro] = useState<Filtro>("todas");

  // TODO (backend): trocar METAS_FINALIZADAS pelos dados da API
  const lista = METAS_FINALIZADAS.filter(
    (meta) => filtro === "todas" || meta.status === filtro
  );

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
        {/* Cabeçalho: só a seta de voltar e o título, igual ao protótipo */}
        <HeaderInterno
          titulo="Histórico"
          subtitulo="Metas"
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        {/* Conteúdo (sobe por cima da faixa roxa do header) */}
        <View style={styles.conteudoSobreHeader}>
          <AlternadorTipo
            valor={filtro}
            aoMudar={setFiltro}
            opcoes={FILTROS}
          />

          {lista.length === 0 ? (
            <Text style={styles.vazio}>Nenhuma meta encontrada.</Text>
          ) : (
            lista.map((meta) => {
              const concluida = meta.status === "concluida";

              // Mesmo ícone da categoria usado no Novo gasto
              const Icone = (
                CATEGORIAS_POR_ID[meta.categoriaId] ?? CATEGORIAS_POR_ID.outros
              ).icone;

              return (
                <Card
                  key={meta.id}
                  gradiente={GRADIENTE_CARD}
                  style={styles.card}
                >
                  <View style={styles.linhaCard}>
                    <View style={styles.caixaIcone}>
                      <Icone size={24} color={Cores.destaque.limao} />
                    </View>

                    <View style={styles.textos}>
                      <View style={styles.linhaTopo}>
                        <Text numberOfLines={1} style={styles.nome}>
                          {meta.nome}
                        </Text>

                        {/* Selo de status */}
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
                            {concluida ? "Concluída" : "Cancelada"}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.detalhe}>
                        {formatarMoeda(meta.valor)} · {meta.data}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}