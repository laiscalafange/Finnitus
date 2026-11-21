import { useIdioma } from "@/features/idioma";

import { useState } from "react";

import {
  View,
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
import { EstadoConfiguracoes } from "@/shared/components/EstadoConfiguracoes";
import { Text } from "@/shared/components/Texto";
import { useConfiguracoes, type TamanhoTexto } from "@/features/configuracoesContext";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/aparencia";

const TAMANHOS_TEXTO = {
  PEQUENO: "Pequeno",
  MEDIO: "Médio",
  GRANDE: "Grande",
} as const satisfies Record<TamanhoTexto, string>;

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.94)",
  "rgba(33, 18, 53, 0.94)",
];

export default function Aparencia() {
  const { t } = useIdioma();
  const { configuracoes, carregando, salvando, atualizar } = useConfiguracoes();
  const tamanhoTexto = configuracoes?.tamanhoTexto;
  const bloqueado = !configuracoes || carregando || salvando;
  const [seletorAberto, setSeletorAberto] =
    useState(false);

  function selecionarTamanho(opcao: TamanhoTexto) {
    setSeletorAberto(false);
    if (opcao !== tamanhoTexto) void atualizar({ tamanhoTexto: opcao });
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="padrao" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo={t("Aparência")} />

        <View style={styles.lista}>
          <EstadoConfiguracoes />
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
                  {t("Tamanho dos textos")}
                </Text>

                <Text style={styles.descricaoItem}>
                  {t("Escolha o tamanho de texto que prefere.")}
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
              disabled={bloqueado}
              onPress={() =>
                setSeletorAberto(!seletorAberto)
              }
              accessibilityRole="button"
              accessibilityState={{
                expanded: seletorAberto,
                disabled: bloqueado,
              }}
            >
              <Text style={styles.valorSelecionado}>
                {tamanhoTexto ? t(TAMANHOS_TEXTO[tamanhoTexto]) : "—"}
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
                {(Object.keys(TAMANHOS_TEXTO) as TamanhoTexto[]).map((opcao) => (
                  <TouchableOpacity
                    key={opcao}
                    style={[
                      styles.opcao,
                      tamanhoTexto === opcao &&
                        styles.opcaoAtiva,
                    ]}
                    activeOpacity={0.8}
                    disabled={bloqueado}
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
                      {t(TAMANHOS_TEXTO[opcao])}
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
