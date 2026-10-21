import { useState } from "react";
import { ScrollView, Text, View } from "react-native";


import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { Cores } from "../../shared/constants/Cores";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { CATEGORIAS_POR_ID } from "@/features/menuMais/constants";
import { formatarMoeda } from "@/features/menuMais/utils";
import { useFinanceiro } from "@/features/financeiroContext";
import { formatarDataCurta } from "@/features/metasData";
import { styles } from "../../styles/Metashistorico";

type Filtro = "todas" | "concluida" | "cancelada";

// Opções do filtro (reaproveita o alternador do Novo gasto)
const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "todas", rotulo: "Todas" },
  { id: "concluida", rotulo: "Concluídas" },
  { id: "cancelada", rotulo: "Canceladas" },
];

// Mesmo roxo dos cards da tela Metas (mês e longo prazo)
const GRADIENTE_CARD: [string, string] = [Cores.fundo.destaque, "#5a2dc7"];

// Tela "Histórico" de Metas: metas que já foram concluídas ou canceladas,
// com filtro por situação. Aberta pelo botão "Histórico" da tela Metas.
export default function MetasHistorico() {
  const [filtro, setFiltro] = useState<Filtro>("todas");

  // As mesmas metas das outras telas de Metas (FinanceiroProvider): aqui só
  // as concluídas e canceladas, da mais recente pra mais antiga
  const { metas } = useFinanceiro();

  const lista = metas
    .filter((meta) => meta.status !== "andamento")
    .filter((meta) => filtro === "todas" || meta.status === filtro)
    .sort((a, b) => (b.dataFinal ?? "").localeCompare(a.dataFinal ?? ""));

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho: só a seta de voltar e o título, igual ao protótipo */}
        <HeaderInterno titulo="Histórico" />

        {/* Conteúdo (logo abaixo do cabeçalho) */}
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
                CATEGORIAS_POR_ID[meta.categoriaId ?? "outros"] ??
                CATEGORIAS_POR_ID.outros
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
                        {formatarMoeda(meta.valorAtual)}
                        {meta.dataFinal ? ` · ${formatarDataCurta(meta.dataFinal)}` : ""}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}