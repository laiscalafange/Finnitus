import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { styles as form } from "@/features/menuMais/styles/formulario";
import { useVoltar } from "@/features/menuMais/useVoltar";
import {
  dataValida,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "@/features/menuMais/utils";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  competenciaAtual,
  competenciaSeguinte,
  contaDoMes,
  mesPorExtenso,
  partesData,
  type TipoRecebimento,
} from "@/features/contas/contasData";
import { styles } from "@/features/contas/styles";

const OPCOES_RECEBIMENTO: { id: TipoRecebimento; rotulo: string }[] = [
  { id: "integral", rotulo: "Integral" },
  { id: "parcial", rotulo: "Parcial" },
  { id: "adiantamento", rotulo: "Adiantamento" },
];

// Tela "Editar receita/despesa". Recebe ?id=...&competencia=AAAA-MM.
// Conta fixa: a mudança vale a partir do mês aberto e não altera os meses
// anteriores nem pagamentos/recebimentos já confirmados.
export default function EditarConta() {
  const voltar = useVoltar();
  const { id, competencia: competenciaParam } = useLocalSearchParams<{
    id?: string;
    competencia?: string;
  }>();

  const { transacoes, baixas, editarTransacao } = useFinanceiro();

  const transacao = transacoes.find((item) => item.id === id);
  const competencia = competenciaParam ?? competenciaAtual();
  const conta = transacao ? contaDoMes(transacao, baixas, competencia) : undefined;

  const [nome, setNome] = useState(conta?.nome ?? "");
  const [valor, setValor] = useState(
    conta ? mascararMoeda(String(Math.round(conta.valorPrevisto * 100))) : "",
  );
  // Conta fixa: só o dia do mês. Conta avulsa: data completa.
  const [dia, setDia] = useState(conta ? String(partesData(conta.dataVencimento)?.dia ?? "") : "");
  const [data, setData] = useState(transacao?.data ?? "");
  const [tipoRecebimento, setTipoRecebimento] = useState<TipoRecebimento>(
    conta?.tipoRecebimento ?? "integral",
  );
  const [observacao, setObservacao] = useState(conta?.observacao ?? "");
  const [erro, setErro] = useState("");

  if (!transacao || !conta) {
    return (
      <View style={form.container}>
        <BackgroundGradient variante="funcional" />
        <HeaderInterno titulo="Editar conta" />
        <View style={form.formulario}>
          <Text style={styles.vazio}>Não encontramos essa conta. Ela pode ter sido excluída.</Text>
          <Button titulo="Voltar" variante="outline" onPress={voltar} />
        </View>
      </View>
    );
  }

  const entrada = conta.tipo === "entrada";
  const fixa = conta.recorrente;

  // Mês a partir do qual a edição vai valer (se o mês aberto já foi
  // pago/recebido, vale só do mês seguinte)
  const jaRegistrado = Boolean(conta.baixa);
  const aPartirDe = jaRegistrado ? competenciaSeguinte(competencia) : competencia;

  function salvar() {
    if (!nome.trim()) {
      setErro("Informe o nome.");
      return;
    }

    if (moedaParaNumero(valor) <= 0) {
      setErro("Informe o valor.");
      return;
    }

    if (fixa) {
      const diaNumero = Number(dia);

      if (!Number.isInteger(diaNumero) || diaNumero < 1 || diaNumero > 31) {
        setErro("Informe o dia do mês (de 1 a 31).");
        return;
      }
    } else if (!dataValida(data)) {
      setErro("Informe uma data válida (DD/MM/AAAA).");
      return;
    }

    setErro("");

    editarTransacao(
      transacao!.id,
      {
        nome,
        valor: moedaParaNumero(valor),
        dia: fixa ? Number(dia) : undefined,
        data: fixa ? undefined : data,
        observacao,
        tipoRecebimento: entrada ? tipoRecebimento : undefined,
      },
      competencia,
    );

    voltar();
  }

  return (
    <View style={form.container}>
      <BackgroundGradient variante="funcional" />
      <KeyboardAvoidingView
        style={form.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={form.conteudo}
        >
          <HeaderInterno titulo={entrada ? "Editar receita" : "Editar despesa"} />

          <View style={form.formulario}>
            {fixa ? (
              <Text style={styles.aviso}>
                A alteração vale a partir de {mesPorExtenso(aPartirDe)}
                {jaRegistrado
                  ? ` (este mês já foi ${entrada ? "recebido" : "pago"})`
                  : ""}
                . Os meses anteriores e os {entrada ? "recebimentos" : "pagamentos"} já confirmados
                não mudam.
              </Text>
            ) : null}

            <Input
              label={entrada ? "Nome da receita" : "Nome da despesa"}
              placeholder="Ex: Salário"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="sentences"
              maxLength={60}
            />

            <Input
              label="Valor"
              placeholder="0,00"
              keyboardType="numeric"
              value={valor}
              onChangeText={(texto) => setValor(mascararMoeda(texto))}
              icone={<Text style={form.prefixoMoeda}>R$</Text>}
            />

            {fixa ? (
              <Input
                label={entrada ? "Dia do recebimento (1 a 31)" : "Dia do vencimento (1 a 31)"}
                placeholder="10"
                keyboardType="numeric"
                maxLength={2}
                value={dia}
                onChangeText={(texto) => setDia(texto.replace(/\D/g, ""))}
              />
            ) : (
              <Input
                label="Data"
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
                value={data}
                onChangeText={(texto) => setData(mascararData(texto))}
              />
            )}

            {entrada ? (
              <>
                <Text style={styles.aviso}>
                  Tipo de recebimento: use “Parcial” se o valor chega em partes e “Adiantamento”
                  se chega antes da data.
                </Text>
                <AlternadorTipo<TipoRecebimento>
                  valor={tipoRecebimento}
                  aoMudar={setTipoRecebimento}
                  opcoes={OPCOES_RECEBIMENTO}
                />
              </>
            ) : null}

            <Input
              label="Observação (opcional)"
              placeholder="Ex: débito automático"
              value={observacao}
              onChangeText={setObservacao}
              autoCapitalize="sentences"
              maxLength={200}
            />

            {erro ? (
              <Text style={form.erro} accessibilityRole="alert">
                {erro}
              </Text>
            ) : null}

            <Button titulo="Salvar alterações" onPress={salvar} />
            <View style={styles.espaco} />
            <Button titulo="Cancelar" variante="outline" onPress={voltar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}