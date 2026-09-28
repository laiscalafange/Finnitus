import { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { HeaderInterno } from "../../shared/components/Header";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";

import { styles } from "@/styles/metasfuturas";

// Tela "Metas > Criação". Os campos antigos (Salário/Despesas) não
// faziam sentido aqui — eram de outra etapa do fluxo. Troquei pelos
// campos de criação de meta em si (nome, valor objetivo, valor já
// guardado e data limite), com os mesmos componentes Input/Button já
// usados no resto do app, mantendo o design (gradiente, header e
// título) como estava.
export default function MetasFuturas() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [valorInicial, setValorInicial] = useState("");
  const [dataLimite, setDataLimite] = useState("");

  const [erro, setErro] = useState("");

  function criarMeta() {
    if (!nome.trim() || !valorObjetivo.trim()) {
      setErro("Informe pelo menos o nome e o valor objetivo.");
      return;
    }

    setErro("");

    // TODO (backend): não existe endpoint pra criar metas ainda —
    // quando existir, enviar { nome, valorObjetivo, valorInicial,
    // dataLimite } pra API aqui.

    router.dismissTo("/metas");
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
      <HeaderInterno
        titulo="Metas"
        subtitulo="Criação"
      />

      {/* Conteúdo principal, posicionado por cima do header
          (marginTop negativo no style "conteudoSobreHeader") */}
      <View style={styles.conteudoSobreHeader}>

        <Input
          label="Nome da meta"
          placeholder="Ex: Viagem para Europa"
          value={nome}
          onChangeText={setNome}
        />

        <Input
          label="Valor objetivo"
          placeholder="0,00"
          keyboardType="numeric"
          value={valorObjetivo}
          onChangeText={setValorObjetivo}
          icone={<Text style={styles.prefixoMoeda}>R$</Text>}
        />

        <Input
          label="Valor inicial já guardado"
          placeholder="0"
          keyboardType="numeric"
          value={valorInicial}
          onChangeText={setValorInicial}
          icone={<Text style={styles.prefixoMoeda}>R$</Text>}
        />

        <Input
          label="Data limite (opcional)"
          placeholder="AAAA-MM-DD"
          maxLength={10}
          value={dataLimite}
          onChangeText={setDataLimite}
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
            onPress={criarMeta}
          />
        </View>

      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}