import { Pressable, Text, View } from "react-native";

import { Cores } from "@/shared/constants/Cores";

import type { TipoTransacao } from "../../types";
import { styles } from "./styles";

type Props = {
  // Opção marcada no momento
  valor: TipoTransacao;
  // Chamado ao tocar em "Gasto" ou "Entrada"
  aoMudar: (novo: TipoTransacao) => void;
};

// Cada opção tem a sua cor quando está marcada
const OPCOES = [
  { id: "gasto", rotulo: "Gasto", cor: Cores.estado.alerta },
  { id: "entrada", rotulo: "Entrada", cor: Cores.destaque.limao },
] as const;

// Alternador "Gasto | Entrada" do topo da tela Novo gasto
export function AlternadorTipo({ valor, aoMudar }: Props) {
  return (
    <View style={styles.container}>
      {OPCOES.map((opcao) => {
        const ativo = valor === opcao.id;

        return (
          <Pressable
            key={opcao.id}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
            onPress={() => aoMudar(opcao.id)}
            style={[
              styles.opcao,
              ativo && { backgroundColor: opcao.cor },
            ]}
          >
            <Text style={[styles.texto, ativo && styles.textoAtivo]}>
              {opcao.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}