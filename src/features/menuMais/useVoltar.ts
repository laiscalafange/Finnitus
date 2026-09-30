import { useRouter } from "expo-router";

import { Rotas } from "@/shared/constants/Rotas";

// Mesma regra do BotaoVoltar: volta pra tela anterior e, se não houver
// nenhuma no histórico, leva pra página inicial.
export function useVoltar() {
  const router = useRouter();

  return function voltar() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(Rotas.inicio);
    }
  };
}