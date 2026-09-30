import { Pressable, Text, View } from "react-native";

import type { CategoriaItem } from "../../types";
import { styles } from "./styles";

type Props = {
  // Título acima da grade (padrão: "Categoria")
  rotulo?: string;
  categorias: CategoriaItem[];
  // id da categoria marcada (null = nenhuma)
  selecionada: string | null;
  aoSelecionar: (id: string) => void;
};

// Grade de categorias (3 por linha) usada em Novo gasto e Novo imprevisto
export function SeletorCategoria({
  rotulo = "Categoria",
  categorias,
  selecionada,
  aoSelecionar,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <View style={styles.grade}>
        {categorias.map((categoria) => {
          const ativa = selecionada === categoria.id;

          return (
            <Pressable
              key={categoria.id}
              accessibilityRole="button"
              accessibilityState={{ selected: ativa }}
              onPress={() => aoSelecionar(categoria.id)}
              style={[styles.item, ativa && styles.itemAtivo]}
            >
              <Text style={styles.emoji}>{categoria.emoji}</Text>

              <Text style={[styles.nome, ativa && styles.nomeAtivo]}>
                {categoria.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}