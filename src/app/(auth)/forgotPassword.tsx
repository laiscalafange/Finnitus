import { JSX, useState } from "react";
import { useRouter } from "expo-router";
import { Text, View, Image } from "react-native";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/forgotPasswordStyles";

export default function ForgotPassword(): JSX.Element {
  const roteador = useRouter();

  const [email, setEmail] = useState<string>("");

  return (
   <View style={{ flex: 1 }}>
      <BackgroundGradient />


      <View style={styles.container}>
  <View style={styles.content}>
        <Text style={styles.titulo}>
          <Text style={styles.tituloDestaque}>Troca</Text> de senha
        </Text>

        <Text style={styles.subtitulo}>
          Enviaremos um email de troca de senha
        </Text>

        <Input
          label="Email"
          placeholder="Email"
          icone={
            <Image
  source={require("../../../assets/icones/email.png")}
  style={styles.iconeInput}
/>
          }
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

</View>

     <View style={styles.conteiner}>
      <Button
        variante="primario"
        titulo="Enviar"
        onPress={() => roteador.push("/emailSent")}
      />
      </View>
   </View>
  );
}