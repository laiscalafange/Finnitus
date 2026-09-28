import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
} from "react-native";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Smartphone,
  Laptop,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/seguranca";

// Dispositivos conectados à conta.
// TODO (backend): não existe endpoint de sessões/dispositivos ainda —
// por enquanto é só um mock pra representar o layout do protótipo.
const DISPOSITIVOS = [
  {
    id: "1",
    nome: "iPhone 14 Pro",
    local: "São Paulo, BR · Agora",
    icon: Smartphone,
    esteAparelho: true,
  },
  {
    id: "2",
    nome: "MacBook Pro",
    local: "São Paulo, BR · Há 2 horas",
    icon: Laptop,
    esteAparelho: false,
  },
] as const;

// Tela "Segurança".
export default function Seguranca() {
  const router = useRouter();

  // Autenticação em duas etapas (mock local — sem endpoint ainda)
  const [duasEtapas, setDuasEtapas] = useState(false);

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
        {/* Cabeçalho: só a seta de voltar e o título, igual ao protótipo */}
        <HeaderInterno
          titulo="Segurança"
          subtitulo="Perfil"
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        <View style={styles.lista}>
          {/* Trocar senha: em vez do formulário de senha aparecer direto
              aqui (menos seguro), o botão leva pra um fluxo próprio de
              3 telas dentro de app/conta (e-mail → código → Redefinir
              senha). Não dá pra reaproveitar o forgotPassword de dentro
              do app logado: aquela pasta (auth) só existe pra quem está
              deslogado (guard={!user} no _layout raiz) — por isso
              navegar pra lá com o usuário logado não fazia nada. */}
          <Card
            gradiente={["rgba(73, 38, 155, 0.71)", "rgba(45, 17, 108, 0.48)"]}
            style={styles.card}
          >
            <Text style={styles.tituloCard}>
              Alterar senha
            </Text>

            <Button
              titulo="Trocar senha"
              variante="terciario"
              onPress={() => router.push("/conta/trocarSenhaEmail")}
            />
          </Card>

          {/* Autenticação em duas etapas */}
          <Card
            gradiente={["rgba(73, 38, 155, 0.71)", "rgba(45, 17, 108, 0.48)"]}
            style={styles.card}
          >
            <View style={styles.linha2fa}>
              <View style={styles.textoContainer2fa}>
                <Text style={styles.tituloCard}>
                  Autenticação em duas etapas
                </Text>

                <Text style={styles.descricao2fa}>
                  Adiciona uma camada extra de segurança.
                </Text>
              </View>

              <Switch
                value={duasEtapas}
                onValueChange={setDuasEtapas}
                trackColor={{
                  false: Cores.interface.borda,
                  true: Cores.destaque.limao,
                }}
                thumbColor={Cores.base.branco}
              />
            </View>
          </Card>

          {/* Dispositivos conectados */}
          <Card
            gradiente={["rgba(73, 38, 155, 0.71)", "rgba(45, 17, 108, 0.48)"]}
            style={styles.card}
          >
            <Text style={styles.tituloCard}>
              Dispositivos conectados
            </Text>

            {DISPOSITIVOS.map(
              ({ id, nome, local, icon: Icone, esteAparelho }) => (
                <View key={id} style={styles.dispositivo}>
                  <Icone size={22} color={Cores.roxo.claro} />

                  <View style={styles.dispositivoTextos}>
                    <View style={styles.dispositivoNomeLinha}>
                      <Text style={styles.dispositivoNome}>
                        {nome}
                      </Text>

                      {esteAparelho ? (
                        <View style={styles.selo}>
                          <Text style={styles.seloTexto}>Este</Text>
                        </View>
                      ) : null}
                    </View>

                    <Text style={styles.dispositivoLocal}>
                      {local}
                    </Text>
                  </View>

                  {!esteAparelho ? (
                    <Text style={styles.desconectar}>
                      Desconectar
                    </Text>
                  ) : null}
                </View>
              )
            )}
          </Card>

          {/* Excluir conta */}
          <Card
            gradiente={["rgba(73, 38, 155, 0.71)", "rgba(45, 17, 108, 0.48)"]}
            style={[styles.card, styles.cardExcluir]}
          >
            <Text style={styles.tituloCard}>
              Excluir conta
            </Text>

            <Text style={styles.descricaoExcluir}>
              Todos os dados serão apagados permanentemente.
            </Text>

            <Button
              titulo="Excluir conta"
              variante="perigo"
              onPress={() =>
                router.push({
                  pathname: "/conta/confirmarAcao",
                  params: { acao: "excluir" },
                })
              }
            />
          </Card>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}