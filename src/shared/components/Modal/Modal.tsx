import { Modal as RNModal, View, Pressable } from "react-native";
import { Text } from "@/shared/components/Texto";

import { styles } from "./ModalStyles";
import { ModalProps } from "./ModalTypes";

export function Modal({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.caixa}>
          <Text style={styles.titulo}>{title}</Text>

          {message && <Text style={styles.mensagem}>{message}</Text>}

          <View style={styles.acoes}>
            {cancelText && (
              <Pressable
                style={({ pressed }) => [
                  styles.botao,
                  styles.botaoCancelar,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={onCancel}
              >
                <Text style={styles.textoCancelar}>{cancelText}</Text>
              </Pressable>
            )}

            {confirmText && (
              <Pressable
                style={({ pressed }) => [
                  styles.botao,
                  styles.botaoConfirmar,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={onConfirm}
              >
                <Text style={styles.textoConfirmar}>{confirmText}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </RNModal>
  );
}