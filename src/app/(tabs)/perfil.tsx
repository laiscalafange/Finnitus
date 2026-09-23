import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { HeaderPerfil } from "../../shared/components/Header";
import { Avatar } from "../../shared/components/Avatar";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/perfil";

import { useAuth } from "../../features/authContext";
import { useAction } from "../../shared/hooks/useAction";

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    user,
    logout,
  } = useAuth();

  const {
    busy,
    error,
    run,
  } = useAction();

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
          {
            paddingBottom: 150 + insets.bottom,
          },
        ]}
      >
        <HeaderPerfil />

        <View style={styles.profile}>
          <Avatar
            name={user?.name ?? "Usuário"}
            size={200}
          />

          <Text style={styles.nome}>
            {user?.name ?? "Usuário"}
          </Text>

          <Text style={styles.usuario}>
            {user?.email ?? ""}
          </Text>
        </View>

        <View style={styles.conteudoCards}>
          <Card
            gradiente={[
              Cores.fundo.destaque,
              "#3b1b92",
            ]}
            style={styles.cardPremium}
          >
            <View style={styles.premiumTituloContainer}>
              <Image
                source={require(
                  "../../../assets/icones/coroa.png"
                )}
                style={styles.coroa}
              />

              <Text style={styles.premiumTitulo}>
                Seja{" "}
                <Text style={styles.premiumVerde}>
                  PREMIUM
                </Text>
              </Text>
            </View>

            <Text style={styles.premiumTexto}>
              Desbloqueie recursos exclusivos e{"\n"}
              relatórios avançados
            </Text>

            <TouchableOpacity
              style={styles.botaoPremium}
              onPress={() => router.push("/")}
            >
              <Text style={styles.botaoTexto}>
                Assine já
              </Text>
            </TouchableOpacity>
          </Card>

         <View style={styles.linhaCards}>
  {/* Botão Editar conta */}
  <TouchableOpacity
    style={{ flex: 1 }}
    activeOpacity={0.85}
    onPress={() => router.push("/conta/editar")}
  >
    <Card
      gradiente={[
        Cores.fundo.destaque,
        "#3b1b92",
      ]}
      style={styles.cardEdicao}
    >
      <Text style={styles.cardTitulo}>
        Editar conta
      </Text>

      <Image
        source={require(
          "../../../assets/icones/EngrenagemPerfil.png"
        )}
        style={styles.EngrenagemPerfil}
      />
    </Card>
  </TouchableOpacity>

  {/* Botão Editar dados bancários */}
  <TouchableOpacity
    style={{ flex: 1 }}
    activeOpacity={0.85}
    onPress={() => router.push("/conta/dadosBancarios")}
  >
    <Card
      gradiente={[
        Cores.fundo.destaque,
        "#3b1b92",
      ]}
      style={styles.cardEdicao}
    >
      <Text style={styles.cardTitulo}>
        Editar dados{"\n"}
        bancários
      </Text>

      <Image
        source={require(
          "../../../assets/icones/BonecoPerfil.png"
        )}
        style={styles.BonecoPerfil}
      />
    </Card>
  </TouchableOpacity>
</View>

          <Card
            gradiente={[
              Cores.fundo.destaque,
              "#3b1b92",
            ]}
            style={styles.cardConfiguracoes}
          >
            <Text style={styles.tituloSecao}>
              Configurações
            </Text>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/")}
            >
              <Image
                source={require(
                  "../../../assets/icones/Configurar.png"
                )}
                style={styles.itemIcone}
              />

              <Text style={styles.itemTexto}>
                Configurar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/")}
            >
              <Image
                source={require(
                  "../../../assets/icones/Seguranca.png"
                )}
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
              onPress={() => router.push("/")}
            >
              <Image
                source={require(
                  "../../../assets/icones/Telefone.png"
                )}
                style={styles.itemIcone}
              />

              <Text style={styles.itemTexto}>
                Contate-nos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/")}
            >
              <Image
                source={require(
                  "../../../assets/icones/Ajuda.png"
                )}
                style={styles.itemIcone}
              />

              <Text style={styles.itemTexto}>
                Ajuda
              </Text>
            </TouchableOpacity>
          </Card>

          <View
            style={{
              marginTop: 20,
              gap: 12,
            }}
          >
            {error ? (
              <Text
                style={{ color: "#ffb4b4" }}
                accessibilityRole="alert"
              >
                {error}
              </Text>
            ) : null}

            <Button
              titulo={
                busy
                  ? "Saindo..."
                  : "Sair da conta"
              }
              variante="terciario"
              disabled={busy}
              onPress={() => void run(logout)}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}