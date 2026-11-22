import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";

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
import type { TipoTransacao } from "@/features/menuMais/types";
import { styles } from "@/features/menuMais/styles/formulario";

// Tela de registro aberta pelos botões "Despesas" e "Receitas" do menu do +.
// O tipo chega pela rota (?tipo=gasto ou ?tipo=entrada) e não pode ser
// trocado dentro da tela: cada botão abre o seu próprio registro.
// Sem parâmetro, abre como despesa.
export default function NovoGasto() {
  const voltar = useVoltar();
  const { adicionarTransacao } = useFinanceiro();

  // Tipo da transação: "entrada" = receita, "gasto" = despesa
  const { tipo: tipoParam } = useLocalSearchParams<{ tipo?: string }>();
  const tipo: TipoTransacao = tipoParam === "entrada" ? "entrada" : "gasto";
  const ehReceita = tipo === "entrada";

  // Textos e categorias de cada tipo
  const categorias = ehReceita ? CATEGORIAS_ENTRADA : CATEGORIAS_GASTO;
  const titulo = ehReceita ? "Nova receita" : "Nova despesa";
  const nomeItem = ehReceita ? "receita" : "despesa";
  const exemploDescricao = ehReceita
    ? "Ex: Pagamento de projeto"
    : "Ex: Almoço em família";

  // Campos do formulário
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [data, setData] = useState(hojeFormatado());
  const [descricao, setDescricao] = useState("");
  const [repetir, setRepetir] = useState(false);

  // Mensagem de erro de validação
  const [erro, setErro] = useState("");

  function salvar() {
    if (moedaParaNumero(valor) <= 0) {
      setErro(`Informe o valor da ${nomeItem}.`);
      return;
    }

    if (!categoria) {
      setErro("Escolha uma categoria.");
      return;
    }

    if (!dataValida(data)) {
      setErro("Informe uma data válida (DD/MM/AAAA).");
      return;
    }

    setErro("");

    // Guarda como "gasto" (despesa) ou "entrada" (receita), igual a antes,
    // então Sumário, Rotas, Contas fixas e Movimentações continuam funcionando
    adicionarTransacao({
      tipo,
      valor: moedaParaNumero(valor),
      categoriaId: categoria,
      data,
      descricao: descricao.trim() || undefined,
      repetirMensalmente: repetir,
    });

    voltar();
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
          {/* Cabeçalho: só a seta de voltar e o título do tipo */}
          <HeaderInterno titulo={titulo} />

          <View style={styles.formulario}>
            <Input
              label="Valor"
              placeholder="0,00"
              keyboardType="numeric"
              value={valor}
              onChangeText={(texto) => setValor(mascararMoeda(texto))}
              icone={<Text style={styles.prefixoMoeda}>R$</Text>}
            />

            {/* Categorias de despesa ou de receita, conforme o botão usado */}
            <SeletorCategoria
  categorias={categorias}
  selecionada={categoria}
  aoSelecionar={setCategoria}
  tipo={ehReceita ? "RECEITA" : "DESPESA"}
/>

            <Input
              label="Data"
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              value={data}
              onChangeText={(texto) => setData(mascararData(texto))}
            />

            <Input
              label="Descrição (opcional)"
              placeholder={exemploDescricao}
              value={descricao}
              onChangeText={setDescricao}
              autoCapitalize="sentences"
              maxLength={120}
            />

            <View style={styles.linhaSwitch}>
              <Text style={styles.textoSwitch}>Repetir mensalmente</Text>

              <Switch
                value={repetir}
                onValueChange={setRepetir}
                trackColor={{
                  false: Cores.overlay.forte,
                  true: Cores.roxo.claro,
                }}
                thumbColor={
                  repetir ? Cores.destaque.limao : Cores.texto.claro
                }
              />
            </View>

            {erro ? (
              <Text style={styles.erro} accessibilityRole="alert">
                {erro}
              </Text>
            ) : null}

            <View style={styles.linhaBotoes}>
              <View style={styles.colunaBotao}>
                <Button
                  titulo="Cancelar"
                  variante="outline"
                  onPress={voltar}
                />
              </View>

              <View style={styles.colunaBotao}>
                <Button
                  titulo={`Salvar ${nomeItem}`}
                  onPress={salvar}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}