import { useCallback, useEffect, useRef, useState } from "react";

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { X } from "lucide-react-native";

import { Card } from "@/shared/components/Cards";
import { Button } from "@/shared/components/Button";
import { Cores } from "@/shared/constants/Cores";

// Mesmo visual dos cards flutuantes da Reserva e das Metas
import { styles as base } from "@/features/menuMais/components/ModalReserva/styles";
import { styles } from "./styles";

// Anos que dá pra escolher
const ANO_MINIMO = 2000;
const ANO_MAXIMO = 2100;

// Segurar a seta do ano: espera um pouco e começa a repetir, cada vez mais
// rápido (tempos em milissegundos)
const ESPERA_ANTES_DE_REPETIR = 350;
const INTERVALO_INICIAL = 150;
const INTERVALO_MINIMO = 40;
const FATOR_ACELERACAO = 0.85;

type Props = {
  visible: boolean;
  // Mês (0 = janeiro ... 11 = dezembro) e ano que o calendário está mostrando
  mes: number;
  ano: number;
  // Nomes curtos dos 12 meses (ex.: Jan, Fev...)
  nomesMeses: readonly string[];
  aoFechar: () => void;
  // Chamado ao confirmar, com o mês (0-11) e o ano escolhidos
  aoConfirmar: (mes: number, ano: number) => void;
};

// Card flutuante pra escolher o mês e o ano do calendário do Plano do mês
export function ModalMesAno({
  visible,
  mes,
  ano,
  nomesMeses,
  aoFechar,
  aoConfirmar,
}: Props) {
  const [mesEscolhido, setMesEscolhido] = useState(mes);
  const [anoEscolhido, setAnoEscolhido] = useState(ano);

  // Sempre que abre, começa no mês e ano que o calendário está mostrando
  useEffect(() => {
    if (visible) {
      setMesEscolhido(mes);
      setAnoEscolhido(ano);
    }
  }, [visible, mes, ano]);

  // Timer da seta que está sendo segurada
  const timerAno = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pararRepeticao = useCallback(() => {
    if (timerAno.current) {
      clearTimeout(timerAno.current);
      timerAno.current = null;
    }
  }, []);

  // Soma (ou subtrai) um ano, sem passar dos limites
  const mudarAno = useCallback((passo: number) => {
    setAnoEscolhido((atual) =>
      Math.min(ANO_MAXIMO, Math.max(ANO_MINIMO, atual + passo))
    );
  }, []);

  // Ao tocar: muda 1 ano na hora. Se continuar segurando, repete cada vez
  // mais rápido até soltar
  function comecarRepeticao(passo: number) {
    pararRepeticao();
    mudarAno(passo);

    function repetir(intervalo: number) {
      timerAno.current = setTimeout(() => {
        mudarAno(passo);
        repetir(Math.max(INTERVALO_MINIMO, intervalo * FATOR_ACELERACAO));
      }, intervalo);
    }

    timerAno.current = setTimeout(
      () => repetir(INTERVALO_INICIAL),
      ESPERA_ANTES_DE_REPETIR
    );
  }

  // Fechou o card ou saiu da tela: para de repetir
  useEffect(() => {
    if (!visible) {
      pararRepeticao();
    }

    return pararRepeticao;
  }, [visible, pararRepeticao]);

  const noAnoMinimo = anoEscolhido <= ANO_MINIMO;
  const noAnoMaximo = anoEscolhido >= ANO_MAXIMO;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={aoFechar}
    >
      <KeyboardAvoidingView
        style={base.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Fundo escurecido: tocar fora fecha */}
        <Pressable style={base.fundo} onPress={aoFechar} />

        <Card
          gradiente={["rgba(73, 38, 155, 0.95)", "rgba(45, 17, 108, 0.95)"]}
          style={base.card}
        >
          {/* Botão X no canto superior direito */}
          <Pressable
            style={base.fechar}
            onPress={aoFechar}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <X size={22} color={Cores.texto.claro} />
          </Pressable>

          <Text style={base.titulo}>Escolher mês e ano</Text>

          {/* Ano: ‹ 2026 › */}
          <View style={styles.linhaAno}>
            <TouchableOpacity
              style={[styles.setaAno, noAnoMinimo && styles.setaAnoDesativada]}
              disabled={noAnoMinimo}
              onPressIn={() => comecarRepeticao(-1)}
              onPressOut={pararRepeticao}
              accessibilityRole="button"
              accessibilityLabel="Ano anterior"
            >
              <Text style={styles.setaAnoTexto}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.ano}>{anoEscolhido}</Text>

            <TouchableOpacity
              style={[styles.setaAno, noAnoMaximo && styles.setaAnoDesativada]}
              disabled={noAnoMaximo}
              onPressIn={() => comecarRepeticao(1)}
              onPressOut={pararRepeticao}
              accessibilityRole="button"
              accessibilityLabel="Próximo ano"
            >
              <Text style={styles.setaAnoTexto}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Meses */}
          <View style={styles.grade}>
            {nomesMeses.map((nome, indice) => {
              const selecionado = indice === mesEscolhido;

              return (
                <TouchableOpacity
                  key={nome}
                  style={[styles.mes, selecionado && styles.mesSelecionado]}
                  activeOpacity={0.8}
                  onPress={() => setMesEscolhido(indice)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selecionado }}
                >
                  <Text
                    style={[
                      styles.mesTexto,
                      selecionado && styles.mesTextoSelecionado,
                    ]}
                  >
                    {nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={base.botoes}>
            <Button
              titulo="Confirmar"
              onPress={() => aoConfirmar(mesEscolhido, anoEscolhido)}
            />

            <Button
              titulo="Cancelar"
              variante="botaotexto"
              onPress={aoFechar}
            />
          </View>
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  );
}