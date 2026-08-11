import { JSX, useState } from "react";
import { useRouter } from "expo-router";
import { Text, View, Image } from "react-native";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
// deixei o mesmo por que o estilo é o mesmo da página de esqueci minha senha
import { styles } from "../../styles/forgotPasswordStyles";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";

export default function RecuperarSenha(): JSX.Element {
  const roteador = useRouter();

  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");

  function trocarSenha(): void {
    if (senha === "" || senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    roteador.push("/configuracaoInicial/FinancialData"); // trocar dps para
  }

  return (
    <View style={{ flex: 1 }}>
          <BackgroundGradient />
    
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
          icone={
            <Image
              source={require("../../../assets/icones/password.png")}
              style={styles.iconeInput}
            />
          }
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Input
          label="Confirmar senha"
          placeholder="Confirme sua nova senha"
          icone={
            <Image
              source={require("../../../assets/icones/password.png")}
              style={styles.iconeInput}
            />
          }
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        </View>
      

      <Button
        variante="primario"
        titulo="Enviar"
        onPress={trocarSenha}
      />
    </View>
    </View>
  );
}