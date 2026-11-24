import { StyleSheet, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Cores } from "../../constants/Cores";
import { Rotas } from "../../constants/Rotas";
import { BotaoVoltar } from "./BotaoVoltar";

type BotaoVoltarAuthProps = {
  // true: fica fixa no canto superior esquerdo (telas com layout absoluto).
  // false: ocupa uma linha no topo (telas que usam o AuthForm).
  absoluto?: boolean;
  voltarPara?: Href;
};

// Seta verde de "voltar" das telas de autenticação (pasta app/(auth)).
// Reutiliza o BotaoVoltar, só muda a cor e pra onde vai se não houver histórico.
export function BotaoVoltarAuth({ absoluto = false, voltarPara = Rotas.inicie }: BotaoVoltarAuthProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(voltarPara);
    }
  }

  const botao = (
    <BotaoVoltar aoPress={voltar} cor={Cores.destaque.limao} />
  );

  if (absoluto) {
    return (
      <View style={[styles.absoluto, { top: insets.top + 20 }]}>
        {botao}
      </View>
    );
  }

  return <View style={styles.linha}>{botao}</View>;
}

const styles = StyleSheet.create({
  absoluto: {
    position: "absolute",
    left: 24,
    zIndex: 10,
  },

  // Mesma largura/margem do conteúdo do AuthForm, pra seta ficar alinhada
  linha: {
    width: "100%",
    maxWidth: 540,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: "flex-start",
  },
});
