import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { HeaderPerfil } from "../../shared/components/Header";
import { Avatar } from "../../shared/components/Avatar";
import { Card } from "../../shared/components/Cards";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS } from "../../shared/constants/Gradientes";
import { Cores } from "../../shared/constants/Cores";
import { Rotas } from "../../shared/constants/Rotas";
import { styles } from "../../styles/perfil";

export default function Perfil() {
  // Hook do Expo Router usado pra navegar entre as telas
  // (router.push troca de tela mantendo a pilha de navegação, então dá pra voltar)
  const router = useRouter();

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

        {/* Cabeçalho fixo do topo (voltar, título, etc) */}
        <HeaderPerfil />

        {/* Informações do perfil (avatar + nome + username) */}
        <View style={styles.profile}>

          {/* TODO: quando o back estiver pronto, o "name" do Avatar
              deve vir dos dados do usuário logado (ex: `${usuario.nome} ${usuario.sobrenome}`) */}
          <Avatar
            name="Usuário"
            size={200}
          />

          {/* TODO: puxar nome + sobrenome do usuário logado quando o back estiver pronto */}
          <Text style={styles.nome}>
            Usuário
          </Text>

          {/* TODO: puxar username/@ do usuário logado quando o back estiver pronto */}
          <Text style={styles.usuario}>
            @User_TwT
          </Text>

        </View>

        {/* CONTEÚDO DOS CARDS */}
        <View style={styles.conteudoCards}>

          {/* CARD PREMIUM */}
          <Card
            gradiente={[Cores.fundo.destaque, '#3b1b92']}
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

            {/* Único elemento clicável do card, leva pra tela de assinatura Premium */}
            <TouchableOpacity
              style={styles.botaoPremium}
              onPress={() => router.push(Rotas.premium)}
            >
              <Text style={styles.botaoTexto}>
                Assine já
              </Text>
            </TouchableOpacity>
          </Card>

          {/* CARDS DE EDIÇÃO (conta e dados bancários) */}
          <View style={styles.linhaCards}>

            {/* CARD "Editar conta" — clicável, leva pra tela de edição de conta */}
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.85}
              onPress={() => router.push("/")}
            >
              <Card
                gradiente={[Cores.fundo.destaque, '#3b1b92']}
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
            </TouchableOpacity>

            {/* CARD "Editar dados bancários" — clicável, leva pra tela de dados bancários */}
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.85}
              onPress={() => router.push("/")}
            >
              <Card
                gradiente={[Cores.fundo.destaque, '#3b1b92']}
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
            </TouchableOpacity>

          </View>

          {/* CARD ÚNICO COM CONFIGURAÇÕES E SUPORTE
              (não precisa de TouchableOpacity no Card inteiro,
              porque cada item de dentro já é clicável individualmente) */}
          <Card
            gradiente={[Cores.fundo.destaque, '#3b1b92']}
            style={styles.cardConfiguracoes}
          >
            <Text style={styles.tituloSecao}>
              Configurações
            </Text>

            {/* Item "Configurar" — leva pra tela de configurações gerais */}
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/")}
            >
              <Image
                source={require("../../../assets/icones/Configurar.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Configurar</Text>
            </TouchableOpacity>

            {/* Item "Segurança" — leva pra tela de segurança (senha, etc) */}
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/")}
            >
              <Image
                source={require("../../../assets/icones/Seguranca.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Segurança</Text>
            </TouchableOpacity>

            <Text style={styles.tituloSecao}>
              Suporte
            </Text>

            {/* Item "Contate-nos" — leva pra tela/formulário de contato */}
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/")}
            >
              <Image
                source={require("../../../assets/icones/Telefone.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Contate-nos</Text>
            </TouchableOpacity>

            {/* Item "Ajuda" — leva pra tela de ajuda/FAQ */}
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/")}
            >
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