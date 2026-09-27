import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import {
  Globe,
  Coins,
  RotateCcw,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { SelectCard } from "../../shared/components/SelectCard";
import { Modal } from "../../shared/components/Modal";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/preferencias";

// Idiomas e moedas disponíveis.
// TODO (backend): nada aqui é persistido ainda — é tudo estado local,
// só pra representar o layout do protótipo.
const IDIOMAS = ["Português", "English", "Español"] as const;
const MOEDAS = ["Real (R$)", "Dólar (US$)", "Euro (€)"] as const;

// Tela "Preferências" (dentro de Configurações).
export default function Preferencias() {
  const [idioma, setIdioma] = useState<(typeof IDIOMAS)[number]>("Português");
  const [moeda, setMoeda] = useState<(typeof MOEDAS)[number]>("Real (R$)");
  const [mostrarValores, setMostrarValores] = useState(true);

  // Confirmação de "Recomeçar do zero"
  const [modalVisivel, setModalVisivel] = useState(false);

  function recomecarDoZero() {
    setModalVisivel(false);

    // TODO (backend): não existe endpoint pra zerar os dados da conta
    // ainda — quando existir, chamar a API aqui.
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno
          titulo="Preferências"
          subtitulo="Configurações"
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        <View style={styles.lista}>
          <Card
            gradiente={["rgba(73, 38, 155, 0.71)", "rgba(45, 17, 108, 0.48)"]}
            style={styles.card}
          >
            <View style={styles.linhaIcone}>
              <Globe size={18} color={Cores.roxo.claro} />
              <Text style={styles.rotuloItem}>Idioma</Text>
            </View>

            {IDIOMAS.map((opcao) => (
              <SelectCard
                key={opcao}
                label={opcao}
                icon={null}
                selected={idioma === opcao}
                onPress={() => setIdioma(opcao)}
              />
            ))}

            <View style={[styles.linhaIcone, styles.espacoTopo]}>
              <Coins size={18} color={Cores.roxo.claro} />
              <Text style={styles.rotuloItem}>Moeda utilizada</Text>
            </View>

            {MOEDAS.map((opcao) => (
              <SelectCard
                key={opcao}
                label={opcao}
                icon={null}
                selected={moeda === opcao}
                onPress={() => setMoeda(opcao)}
              />
            ))}

            <View style={styles.divisor} />

            <View style={styles.linhaSwitch}>
              <Text style={styles.rotuloSwitch}>
                Mostrar valores no dashboard
              </Text>

              <Switch
                value={mostrarValores}
                onValueChange={setMostrarValores}
                trackColor={{
                  false: Cores.interface.borda,
                  true: Cores.destaque.limao,
                }}
                thumbColor={Cores.base.branco}
              />
            </View>

            <View style={styles.divisor} />

            <View style={styles.linhaResetar}>
              <RotateCcw size={18} color={Cores.estado.erro} />

              <Text
                style={styles.textoResetar}
                onPress={() => setModalVisivel(true)}
              >
                Recomeçar do zero
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisivel}
        title="Recomeçar do zero"
        message="Isso apaga todos os seus gastos, receitas e metas cadastrados. Essa ação não pode ser desfeita."
        confirmText="Recomeçar"
        cancelText="Cancelar"
        onConfirm={recomecarDoZero}
        onCancel={() => setModalVisivel(false)}
      />
    </LinearGradient>
  );
}