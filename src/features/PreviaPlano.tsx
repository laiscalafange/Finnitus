import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Href } from "expo-router";
import { ArrowUpRight, Crown, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Cards";
import { Cores } from "@/shared/constants/Cores";
import { styles } from "@/styles/premiumAtivo";
import type { Plano } from "./planosData";

type Props = {
  plano: Plano;
  aoFechar: () => void;
  aoAbrirRecurso: (rota: Href) => void;
  aoSimular: () => void;
};

export function PreviaPlano({ plano, aoFechar, aoAbrirRecurso, aoSimular }: Props) {

  return (
    <Modal animationType="slide" onRequestClose={aoFechar}>
      <LinearGradient
        colors={["#160B24", "#08070A", "#160B24"]}
        style={styles.fundo}
      >
        <SafeAreaView style={styles.fundo} accessibilityViewIsModal>
          <View style={styles.cabecalho}>
            <View style={styles.cabecalhoTexto}>
              <Text style={styles.subtitulo}>Demonstração sem cobrança</Text>
              <Text accessibilityRole="header" style={styles.titulo}>Prévia do plano</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar prévia"
              onPress={aoFechar}
              style={styles.fechar}
            >
              <X size={22} color={Cores.base.branco} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.conteudo}>
            <Card gradiente={[Cores.fundo.cardAlt, Cores.fundo.navBarra]} style={styles.plano}>
              <View style={styles.identidade}>
                <View style={styles.emblema}>
                  <Crown size={23} color={Cores.destaque.limao} />
                </View>
                <View style={styles.cabecalhoTexto}>
                  <Text accessibilityRole="header" style={styles.planoNome}>{plano.nome}</Text>
                  <Text style={styles.preco}>{plano.preco}{plano.periodo}</Text>
                </View>
              </View>
              {plano.teste && <Text style={styles.descricao}>{plano.teste} na proposta do plano.</Text>}
              <Button titulo={plano.periodo ? "Simular compra" : "Simular plano"} onPress={aoSimular} />
            </Card>

            <Text accessibilityRole="header" style={styles.secao}>Recursos e exemplos</Text>
            {plano.recursos.map(({ nome, exemplo, destino }) => (
              <View key={nome} style={styles.recurso}>
                <Text style={styles.recursoNome}>{nome}</Text>
                <Text style={styles.descricao}>{exemplo}</Text>
                {destino && (
                  <Pressable
                    accessibilityRole="link"
                    onPress={() => aoAbrirRecurso(destino.rota)}
                    style={styles.link}
                  >
                    <Text style={styles.linkTexto}>{destino.titulo}</Text>
                    <ArrowUpRight size={16} color={Cores.destaque.limao} />
                  </Pressable>
                )}
              </View>
            ))}

            <Button titulo="Voltar aos planos" variante="botaotexto" onPress={aoFechar} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
}
