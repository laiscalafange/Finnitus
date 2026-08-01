import { useRouter } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
// deixei o mesmo por que o estilo é o mesmo da página de esqueci minha senha
import { styles } from "../../styles/forgotPasswordStyles";
import { useState } from 'react';


export default function RecuperarSenha() {
  const roteador = useRouter();

  const [senha, setSenha] = useState('');

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <Text style={styles.titulo}>
          <Text style={styles.tituloDestaque}>Troca</Text> de senha
        </Text>

        <Text style={styles.subtitulo}>
          Informe sua nova senha e confirme para redefinir sua senha
        </Text>

        <Input
          label="Senha nova"
          placeholder="Digite sua nova senha"
          icone={<Image
      source={require("../../../assets/icones/password.png")}
      style={styles.iconeInput}
    />}
          value={senha}
          onChangeText={setSenha}
          keyboardType="password"
        />

        <Input
          label="Confirmar senha"
          placeholder="Confirme sua nova senha"
          icone={<Image
      source={require("../../../assets/icones/password.png")}
      style={styles.iconeInput}
    />}
          value={senha}
          onChangeText={setSenha}
          keyboardType="password"
        />
      </View>

      <Button
        variante="primario"
        titulo="Enviar"
        onPress={() => roteador.push("/verifyEmail")} // navegação para digitar codigo de redefinição de senha
      />
    </View>
  );
}