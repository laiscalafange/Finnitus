import { useState } from "react";

import { Pressable, Text, View } from "react-native";

import { Tag } from "lucide-react-native";

import { Cores } from "@/shared/constants/Cores";

import type { CategoriaItem } from "../../types";
import { ModalOutrasCategorias } from "../ModalOutrasCategorias";
import { styles } from "./styles";

type Props = {
  // Título acima da grade (padrão: "Categoria")
  rotulo?: string;
  categorias: CategoriaItem[];
  // id da categoria marcada (null = nenhuma)
  selecionada: string | null;
  aoSelecionar: (id: string) => void;
};

const TAMANHO_ICONE = 22;

// Tira acento e maiúsculas pra comparar nomes ("Educação" = "educacao")
function normalizar(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Grade de categorias (3 por linha) usada em Novo gasto e Novo imprevisto.
// O card "Outros" abre um modal com mais categorias e com a opção de criar
// uma nova.
export function SeletorCategoria({
  rotulo = "Categoria",
  categorias,
  selecionada,
  aoSelecionar,
}: Props) {
  const [modalAberto, setModalAberto] = useState(false);

  // Categorias criadas pela pessoa, separadas por card "Outros" (gasto e
  // entrada têm listas diferentes).
  // TODO (backend): quando existir endpoint de categorias, salvar aqui
  const [criadas, setCriadas] = useState<Record<string, CategoriaItem[]>>({});

  // Card "Outros" (o único que tem a lista de extras)
  const itemOutros = categorias.find((c) => c.extras !== undefined);

  const opcoesOutros: CategoriaItem[] = itemOutros
    ? [...(itemOutros.extras ?? []), ...(criadas[itemOutros.id] ?? [])]
    : [];

  // Categoria escolhida dentro do modal (null = nenhuma)
  const escolhidaOutros =
    opcoesOutros.find((o) => o.id === selecionada) ?? null;

  // Cria a categoria, já deixa ela marcada e fecha o modal.
  // Retorna a mensagem de erro, ou null se deu certo.
  function criarCategoria(nome: string): string | null {
    if (!itemOutros) {
      return "Não foi possível criar a categoria.";
    }

    const nomeLimpo = nome.trim();

    if (!nomeLimpo) {
      return "Digite o nome da categoria.";
    }

    const jaExiste = [...categorias, ...opcoesOutros].some(
      (c) => normalizar(c.rotulo) === normalizar(nomeLimpo)
    );

    if (jaExiste) {
      return "Essa categoria já existe.";
    }

    const nova: CategoriaItem = {
      id: `criada-${Date.now()}`,
      rotulo: nomeLimpo,
      icone: Tag,
    };

    setCriadas((atual) => ({
      ...atual,
      [itemOutros.id]: [...(atual[itemOutros.id] ?? []), nova],
    }));

    aoSelecionar(nova.id);
    setModalAberto(false);

    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <View style={styles.grade}>
        {categorias.map((categoria) => {
          const ehOutros = categoria.extras !== undefined;

          // Se escolheu algo no modal, o card "Outros" passa a mostrar
          // o ícone e o nome da categoria escolhida
          const exibida =
            ehOutros && escolhidaOutros ? escolhidaOutros : categoria;

          const ativa = ehOutros
            ? escolhidaOutros !== null
            : selecionada === categoria.id;

          const Icone = exibida.icone;

          return (
            <Pressable
              key={categoria.id}
              accessibilityRole="button"
              accessibilityState={{ selected: ativa }}
              onPress={() =>
                ehOutros ? setModalAberto(true) : aoSelecionar(categoria.id)
              }
              style={[styles.item, ativa && styles.itemAtivo]}
            >
              <Icone size={TAMANHO_ICONE} color={Cores.destaque.limao} />

              <Text
                numberOfLines={1}
                style={[styles.nome, ativa && styles.nomeAtivo]}
              >
                {exibida.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {itemOutros ? (
        <ModalOutrasCategorias
          visivel={modalAberto}
          opcoes={opcoesOutros}
          selecionada={selecionada}
          aoFechar={() => setModalAberto(false)}
          aoSelecionar={(id) => {
            aoSelecionar(id);
            setModalAberto(false);
          }}
          aoCriar={criarCategoria}
        />
      ) : null}
    </View>
  );
}