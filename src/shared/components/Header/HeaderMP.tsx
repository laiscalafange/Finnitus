import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SinoNotificacoes } from "@/shared/components/SinoNotificacoes";
import { Text } from "@/shared/components/Texto";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { FONTS } from "../../constants/Tipografia";
import { Rotas } from "../../constants/Rotas";
import { BotaoVoltar } from "../BotaoVoltar";

// Cabeçalho roxo grande (visual original do antigo HeaderInterno), usado só nas
// telas Premium e Metas. As demais telas usam o HeaderInterno simplificado.
export interface HeaderMPProps {
  titulo: string;
  subtitulo: string;
  // Mostra a seta de voltar à esquerda do título (padrão: true)
  mostrarVoltar?: boolean;
  // Mostra o ícone da coroa (Premium) — esconder na própria tela Premium
  mostrarPremium?: boolean;
  // Mostra o ícone do sino (Notificação) — esconder na própria tela de Notificação
  mostrarNotificacao?: boolean;
}

export function HeaderMP({
  titulo,
  subtitulo,
  mostrarVoltar = true,
  mostrarPremium = true,
  mostrarNotificacao = true,
}: HeaderMPProps) {
  // Hook de navegação do Expo Router
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#7c4dff', '#49269b', '#090312']}
      locations={[0, 0.50, 1]}
      start={{ x: 1.0, y: 0 }}
      end={{ x: 1.0, y: 1 }}
      style={styles.header}
    >
      {/* Lado esquerdo: seta de voltar (roxo escuro) + título e subtítulo.
          Título e subtítulo são recebidos por props e mudam de acordo
          com a tela que usa esse header (ex: "Metas" / "Detalhes") */}
      <View style={styles.esquerda}>
        {mostrarVoltar && <BotaoVoltar />}

        <View>
          <Text style={styles.titulo}>{titulo}</Text>
          <Text style={styles.subtitulo}>{subtitulo}</Text>
        </View>
      </View>

      {/* Ícones do canto superior direito */}
      <View style={styles.icones}>

        {/* Coroa — leva pra tela de assinatura Premium
            (não aparece na própria tela Premium) */}
        {mostrarPremium && (
          <TouchableOpacity onPress={() => router.push(Rotas.premium)}>
            <Image
              source={require("../../../../assets/icones/coroa.png")}
              style={styles.icone}
            />
          </TouchableOpacity>
        )}

        {mostrarNotificacao && <SinoNotificacoes estiloIcone={styles.icone} />}

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Faixa roxa do topo, com cantos bem arredondados embaixo
  // (mais alta que o HeaderPerfil, pra dar espaço ao conteúdo
  // que "sobe" por cima dela nas telas internas)
  header: {
    height: 400,

    paddingTop: 62,
    paddingHorizontal: 20,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    borderBottomLeftRadius: 140,
    borderBottomRightRadius: 140,

    overflow: "hidden",
  },

  // Seta de voltar + bloco de título/subtítulo, lado a lado
  esquerda: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  titulo: {
    color: "#B7FF00",
    fontSize: 28,
    lineHeight: 30,
    fontFamily: FONTS.raleway.bold,
  },

  subtitulo: {
    color: "#B7FF00",
    fontSize: 20,
    lineHeight: 22,
    fontFamily: FONTS.raleway.regular,
    marginTop: 2,
  },

  // Container dos 2 ícones (coroa + sino)
  icones: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 3,
  },

  icone: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
