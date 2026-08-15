import { View, Text, Image, useWindowDimensions } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { styles } from "../../styles/cadastroStyles";
import { useRouter } from "expo-router";
import { Button } from "../../shared/components/Button";
import { Input } from "../../shared/components/Input";
import { useState } from "react";


export default function Cadastro() {
const roteador = useRouter();

const { height } = useWindowDimensions();

  const topContent = height * 0.100;
  const topContent2 = height * 0.18;
  const topContent3 = height * 0.30;

const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [senha, setSenha] = useState("");
const [confirmarSenha, setConfirmarSenha] = useState("");

return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

    <View style={[
          styles.content,
          {
            top: topContent,
          },
        ]}
      >
        <Text style={styles.title2}>
        Crie <Text style={styles.title}>
        sua conta </Text>
        </Text>
    </View>

      <View style={[
          styles.content2,
          {
            top: topContent2,
          },
        ]}
      >
        <Text style={styles.subtitle}>
          Preencha seus dados.
        </Text>
      </View>

      <View  style={[
          styles.content3,
          {
            top: topContent3,
          },
        ]}
      >
           <Input
              label="Nome"
              placeholder="Digite seu nome completo"
              icone={
                <Image
                  source={require("../../../assets/icones/boneco.png")}
                  style={styles.iconeInput}
                />
              }
              value={nome}
              onChangeText={setNome}
              keyboardType="text"
            />
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

            <Input
              label="Confirme sua senha"
              placeholder="Digite sua senha novamente"
              icone={
                <Image
                  source={require("../../../assets/icones/senha.png")}
                  style={styles.iconeInput}
                />
              }
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
      </View>

       <View style={styles.conteiner}>
       <Button
          variante="primario"
          titulo="Confirmar"
          onPress={() => roteador.push("/onboarding/BemVindo")}
        />
        </View>
    </View>
  );
} 