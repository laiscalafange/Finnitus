// arquivo criado para testar os componentes

import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";

import { Button } from "../shared/components/Button";
import { Progress } from "../shared/components/Progress";
import { Avatar } from "../shared/components/Avatar";
import { Modal } from "../shared/components/Modal";
import { FAB } from "../shared/components/Fab";

export default function TestComponents() {
  const [progresso, setProgresso] = useState(40);
  const [modalVisivel, setModalVisivel] = useState(false);

  return (
    <View style={styles.pagina}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* Button */}
        <Text style={styles.secao}>Button</Text>
        <View style={styles.grupo}>
          <Button titulo="Botão primário" variante="primario" />
          <Button titulo="Botão outline" variante="outline" />
        </View>

        {/* Progress */}
        <Text style={styles.secao}>Progress</Text>
        <View style={styles.grupo}>
          <Progress value={progresso} />
          <Progress value={80} color="#7E3BED" height={12} />
          <View style={styles.linhaBotoes}>
            <Button
              titulo="-10%"
              variante="outline"
              onPress={() => setProgresso((v) => Math.max(v - 10, 0))}
            />
            <Button
              titulo="+10%"
              variante="primario"
              onPress={() => setProgresso((v) => Math.min(v + 10, 100))}
            />
          </View>
        </View>

        {/* Avatar */}
        <Text style={styles.secao}>Avatar</Text>
        <View style={[styles.grupo, styles.linhaAvatares]}>
          <Avatar name="Maria Helena" size={64} />
          <Avatar
            image="https://i.pravatar.cc/150?img=12"
            size={64}
          />
          <Avatar size={64} />
        </View>

        {/* Modal */}
        <Text style={styles.secao}>Modal</Text>
        <View style={styles.grupo}>
          <Button
            titulo="Abrir modal"
            variante="primario"
            onPress={() => setModalVisivel(true)}
          />
        </View>
      </ScrollView>

      <Modal
        visible={modalVisivel}
        title="Confirmar ação"
        message="Tem certeza que deseja continuar?"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={() => setModalVisivel(false)}
        onCancel={() => setModalVisivel(false)}
      />

      <FAB icon={<Plus color="#B7FF00" size={24} />} onPress={() => setModalVisivel(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  pagina: {
    flex: 1,
    backgroundColor: "#0D0D14",
  },
  conteudo: {
    padding: 20,
    paddingBottom: 100,
  },
  secao: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  grupo: {
    gap: 12,
  },
  linhaBotoes: {
    flexDirection: "row",
    gap: 12,
  },
  linhaAvatares: {
    flexDirection: "row",
    gap: 16,
  },
});