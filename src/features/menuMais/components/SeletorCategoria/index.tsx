import { useState } from "react";

import { Pressable, Text, View } from "react-native";

import { Tag } from "lucide-react-native";

import { Cores } from "@/shared/constants/Cores";

import type { CategoriaItem } from "../../types";
import {
  ModalOutrasCategorias,
  TEXTOS_CATEGORIA,
  type TextosCategoria,
} from "../ModalOutrasCategorias";
import { styles } from "./styles";

type Props = {
  // Título acima da grade (padrão: "Categoria")
  rotulo?: string;
  categorias: CategoriaItem[];
  // id da categoria marcada (null = nenhuma)
  selecionada: string | null;
  // Recebe também o item escolhido (útil pra guardar o nome de uma
  // categoria criada). Quem só usa o id pode ignorar o 2º parâmetro.
  aoSelecionar: (id: string, categoria: CategoriaItem) => void;
  // Textos do modal "Outros" (padrão: textos de categoria)
  textos?: TextosCategoria;
  // Opcional: quem usa guarda as categorias criadas (ex.: pra não perder ao
  // fechar a tela). Passe as já criadas em "criadas" e receba cada nova em
  // "aoCriar". Sem "aoCriar", o seletor guarda as criadas sozinho.
  criadas?: CategoriaItem[];
  aoCriar?: (nova: CategoriaItem) => void;
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
  textos = TEXTOS_CATEGORIA,
  criadas: criadasDeFora,
  aoCriar,
}: Props) {
  const [modalAberto, setModalAberto] = useState(false);

  // Categorias criadas pela pessoa, separadas por card "Outros" (gasto e
  // entrada têm listas diferentes).
  // TODO (backend): quando existir endpoint de categorias, salvar aqui
  const [criadas, setCriadas] = useState<Record<string, CategoriaItem[]>>({});

  // Card "Outros" (o único que tem a lista de extras)
  const itemOutros = categorias.find((c) => c.extras !== undefined);

  const opcoesOutros: CategoriaItem[] = itemOutros
    ? [
        ...(itemOutros.extras ?? []),
        ...(aoCriar ? (criadasDeFora ?? []) : (criadas[itemOutros.id] ?? [])),
      ]
    : [];

  // Categoria escolhida dentro do modal (null = nenhuma)
  const escolhidaOutros =
    opcoesOutros.find((o) => o.id === selecionada) ?? null;

  // Cria a categoria, já deixa ela marcada e fecha o modal.
  // Retorna a mensagem de erro, ou null se deu certo.
  function criarCategoria(nome: string): string | null {
    if (!itemOutros) {
      return textos.falhou;
    }

    const nomeLimpo = nome.trim();

    if (!nomeLimpo) {
      return textos.semNome;
    }

    const jaExiste = [...categorias, ...opcoesOutros].some(
      (c) => normalizar(c.rotulo) === normalizar(nomeLimpo)
    );

    if (jaExiste) {
      return textos.jaExiste;
    }

    const nova: CategoriaItem = {
      id: `criada-${Date.now()}`,
      rotulo: nomeLimpo,
      icone: Tag,
    };

    if (aoCriar) {
      aoCriar(nova);
    } else {
      setCriadas((atual) => ({
        ...atual,
        [itemOutros.id]: [...(atual[itemOutros.id] ?? []), nova],
      }));
    }

    aoSelecionar(nova.id, nova);
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
                ehOutros
                  ? setModalAberto(true)
                  : aoSelecionar(categoria.id, categoria)
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
            const escolhida = opcoesOutros.find((o) => o.id === id);

            if (escolhida) {
              aoSelecionar(id, escolhida);
            }

            setModalAberto(false);
          }}
          aoCriar={criarCategoria}
          textos={textos}
        />
      ) : null}
    </View>
  );
}