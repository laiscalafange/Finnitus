import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { Progress } from "../../shared/components/Progress";
import { styles } from "../../styles/metasdetalhes";

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
  // Hook de navegação do Expo Router
  const router = useRouter();

  return (
    <LinearGradient
      // Gradiente próprio dessa tela (mesmo estilo do Notificações/MetasFuturas),
      // não usa mais o GRADIENTS.background compartilhado
      colors={["#3f1e69", "#08070A", "#291444"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        {/* Cabeçalho fixo do topo */}
        <HeaderInterno
          titulo="Metas"
          subtitulo="Detalhes"
        />

        {/* Conteúdo posicionado por cima do header (marginTop negativo) */}
        <View style={styles.conteudoSobreHeader}>

          {/* Ícone principal da meta */}
          <View style={styles.iconeMeta}>
            <Image
              source={require("../../../assets/icones/cifrao.png")}
              style={styles.cifrao}
            />
          </View>

          {/* Nome da meta */}
          {/* TODO: valores hardcoded — futuramente vêm da meta específica
              (via params de rota, ex: /metas-detalhes?id=123) */}
          <Text style={styles.nomeMeta}>
            Bolsa nova
          </Text>

          {/* Valor já guardado */}
          <Text style={styles.valor}>
            R$1.500,00
          </Text>

          {/* Valor total da meta */}
          <Text style={styles.metaTotal}>
            De R$4.500,00
          </Text>

          {/* Barra de progresso (valor atual / valor total) */}
          <View style={styles.progresso}>
            <Progress
              value={1500}
              max={4500}
              height={17}
              color="#8D49E1"
              backgroundColor="#482287"
            />
          </View>

          {/* Quanto falta pra bater a meta */}
          <Text style={styles.faltam}>
            Faltam R$3.000,00
          </Text>

          {/* Botão "Depositar" — leva pra tela/modal de depósito na meta
              TODO: ajustar "/depositar" pro nome real da rota, se for diferente,
              e futuramente passar o id da meta como parâmetro */}
          <Button
            titulo="Depositar"
            variante="secundario"
            onPress={() => router.push("/")}
          />

          {/* HISTÓRICO de depósitos dessa meta */}
          <View style={styles.historico}>
            <Text style={styles.tituloHistorico}>
              Histórico
            </Text>

            {historico.map((item) => (
              <View key={item.id}>

                {/* Data do grupo de depósitos */}
                <Text style={styles.data}>
                  {item.data}
                </Text>

                {/* Card com os dados do depósito */}
                <Card
                  gradiente={["#482287", "#281542"]}
                  style={styles.cardHistorico}
                >
                  <View style={styles.linhaHistorico}>

                    {/* Ícone do tipo de movimentação */}
                    <Image
                      source={item.icone}
                      style={styles.iconeHistorico}
                    />

                    {/* Tipo + horário */}
                    <View>
                      <Text style={styles.tipoDeposito}>
                        {item.tipo}
                      </Text>

                      <Text style={styles.horario}>
                        {item.horario}
                      </Text>
                    </View>

                    {/* Valor do depósito */}
                    <Text style={styles.valorDeposito}>
                      {item.valor}
                    </Text>

                  </View>
                </Card>

              </View>
            ))}

            {/* "Ver mais" — carrega o restante do histórico dessa meta
                TODO: ajustar "/historico-metas" pro nome real da rota, se for diferente,
                e futuramente passar o id da meta como parâmetro */}
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.verMais}>
                Ver mais
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}