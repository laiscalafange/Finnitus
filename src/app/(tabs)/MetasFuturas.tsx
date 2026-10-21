import { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { HeaderMP } from "../../shared/components/Header";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";

import MetasFrame from "./MetasFrame";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import {
  dataEhPassada,
  dataValida,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "@/features/menuMais/utils";
import { useFinanceiro } from "@/features/financeiroContext";
import type { Meta, TipoMeta } from "@/features/metasData";
import { styles } from "@/styles/metasfuturas";

// Opções do tipo da meta (reaproveita o alternador do Novo gasto)
const TIPOS: { id: TipoMeta; rotulo: string }[] = [
  { id: "longoPrazo", rotulo: "Longo prazo" },
  { id: "mes", rotulo: "Meta do mês" },
];

// Tela "Metas > Criação": nome, tipo (longo prazo ou do mês), valor objetivo,
// valor já guardado e data limite. A meta criada vai pro estado de metas
// (FinanceiroProvider), então aparece na tela Metas, em Detalhes, nas
// Análises e na Home.
export default function MetasFuturas() {
  const { criarMeta } = useFinanceiro();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoMeta>("longoPrazo");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [valorInicial, setValorInicial] = useState("");
  const [dataLimite, setDataLimite] = useState("");

  const [erro, setErro] = useState("");

  // Meta que acabou de ser criada (mostrada no card "Meta criada!")
  const [metaCriada, setMetaCriada] = useState<Meta | null>(null);

  async function validarECriar() {
    const objetivo = moedaParaNumero(valorObjetivo);
    const inicial = moedaParaNumero(valorInicial);

    if (!nome.trim()) {
      setErro("Informe o nome da meta.");
      return;
    }

    if (objetivo <= 0) {
      setErro("Informe o valor objetivo.");
      return;
    }

    if (inicial >= objetivo) {
      setErro("O valor inicial deve ser menor que o valor objetivo.");
      return;
    }

    if (dataLimite) {
      if (!dataValida(dataLimite)) {
        setErro("Informe uma data limite válida (DD/MM/AAAA).");
        return;
      }

      if (dataEhPassada(dataLimite)) {
        setErro("A data limite não pode estar no passado.");
        return;
      }
    }

    setErro("");

    // TODO (backend): não existe endpoint pra criar metas ainda. Quando
    // existir, enviar { nome, tipo, valorTotal: objetivo, valorInicial:
    // inicial, dataLimite } pra API aqui.
    const meta = await criarMeta({
      nome,
      tipo,
      valorTotal: objetivo,
      valorInicial: inicial,
      dataLimite: dataLimite || undefined,
    });

    setMetaCriada(meta);
  }

  // Fecha o card e limpa os campos pra uma nova meta
  function novaMeta() {
    setMetaCriada(null);
    setNome("");
    setTipo("longoPrazo");
    setValorObjetivo("");
    setValorInicial("");
    setDataLimite("");
  }

  return (
    <LinearGradient
      // Gradiente próprio dessa tela (não usa mais o GRADIENTS.background
      // compartilhado, pra não afetar outras telas como Premium)
      colors={["#3f1e69", "#08070A", "#291444"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Empurra o formulário pra cima quando o teclado abre */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* ScrollView: se o conteúdo passar da altura da tela (ex.: quando
          aparece a mensagem de erro), dá pra rolar até o botão */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >

          {/* Cabeçalho (título "Metas" + subtítulo "Criação") */}
          <HeaderMP
            titulo="Metas"
            subtitulo="Criação"
          />

          {/* Conteúdo principal, posicionado por cima do header
          (marginTop negativo no style "conteudoSobreHeader") */}
          <View style={styles.conteudoSobreHeader}>


            {/* Longo prazo ou Meta do mês */}
            <Text style={styles.rotuloTipo}>Tipo de meta</Text>
            <AlternadorTipo valor={tipo} aoMudar={setTipo} opcoes={TIPOS} />

            <Input
              label="Nome da meta"
              placeholder="Ex: Viagem para Europa"
              value={nome}
              onChangeText={setNome}
            />


            {/* Os valores têm máscara de moeda: "150050" vira "1.500,50" */}
            <Input
              label="Valor do objetivo"
              placeholder="0,00"
              keyboardType="numeric"
              value={valorObjetivo}
              onChangeText={(texto) => setValorObjetivo(mascararMoeda(texto))}
              icone={<Text style={styles.prefixoMoeda}>R$</Text>}
            />

            <Input
              label="Valor inicial já guardado"
              placeholder="0,00"
              keyboardType="numeric"
              value={valorInicial}
              onChangeText={(texto) => setValorInicial(mascararMoeda(texto))}
              icone={<Text style={styles.prefixoMoeda}>R$</Text>}
            />

            {/* A barra "/" entra sozinha enquanto digita: DD/MM/AAAA */}
            <Input
              label="Data limite (opcional)"
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              value={dataLimite}
              onChangeText={(texto) => setDataLimite(mascararData(texto))}
            />

            {erro ? (
              <Text style={styles.erro} accessibilityRole="alert">
                {erro}
              </Text>
            ) : null}

            {/* Botão de confirmação */}
            <View style={styles.botaoContainer}>
              <Button
                titulo="Criar meta"
                onPress={validarECriar}
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <MetasFrame
        visible={metaCriada !== null}
        tipo="criada"
        nome={metaCriada?.nome}
        valor={metaCriada?.valorTotal}
        onClose={novaMeta}
      />
    </LinearGradient>
  );
}