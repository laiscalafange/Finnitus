import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import { Cores } from "../../constants/Cores";
import { Rotas } from "../../constants/Rotas";
import { styles } from "./BotaoVoltarStyles";
import { BotaoVoltarProps } from "./BotaoVoltarTypes";

// Seta de "voltar pra tela anterior" usada nos cabeçalhos das telas internas
export function BotaoVoltar({
  aoPress,
  cor = Cores.texto.contraste, // roxo escuro (#3B176B)
  tamanho = 28,
}: BotaoVoltarProps) {
  // Hook de navegação do Expo Router
  const router = useRouter();

  function voltar() {
    // Se a tela passou uma ação própria, usa ela
    if (aoPress) {
      aoPress();
      return;
    }

    // Volta pra tela anterior; se não tiver nenhuma no histórico
    // (ex: tela aberta direto), leva pra página inicial
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(Rotas.inicio);
    }
  }

  return (
    <TouchableOpacity
      style={styles.botao}
      onPress={voltar}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
    >
      <ArrowLeft size={tamanho} color={cor} strokeWidth={3} />
    </TouchableOpacity>
  );
}