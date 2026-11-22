import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Tag } from "lucide-react-native";

import { Cores } from "@/shared/constants/Cores";
import { useAuth } from "@/features/authContext";
import {
  criarCategoriaPersonalizadaApi,
  listarCategoriasPersonalizadasApi,
  type CategoriaPersonalizadaApi,
  type TipoCategoriaApi,
} from "@/services/categoriasPersonalizadasApi";
import { errorMessage } from "@/services/api";

import type { CategoriaItem } from "../../types";
import {
  ModalOutrasCategorias,
  TEXTOS_CATEGORIA,
  type TextosCategoria,
} from "../ModalOutrasCategorias";
import { styles } from "./styles";

type Props = {
  rotulo?: string;
  categorias: CategoriaItem[];
  selecionada: string | null;
  aoSelecionar: (id: string, categoria: CategoriaItem) => void;
  textos?: TextosCategoria;
  // Uso legado: se um pai administra categorias, ele continua responsável
  // por carregar/salvar; a integração automática não é acionada.
  criadas?: CategoriaItem[];
  aoCriar?: (nova: CategoriaItem) => void;
  // Passe RECEITA ou DESPESA para ligar a persistência no Neon.
  tipo?: TipoCategoriaApi;
  // Permite impedir que a tela avance antes da resposta do POST.
  aoAlterarSalvamento?: (salvando: boolean) => void;
};

const TAMANHO_ICONE = 22;

function normalizar(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function converterCategoria(registro: CategoriaPersonalizadaApi): CategoriaItem {
  return {
    // Prefixo evita colisão com IDs das categorias fixas da interface.
    // Também permite reconhecer esse ID ao enviar receitas/despesas ao backend.
    id: `personalizada-${registro.id_CategoriaPersonalizada}`,
    rotulo: registro.nome,
    icone: Tag,
  };
}

export function SeletorCategoria({
  rotulo = "Categoria",
  categorias,
  selecionada,
  aoSelecionar,
  textos = TEXTOS_CATEGORIA,
  criadas: criadasDeFora,
  aoCriar,
  tipo,
  aoAlterarSalvamento,
}: Props) {
  const { user } = useAuth();
  const usuarioAtualRef = useRef(user?.id);
  usuarioAtualRef.current = user?.id;
  const tipoAtualRef = useRef(tipo);
  tipoAtualRef.current = tipo;
  const selecionadaAtualRef = useRef(selecionada);
  selecionadaAtualRef.current = selecionada;

  const [modalAberto, setModalAberto] = useState(false);
  const [criadas, setCriadas] = useState<Record<string, CategoriaItem[]>>({});
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const salvandoRef = useRef(false);

  const itemOutros = categorias.find((c) => c.extras !== undefined);
  const chave = `${tipo ?? "LOCAL"}:${itemOutros?.id ?? "outros"}`;

  // Busca as categorias pertencentes à conta atual. As rotas já exigem JWT.
  useEffect(() => {
    if (!tipo || !itemOutros || aoCriar || !user?.id) {
      if (!user?.id) setCriadas({});
      return;
    }

    let ativo = true;
    setCarregando(true);
    setCriadas((atual) => ({ ...atual, [chave]: [] }));

    void listarCategoriasPersonalizadasApi()
      .then((registros) => {
        if (!ativo) return;
        const lista = registros
          .filter((registro) => registro.tipo === tipo)
          .map(converterCategoria);
        setCriadas((atual) => ({ ...atual, [chave]: lista }));
      })
      .catch((erro: unknown) => {
        if (ativo) {
          Alert.alert("Categorias", errorMessage(erro));
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [tipo, itemOutros?.id, aoCriar, user?.id, chave]);

  const opcoesOutros: CategoriaItem[] = itemOutros
    ? [
        ...(itemOutros.extras ?? []),
        ...(aoCriar ? (criadasDeFora ?? []) : (criadas[chave] ?? [])),
      ]
    : [];

  const escolhidaOutros =
    opcoesOutros.find((o) => o.id === selecionada) ?? null;

  // ModalOutrasCategorias usa retorno sincrono (string | null).
  // O modal pode fechar imediatamente, mas só selecionamos a nova categoria
  // DEPOIS de o banco confirmar a criação; não usamos um ID temporário.
  function criarCategoria(nome: string): string | null {
    if (!itemOutros) return textos.falhou;
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) return textos.semNome;
    if (nomeLimpo.length > 100) return "A categoria pode ter até 100 caracteres.";
    if (salvandoRef.current) return "Aguarde a categoria anterior ser salva.";
    if (carregando && tipo && !aoCriar) return "Aguarde as categorias carregarem.";

    const jaExiste = [...categorias, ...opcoesOutros].some(
      (c) => normalizar(c.rotulo) === normalizar(nomeLimpo),
    );
    if (jaExiste) return textos.jaExiste;

    if (!tipo || aoCriar) {
      // Mantém o comportamento anterior em usos que não passam 'tipo'.
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
          [chave]: [...(atual[chave] ?? []), nova],
        }));
      }
      aoSelecionar(nova.id, nova);
      setModalAberto(false);
      return null;
    }

    if (!user?.id) return "Entre na sua conta para criar categorias.";
    const idUsuarioDaCriacao = user.id;
    const selecionadaAntesDeCriar = selecionada;

    salvandoRef.current = true;
    setSalvando(true);
    aoAlterarSalvamento?.(true);
    setModalAberto(false);

    void criarCategoriaPersonalizadaApi(nomeLimpo, tipo)
      .then((registro) => {
        // Se a sessão mudou durante a chamada, não exibe dados na outra conta.
        if (
          usuarioAtualRef.current !== idUsuarioDaCriacao ||
          tipoAtualRef.current !== tipo
        ) return;
        const nova = converterCategoria(registro);
        setCriadas((atual) => ({
          ...atual,
          [chave]: [
            ...(atual[chave] ?? []).filter((item) => item.id !== nova.id),
            nova,
          ].sort((a, b) => a.rotulo.localeCompare(b.rotulo, "pt-BR")),
        }));
        // Não substitui uma escolha feita pelo usuário enquanto aguardava a API.
        if (selecionadaAtualRef.current === selecionadaAntesDeCriar) {
          aoSelecionar(nova.id, nova);
        }
      })
      .catch((erro: unknown) => {
        if (usuarioAtualRef.current === idUsuarioDaCriacao) {
          Alert.alert("Não foi possível criar a categoria", errorMessage(erro));
        }
      })
      .finally(() => {
        salvandoRef.current = false;
        setSalvando(false);
        aoAlterarSalvamento?.(false);
      });

    return null;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <View style={styles.grade}>
        {categorias.map((categoria) => {
          const ehOutros = categoria.extras !== undefined;
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

      {salvando ? (
        <Text accessibilityRole="text" style={styles.rotulo}>
          Salvando categoria...
        </Text>
      ) : null}

      {itemOutros ? (
        <ModalOutrasCategorias
          visivel={modalAberto}
          opcoes={opcoesOutros}
          selecionada={selecionada}
          aoFechar={() => setModalAberto(false)}
          aoSelecionar={(id) => {
            const escolhida = opcoesOutros.find((o) => o.id === id);
            if (escolhida) aoSelecionar(id, escolhida);
            setModalAberto(false);
          }}
          aoCriar={criarCategoria}
          textos={textos}
        />
      ) : null}
    </View>
  );
}
