import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { HeaderPerfil } from "../../shared/components/Header";
import { Avatar } from "../../shared/components/Avatar";
import { Card } from "../../shared/components/Cards";
import { LinearGradient } from "expo-linear-gradient";
import { FONTS } from "../../shared/constants/Tipografia";
import { Cores } from '@/shared/constants/Cores';

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
            gradiente={["#7c4dff", "#3b1b92"]}
            style={styles.cardPremium}
          >

            <View style={styles.premiumTituloContainer}>
                <Image
                  source={require("../../../assets/icones/coroa.png")}
                  style={styles.coroa}
                />

              <Text style={styles.premiumTitulo}>
                Seja <Text style={styles.premiumVerde}>PREMIUM</Text>
              </Text>
            </View>

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
              gradiente={["#7c4dff", "#3b1b92"]}
              style={styles.cardEdicao}
            >
              <Text style={styles.cardTitulo}>
                Editar conta
              </Text>

              <Image
                source={require("../../../assets/icones/EngrenagemPerfil.png")}
                style={styles.EngrenagemPerfil}
              />
            </Card>

            <Card
              gradiente={["#7c4dff", "#3b1b92"]}
              style={styles.cardEdicao}
            >
              <Text style={styles.cardTitulo}>
                Editar dados{"\n"}
                bancários
              </Text>

              <Image
                source={require("../../../assets/icones/BonecoPerfil.png")}
                style={styles.BonecoPerfil}
              />
            </Card>

          </View>

          {/* CONFIGURAÇÕES E SUPORTE */}
          <Card
            gradiente={["#7c4dff", "#3b1b92"]}
            style={styles.cardConfiguracoes}
          >
            <Text style={styles.tituloSecao}>
              Configurações
            </Text>

            <TouchableOpacity style={styles.item}>
              <Image
                source={require("../../../assets/icones/Configurar.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Configurar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Image
                source={require("../../../assets/icones/Segurança.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Segurança</Text>
            </TouchableOpacity>

            <Text style={styles.tituloSecao}>
              Suporte
            </Text>

            <TouchableOpacity style={styles.item}>
              <Image
                source={require("../../../assets/icones/Telefone.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Contate-nos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
              <Image
                source={require("../../../assets/icones/Ajuda.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Ajuda</Text>
            </TouchableOpacity>
          </Card>

        </View>

      </ScrollView>

    </LinearGradient >
  );
}

//CSS

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
    color: Cores.roxo.principal,
    fontSize: 25,
    fontFamily: FONTS.raleway.bold,
  },

  usuario: {
    marginTop: 2,
    color: Cores.roxo.escuro,
    fontSize: 12,
    fontFamily: FONTS.raleway.regular
  },

  /* ESPAÇO DOS CARDS */

  conteudoCards: {
    paddingHorizontal: 12,
  },

  /* PREMIUM */

  premiumTituloContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardPremium: {
    marginTop: 20,
    padding: 12,
    borderRadius: 6,
  },

  premiumTitulo: {
    color: Cores.roxo.claro,
    fontSize: 19,
    fontFamily: FONTS.raleway.bold,
  },

  coroa: {
    width: 35,
    height: 35,
    marginRight: 10,
    resizeMode: "contain",
  },

  premiumVerde: {
    color: "#B8FF00",
  },

  premiumTexto: {
    color: Cores.roxo.claro,
    fontSize: 13,
    marginTop: 3,
    fontFamily: FONTS.raleway.regular,
  },

  botaoPremium: {
    height: 32,
    backgroundColor: Cores.roxo.claro,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  botaoTexto: {
    color: Cores.destaque.limao,
    fontSize: 18,
    fontFamily: FONTS.raleway.regular,
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
    paddingRight: 0,
    borderRadius: 6,
  },

  cardTitulo: {
    color: Cores.roxo.claro,
    fontSize: 18,
    fontFamily: FONTS.raleway.bold,
  },

  EngrenagemPerfil: {
    width: 130,
    height: 130,
    resizeMode: "contain",
    alignSelf: "flex-end",
    marginTop: 5,
  },

  BonecoPerfil: {
    width: 70,
    height: 105,
    resizeMode: "contain",
    alignSelf: "flex-end",
  },

  /* CONFIGURAÇÕES */

  cardConfiguracoes: {
    padding: 10,
    borderRadius: 6,
    marginTop: 0,
  },

  tituloSecao: {
    color: Cores.roxo.claro,
    fontSize: 20,
    fontFamily: FONTS.raleway.bold,
    marginBottom: 8,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    height: 38,
  },

  itemIcone: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 10,
  },

  itemTexto: {
    color: Cores.roxo.claro,
    fontSize: 15,
    fontFamily: FONTS.raleway.regular,
  },

});