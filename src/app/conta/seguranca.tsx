
import { useState } from "react";

import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";

import {
  Smartphone,
  Laptop,
  LockKeyhole,
  ShieldCheck,
  MonitorSmartphone,
  Trash2,
  ChevronRight,
} from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Card } from "../../shared/components/Cards";
import { ModalConfirmarAcao } from "../../shared/components/Modal/ModalConfirmarAcao";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/seguranca";

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.94)",
  "rgba(33, 18, 53, 0.94)",
];

// Dados ilustrativos do protótipo.
// Ainda não existe integração com sessões do backend.
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

export default function Seguranca() {
  const router = useRouter();

  const [duasEtapas, setDuasEtapas] = useState(false);

  const [
    modalExcluirVisivel,
    setModalExcluirVisivel,
  ] = useState(false);

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="padrao" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudo}
      >
        <HeaderInterno titulo="Segurança" />

        <View style={styles.lista}>
          {/* ALTERAR SENHA */}
          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.card}
          >
            <View style={styles.cabecalhoCard}>
              <View style={styles.iconeContainer}>
                <LockKeyhole
                  size={19}
                  color={Cores.destaque.limao}
                />
              </View>

              <View style={styles.textosCabecalho}>
                <Text style={styles.tituloCard}>
                  Alterar senha
                </Text>

                <Text style={styles.descricaoCard}>
                  Atualize sua senha para proteger sua conta.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.botao}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/conta/trocarSenhaEmail")
              }
            >
              <Text style={styles.textoBotao}>
                Trocar senha
              </Text>

              <ChevronRight
                size={18}
                color={Cores.destaque.limao}
              />
            </TouchableOpacity>
          </Card>

          {/* AUTENTICAÇÃO EM DUAS ETAPAS */}
          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.card}
          >
            <View style={styles.linha2fa}>
              <View style={styles.iconeContainer}>
                <ShieldCheck
                  size={19}
                  color={Cores.destaque.limao}
                />
              </View>

              <View style={styles.textoContainer2fa}>
                <Text style={styles.tituloCard}>
                  Autenticação em duas etapas
                </Text>

                <Text style={styles.descricaoCard}>
                  Adiciona uma camada extra de segurança.
                </Text>
              </View>

              <Switch
                value={duasEtapas}
                onValueChange={setDuasEtapas}
                trackColor={{
                  false: "rgba(163, 87, 255, 0.25)",
                  true: Cores.destaque.limao,
                }}
                thumbColor={Cores.base.branco}
              />
            </View>
          </Card>

          {/* DISPOSITIVOS CONECTADOS */}
          <Card
            gradiente={GRADIENTE_CARD}
            style={styles.card}
          >
            <View style={styles.cabecalhoCard}>
              <View style={styles.iconeContainer}>
                <MonitorSmartphone
                  size={19}
                  color={Cores.destaque.limao}
                />
              </View>

              <Text style={styles.tituloCard}>
                Dispositivos conectados
              </Text>
            </View>

            {DISPOSITIVOS.map(
              (
                {
                  id,
                  nome,
                  local,
                  icon: Icone,
                  esteAparelho,
                },
                index
              ) => (
                <View
                  key={id}
                  style={[
                    styles.dispositivo,
                    index !== DISPOSITIVOS.length - 1 &&
                      styles.dispositivoDivisor,
                  ]}
                >
                  <View style={styles.iconeDispositivo}>
                    <Icone
                      size={19}
                      color={Cores.destaque.limao}
                    />
                  </View>

                  <View style={styles.dispositivoTextos}>
                    <View style={styles.dispositivoNomeLinha}>
                      <Text style={styles.dispositivoNome}>
                        {nome}
                      </Text>

                      {esteAparelho && (
                        <View style={styles.selo}>
                          <Text style={styles.seloTexto}>
                            Este
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.dispositivoLocal}>
                      {local}
                    </Text>
                  </View>

                  {!esteAparelho && (
                    <Text style={styles.desconectar}>
                      Desconectar
                    </Text>
                  )}
                </View>
              )
            )}
          </Card>

          {/* EXCLUIR CONTA - ÁREA DE PERIGO */}
          <TouchableOpacity
            style={styles.cardExcluir}
            activeOpacity={0.8}
            onPress={() =>
              setModalExcluirVisivel(true)
            }
          >
            <View style={styles.iconePerigoContainer}>
              <Trash2
                size={20}
                color="#FF8585"
              />
            </View>

            <View style={styles.textosPerigo}>
              <Text style={styles.tituloPerigo}>
                Excluir conta
              </Text>

              <Text style={styles.descricaoPerigo}>
                Apagar permanentemente os dados da conta.
              </Text>
            </View>

            <ChevronRight
              size={19}
              color="#FF8585"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ModalConfirmarAcao
        visible={modalExcluirVisivel}
        acao="excluir"
        onClose={() =>
          setModalExcluirVisivel(false)
        }
      />
    </View>
  );
}
