
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
      colors={["#160B24", "#0D1112", "#160B24"]}
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
          activeOpacity={0.8}
        >
          <Ionicons
            name="chevron-back"
            size={19}
            color="#B7FF00"
          />

          <Text style={styles.voltarTexto}>
            Voltar
          </Text>
        </TouchableOpacity>

        <View style={styles.centralizar}>
          <LinearGradient
            colors={["#2C1B43", "#211235"]}
            style={styles.card}
          >
            <View style={styles.iconeFundo}>
              <Ionicons
                name="trash-outline"
                size={30}
                color="#FF7777"
              />
            </View>

            <Text style={styles.titulo}>
              Excluir sua conta?
            </Text>

            <Text style={styles.descricao}>
              Tem certeza de que deseja excluir
              sua conta do Finnitus?
            </Text>

            <View style={styles.alertaContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#FF7777"
                style={styles.alertaIcone}
              />

              <Text style={styles.alerta}>
                Todos os seus dados financeiros,
                metas, reservas e movimentações
                serão apagados permanentemente.
                Esta ação não pode ser desfeita.
              </Text>
            </View>

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
                <ActivityIndicator color="#FF7777" />
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
    gap: 4,
    marginBottom: 20,
  },

  voltarTexto: {
    color: "#B7FF00",
    fontSize: 16,
    fontWeight: "600",
  },

  centralizar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "100%",
    maxWidth: 490,
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.30)",
  },

  iconeFundo: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255, 65, 65, 0.09)",
    borderWidth: 1,
    borderColor: "rgba(255, 119, 119, 0.30)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  descricao: {
    color: "#C7A9F5",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
  },

  alertaContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 65, 65, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(255, 119, 119, 0.25)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    gap: 10,
  },

  alertaIcone: {
    marginTop: 1,
  },

  alerta: {
    flex: 1,
    color: "#E5D7F4",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "left",
  },

  formulario: {
    width: "100%",
    marginBottom: 10,
  },

  label: {
    color: "#E5D7F4",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "rgba(13, 17, 18, 0.55)",
    borderColor: "rgba(163, 87, 255, 0.35)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 17,
    width: "100%",
  },

  erro: {
    color: "#FF7777",
    textAlign: "center",
    marginBottom: 14,
    fontSize: 13,
  },

  botaoExcluir: {
    width: "100%",
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 119, 119, 0.55)",
    backgroundColor: "rgba(255, 65, 65, 0.09)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    paddingHorizontal: 12,
  },

  desabilitado: {
    opacity: 0.45,
  },

  textoExcluir: {
    color: "#FF7777",
    fontSize: 15,
    fontWeight: "bold",
  },

  botaoCancelar: {
    width: "100%",
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.35)",
    backgroundColor: "rgba(56, 32, 91, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  textoCancelar: {
    color: "#C7A9F5",
    fontSize: 15,
    fontWeight: "bold",
  },
});
