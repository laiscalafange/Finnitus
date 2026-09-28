import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

import { useState } from "react";

import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { HeaderPerfil } from "../../shared/components/Header";
import { Avatar } from "../../shared/components/Avatar";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { ModalFotoPerfil } from "../../shared/components/Modal/ModalFotoPerfil";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/perfil";

import { useAuth } from "../../features/authContext";
import { Rotas } from "../../shared/constants/Rotas";

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { user } = useAuth();

  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [modalFotoVisible, setModalFotoVisible] = useState(false);

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.conteudo,
          { paddingBottom: 150 + insets.bottom },
        ]}
      >
        <HeaderPerfil />

        <View style={styles.profile}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setModalFotoVisible(true)}
          >
            <Avatar
              name={user?.name ?? "Usuário"}
              image={fotoPerfil ?? undefined}
              size={200}
            />
          </TouchableOpacity>

          <Text style={styles.nome}>
            {user?.name ?? "Usuário"}
          </Text>

          <Text style={styles.usuario}>
            {user?.email ?? ""}
          </Text>
        </View>

        <View style={styles.conteudoCards}>
          <Card
            gradiente={[Cores.fundo.destaque, "#3b1b92"]}
            style={styles.cardPremium}
          >
            <View style={styles.premiumTituloContainer}>
              <Image
                source={require("../../../assets/icones/coroa.png")}
                style={styles.coroa}
              />

              <Text style={styles.premiumTitulo}>
                Seja{" "}
                <Text style={styles.premiumVerde}>PREMIUM</Text>
              </Text>
            </View>

            <Text style={styles.premiumTexto}>
              Desbloqueie recursos exclusivos e{"\n"}
              relatórios avançados
            </Text>

            <TouchableOpacity
              style={styles.botaoPremium}
              activeOpacity={0.8}
              onPress={() => router.push(Rotas.premium)}
            >
              <Text style={styles.botaoTexto}>
                Assine já
              </Text>
            </TouchableOpacity>
          </Card>

          <View style={styles.linhaCards}>
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.85}
              onPress={() => router.push("/conta/editar")}
            >
              <Card
                gradiente={[Cores.fundo.destaque, "#3b1b92"]}
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

            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.85}
              onPress={() =>
                router.push("/conta/dadosBancarios")
              }
            >
              <Card
                gradiente={[Cores.fundo.destaque, "#3b1b92"]}
                style={styles.cardEdicao}
              >
                <Text style={styles.cardTitulo}>
                  Editar dados{"\n"}bancários
                </Text>

                <Image
                  source={require("../../../assets/icones/BonecoPerfil.png")}
                  style={styles.BonecoPerfil}
                />
              </Card>
            </TouchableOpacity>
          </View>

          <Card
            gradiente={[Cores.fundo.destaque, "#3b1b92"]}
            style={styles.cardConfiguracoes}
          >
            <Text style={styles.tituloSecao}>
              Configurações
            </Text>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/conta/configuracoes")}
            >
              <Image
                source={require("../../../assets/icones/Configurar.png")}
                style={styles.itemIcone}
              />

              <Text style={styles.itemTexto}>
                Configurar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/conta/seguranca")}
            >
              <Image
                source={require("../../../assets/icones/Seguranca.png")}
                style={styles.itemIcone}
              />

              <Text style={styles.itemTexto}>
                Segurança
              </Text>
            </TouchableOpacity>

            <Text style={styles.tituloSecao}>
              Suporte
            </Text>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/conta/contato")}
            >
              <Image
                source={require("../../../assets/icones/Telefone.png")}
                style={styles.itemIcone}
              />

              <Text style={styles.itemTexto}>
                Contate-nos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/conta/ajuda")}
            >
              <Image
                source={require("../../../assets/icones/Ajuda.png")}
                style={styles.itemIcone}
              />

              <Text style={styles.itemTexto}>
                Ajuda
              </Text>
            </TouchableOpacity>
          </Card>

          <View style={{ marginTop: 20, gap: 12 }}>
            {/* Leva pra tela de confirmação (com contagem de 10s) */}
            <Button
              titulo="Sair da conta"
              variante="terciario"
              onPress={() =>
                router.push({
                  pathname: "/conta/confirmarAcao",
                  params: { acao: "sair" },
                })
              }
            />
          </View>
        </View>

        <ModalFotoPerfil
          visible={modalFotoVisible}
          onClose={() => setModalFotoVisible(false)}
          onImageSelected={(uri) => setFotoPerfil(uri)}
          onRemove={() => setFotoPerfil(null)}
          hasImage={!!fotoPerfil}
        />
      </ScrollView>
    </LinearGradient>
  );
}