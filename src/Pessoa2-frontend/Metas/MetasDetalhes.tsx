import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { Progress } from "../../shared/components/Progress";
import { Cores } from "../../shared/constants/Cores";
import { FONTS } from "../../shared/constants/Tipografia";
import { GRADIENTS } from "../../shared/constants/Gradientes";

// Histórico da meta
// Futuramente esses dados poderão vir do Back-end
const historico = [
  {
    id: 1,
    data: "Quinta-feira",
    tipo: "Depósito",
    horario: "08:45",
    valor: "R$ 34,97",
    icone: require("../../../assets/icones/deposito.png"),
  },
  {
    id: 2,
    data: "Quinta-feira",
    tipo: "Depósito",
    horario: "08:45",
    valor: "R$ 34,97",
    icone: require("../../../assets/icones/deposito.png"),
  },
  {
    id: 3,
    data: "13 Jun",
    tipo: "Depósito",
    horario: "08:45",
    valor: "R$ 34,97",
    icone: require("../../../assets/icones/deposito.png"),
  },
  {
    id: 4,
    data: "10 Jun",
    tipo: "Depósito",
    horario: "08:45",
    valor: "R$ 34,97",
    icone: require("../../../assets/icones/deposito.png"),
  },
];

export default function MetasDetalhes() {
  return (
    <LinearGradient
      colors={GRADIENTS.background.colors}
      start={GRADIENTS.background.start}
      end={GRADIENTS.background.end}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* HEADER */}
        <HeaderInterno
          titulo="Metas"
          subtitulo="Detalhes"
        />

        <View style={styles.conteudoSobreHeader}>

          {/* Ícone da meta */}
          <View style={styles.iconeMeta}>
            <Image
              source={require("../../../assets/icones/cifrao.png")}
              style={styles.cifrao}
            />
          </View>

          {/* Informações da meta */}
          <Text style={styles.nomeMeta}>
            Bolsa nova
          </Text>

          <Text style={styles.valor}>
            R$1.500,00
          </Text>

          <Text style={styles.metaTotal}>
            De R$4.500,00
          </Text>

          {/* Barra de progresso */}
          <View style={styles.progresso}>
            <Progress
              value={1500}
              max={4500}
              height={17}
              color="#8D49E1"
              backgroundColor="#482287"
            />
          </View>

          <Text style={styles.faltam}>
            Faltam R$3.000,00
          </Text>

          {/* Botão */}
          <Button
            titulo="Depositar"
            variante="secundario"
            onPress={() => { }}
          />

          {/* HISTÓRICO */}
          <View style={styles.historico}>
            <Text style={styles.tituloHistorico}>
              Histórico
            </Text>

            {historico.map((item) => (
              <View key={item.id}>

                {/* Data */}
                <Text style={styles.data}>
                  {item.data}
                </Text>

                {/* Card */}
                <Card
                  gradiente={["#482287", "#281542"]}
                  style={styles.cardHistorico}
                >
                  <View style={styles.linhaHistorico}>

                    {/* Ícone */}
                    <Image
                      source={item.icone}
                      style={styles.iconeHistorico}
                    />

                    {/* Informações */}
                    <View>
                      <Text style={styles.tipoDeposito}>
                        {item.tipo}
                      </Text>

                      <Text style={styles.horario}>
                        {item.horario}
                      </Text>
                    </View>

                    {/* Valor */}
                    <Text style={styles.valorDeposito}>
                      {item.valor}
                    </Text>

                  </View>
                </Card>

              </View>
            ))}

            {/* Ver mais */}
            <Text style={styles.verMais}>
              Ver mais
            </Text>
          </View>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingBottom: 30,
  },

  conteudoSobreHeader: {
    marginTop: -340,
    paddingHorizontal: 16,
  },

  // Ícone principal da meta
  iconeMeta: {
    alignSelf: "center",
    width: 120,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  cifrao: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  nomeMeta: {
    textAlign: "center",
    fontFamily: FONTS.raleway.bold,
    fontSize: 20,
    color: Cores.texto.principal,
    marginTop: 5,
  },

  valor: {
    textAlign: "center",
    fontFamily: FONTS.raleway.bold,
    fontSize: 32,
    color: Cores.destaque.limao,
  },

  metaTotal: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    marginTop: 5,
    color: Cores.texto.principal,
  },

  progresso: {
    marginTop: 12,
  },

  faltam: {
    textAlign: "center",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.texto.principal,
    marginTop: 5,
    marginBottom: 15,
  },

  // Histórico
  historico: {
    marginTop: 5,
  },

  tituloHistorico: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 20,
    color: Cores.texto.principal,
  },

  data: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.principal,
    marginTop: 8,
    marginBottom: 5,
  },

  cardHistorico: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
  },

  linhaHistorico: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Ícone dentro do card
  iconeHistorico: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginRight: 12,
  },

  tipoDeposito: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 12,
    color: Cores.texto.principal,
  },

  horario: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 10,
    color: Cores.texto.principal,
  },

  valorDeposito: {
    marginLeft: "auto",
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 11,
    color: Cores.texto.secundario,
  },

  verMais: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.texto.secundario,
    marginTop: 5,
    marginBottom: 10,
  },
});