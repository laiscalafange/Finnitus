import { useState } from "react";
import { Alert, ScrollView, Switch, TouchableOpacity, View } from "react-native";
import { Coins, Globe, RotateCcw } from "lucide-react-native";

import { useConfiguracoes } from "@/features/configuracoesContext";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Cards";
import { EstadoConfiguracoes } from "@/shared/components/EstadoConfiguracoes";
import { HeaderInterno } from "@/shared/components/Header";
import { Input } from "@/shared/components/Input";
import { Text } from "@/shared/components/Texto";
import { Cores } from "@/shared/constants/Cores";
import { useAction } from "@/shared/hooks/useAction";
import { styles } from "@/styles/preferencias";

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.94)",
  "rgba(33, 18, 53, 0.94)",
];
const CONFIRMACAO = "RECOMEÇAR";

export default function Preferencias() {
  const { configuracoes, atualizar, salvando, carregando, recomecar } = useConfiguracoes();
  const { busy, error, run, clearError } = useAction();
  const [confirmando, setConfirmando] = useState(false);
  const [confirmacao, setConfirmacao] = useState("");
  const podeRecomecar = confirmacao.trim() === CONFIRMACAO && !busy;

  function fecharConfirmacao() {
    setConfirmando(false);
    setConfirmacao("");
    clearError();
  }

  function confirmarReset() {
    if (!podeRecomecar) return;
    void run(async () => {
      await recomecar(CONFIRMACAO);
      Alert.alert("Você recomeçou do zero", "Seus dados financeiros foram apagados.");
    });
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="padrao" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo="Preferências" />
        <View style={styles.lista}>
          <EstadoConfiguracoes />

          <Card gradiente={GRADIENTE_CARD} style={styles.card}>
            <View style={styles.linhaIcone}>
              <Globe size={18} color={Cores.destaque.limao} />
              <Text style={styles.rotuloItem}>Idioma</Text>
            </View>
            <View style={styles.seletor}>
              <Text style={styles.valorSelecionado}>Português (Brasil)</Text>
            </View>

            <View style={[styles.linhaIcone, styles.espacoTopo]}>
              <Coins size={18} color={Cores.destaque.limao} />
              <Text style={styles.rotuloItem}>Moeda utilizada</Text>
            </View>
            <View style={styles.seletor}>
              <Text style={styles.valorSelecionado}>Real (R$)</Text>
            </View>

            <View style={styles.divisor} />

            <View style={styles.linhaSwitch}>
              <View style={styles.textoSwitchContainer}>
                <Text style={styles.rotuloSwitch}>Mostrar valores financeiros</Text>
                <Text style={styles.descricaoSwitch}>
                  Exibir valores nos painéis e nas telas de consulta financeira.
                </Text>
              </View>
              <Switch
                accessibilityLabel="Mostrar valores financeiros"
                disabled={!configuracoes || salvando || carregando}
                value={configuracoes?.mostrarValores === true}
                onValueChange={(mostrarValores) => void atualizar({ mostrarValores })}
                trackColor={{
                  false: "rgba(163, 87, 255, 0.25)",
                  true: Cores.destaque.limao,
                }}
                thumbColor={Cores.base.branco}
              />
            </View>
          </Card>

          {!confirmando ? (
            <TouchableOpacity
              style={styles.cardPerigo}
              activeOpacity={0.8}
              accessibilityRole="button"
              onPress={() => setConfirmando(true)}
            >
              <View style={styles.iconePerigoContainer}>
                <RotateCcw size={20} color="#FF8585" />
              </View>
              <View style={styles.textosPerigo}>
                <Text style={styles.tituloPerigo}>Recomeçar do zero</Text>
                <Text style={styles.descricaoPerigo}>Apagar seus registros financeiros.</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <Card gradiente={GRADIENTE_CARD} style={[styles.card, { gap: 12 }]}>
              <Text style={styles.tituloPerigo}>Recomeçar do zero</Text>
              <Text style={styles.descricaoSwitch}>
                Receitas, despesas, metas, dívidas, reserva e outros registros financeiros
                serão apagados permanentemente. Sua conta e preferências serão mantidas.
              </Text>
              <Input
                label="Digite RECOMEÇAR para confirmar"
                placeholder={CONFIRMACAO}
                value={confirmacao}
                onChangeText={setConfirmacao}
                editable={!busy}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              {error ? (
                <Text style={{ color: "#FF8585" }} accessibilityRole="alert">{error}</Text>
              ) : null}
              <Button
                titulo={busy ? "Apagando dados..." : "Apagar dados financeiros"}
                variante="perigo"
                disabled={!podeRecomecar}
                onPress={confirmarReset}
              />
              <Button titulo="Cancelar" variante="outline" disabled={busy} onPress={fecharConfirmacao} />
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
