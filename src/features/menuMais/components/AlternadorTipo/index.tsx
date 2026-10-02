import { Pressable, Text, View } from "react-native";

import { Cores } from "@/shared/constants/Cores";

import type { TipoTransacao } from "../../types";
import { styles } from "./styles";

type Opcao<T extends string> = {
  id: T;
  rotulo: string;
  // Cor da opção quando está marcada (padrão: verde-limão)
  cor?: string;
};

type Props<T extends string> = {
  // Opção marcada no momento
  valor: T;
  aoMudar: (novo: T) => void;
  // Opções do alternador. Sem isso, mostra "Gasto | Entrada" (Novo gasto)
  opcoes?: Opcao<T>[];
};

// Opções padrão (Novo gasto): cada uma tem a sua cor quando está marcada
const OPCOES_TRANSACAO: Opcao<TipoTransacao>[] = [
  { id: "gasto", rotulo: "Gasto", cor: Cores.estado.alerta },
  { id: "entrada", rotulo: "Entrada", cor: Cores.destaque.limao },
];

// Alternador de opções (ex.: "Gasto | Entrada" no Novo gasto e
// "Todas | Concluídas | Canceladas" no Histórico de Metas)
export function AlternadorTipo<T extends string = TipoTransacao>({
  valor,
  aoMudar,
  opcoes,
}: Props<T>) {
  const lista = opcoes ?? (OPCOES_TRANSACAO as unknown as Opcao<T>[]);

  return (
    <View style={styles.container}>
      {lista.map((opcao) => {
        const ativo = valor === opcao.id;

        return (
          <Pressable
            key={opcao.id}
            accessibilityRole="button"
            accessibilityState={{ selected: ativo }}
            onPress={() => aoMudar(opcao.id)}
            style={[
              styles.opcao,
              ativo && { backgroundColor: opcao.cor ?? Cores.destaque.limao },
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