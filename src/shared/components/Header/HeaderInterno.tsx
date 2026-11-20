import { View, StyleSheet } from "react-native";
import { Text } from "@/shared/components/Texto";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FONTS } from "../../constants/Tipografia";
import { Cores } from "../../constants/Cores";
import { BotaoVoltar } from "../BotaoVoltar";

export interface HeaderInternoProps {
  titulo: string;
  // Linha pequena opcional abaixo do título (ex.: "Outubro 2026").
  // Só use quando ela traz uma informação que a tela não mostra em outro lugar
  subtitulo?: string;
  // Mostra a seta de voltar à esquerda do título (padrão: true)
  mostrarVoltar?: boolean;
}

// Cabeçalho discreto das telas funcionais (formulários, listas, detalhes...):
// só o botão de voltar e o título, sem faixa roxa nem curva decorativa.
// O fundo da tela vem do BackgroundGradient (variante="funcional").
// As telas Premium e Metas continuam usando o HeaderMP.
export function HeaderInterno({
  titulo,
  subtitulo,
  mostrarVoltar = true,
}: HeaderInternoProps) {
  // Respeita a área do topo (notch / barra de status) em cada aparelho
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
      {/* Seta de voltar em verde-limão pra ter contraste no fundo escuro */}
      {mostrarVoltar && <BotaoVoltar cor={Cores.destaque.limao} />}

      <View style={styles.textos}>
        <Text style={styles.titulo} numberOfLines={1}>
          {titulo}
        </Text>

        {subtitulo ? (
          <Text style={styles.subtitulo} numberOfLines={1}>
            {subtitulo}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Faixa simples no topo, transparente (aparece o fundo da tela)
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },

  // minWidth 0 deixa o título encolher em vez de empurrar a tela pro lado
  textos: {
    flex: 1,
    minWidth: 0,
  },

  titulo: {
    color: Cores.base.branco,
    fontSize: 22,
    lineHeight: 28,
    fontFamily: FONTS.raleway.bold,
  },

  subtitulo: {
    color: Cores.texto.claro,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: FONTS.quicksand.medium,
  },
});