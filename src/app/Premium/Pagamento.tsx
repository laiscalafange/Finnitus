import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { CreditCard, QrCode } from "lucide-react-native";

import { buscarPlano } from "@/features/planosData";
import { METODOS_SIMULADOS } from "@/features/pagamentoUtils";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Cards";
import { HeaderInterno } from "@/shared/components/Header";
import { Cores } from "@/shared/constants/Cores";
import { Rotas } from "@/shared/constants/Rotas";
import { FUNDO_PAGAMENTO, styles } from "@/styles/pagamento";

type Metodo = (typeof METODOS_SIMULADOS)[number]["id"];

export default function Pagamento() {
  const router = useRouter();
  const { plano: planoId } = useLocalSearchParams<{ plano?: string }>();
  const plano = buscarPlano(planoId);
  const [metodo, setMetodo] = useState<Metodo>("cartao");

  if (!plano) {
    return <Redirect href={Rotas.premium} />;
  }

  const planoIdConfirmado = plano.id;
  const pago = Boolean(plano.periodo);
  const metodoSelecionado = METODOS_SIMULADOS.find(({ id }) => id === metodo);

  function confirmar() {
    router.replace({
      pathname: Rotas.premiumAtivo,
      params: pago
        ? { plano: planoIdConfirmado, metodo }
        : { plano: planoIdConfirmado },
    });
  }

  return (
    <LinearGradient colors={FUNDO_PAGAMENTO} style={styles.fundo}>
      <HeaderInterno titulo={pago ? "Simular compra" : "Simular plano"} />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Card gradiente={[Cores.fundo.cardAlt, Cores.fundo.navBarra]} style={styles.card}>
          <Text accessibilityRole="header" style={styles.titulo}>{plano.nome}</Text>
          <Text style={styles.preco}>{plano.preco}{plano.periodo}</Text>
          <Text style={styles.texto}>
            {pago
              ? "Use um meio de pagamento fictício para testar a compra. A simulação é gratuita."
              : "Veja como seria a confirmação do plano Básico."}
          </Text>
        </Card>

        {pago && (
          <>
            <Text accessibilityRole="header" style={styles.secao}>Forma de pagamento</Text>
            <View style={styles.metodos}>
              {METODOS_SIMULADOS.map(({ id, titulo }) => {
                const ativo = id === metodo;
                const Icone = id === "cartao" ? CreditCard : QrCode;
                const cor = ativo ? Cores.destaque.limao : Cores.texto.claro;

                return (
                  <Pressable
                    key={id}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: ativo }}
                    onPress={() => setMetodo(id)}
                    style={[styles.metodo, ativo && styles.metodoAtivo]}
                  >
                    <Icone size={21} color={cor} />
                    <Text style={[styles.metodoTexto, { color: cor }]}>{titulo}</Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={styles.texto}>{metodoSelecionado?.descricao}</Text>
          </>
        )}

        <Button
          titulo={pago ? "Simular pagamento" : "Concluir demonstração"}
          variante="terciario"
          onPress={confirmar}
        />
        <Button
          titulo="Voltar aos planos"
          variante="botaotexto"
          onPress={() => router.dismissTo(Rotas.premium)}
        />
      </ScrollView>
    </LinearGradient>
  );
}
