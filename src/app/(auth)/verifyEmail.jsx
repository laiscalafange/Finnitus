import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { Button } from "../../shared/components/Button/Button";
import { FourInput } from "../../shared/components/Four";
import { styles } from "../../styles/VerifyEmailStyles";

export default function VerificacaoEmail() {
  
  const { email } = useLocalSearchParams();

  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleValidar() {
    if (codigo.length < 4) {
      setErro(true);
      return;
    }

    setCarregando(true);
    try {
      // await validarCodigo(email, codigo);
      setErro(false);
      router.push("/proxima-tela"); // navegação para a próxima tela após validação bem-sucedida
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }

  function handleReenviar() {
    // await reenviarCodigo(email);
  }

  return (
    
    <View style={styles.container}>
      <Text style={styles.titulo}>
        <Text style={styles.tituloDestaque}>Verificação</Text> de E-mail
      </Text>

      <Text style={styles.subtitulo}>
        Enviamos um código de 4 dígitos para{" "}
        <Text style={styles.emailDestaque}>{email}</Text>.
      </Text>

      <Text style={styles.label}>Digite o código</Text>

      <FourInput
        onCodigoCompleto={(valor) => {
          setCodigo(valor);
          setErro(false);
        }}
        erro={erro}
      />

      <View style={styles.rodape}>
        <Button
          titulo={carregando ? "Validando..." : "Validar código"}
          variante="primario"
          onPress={handleValidar}
        />

        <Pressable onPress={handleReenviar}>
          <Text style={styles.reenviar}>Reenviar código</Text>
        </Pressable>
      </View>
    </View>
  );
}