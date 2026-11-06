
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { authService } from "../../services/auth";
import { useAuth } from "../../features/authContext";

export default function ExcluirConta() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { clearSession } = useAuth();

  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  const podeExcluir =
    senha.length > 0 &&
    confirmacao.trim() === "EXCLUIR" &&
    !excluindo;

  async function confirmarExclusao() {
    if (!podeExcluir) return;

    setErro("");
    setExcluindo(true);

    try {
      // Exclui os dados no backend.
      await authService.deleteAccount(senha);

      // Limpa a sessão somente após o sucesso.
      await clearSession();

      // O guard de autenticação deve levar ao login.
    } catch (error) {
      let mensagem =
        "Não foi possível excluir sua conta. Tente novamente.";

      if (axios.isAxiosError(error)) {
        const dados = error.response?.data;

        mensagem =
          dados?.error ??
          dados?.message ??
          mensagem;
      } else if (error instanceof Error) {
        mensagem = error.message;
      }

      setErro(mensagem);
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.conteudo,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={excluindo}
        >
          <Text style={styles.voltar}>‹ Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Excluir conta</Text>

        <Text style={styles.descricao}>
          Sentiremos sua falta! Antes de continuar,
          leia atentamente as informações abaixo.
        </Text>

        <View style={styles.aviso}>
          <Text style={styles.avisoTitulo}>
            Atenção: ação permanente
          </Text>

          <Text style={styles.avisoTexto}>
            Ao excluir sua conta, seus dados financeiros,
            receitas, despesas, metas, reserva, dívidas
            e eventos armazenados no Finnitus serão
            apagados permanentemente.
          </Text>

          <Text style={styles.avisoTexto}>
            Esta ação não pode ser desfeita.
          </Text>
        </View>

        <Text style={styles.label}>
          Senha atual
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#8B8298"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          editable={!excluindo}
          autoCapitalize="none"
        />

        <Text style={styles.label}>
          Digite EXCLUIR para confirmar
        </Text>

        <TextInput
          style={styles.input}
          placeholder="EXCLUIR"
          placeholderTextColor="#8B8298"
          autoCapitalize="characters"
          autoCorrect={false}
          value={confirmacao}
          onChangeText={setConfirmacao}
          editable={!excluindo}
        />

        {erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.botaoExcluir,
            !podeExcluir && styles.desabilitado,
          ]}
          onPress={confirmarExclusao}
          disabled={!podeExcluir}
        >
          {excluindo ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoExcluir}>
              Excluir minha conta
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoCancelar}
          onPress={() => router.back()}
          disabled={excluindo}
        >
          <Text style={styles.textoCancelar}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  voltar: {
    color: "#B6FF00",
    fontSize: 16,
    marginBottom: 32,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 12,
  },
  descricao: {
    color: "#C8C0D4",
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 28,
  },
  aviso: {
    backgroundColor: "#2D1421",
    borderWidth: 1,
    borderColor: "#B54255",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  avisoTitulo: {
    color: "#FF838F",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
  },
  avisoTexto: {
    color: "#E9DAE2",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#21152F",
    borderWidth: 1,
    borderColor: "#50415F",
    borderRadius: 12,
    color: "#FFFFFF",
    fontSize: 16,
    padding: 16,
    marginBottom: 22,
  },
  erro: {
    color: "#FF838F",
    textAlign: "center",
    marginBottom: 18,
  },
  botaoExcluir: {
    backgroundColor: "#B9364C",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  desabilitado: {
    opacity: 0.45,
  },
  textoExcluir: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoCancelar: {
    padding: 18,
    alignItems: "center",
    marginTop: 12,
  },
  textoCancelar: {
    color: "#C8C0D4",
    fontSize: 16,
  },
});
