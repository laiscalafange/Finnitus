import { useRouter } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/forgotPasswordStyles";
import { useState } from 'react';



export default function RecuperarSenha() {
  const roteador = useRouter();

  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.breadcrumb}>Troca de senha</Text>

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
          icone={<Text style={styles.iconeInput}>✉️</Text>}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <Button
        variante="primario"
        titulo="Enviar"
        onPress={() => roteador.push("/autenticacao/emailSent")} // navegação entra depois
      />
    </View>
  );
}