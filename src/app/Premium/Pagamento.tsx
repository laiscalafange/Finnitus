import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { QrCode } from "lucide-react-native";

import { HeaderMP } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";
import { Rotas } from "../../shared/constants/Rotas";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { buscarPlanoPago } from "@/features/planosData";
import {
  cvvValido,
  mascararCvv,
  mascararNumeroCartao,
  mascararValidade,
  numeroCartaoValido,
  validadeValida,
} from "@/features/pagamentoUtils";
import { styles } from "../../styles/pagamento";

type Forma = "cartao" | "pix";

// Opções do alternador (reaproveita o mesmo do Histórico de Metas)
const FORMAS: { id: Forma; rotulo: string }[] = [
  { id: "cartao", rotulo: "Cartão" },
  { id: "pix", rotulo: "Pix" },
];

// Gradientes iguais aos das outras telas internas
const GRADIENTE_FUNDO: [string, string, string] = [
  "#160B24",
  "#08070A",
  "#160B24",
];
const GRADIENTE_CARD: [string, string] = [
  Cores.fundo.cardAlt,
  Cores.fundo.navBarra,
];

// Tela "Pagamento": aberta pelo botão "Obter Agora" da tela Premium.
// A pessoa escolhe pagar com Cartão ou Pix e confirma.
export default function Pagamento() {
  const router = useRouter();

  // Plano escolhido na tela Premium (chega como parâmetro de rota)
  const { plano: planoId } = useLocalSearchParams<{ plano?: string }>();
  const plano = buscarPlanoPago(planoId);

  const [forma, setForma] = useState<Forma>("cartao");

  // Campos do cartão
  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [validade, setValidade] = useState("");
  const [cvv, setCvv] = useState("");

  // Mensagem de erro de validação
  const [erro, setErro] = useState("");

  function mudarForma(nova: Forma) {
    setForma(nova);
    setErro("");
  }

  function confirmar() {
    // Só o cartão tem campos pra validar (o Pix gera o QR Code depois)
    if (forma === "cartao") {
      if (!numeroCartaoValido(numero)) {
        setErro("Confira o número do cartão.");
        return;
      }

      if (nome.trim().length < 2) {
        setErro("Informe o nome como está no cartão.");
        return;
      }

      if (!validadeValida(validade)) {
        setErro("Confira a validade do cartão (MM/AA).");
        return;
      }

      if (!cvvValido(cvv)) {
        setErro("Confira o código de segurança (CVV).");
        return;
      }
    }

    setErro("");

    // TODO (backend): enviar o pagamento pra um gateway (cartão ou Pix) e
    // só ir pra tela de sucesso quando a assinatura for confirmada.
    // Hoje ainda não existe cobrança, então a tela só valida e avança.
    // replace: assim a seta de voltar da tela de sucesso não reabre o Pagamento.
    router.replace({
      pathname: Rotas.premiumAtivo,
      params: { plano: plano.id },
    });
  }

  return (
    <LinearGradient
      colors={GRADIENTE_FUNDO}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
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
          <HeaderMP
            titulo="Pagamento"
            subtitulo="Premium"
            mostrarPremium={false}
            mostrarNotificacao={false}
          />

          {/* Conteúdo (sobe por cima da faixa roxa do header) */}
          <View style={styles.formulario}>
            <AlternadorTipo
              valor={forma}
              aoMudar={mudarForma}
              opcoes={FORMAS}
            />

            {forma === "cartao" ? (
              <>
                <Input
                  label="Número do cartão"
                  placeholder="0000 0000 0000 0000"
                  value={numero}
                  onChangeText={(texto) =>
                    setNumero(mascararNumeroCartao(texto))
                  }
                  keyboardType="numeric"
                  autoComplete="cc-number"
                  maxLength={19}
                />

                <Input
                  label="Nome no cartão"
                  placeholder="Como está no cartão"
                  value={nome}
                  onChangeText={setNome}
                  autoCapitalize="characters"
                  autoComplete="cc-name"
                />

                {/* Validade e CVV lado a lado */}
                <View style={styles.linhaCampos}>
                  <View style={styles.metade}>
                    <Input
                      label="Validade"
                      placeholder="MM/AA"
                      value={validade}
                      onChangeText={(texto) =>
                        setValidade(mascararValidade(texto))
                      }
                      keyboardType="numeric"
                      autoComplete="cc-exp"
                      maxLength={5}
                    />
                  </View>

                  <View style={styles.metade}>
                    <Input
                      label="CVV"
                      placeholder="000"
                      value={cvv}
                      onChangeText={(texto) => setCvv(mascararCvv(texto))}
                      keyboardType="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                    />
                  </View>
                </View>
              </>
            ) : (
              // Pix: o QR Code só é gerado depois de confirmar
              <Card gradiente={GRADIENTE_CARD} style={styles.cardQr}>
                <View style={styles.caixaQr}>
                  <QrCode size={48} color={Cores.destaque.limao} />
                </View>

                <Text style={styles.textoQr}>
                  QR Code gerado após confirmar
                </Text>
              </Card>
            )}

            {/* Resumo do plano escolhido */}
            <Card gradiente={GRADIENTE_CARD} style={styles.resumo}>
              <View style={styles.linhaResumo}>
                <Text style={styles.resumoNome}>{plano.nome} · Mensal</Text>
                <Text style={styles.resumoPreco}>{plano.preco}</Text>
              </View>

              <Text style={styles.resumoInfo}>
                {plano.testeDias
                  ? `Cobrança após ${plano.testeDias} dias grátis`
                  : "Cobrança hoje"}
              </Text>
            </Card>

            {/* Mensagem de erro de validação */}
            {erro ? (
              <Text style={styles.erro} accessibilityRole="alert">
                {erro}
              </Text>
            ) : null}

            <Button titulo="Confirmar pagamento" onPress={confirmar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}