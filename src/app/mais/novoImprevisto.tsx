import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useRouter } from "expo-router";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import { SeletorCategoria } from "@/features/menuMais/components/SeletorCategoria";
import { CATEGORIAS_GASTO } from "@/features/menuMais/constants";
import {
  dataValida,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "@/features/menuMais/utils";
import { styles } from "@/features/menuMais/styles/formulario";

// Tela "Novo imprevisto": registra uma despesa inesperada (remédio, conserto,
// manutenção...). Os dados serão usados pelo Plano B.
export default function NovoImprevisto() {
  const router = useRouter();

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [dataPagamento, setDataPagamento] = useState("");
  const [descricao, setDescricao] = useState("");

  // Mensagem de erro de validação
  const [erro, setErro] = useState("");

  function continuar() {
    if (!nome.trim()) {
      setErro("Informe o nome do imprevisto.");
      return;
    }

    if (moedaParaNumero(valor) <= 0) {
      setErro("Informe o valor necessário.");
      return;
    }

    if (!categoria) {
      setErro("Escolha uma categoria.");
      return;
    }

    if (!dataValida(dataPagamento)) {
      setErro("Informe uma data de pagamento válida (DD/MM/AAAA).");
      return;
    }

    setErro("");

    // TODO (backend): ainda não existe endpoint de imprevistos. Quando existir,
    // enviar { nome, valor: moedaParaNumero(valor), categoria, dataPagamento,
    // descricao } pra API aqui.

    // Leva pro Plano B, que vai usar o imprevisto (hoje a tela usa dados mock)
    router.dismissTo("/PlanoB");
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      {/* Empurra o formulário pra cima quando o teclado abre */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >
          {/* Cabeçalho: só a seta de voltar e o título, igual ao protótipo */}
          <HeaderInterno titulo="Novo imprevisto" />

          {/* Formulário (logo abaixo do cabeçalho) */}
          <View style={styles.formulario}>
            <Input
              label="Nome do imprevisto"
              placeholder="Ex: Conserto do celular"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="sentences"
              maxLength={60}
            />

            <Input
              label="Valor necessário"
              placeholder="0,00"
              keyboardType="numeric"
              value={valor}
              onChangeText={(texto) => setValor(mascararMoeda(texto))}
              icone={<Text style={styles.prefixoMoeda}>R$</Text>}
            />

            <SeletorCategoria
              categorias={CATEGORIAS_GASTO}
              selecionada={categoria}
              aoSelecionar={setCategoria}
            />

            <Input
              label="Data do pagamento"
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              value={dataPagamento}
              onChangeText={(texto) => setDataPagamento(mascararData(texto))}
            />

            <Input
              label="Descrição (opcional)"
              placeholder="Ex: Troca da tela"
              value={descricao}
              onChangeText={setDescricao}
              autoCapitalize="sentences"
              maxLength={120}
            />

            {/* Mensagem de erro de validação */}
            {erro ? (
              <Text style={styles.erro} accessibilityRole="alert">
                {erro}
              </Text>
            ) : null}

            <Button titulo="Continuar" onPress={continuar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}