
import { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import {
  Type,
  ChevronDown,
  Check,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/aparencia";

const TAMANHOS_TEXTO = [
  "Pequeno",
  "Médio",
  "Grande",
] as const;

type TamanhoTexto = (typeof TAMANHOS_TEXTO)[number];

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.94)",
  "rgba(33, 18, 53, 0.94)",
];

export default function Aparencia() {
  const [tamanhoTexto, setTamanhoTexto] =
    useState<TamanhoTexto>("Médio");

  const [seletorAberto, setSeletorAberto] =
    useState(false);

  function selecionarTamanho(opcao: TamanhoTexto) {
    setTamanhoTexto(opcao);
    setSeletorAberto(false);
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="padrao" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo="Aparência" />

        <View style={styles.lista}>
          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.card}
          >
            <View style={styles.linhaIcone}>
              <View style={styles.iconeContainer}>
                <Type
                  size={19}
                  color={Cores.destaque.limao}
                />
              </View>

              <View style={styles.textosTitulo}>
                <Text style={styles.rotuloItem}>
                  Tamanho dos textos
                </Text>

                <Text style={styles.descricaoItem}>
                  Escolha o tamanho de texto que prefere.
                </Text>
              </View>
            </View>

            {/* SELETOR */}
            <TouchableOpacity
              style={[
                styles.seletor,
                seletorAberto && styles.seletorAberto,
              ]}
              activeOpacity={0.8}
              onPress={() =>
                setSeletorAberto(!seletorAberto)
              }
              accessibilityRole="button"
              accessibilityState={{
                expanded: seletorAberto,
              }}
            >
              <Text style={styles.valorSelecionado}>
                {tamanhoTexto}
              </Text>

              <ChevronDown
                size={19}
                color={Cores.destaque.limao}
                style={{
                  transform: [
                    {
                      rotate: seletorAberto
                        ? "180deg"
                        : "0deg",
                    },
                  ],
                }}
              />
            </TouchableOpacity>

            {/* OPÇÕES */}
            {seletorAberto && (
              <View style={styles.opcoesContainer}>
                {TAMANHOS_TEXTO.map((opcao) => (
                  <TouchableOpacity
                    key={opcao}
                    style={[
                      styles.opcao,
                      tamanhoTexto === opcao &&
                        styles.opcaoAtiva,
                    ]}
                    activeOpacity={0.8}
                    onPress={() =>
                      selecionarTamanho(opcao)
                    }
                  >
                    <Text
                      style={[
                        styles.textoOpcao,
                        tamanhoTexto === opcao &&
                          styles.textoOpcaoAtiva,
                      ]}
                    >
                      {opcao}
                    </Text>

                    {tamanhoTexto === opcao && (
                      <Check
                        size={17}
                        color={Cores.destaque.limao}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
