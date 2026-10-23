import { View, Text, ScrollView } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/inicieStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";

// Limite do aumento de fonte do sistema (evita o texto estourar a tela)
const LIMITE_FONTE = 1.1;

export default function Inicie() {
  const roteador = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      {/* O texto rola se não couber; os botões ficam sempre livres embaixo */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.linha}>
          <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
            Inicie
          </Text>
          <View>
            <Text style={styles.title2} maxFontSizeMultiplier={LIMITE_FONTE}>
              agora
            </Text>
            <Underline width={72} marginLeft={48} />
          </View>
        </View>
        <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
          a sua
        </Text>
        <Text style={styles.title} maxFontSizeMultiplier={LIMITE_FONTE}>
          jornada
        </Text>
        <Text style={styles.subtitle} maxFontSizeMultiplier={LIMITE_FONTE}>
          Faça o login e comece a gerir o seu{" "}
          <Text style={styles.subtitle2} maxFontSizeMultiplier={LIMITE_FONTE}>
            dinheiro.
          </Text>
        </Text>
      </ScrollView>

      <View style={styles.conteiner}>
        <Button
          variante="primario"
          titulo="Cadastre-se"
          onPress={() => roteador.push("/escolha")}
        />
        <Button
          variante="outline"
          titulo="Já sou cadastrado"
          onPress={() => roteador.push("/voltando")}
        />
      </View>
    </View>
  );
}