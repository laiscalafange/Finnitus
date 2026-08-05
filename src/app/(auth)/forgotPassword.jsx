import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/forgotPasswordStyles";
import { useState } from 'react';
//import { router } from "expo-router";

/*router.push({
  pathname: "/verificacao-email",
  params: { email: "usuario@gmail.com" },
});*/



export default function forgotPassword() {
  const roteador = useRouter();

  const [email, setEmail] = useState('');

  return (
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
          icone={<Image
      source={require("../../../assets/icones/email.png")}
      style={{
    width: 40,
    height: 40,
  }}
    />}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <Button
        variante="primario"
        titulo="Enviar"
        onPress={() => roteador.push("/emailSent")} // navegação para a página de email enviado
      />
    </View>
  );
}