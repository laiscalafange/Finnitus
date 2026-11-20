import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal as ModalEdicao,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Modal } from "../../shared/components/Modal";
import {
  BotaoPlano,
  CardVidro,
  EstrategiaCard,
  FormularioImprevisto,
  StatusBadge,
  TextoAnalise,
  camposDoImprevisto,
  camposParaDados,
  validarCampos,
  type CamposImprevisto,
} from "../../shared/components/PlanoB/ImprevistoUI";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";
import { useAction } from "../../shared/hooks/useAction";

import { formatarMoeda } from "@/features/menuMais/utils";
import {
  analiseEmCache,
  atualizarImprevisto,
  buscarImprevisto,
  dadosDoImprevisto,
  definirResolvido,
  escolherEstrategia,
  excluirImprevisto,
  mensagemErroImprevisto,
  mudancaSignificativa,
  reanalisarImprevisto,
  rotuloTipoImprevisto,
  type Analise,
  type Imprevisto,
} from "@/services/imprevistosApi";

// Tela de detalhes de um imprevisto: aberta ao tocar num card de
// "Seus imprevistos" na tela Plano-B (recebe o parâmetro "id").
export default function DetalheImprevisto() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [imprevisto, setImprevisto] = useState<Imprevisto | null>(null);
  const [analise, setAnalise] = useState<Analise | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erroCarga, setErroCarga] = useState("");

  const [editando, setEditando] = useState(false);
  const [campos, setCampos] = useState<CamposImprevisto | null>(null);
  const [erroEdicao, setErroEdicao] = useState("");
  const [sugerirReanalise, setSugerirReanalise] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState(false);

  // Uma ação por vez (editar, escolher estratégia, excluir...)
  const { busy, error, clearError, run } = useAction();

  const carregar = useCallback(async () => {
    if (!id) {
      return;
    }

    setCarregando(true);
    setErroCarga("");

    try {
      setImprevisto(await buscarImprevisto(id));
      setAnalise(analiseEmCache(id));
    } catch (erro) {
      setErroCarga(mensagemErroImprevisto(erro));
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  // ----- Ações -----

  function abrirEdicao() {
    if (!imprevisto) return;

    setCampos(camposDoImprevisto(imprevisto));
    setErroEdicao("");
    clearError();
    setEditando(true);
  }

  function salvarEdicao() {
    if (!imprevisto || !campos) return;

    const mensagem = validarCampos(campos);

    if (mensagem) {
      setErroEdicao(mensagem);
      return;
    }

    setErroEdicao("");

    void run(async () => {
      const antes = imprevisto;
      const salvo = await atualizarImprevisto(antes.id, camposParaDados(campos));

      setImprevisto(salvo);
      setEditando(false);

      // Se mudou bastante o problema, oferece uma nova análise
      setSugerirReanalise(mudancaSignificativa(antes, salvo));
    });
  }

  function pedirNovaAnalise() {
    if (!imprevisto) return;

    clearError();

    void run(async () => {
      const nova = await reanalisarImprevisto(
        imprevisto.id,
        dadosDoImprevisto(imprevisto),
      );

      setAnalise(nova);
      setSugerirReanalise(false);
    });
  }

  // Escolher/alterar a estratégia só grava a escolha. Nenhum dinheiro é
  // movimentado da reserva.
  function escolher(titulo: string) {
    if (!imprevisto) return;

    clearError();

    void run(async () => {
      const salvo = await escolherEstrategia(imprevisto.id, titulo);

      setImprevisto(salvo);
    });
  }

  function alternarResolvido() {
    if (!imprevisto) return;

    clearError();

    void run(async () => {
      setImprevisto(
        await definirResolvido(imprevisto, imprevisto.status !== "resolvido"),
      );
    });
  }

  function excluir() {
    if (!imprevisto) return;

    setConfirmarExclusao(false);
    clearError();

    void run(async () => {
      await excluirImprevisto(imprevisto.id);
      router.back();
    });
  }

  // ----- Estados da tela -----

  if (carregando) {
    return (
      <View style={estilos.tela}>
        <BackgroundGradient variante="funcional" />
        <HeaderInterno titulo="Imprevisto" />
        <ActivityIndicator
          style={estilos.centro}
          size="large"
          color={Cores.destaque.limao}
        />
      </View>
    );
  }

  if (!imprevisto) {
    return (
      <View style={estilos.tela}>
        <BackgroundGradient variante="funcional" />
        <HeaderInterno titulo="Imprevisto" />

        <View style={estilos.conteudo}>
          <CardVidro>
            <Text style={estilos.erro}>
              {erroCarga || "Imprevisto não encontrado."}
            </Text>

            <BotaoPlano
              titulo="Tentar novamente"
              variante="secundario"
              onPress={() => void carregar()}
            />
          </CardVidro>
        </View>
      </View>
    );
  }

  const resolvido = imprevisto.status === "resolvido";
  const estrategias = analise?.estrategias ?? [];

  // Estratégia que foi escolhida (se a análise ainda está disponível)
  const escolhida = estrategias.find(
    (item) => item.titulo === imprevisto.estrategia,
  );
  const outras = estrategias.filter(
    (item) => item.titulo !== imprevisto.estrategia,
  );

  return (
    <View style={estilos.tela}>
      <BackgroundGradient variante="funcional" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <HeaderInterno titulo="Detalhes do imprevisto" />

        <View style={estilos.conteudo}>
          {/* Informações completas */}
          <CardVidro>
            <Text style={estilos.nome}>{imprevisto.nome}</Text>
            <StatusBadge status={imprevisto.status} />

            <View style={estilos.dados}>
              <Linha rotulo="Tipo" valor={rotuloTipoImprevisto(imprevisto)} />
              <Linha
                rotulo="Valor estimado"
                valor={formatarMoeda(imprevisto.valor)}
                destaque
              />
              <Linha rotulo="Data do evento" valor={imprevisto.data} />
              <Linha
                rotulo="Duração do prejuízo"
                valor={
                  imprevisto.duracaoMeses
                    ? `${imprevisto.duracaoMeses} ${
                        imprevisto.duracaoMeses === 1 ? "mês" : "meses"
                      }`
                    : "Não informada"
                }
              />
            </View>
          </CardVidro>

          {/* Descrição original */}
          <Text style={estilos.secao}>Descrição original</Text>
          <CardVidro>
            <Text style={estilos.texto}>
              {imprevisto.descricao || "Nenhuma descrição informada."}
            </Text>
          </CardVidro>

          {/* Edição que mudou bastante o problema */}
          {sugerirReanalise ? (
            <CardVidro style={estilos.cardAviso}>
              <Text style={estilos.avisoTitulo}>
                Essa alteração muda bastante o problema
              </Text>
              <Text style={estilos.texto}>
                A análise e as estratégias abaixo foram feitas com os dados
                antigos. Peça uma nova análise para atualizá-las.
              </Text>

              <BotaoPlano
                titulo={busy ? "Analisando..." : "Solicitar nova análise"}
                disabled={busy}
                onPress={pedirNovaAnalise}
              />
            </CardVidro>
          ) : null}

          {/* Análise da IA */}
          <Text style={estilos.secao}>Análise da IA</Text>
          <CardVidro>
            {analise ? (
              <TextoAnalise texto={analise.texto} />
            ) : (
              <View>
                <Text style={estilos.texto}>
                  A análise deste imprevisto não está disponível neste aparelho.
                  Solicite uma nova análise para ver o texto e as estratégias.
                </Text>

                <BotaoPlano
                  titulo={busy ? "Analisando..." : "Solicitar nova análise"}
                  disabled={busy}
                  onPress={pedirNovaAnalise}
                />
              </View>
            )}
          </CardVidro>

          {/* Estratégia selecionada */}
          <Text style={estilos.secao}>Estratégia selecionada</Text>

          {imprevisto.estrategia ? (
            escolhida ? (
              <EstrategiaCard estrategia={escolhida} selecionada />
            ) : (
              <CardVidro>
                <Text style={estilos.estrategiaNome}>
                  {imprevisto.estrategia}
                </Text>
              </CardVidro>
            )
          ) : (
            <CardVidro>
              <Text style={estilos.texto}>
                Nenhuma estratégia escolhida ainda.
                {outras.length > 0 ? " Escolha uma das opções abaixo." : ""}
              </Text>
            </CardVidro>
          )}

          {/* Outras estratégias (permite alterar a escolha) */}
          {outras.length > 0 ? (
            <View>
              <Text style={estilos.secao}>Outras estratégias disponíveis</Text>

              {outras.map((estrategia) => (
                <EstrategiaCard
                  key={estrategia.id}
                  estrategia={estrategia}
                  desabilitado={busy}
                  acaoRotulo={
                    imprevisto.estrategia
                      ? "Alterar para esta estratégia"
                      : "Escolher esta estratégia"
                  }
                  aoAcao={() => escolher(estrategia.titulo)}
                />
              ))}

              <Text style={estilos.aviso}>
                Valores estimados pelo app com base na sua situação financeira.
                Escolher uma estratégia não move dinheiro da sua reserva.
              </Text>
            </View>
          ) : null}

          {error && !editando ? (
            <Text style={estilos.erro} accessibilityRole="alert">
              {error}
            </Text>
          ) : null}

          {/* Ações */}
          <View style={estilos.acoes}>
            <BotaoPlano
              titulo="Editar imprevisto"
              variante="secundario"
              disabled={busy}
              onPress={abrirEdicao}
            />

            <BotaoPlano
              titulo={resolvido ? "Reabrir imprevisto" : "Marcar como resolvido"}
              variante={resolvido ? "secundario" : "primario"}
              disabled={busy}
              onPress={alternarResolvido}
            />

            <BotaoPlano
              titulo="Excluir imprevisto"
              variante="perigo"
              disabled={busy}
              onPress={() => setConfirmarExclusao(true)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Confirmação de exclusão */}
      <Modal
        visible={confirmarExclusao}
        title="Excluir imprevisto?"
        message="Essa ação não pode ser desfeita. O imprevisto e a estratégia escolhida serão removidos do seu histórico."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={excluir}
        onCancel={() => setConfirmarExclusao(false)}
      />

      {/* Editar imprevisto */}
      <ModalEdicao
        visible={editando}
        animationType="slide"
        onRequestClose={() => { if (!busy) setEditando(false); }}
      >
        <View style={estilos.tela}>
          <BackgroundGradient variante="funcional" />

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: insets.top + 14,
                paddingHorizontal: 16,
                paddingBottom: 40,
              }}
            >
              <Text style={estilos.tituloEdicao}>Editar imprevisto</Text>

              {campos ? (
                <FormularioImprevisto
                  campos={campos}
                  aoAlterar={setCampos}
                  erro={erroEdicao || error}
                  desabilitado={busy}
                />
              ) : null}

              <View style={estilos.acoes}>
                <BotaoPlano
                  titulo={busy ? "Salvando..." : "Salvar alterações"}
                  disabled={busy}
                  onPress={salvarEdicao}
                />

                <BotaoPlano
                  titulo="Cancelar"
                  variante="secundario"
                  disabled={busy}
                  onPress={() => setEditando(false)}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ModalEdicao>
    </View>
  );
}

// Linha "rótulo ... valor" do card de informações
function Linha({
  rotulo,
  valor,
  destaque = false,
}: {
  rotulo: string;
  valor: string;
  destaque?: boolean;
}) {
  return (
    <View style={estilos.linha}>
      <Text style={estilos.linhaRotulo}>{rotulo}</Text>
      <Text style={[estilos.linhaValor, destaque && estilos.linhaDestaque]}>
        {valor}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
  },

  centro: {
    marginTop: 60,
  },

  conteudo: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  nome: {
    marginBottom: 8,
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    color: Cores.base.branco,
  },

  dados: {
    marginTop: 12,
  },

  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Cores.overlay.suave,
  },

  linhaRotulo: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.texto.claro,
  },

  linhaValor: {
    flexShrink: 1,
    textAlign: "right",
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },

  linhaDestaque: {
    fontFamily: FONTS.raleway.extrabold,
    color: Cores.destaque.limao,
  },

  secao: {
    marginTop: 8,
    marginBottom: 10,
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    color: Cores.destaque.limao,
  },

  texto: {
    marginBottom: 4,
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 21,
    color: Cores.base.branco,
  },

  estrategiaNome: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
  },

  cardAviso: {
    borderColor: Cores.estado.alerta,
  },

  avisoTitulo: {
    marginBottom: 6,
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.estado.alerta,
  },

  aviso: {
    marginBottom: 14,
    fontFamily: FONTS.quicksand.medium,
    fontSize: 12,
    lineHeight: 17,
    color: Cores.texto.claro,
  },

  erro: {
    marginBottom: 12,
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: "#ffb4b4",
  },

  // Botões empilhados, com espaço entre eles
  acoes: {
    gap: 12,
    marginTop: 8,
  },

  tituloEdicao: {
    marginBottom: 16,
    fontFamily: FONTS.raleway.bold,
    fontSize: 22,
    color: Cores.base.branco,
  },
});