
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
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

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

  async function excluirConta() {
    if (!podeExcluir) return;

    setExcluindo(true);
    setErro("");

    try {
      await authService.deleteAccount(senha);
      await clearSession();
    } catch (error) {
      const mensagem = axios.isAxiosError(error)
        ? error.response?.data?.error ??
          error.response?.data?.message ??
          "Não foi possível excluir sua conta."
        : error instanceof Error
          ? error.message
          : "Não foi possível concluir a operação.";

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
          styles.scroll,
          {
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 32,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.voltar}
          onPress={() => router.back()}
          disabled={excluindo}
        >
          <Ionicons
            name="chevron-back"
            size={19}
            color="#B6FF00"
          />
          <Text style={styles.voltarTexto}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.centralizar}>
          <LinearGradient
            colors={["#46238F", "#32166F"]}
            style={styles.card}
          >
            <View style={styles.iconeFundo}>
              <Ionicons
                name="trash-outline"
                size={34}
                color="#B6FF00"
              />
            </View>

            <Text style={styles.titulo}>
              Excluir sua conta?
            </Text>

            <Text style={styles.descricao}>
              Tem certeza de que deseja excluir
              sua conta do Finnitus?
            </Text>

            <Text style={styles.alerta}>
              Todos os seus dados financeiros,
              metas, reservas e movimentações
              serão apagados permanentemente.
              Esta ação não pode ser desfeita.
            </Text>

            <View style={styles.formulario}>
              <Text style={styles.label}>
                Senha atual
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#A998C4"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                autoCapitalize="none"
                editable={!excluindo}
              />

              <Text style={styles.label}>
                Digite EXCLUIR para confirmar
              </Text>

              <TextInput
                style={styles.input}
                placeholder="EXCLUIR"
                placeholderTextColor="#A998C4"
                value={confirmacao}
                onChangeText={setConfirmacao}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!excluindo}
              />
            </View>

            {erro ? (
              <Text style={styles.erro}>
                {erro}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.botaoExcluir,
                !podeExcluir && styles.desabilitado,
              ]}
              disabled={!podeExcluir}
              onPress={excluirConta}
              activeOpacity={0.8}
            >
              {excluindo ? (
                <ActivityIndicator color="#B6FF00" />
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
              activeOpacity={0.8}
            >
              <Text style={styles.textoCancelar}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  voltar: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  voltarTexto: {
    color: "#B6FF00",
    fontSize: 16,
  },
  centralizar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 490,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6435AB",
  },
  iconeFundo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#5533A0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  descricao: {
    color: "#D4C5EB",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 10,
  },
  alerta: {
    color: "#E5D7F4",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  formulario: {
    width: "100%",
    marginBottom: 10,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#251347",
    borderColor: "#7351AD",
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 17,
    width: "100%",
  },
  erro: {
    color: "#FF9DAA",
    textAlign: "center",
    marginBottom: 14,
    fontSize: 13,
  },
  botaoExcluir: {
    width: "100%",
    minHeight: 54,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#B6FF00",
    backgroundColor: "#3D2085",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  desabilitado: {
    opacity: 0.45,
  },
  textoExcluir: {
    color: "#B6FF00",
    fontSize: 17,
    fontWeight: "bold",
  },
  botaoCancelar: {
    width: "100%",
    minHeight: 54,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#9853ED",
    alignItems: "center",
    justifyContent: "center",
  },
  textoCancelar: {
    color: "#B96AFF",
    fontSize: 17,
    fontWeight: "bold",
  },
});
