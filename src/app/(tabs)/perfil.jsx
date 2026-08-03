import {View,Text,StyleSheet,TouchableOpacity,ScrollView,} from "react-native";
import { HeaderPerfil } from "../../shared/components/Header";
import { Avatar } from "../../shared/components/Avatar";
import { Card } from "../../shared/components/Cards";
import { LinearGradient } from "expo-linear-gradient";

export default function Perfil() {
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

        {/* Cabeçalho */}
        <HeaderPerfil />

        {/* Informações do perfil */}
        <View style={styles.profile}>

          <Avatar
            name="Usuário"
            size={200}
          />

          <Text style={styles.nome}>
            Usuário
          </Text>

          <Text style={styles.usuario}>
            @User_TwT
          </Text>

        </View>

        {/* CONTEÚDO DOS CARDS */}
        <View style={styles.conteudoCards}>

          {/* CARD PREMIUM */}
          <Card
            gradiente={["#712edc", "#281542"]}
            style={styles.cardPremium}
          >
            <Text style={styles.premiumTitulo}>
              👑 Seja <Text style={styles.premiumVerde}>PREMIUM</Text>
            </Text>

            <Text style={styles.premiumTexto}>
              Desbloqueie recursos exclusivos e{"\n"}
              relatórios avançados
            </Text>

            <TouchableOpacity style={styles.botaoPremium}>
              <Text style={styles.botaoTexto}>
                Assine já
              </Text>
            </TouchableOpacity>
          </Card>

          {/* CARDS DE EDIÇÃO */}
          <View style={styles.linhaCards}>

            <Card
              gradiente={["#712edc", "#281542"]}
              style={styles.cardEdicao}
            >
              <Text style={styles.cardTitulo}>
                Editar conta
              </Text>

              <Text style={styles.iconeCard}>
                ⚙
              </Text>
            </Card>

            <Card
              gradiente={["#712edc", "#281542"]}
              style={styles.cardEdicao}
            >
              <Text style={styles.cardTitulo}>
                Editar dados{"\n"}
                bancários
              </Text>

              <Text style={styles.iconeCard}>
                👤
              </Text>
            </Card>

          </View>

          {/* CONFIGURAÇÕES E SUPORTE */}
          <Card
            gradiente={["#712edc", "#281542"]}
            style={styles.cardConfiguracoes}
          >

            <Text style={styles.tituloSecao}>
              Configurações
            </Text>

            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemIcone}>⚙</Text>
              <Text style={styles.itemTexto}>Configurar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemIcone}>🛡</Text>
              <Text style={styles.itemTexto}>Segurança</Text>
            </TouchableOpacity>

            <Text style={styles.tituloSecao}>
              Suporte
            </Text>

            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemIcone}>☎</Text>
              <Text style={styles.itemTexto}>Contate-nos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemIcone}>ⓘ</Text>
              <Text style={styles.itemTexto}>Ajuda</Text>
            </TouchableOpacity>

          </Card>

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

  profile: {
    alignItems: "center",
    marginTop: -90,
  },

  nome: {
    marginTop: 0,
    color: "#A84FFF",
    fontSize: 25,
    fontWeight: "bold",
  },

  usuario: {
    marginTop: 2,
    color: "#7136A8",
    fontSize: 12,
  },

  /* ESPAÇO DOS CARDS */

  conteudoCards: {
    paddingHorizontal: 12,
  },

  /* PREMIUM */

  cardPremium: {
    marginTop: 25,
    padding: 12,
    borderRadius: 6,
  },

  premiumTitulo: {
    color: "#A84FFF",
    fontSize: 19,
    fontWeight: "bold",
  },

  premiumVerde: {
    color: "#B8FF00",
  },

  premiumTexto: {
    color: "#A84FFF",
    fontSize: 13,
    marginTop: 3,
  },

  botaoPremium: {
    height: 32,
    backgroundColor: "#8739E8",
    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 8,
  },

  botaoTexto: {
    color: "#B8FF00",
    fontSize: 18,
  },

  /* CARDS DE EDIÇÃO */

  linhaCards: {
    flexDirection: "row",
    gap: 12,
  },

  cardEdicao: {
    flex: 1,
    height: 172,
    padding: 8,
    borderRadius: 6,
  },

  cardTitulo: {
    color: "#A84FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  iconeCard: {
    color: "#7B32E5",
    fontSize: 75,
    textAlign: "right",
    marginTop: 5,
  },

  /* CONFIGURAÇÕES */

  cardConfiguracoes: {
    padding: 10,
    borderRadius: 6,
    marginTop: 0,
  },

  tituloSecao: {
    color: "#A84FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    height: 38,
  },

  itemIcone: {
    color: "#C58AFF",
    fontSize: 18,
    width: 32,
  },

  itemTexto: {
    color: "#A84FFF",
    fontSize: 15,
  },

});