import { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "../../styles/emailSentStyles";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";

export default function EmailSent() {
  const router = useRouter();

  useEffect(() => {
  const timer = setTimeout(() => {
    router.replace("/verifyEmail");
  }, 3000);

  return () => clearTimeout(timer);
}, []);

  return (
    <View style={{ flex: 1 }}>
          <BackgroundGradient />
          
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../../../assets/icones/sent.png")}
          style={styles.icone}
        />

        <Text style={styles.titulo}>
          <Text style={styles.tituloDestaque}>Email</Text> enviado
        </Text>

        <Text style={styles.subtitulo}>
          Verifique seu email para redefinir sua senha.
        </Text>
      </View>
      </View>

     
    </View>
  );
}