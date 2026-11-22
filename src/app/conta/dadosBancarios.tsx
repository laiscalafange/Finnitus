import { useIdioma } from "@/features/idioma";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/dadosBancarios";

/** Não solicitar dados bancários sem finalidade implementada e armazenamento seguro. */
export default function DadosBancarios() {
  const { t } = useIdioma();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView contentContainerStyle={styles.conteudo}>
        <HeaderInterno titulo={t("Dados bancários")} />
        <View style={styles.formulario}>
          <Text style={[styles.rotuloTipo, { marginBottom: 14 }]}>
            {t("Recurso não disponível nesta versão acadêmica.")}
          </Text>
          <Text style={[styles.rotuloTipo, { marginBottom: 24 }]}>
            {t("O Finnitus não se conecta a bancos e não precisa do seu número de agência, conta ou chave Pix para organizar suas finanças. Não insira essas informações no aplicativo.")}
          </Text>
          <Button titulo={t("Voltar ao perfil")} onPress={() => router.back()} />
        </View>
      </ScrollView>
    </View>
  );
}
