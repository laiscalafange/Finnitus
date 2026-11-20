
import { useCallback, useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text } from "@/shared/components/Texto";

import { LinearGradient } from "expo-linear-gradient";
import {
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";

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

const TIPOS: { id: TipoMeta; rotulo: string }[] = [
  { id: "longoPrazo", rotulo: "Longo prazo" },
  { id: "mes", rotulo: "Meta do mês" },
];

export default function MetasFuturas() {
  const { criarMeta } = useFinanceiro();

  const { tipo: tipoParam } =
    useLocalSearchParams<{ tipo?: string }>();

  const tipoInicial: TipoMeta =
    tipoParam === "mes" ? "mes" : "longoPrazo";

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoMeta>(tipoInicial);
  const [valorObjetivo, setValorObjetivo] = useState("");
  const [valorInicial, setValorInicial] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [erro, setErro] = useState("");
  const [metaCriada, setMetaCriada] =
    useState<Meta | null>(null);
  const [criando, setCriando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setTipo(tipoInicial);
    }, [tipoInicial])
  );

  async function validarECriar() {
    if (criando) return;

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
      setErro(
        "O valor inicial deve ser menor que o valor objetivo."
      );
      return;
    }

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
    setCriando(true);

    try {
      const meta = await criarMeta({
        nome: nome.trim(),
        tipo,
        valorTotal: objetivo,
        valorInicial: inicial,
        dataLimite: dataLimite || undefined,
      });

      setMetaCriada(meta);
    } catch {
      setErro(
        "Não foi possível criar a meta. Tente novamente."
      );
    } finally {
      setCriando(false);
    }
  }

  function novaMeta() {
    setMetaCriada(null);
    setNome("");
    setTipo(tipoInicial);
    setValorObjetivo("");
    setValorInicial("");
    setDataLimite("");
    setErro("");
  }

  return (
    <LinearGradient
      colors={["#3F1E69", "#08070A", "#291444"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios" ? "padding" : "height"
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >
          <HeaderMP
            titulo="Metas"
            subtitulo="Criação"
          />

          <View style={styles.conteudoSobreHeader}>
            <View style={styles.blocoTipo}>
              <Text style={styles.rotuloTipo}>
                Tipo de meta
              </Text>

              <AlternadorTipo
                valor={tipo}
                aoMudar={setTipo}
                opcoes={TIPOS}
              />
            </View>

            <Input
              label="Nome da meta"
              placeholder="Ex: Viagem para Europa"
              value={nome}
              onChangeText={setNome}
            />

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

            {erro ? (
              <Text
                style={styles.erro}
                accessibilityRole="alert"
              >
                {erro}
              </Text>
            ) : null}

            <View style={styles.botaoContainer}>
              <Button
                titulo={
                  criando ? "Criando meta..." : "Criar meta"
                }
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
