
import { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { HeaderInterno } from "../../shared/components/Header";
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
import { errorMessage } from "@/services/api";
import { styles } from "@/styles/metasfuturas";

const TIPOS: { id: TipoMeta; rotulo: string }[] = [
  { id: "longoPrazo", rotulo: "Longo prazo" },
  { id: "mes", rotulo: "Meta do mês" },
];

export default function MetasFuturas() {
  const { criarMeta } = useFinanceiro();

  // Dados do formulário
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoMeta>("longoPrazo");

  const [valorObjetivo, setValorObjetivo] = useState("");
  const [valorInicial, setValorInicial] = useState("");
  const [dataLimite, setDataLimite] = useState("");

  // Estados de erro e carregamento
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Meta criada e confirmada pelo backend
  const [metaCriada, setMetaCriada] = useState<Meta | null>(
    null
  );

  // =========================================
  // VALIDAR E CRIAR META NO BANCO NEON
  // =========================================
  async function validarECriar() {
    // Impede criação duplicada por vários cliques
    if (salvando) {
      return;
    }

    const objetivo = moedaParaNumero(valorObjetivo);
    const inicial = moedaParaNumero(valorInicial);

    // Valida o nome
    if (!nome.trim()) {
      setErro("Informe o nome da meta.");
      return;
    }

    // Valida o valor objetivo
    if (!Number.isFinite(objetivo) || objetivo <= 0) {
      setErro("Informe o valor objetivo.");
      return;
    }

    // Valida o valor inicial
    if (!Number.isFinite(inicial) || inicial < 0) {
      setErro("Informe um valor inicial válido.");
      return;
    }

    if (inicial >= objetivo) {
      setErro(
        "O valor inicial deve ser menor que o valor objetivo."
      );
      return;
    }

    // Valida a data limite, caso informada
    if (dataLimite) {
      if (!dataValida(dataLimite)) {
        setErro(
          "Informe uma data limite válida (DD/MM/AAAA)."
        );
        return;
      }

      if (dataEhPassada(dataLimite)) {
        setErro(
          "A data limite não pode estar no passado."
        );
        return;
      }
    }

    setErro("");
    setSalvando(true);

    try {
      // Aguarda o backend confirmar a criação
      const meta = await criarMeta({
        nome: nome.trim(),
        tipo,
        valorTotal: objetivo,
        valorInicial: inicial,
        dataLimite: dataLimite || undefined,
      });

      // Garante que o pop-up tenha nome e objetivo
      setMetaCriada({
        ...meta,
        nome: meta.nome?.trim() || nome.trim(),
        valorTotal: meta.valorTotal ?? objetivo,
      });

    } catch (error) {
      console.error("Erro ao criar meta:", error);

      setErro(
        errorMessage(error)
      );

    } finally {
      setSalvando(false);
    }
  }

  // =========================================
  // LIMPAR FORMULÁRIO PARA CRIAR OUTRA META
  // =========================================
  function novaMeta() {
    setMetaCriada(null);
    setNome("");
    setTipo("longoPrazo");
    setValorObjetivo("");
    setValorInicial("");
    setDataLimite("");
    setErro("");
  }

  return (
    <LinearGradient
      colors={["#3f1e69", "#08070A", "#291444"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >
          <HeaderInterno
            titulo="Metas"
            subtitulo="Criação"
          />

          <View style={styles.conteudoSobreHeader}>

            {/* TIPO DA META */}
            <Text style={styles.rotuloTipo}>
              Tipo de meta
            </Text>

            <AlternadorTipo
              valor={tipo}
              aoMudar={setTipo}
              opcoes={TIPOS}
            />

            {/* NOME */}
            <Input
              label="Nome da meta"
              placeholder="Ex: Viagem para Europa"
              value={nome}
              onChangeText={setNome}
            />

            {/* OBJETIVO */}
            <Input
              label="Valor do objetivo"
              placeholder="0,00"
              keyboardType="numeric"
              value={valorObjetivo}
              onChangeText={(texto) =>
                setValorObjetivo(mascararMoeda(texto))
              }
              icone={
                <Text style={styles.prefixoMoeda}>
                  R$
                </Text>
              }
            />

            {/* VALOR INICIAL */}
            <Input
              label="Valor inicial já guardado"
              placeholder="0,00"
              keyboardType="numeric"
              value={valorInicial}
              onChangeText={(texto) =>
                setValorInicial(mascararMoeda(texto))
              }
              icone={
                <Text style={styles.prefixoMoeda}>
                  R$
                </Text>
              }
            />

            {/* DATA LIMITE */}
            <Input
              label="Data limite (opcional)"
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              value={dataLimite}
              onChangeText={(texto) =>
                setDataLimite(mascararData(texto))
              }
            />

            {/* MENSAGEM DE ERRO */}
            {erro ? (
              <Text
                style={styles.erro}
                accessibilityRole="alert"
              >
                {erro}
              </Text>
            ) : null}

            {/* BOTÃO DE CRIAÇÃO */}
            <View style={styles.botaoContainer}>
              <Button
                titulo={
                  salvando
                    ? "Criando meta..."
                    : "Criar meta"
                }
                onPress={validarECriar}
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* POP-UP DE META CRIADA */}
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
