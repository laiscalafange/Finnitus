import { useIdioma } from "@/features/idioma";

import { useCallback, useMemo, useState } from "react";

import {
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Text } from "../../shared/components/Texto";

import { useFocusEffect, useRouter } from "expo-router";

import {
  Smartphone,
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
import { ModalCodigoSeguranca } from "../../shared/components/Modal/ModalCodigoSeguranca";
import { useAuth } from "../../features/authContext";
import { useAuthAction } from "../../shared/hooks/useAuthAction";
import {
  segurancaService,
  type EstadoDuasEtapas,
  type SessaoUsuario,
} from "../../services/seguranca";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/seguranca";

const GRADIENTE_CARD: [string, string] = [
  "rgba(44, 27, 67, 0.94)",
  "rgba(33, 18, 53, 0.94)",
];

export default function Seguranca() {
  const { idioma, t } = useIdioma();
  const formatoDataSessao = useMemo(() => new Intl.DateTimeFormat(idioma, {
    dateStyle: "short",
    timeStyle: "short",
  }), [idioma]);
  const router = useRouter();
  const { confirmarAlteracao2FA } = useAuth();
  const [duasEtapas, setDuasEtapas] = useState<EstadoDuasEtapas | null>(null);
  const [dispositivos, setDispositivos] = useState<SessaoUsuario[] | null>(null);
  const [desafio, setDesafio] = useState<{ challengeId: string; ativar: boolean } | null>(null);
  const { busy, error, run } = useAuthAction();

  const carregar = useCallback(async () => {
    const [configuracao, sessoes] = await Promise.all([
      segurancaService.verDuasEtapas(),
      segurancaService.listarSessoes(),
    ]);
    setDuasEtapas(configuracao);
    setDispositivos(sessoes);
  }, []);

  useFocusEffect(useCallback(() => {
    void run(carregar);
  }, [carregar, run]));

  function solicitarDuasEtapas(ativar: boolean) {
    void run(async () => {
      const { challengeId } = await segurancaService.solicitarAlteracao(ativar);
      setDesafio({ challengeId, ativar });
    });
  }

  async function confirmarDuasEtapas(codigo: string) {
    if (!desafio) return;
    const ativa = await confirmarAlteracao2FA(desafio.ativar, desafio.challengeId, codigo);
    setDuasEtapas((atual) => atual && { ...atual, ativa });
    setDispositivos(null);
    setDesafio(null);
    void run(carregar);
  }

  function desconectar(id: string) {
    void run(async () => {
      await segurancaService.desconectarSessao(id);
      setDispositivos((sessoes) => sessoes?.filter((sessao) => sessao.id !== id) ?? null);
    });
  }

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
        <HeaderInterno titulo={t("Segurança")} />

        <View style={styles.lista}>
          {error ? (
            <TouchableOpacity
              accessibilityRole="button"
              disabled={busy}
              style={styles.botao}
              onPress={() => void run(carregar)}
            >
              <Text style={[styles.descricaoCard, styles.textosCabecalho]} accessibilityRole="alert">
                {error} {t("Toque para atualizar.")}
              </Text>
            </TouchableOpacity>
          ) : null}
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
                  {t("Alterar senha")}
                </Text>

                <Text style={styles.descricaoCard}>
                  {t("Atualize sua senha para proteger sua conta.")}
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
                {t("Trocar senha")}
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
                  {t("Autenticação em duas etapas")}
                </Text>

                <Text style={styles.descricaoCard}>
                  {duasEtapas?.disponivel
                    ? t("Receba um código por e-mail ao entrar.")
                    : duasEtapas
                      ? t("O envio de códigos está indisponível.")
                      : busy ? t("Carregando…") : t("Status indisponível.")}
                </Text>
              </View>

              <Switch
                accessibilityLabel={t("Autenticação em duas etapas")}
                value={duasEtapas?.ativa ?? false}
                disabled={busy || !duasEtapas?.disponivel}
                onValueChange={solicitarDuasEtapas}
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
                {t("Dispositivos conectados")}
              </Text>
            </View>

            {!dispositivos?.length && (
              <Text style={styles.descricaoCard}>
                {dispositivos ? t("Nenhuma sessão ativa.") : busy ? t("Carregando…") : t("Sessões indisponíveis.")}
              </Text>
            )}
            {dispositivos?.map(
              (
                {
                  id,
                  dispositivo,
                  criadaEm,
                  atual,
                },
                index
              ) => (
                <View
                  key={id}
                  style={[
                    styles.dispositivo,
                    index !== dispositivos.length - 1 &&
                      styles.dispositivoDivisor,
                  ]}
                >
                  <View style={styles.iconeDispositivo}>
                    <Smartphone
                      size={19}
                      color={Cores.destaque.limao}
                    />
                  </View>

                  <View style={styles.dispositivoTextos}>
                    <View style={styles.dispositivoNomeLinha}>
                      <Text style={styles.dispositivoNome}>
                        {dispositivo}
                      </Text>

                      {atual && (
                        <View style={styles.selo}>
                          <Text style={styles.seloTexto}>
                            {t("Este aparelho")}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.dispositivoLocal}>
                      {t("Acesso iniciado em {data}", { data: formatoDataSessao.format(new Date(criadaEm)) })}
                    </Text>
                  </View>

                  {!atual && (
                    <TouchableOpacity
                      accessibilityRole="button"
                      accessibilityLabel={t("Desconectar {dispositivo}", { dispositivo })}
                      disabled={busy}
                      hitSlop={8}
                      onPress={() => desconectar(id)}
                    >
                      <Text style={styles.desconectar}>{t("Desconectar")}</Text>
                    </TouchableOpacity>
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
                {t("Excluir conta")}
              </Text>

              <Text style={styles.descricaoPerigo}>
                {t("Apagar permanentemente os dados da conta.")}
              </Text>
            </View>

            <ChevronRight
              size={19}
              color="#FF8585"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {desafio && (
        <ModalCodigoSeguranca
          key={desafio.challengeId}
          titulo={desafio.ativar ? t("Ativar verificação em duas etapas") : t("Desativar verificação em duas etapas")}
          instrucao={t("Digite o código recebido por e-mail. Ao confirmar, as outras sessões serão encerradas.")}
          onConfirmar={confirmarDuasEtapas}
          onCancelar={() => setDesafio(null)}
        />
      )}

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
