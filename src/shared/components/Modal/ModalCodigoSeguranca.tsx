import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, View } from "react-native";
import { Button } from "../Button";
import { Input } from "../Input";
import { Cores } from "../../constants/Cores";
import { FONTS } from "../../constants/Tipografia";
import { useAuthAction } from "../../hooks/useAuthAction";

type Props = {
  titulo: string;
  instrucao: string;
  onConfirmar: (codigo: string) => Promise<void>;
  onCancelar: () => void;
};

export function ModalCodigoSeguranca({ titulo, instrucao, onConfirmar, onCancelar }: Props) {
  const [codigo, setCodigo] = useState("");
  const { busy, error, run, clearError } = useAuthAction();

  function cancelar() {
    if (!busy) onCancelar();
  }

  return (
    <Modal animationType="fade" transparent visible onRequestClose={cancelar}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.fundo}
      >
        <View style={styles.cartao} accessibilityViewIsModal>
          <Text accessibilityRole="header" style={styles.titulo}>{titulo}</Text>
          <Text style={styles.instrucao}>{instrucao}</Text>
          <Input
            label="Código de verificação"
            placeholder="6 dígitos"
            keyboardType="number-pad"
            autoComplete="one-time-code"
            value={codigo}
            onChangeText={(valor) => {
              setCodigo(valor.replace(/\D/g, "").slice(0, 6));
              clearError();
            }}
            editable={!busy}
            maxLength={6}
            erro={error}
          />
          <Button
            titulo={busy ? "Confirmando..." : "Confirmar"}
            disabled={busy || codigo.length !== 6}
            onPress={() => void run(() => onConfirmar(codigo))}
          />
          <Button titulo="Cancelar" variante="outline" disabled={busy} onPress={cancelar} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  cartao: {
    width: "100%",
    maxWidth: 460,
    padding: 20,
    gap: 12,
    backgroundColor: "#211235",
    borderRadius: 16,
  },
  titulo: { color: Cores.base.branco, fontFamily: FONTS.raleway.bold, fontSize: 18 },
  instrucao: { color: Cores.base.branco, fontFamily: FONTS.quicksand.regular, fontSize: 14 },
});
