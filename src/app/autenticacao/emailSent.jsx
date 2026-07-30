import { Text, View, Image } from 'react-native';
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/emailSentStyles";
import { useRouter } from "expo-router";

export default function EmailSent() {
  const roteador = useRouter();

  return (
  
     <View style={styles.content}>
  <Image
    source={require("../../../assets/icones/sent.png")}
    style={styles.icone}
  />

      <View style={styles.content}>
        <Text style={styles.titulo}>
          <Text style={styles.tituloDestaque}>Email</Text> enviado
        </Text>

        <Text style={styles.subtitulo}>
          Verifique seu email para redefinir sua senha
        </Text> 
      </View>

      <Button
        variante="primario"
        titulo="Ok!"
        onPress={() => roteador.push("/autenticacao/emailSent")} // navegação para mudar senha
      /> {/*daria para fazer com que essa página ficasse uns 5segundos na tela e redirecionasse para a página de troca de senha*/ }  
    </View>
  );
}