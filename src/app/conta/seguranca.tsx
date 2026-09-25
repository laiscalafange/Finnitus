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
  ChevronRight,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { Modal } from "../../shared/components/Modal";

import { Cores } from "../../shared/constants/Cores";
import { useAuth } from "../../features/authContext";
import { useAction } from "../../shared/hooks/useAction";
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
  const { logout } = useAuth();

  // Autenticação em duas etapas (mock local — sem endpoint ainda)
  const [duasEtapas, setDuasEtapas] = useState(false);

  // Confirmação de excluir conta
  const [modalVisivel, setModalVisivel] = useState(false);

  const { busy, run } = useAction();

  function excluirConta() {
    setModalVisivel(false);

    // TODO (backend): não existe endpoint de exclusão de conta ainda.
    // Por enquanto, confirmar aqui só desconecta o usuário (logout).
    void run(logout);
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
        {/* Cabeçalho: só a seta de voltar e o título, igual ao protótipo */}
        <HeaderInterno
          titulo="Segurança"
          subtitulo="Perfil"
          mostrarPremium={false}
          mostrarNotificacao={false}
        />

        <View style={styles.lista}>
          {/* Trocar senha: em vez do formulário de senha aparecer direto
              aqui (menos seguro), o botão reaproveita o fluxo de
              "Esqueci minha senha" (e-mail + código), só com o texto
              trocado pra "Trocar senha" (ver modo=trocar em forgotPassword) */}
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
              onPress={() =>
                router.push({
                  pathname: "/forgotPassword",
                  params: { modo: "trocar" },
                })
              }
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
              disabled={busy}
              onPress={() => setModalVisivel(true)}
            />
          </Card>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisivel}
        title="Excluir conta"
        message="Essa ação não pode ser desfeita. Todos os seus dados serão apagados permanentemente."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={excluirConta}
        onCancel={() => setModalVisivel(false)}
      />
    </LinearGradient>
  );
}