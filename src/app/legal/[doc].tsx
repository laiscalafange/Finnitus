import { ScrollView, Text, View, Pressable, StyleSheet, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import documentos from "../../features/legalTextos.json";

const paginas = documentos as Record<string, { titulo: string; secoes: string[][] }>;

export default function DocumentoLegal() {
  const router = useRouter();
  const { doc } = useLocalSearchParams<{ doc?: string }>();
  const documento = doc && Object.prototype.hasOwnProperty.call(paginas, doc) ? paginas[doc] : undefined;
  return (
    <View style={styles.fundo}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar"
          style={styles.voltar} onPress={() => router.back()}>
          <Text style={styles.link}>Voltar</Text>
        </Pressable>
        <Text accessibilityRole="header" style={styles.titulo}>{documento?.titulo ?? "Documento não encontrado"}</Text>
        <Text style={styles.info}>Finnitus · Projeto acadêmico · Atualizado em 31/10/2026</Text>
        {documento?.secoes.map(([titulo, texto], i) => (
          <View key={i} style={styles.secao}>
            <Text accessibilityRole="header" style={styles.subtitulo}>{titulo}</Text>
            <Text style={styles.texto}>{texto}</Text>
          </View>
        ))}
        <Pressable accessibilityRole="link" onPress={() => Linking.openURL('mailto:finnitus.contato@gmail.com')}>
          <Text style={styles.link}>Contato: finnitus.contato@gmail.com</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: '#100D19' },
  conteudo: { paddingHorizontal: 22, paddingTop: 52, paddingBottom: 65 },
  voltar: { paddingVertical: 16, alignSelf: 'flex-start' },
  titulo: { color: '#FFFFFF', fontWeight: '700', fontSize: 27, marginBottom: 10 },
  info: { color: '#E8DEFF', fontSize: 13, marginBottom: 15 },
  secao: { marginBottom: 20 },
  subtitulo: { color: '#E8DEFF', fontWeight: '700', fontSize: 18, marginBottom: 7 },
  texto: { color: '#FFFFFF', fontSize: 15, lineHeight: 23 },
  link: { color: '#FFF081', fontSize: 15, fontWeight: '700', textDecorationLine: 'underline' },
});
