import { View, Text, useWindowDimensions } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/inicieStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";

export default function Inicie() {
  const roteador = useRouter();

  const { height } = useWindowDimensions();

  const topContent = height * 0.125;
  const topContent2 = height * 0.40;

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <View
        style={[
          styles.content,
          {
            top: topContent,
          },
        ]}
      >
        <View style={styles.linha}>
          <Text style={styles.title}>
            Inicie
          </Text>

          <View>
            <Text style={styles.title2}>
              agora
            </Text>

            <Underline width={90} marginLeft={60} />
          </View>
        </View>

        <Text style={styles.title}>
          a sua
        </Text>

        <Text style={styles.title}>
          jornada
        </Text>
      </View>

      <View
        style={[
          styles.content2,
          {
            top: topContent2,
          },
        ]}
      >
        <Text style={styles.subtitle}>
          Faça o login e comece a gerir o seu{" "}
          <Text style={styles.subtitle2}>
            dinheiro.
          </Text>
        </Text>
      </View>

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