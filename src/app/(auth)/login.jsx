import { View, Text, Image, Pressable, useWindowDimensions } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/loginStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Underline } from "../../shared/components/underline";
import { Input } from "../../shared/components/Input";
import { useState } from "react";

export default function Login() {
const roteador = useRouter();

const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={styles.content}>
        <Text style={styles.title2}>
       Entre na <Text style={styles.title}>
        sua conta </Text>
        </Text>
        <Text style={styles.subtitle}>
          Preencha seus dados.
        </Text>

            <Input
              label="Email"
              placeholder="Digite seu Email"
              icone={
                <Image
                  source={require("../../../assets/icones/email3.png")}
                  style={styles.iconeInput}
                />
              }
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <Input
          label="Senha"
          placeholder="Digite sua senha"
          icone={
            <Image
              source={require("../../../assets/icones/senha.png")}
              style={styles.iconeInput}
            />
          }
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          />
      </View>

       <View style={styles.conteiner}>
       <Button
          variante="primario"
          titulo="Confirmar"
          onPress={() => roteador.push("/paginaInicial")}
        />

      <Pressable onPress={() => roteador.push("/forgotPassword")}>
      <Text style={styles.texto}>
        Esqueceu sua senha?
      </Text>
    </Pressable>
        </View>
    </View>
  );
} 