
import { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";

import {
  Globe,
  Coins,
  RotateCcw,
  Check,
  ChevronDown,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { Modal } from "../../shared/components/Modal";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/preferencias";

const IDIOMAS = [
  "Português",
  "English",
  "Español",
] as const;

const MOEDAS = [
  "Real (R$)",
  "Dólar (US$)",
  "Euro (€)",
] as const;

type Idioma = (typeof IDIOMAS)[number];
type Moeda = (typeof MOEDAS)[number];

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.94)",
  "rgba(33, 18, 53, 0.94)",
];

export default function Preferencias() {
  const [idioma, setIdioma] = useState<Idioma>("Português");
  const [moeda, setMoeda] = useState<Moeda>("Real (R$)");

  const [mostrarValores, setMostrarValores] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);

  const [idiomasAbertos, setIdiomasAbertos] = useState(false);
  const [moedasAbertas, setMoedasAbertas] = useState(false);

  function recomecarDoZero() {
    setModalVisivel(false);

    // Mantida a lógica original:
    // integrar ao backend quando houver endpoint.
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="padrao" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo="Preferências" />

        <View style={styles.lista}>
          {/* OPÇÕES NORMAIS */}
          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.card}
          >
            {/* IDIOMA */}
            <View style={styles.linhaIcone}>
              <Globe
                size={18}
                color={Cores.destaque.limao}
              />

              <Text style={styles.rotuloItem}>
                Idioma
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.seletor,
                idiomasAbertos && styles.seletorAberto,
              ]}
              activeOpacity={0.8}
              onPress={() => {
                setIdiomasAbertos(!idiomasAbertos);
                setMoedasAbertas(false);
              }}
            >
              <Text style={styles.valorSelecionado}>
                {idioma}
              </Text>

              <ChevronDown
                size={19}
                color={Cores.destaque.limao}
              />
            </TouchableOpacity>

            {idiomasAbertos && (
              <View style={styles.opcoesContainer}>
                {IDIOMAS.map((opcao) => (
                  <TouchableOpacity
                    key={opcao}
                    style={[
                      styles.opcao,
                      idioma === opcao && styles.opcaoAtiva,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setIdioma(opcao);
                      setIdiomasAbertos(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.textoOpcao,
                        idioma === opcao &&
                          styles.textoOpcaoAtiva,
                      ]}
                    >
                      {opcao}
                    </Text>

                    {idioma === opcao && (
                      <Check
                        size={17}
                        color={Cores.destaque.limao}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* MOEDA */}
            <View
              style={[
                styles.linhaIcone,
                styles.espacoTopo,
              ]}
            >
              <Coins
                size={18}
                color={Cores.destaque.limao}
              />

              <Text style={styles.rotuloItem}>
                Moeda utilizada
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.seletor,
                moedasAbertas && styles.seletorAberto,
              ]}
              activeOpacity={0.8}
              onPress={() => {
                setMoedasAbertas(!moedasAbertas);
                setIdiomasAbertos(false);
              }}
            >
              <Text style={styles.valorSelecionado}>
                {moeda}
              </Text>

              <ChevronDown
                size={19}
                color={Cores.destaque.limao}
              />
            </TouchableOpacity>

            {moedasAbertas && (
              <View style={styles.opcoesContainer}>
                {MOEDAS.map((opcao) => (
                  <TouchableOpacity
                    key={opcao}
                    style={[
                      styles.opcao,
                      moeda === opcao && styles.opcaoAtiva,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => {
                      setMoeda(opcao);
                      setMoedasAbertas(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.textoOpcao,
                        moeda === opcao &&
                          styles.textoOpcaoAtiva,
                      ]}
                    >
                      {opcao}
                    </Text>

                    {moeda === opcao && (
                      <Check
                        size={17}
                        color={Cores.destaque.limao}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.divisor} />

            {/* MOSTRAR VALORES */}
            <View style={styles.linhaSwitch}>
              <View style={styles.textoSwitchContainer}>
                <Text style={styles.rotuloSwitch}>
                  Mostrar valores no dashboard
                </Text>

                <Text style={styles.descricaoSwitch}>
                  Exibir os valores financeiros na tela inicial.
                </Text>
              </View>

              <Switch
                value={mostrarValores}
                onValueChange={setMostrarValores}
                trackColor={{
                  false: "rgba(163, 87, 255, 0.25)",
                  true: Cores.destaque.limao,
                }}
                thumbColor={Cores.base.branco}
              />
            </View>
          </Card>

          {/* ÁREA DE PERIGO - SEPARADA */}
          <TouchableOpacity
            style={styles.cardPerigo}
            activeOpacity={0.8}
            onPress={() => setModalVisivel(true)}
          >
            <View style={styles.iconePerigoContainer}>
              <RotateCcw
                size={20}
                color="#FF8585"
              />
            </View>

            <View style={styles.textosPerigo}>
              <Text style={styles.tituloPerigo}>
                Recomeçar do zero
              </Text>

              <Text style={styles.descricaoPerigo}>
                Redefinir seus dados financeiros.
              </Text>
            </View>
          </TouchableOpacity>
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
    </View>
  );
}
