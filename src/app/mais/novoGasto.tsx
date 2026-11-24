
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TouchableOpacity,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import type {
  CategoriaItem,
  TipoTransacao,
} from "@/features/menuMais/types";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { SeletorCategoria } from "@/features/menuMais/components/SeletorCategoria";

import {
  CATEGORIAS_ENTRADA,
  CATEGORIAS_GASTO,
} from "@/features/menuMais/constants";

import { useFinanceiro } from "@/features/financeiroContext";
import { useVoltar } from "@/features/menuMais/useVoltar";

import {
  dataValida,
  hojeFormatado,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "@/features/menuMais/utils";

import { styles } from "@/features/menuMais/styles/formulario";

type StatusReceita = "RECEBIDA" | "PENDENTE";
type StatusDespesa = "PAGA" | "PENDENTE";
type TipoCadastro = "FIXA" | "VARIAVEL";

type FormaPagamento =
  | "DINHEIRO"
  | "PIX"
  | "DEBITO"
  | "CREDITO"
  | "BOLETO";

const FORMAS_PAGAMENTO: {
  label: string;
  value: FormaPagamento;
}[] = [
  { label: "Dinheiro", value: "DINHEIRO" },
  { label: "Pix", value: "PIX" },
  { label: "Débito", value: "DEBITO" },
  { label: "Crédito", value: "CREDITO" },
  { label: "Boleto", value: "BOLETO" },
];

export default function NovoGasto() {
  const voltar = useVoltar();
  const { adicionarTransacao } = useFinanceiro();

  const { tipo: tipoParam } = useLocalSearchParams<{
    tipo?: string;
  }>();

  const tipo: TipoTransacao =
    tipoParam === "entrada" ? "entrada" : "gasto";

  const ehReceita = tipo === "entrada";

  const categorias = ehReceita
    ? CATEGORIAS_ENTRADA
    : CATEGORIAS_GASTO;

  const titulo = ehReceita ? "Nova receita" : "Nova despesa";
  const nomeItem = ehReceita ? "receita" : "despesa";

  const exemploDescricao = ehReceita
    ? "Ex: Pagamento de projeto"
    : "Ex: Almoço em família";

  const [valor, setValor] = useState("");

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<CategoriaItem | null>(null);

  const [data, setData] = useState(hojeFormatado());
  const [descricao, setDescricao] = useState("");
  const [repetir, setRepetir] = useState(false);

  const [tipoCadastro, setTipoCadastro] =
    useState<TipoCadastro>("VARIAVEL");

  const [statusReceita, setStatusReceita] =
    useState<StatusReceita>("PENDENTE");

  const [statusDespesa, setStatusDespesa] =
    useState<StatusDespesa>("PENDENTE");

  const [dataPagamento, setDataPagamento] =
    useState(hojeFormatado());

  const [formaPagamento, setFormaPagamento] =
    useState<FormaPagamento | null>(null);

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const estiloLabel = {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600" as const,
    marginTop: 15,
    marginBottom: 10,
  };

  const estiloLinha = {
    flexDirection: "row" as const,
    gap: 10,
    marginBottom: 8,
  };

  const estiloOpcoesPagamento = {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
  };

  const estiloItemPagamento = {
    minWidth: "30%" as const,
    flexGrow: 1,
  };

  const estiloLinhaRepetir = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginTop: 20,
    marginBottom: 15,
  };

  const estiloErro = {
    color: "#FF6B6B",
    marginBottom: 15,
  };

  async function salvar() {
    if (salvando) return;

    if (moedaParaNumero(valor) <= 0) {
      setErro(`Informe o valor da ${nomeItem}.`);
      return;
    }

    if (!categoriaSelecionada) {
      setErro("Escolha uma categoria.");
      return;
    }

    if (!dataValida(data)) {
      setErro("Informe uma data válida (DD/MM/AAAA).");
      return;
    }

    if (!ehReceita && !formaPagamento) {
      setErro("Escolha a forma de pagamento.");
      return;
    }

    if (
      !ehReceita &&
      statusDespesa === "PAGA" &&
      !dataValida(dataPagamento)
    ) {
      setErro("Informe uma data de pagamento válida.");
      return;
    }

    setErro("");
    setSalvando(true);

    try {
      await adicionarTransacao({
        tipo,
        valor: moedaParaNumero(valor),
        categoriaId: categoriaSelecionada.id,
        categoriaNome: categoriaSelecionada.rotulo,
        data,
        descricao: descricao.trim() || undefined,
        repetirMensalmente: repetir,
        tipoCadastro,
        status: ehReceita ? statusReceita : statusDespesa,
        ...(ehReceita
          ? {}
          : {
              formaPagamento: formaPagamento!,
              dataPagamento:
                statusDespesa === "PAGA"
                  ? dataPagamento
                  : undefined,
            }),
      });

      voltar();
    } catch (error: any) {
      setErro(
        error?.response?.data?.message ||
          error?.message ||
          `Não foi possível cadastrar a ${nomeItem}.`
      );
    } finally {
      setSalvando(false);
    }
  }

  function opcao<T extends string>(
    label: string,
    value: T,
    selecionado: boolean,
    onPress: () => void
  ) {
    return (
      <TouchableOpacity
        key={value}
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flex: 1,
          minHeight: 44,
          paddingVertical: 12,
          paddingHorizontal: 8,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: selecionado ? "#B7FF00" : "#555",
          backgroundColor: selecionado
            ? "#2B1454"
            : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: selecionado ? "#B7FF00" : "#FFFFFF",
            fontWeight: selecionado ? "bold" : "normal",
            fontSize: 13,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >
          <HeaderInterno titulo={titulo} />

          <View style={styles.formulario}>
            <Input
              label="Valor"
              value={valor}
              onChangeText={(texto: string) =>
                setValor(mascararMoeda(texto))
              }
              placeholder="R$ 0,00"
              keyboardType="numeric"
            />

            <Text style={estiloLabel}>Categoria</Text>

            <SeletorCategoria
              tipo={ehReceita ? "RECEITA" : "DESPESA"}
              categorias={categorias}
              selecionada={categoriaSelecionada?.id ?? null}
              aoSelecionar={(_id, categoria) => {
                setCategoriaSelecionada(categoria);
              }}
            />

            <Input
              label="Data"
              value={data}
              onChangeText={(texto: string) =>
                setData(mascararData(texto))
              }
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
            />

            <Input
              label="Descrição"
              value={descricao}
              onChangeText={setDescricao}
              placeholder={exemploDescricao}
            />

            <Text style={estiloLabel}>Tipo de cadastro</Text>

            <View style={estiloLinha}>
              {opcao(
                "Fixa",
                "FIXA",
                tipoCadastro === "FIXA",
                () => setTipoCadastro("FIXA")
              )}

              {opcao(
                "Variável",
                "VARIAVEL",
                tipoCadastro === "VARIAVEL",
                () => setTipoCadastro("VARIAVEL")
              )}
            </View>

            {ehReceita ? (
              <>
                <Text style={estiloLabel}>
                  Situação da receita
                </Text>

                <View style={estiloLinha}>
                  {opcao(
                    "Recebida",
                    "RECEBIDA",
                    statusReceita === "RECEBIDA",
                    () => setStatusReceita("RECEBIDA")
                  )}

                  {opcao(
                    "Pendente",
                    "PENDENTE",
                    statusReceita === "PENDENTE",
                    () => setStatusReceita("PENDENTE")
                  )}
                </View>
              </>
            ) : (
              <>
                <Text style={estiloLabel}>
                  Situação da despesa
                </Text>

                <View style={estiloLinha}>
                  {opcao(
                    "Paga",
                    "PAGA",
                    statusDespesa === "PAGA",
                    () => setStatusDespesa("PAGA")
                  )}

                  {opcao(
                    "Pendente",
                    "PENDENTE",
                    statusDespesa === "PENDENTE",
                    () => setStatusDespesa("PENDENTE")
                  )}
                </View>

                <Text style={estiloLabel}>
                  Forma de pagamento
                </Text>

                <View style={estiloOpcoesPagamento}>
                  {FORMAS_PAGAMENTO.map((forma) => (
                    <View
                      key={forma.value}
                      style={estiloItemPagamento}
                    >
                      {opcao(
                        forma.label,
                        forma.value,
                        formaPagamento === forma.value,
                        () => setFormaPagamento(forma.value)
                      )}
                    </View>
                  ))}
                </View>

                {statusDespesa === "PAGA" && (
                  <Input
                    label="Data do pagamento"
                    value={dataPagamento}
                    onChangeText={(texto: string) =>
                      setDataPagamento(mascararData(texto))
                    }
                    placeholder="DD/MM/AAAA"
                    keyboardType="numeric"
                  />
                )}
              </>
            )}

            <View style={estiloLinhaRepetir}>
              <Text style={estiloLabel}>
                Repetir mensalmente
              </Text>

              <Switch
                value={repetir}
                onValueChange={setRepetir}
                trackColor={{
                  false: "#555",
                  true: "#482287",
                }}
                thumbColor={repetir ? "#B7FF00" : "#FFFFFF"}
              />
            </View>

            {!!erro && (
              <Text
                style={estiloErro}
                accessibilityRole="alert"
              >
                {erro}
              </Text>
            )}

            <Button
              titulo="Cancelar"
              onPress={voltar}
              variante="secundario"
            />

            <Button
              titulo={salvando ? "Salvando..." : "Salvar"}
              onPress={salvar}
              disabled={salvando}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
