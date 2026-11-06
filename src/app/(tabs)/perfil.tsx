import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { HeaderPerfil } from "../../shared/components/Header";
import { Avatar } from "../../shared/components/Avatar";
import { Card } from "../../shared/components/Cards";
import { Button } from "../../shared/components/Button";
import { ModalFotoPerfil } from "../../shared/components/Modal/ModalFotoPerfil";
import { ModalConfirmarAcao } from "../../shared/components/Modal/ModalConfirmarAcao";

import { Cores } from "../../shared/constants/Cores";
import { styles } from "../../styles/perfil";
import { useAuth } from "../../features/authContext";
import { Rotas } from "../../shared/constants/Rotas";
import { api } from "../../services/api";

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [modalFotoVisible, setModalFotoVisible] = useState(false);
  const [modalSairVisible, setModalSairVisible] = useState(false);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState<string | null>(null);

  // Carrega a foto persistida no backend ao entrar na conta.
  useEffect(() => {
    let ativo = true;

    if (!user) {
      setFotoPerfil(null);
      setErroFoto(null);
      return;
    }

    async function carregarFotoPerfil() {
      try {
        const resposta = await api.get("/me/foto");
        if (ativo) {
          setFotoPerfil(resposta.data.fotoPerfilUrl ?? null);
          setErroFoto(null);
        }
      } catch (erro) {
        console.error("Erro ao carregar foto de perfil:", erro);
        if (ativo) {
          setErroFoto("Não foi possível carregar a foto de perfil.");
        }
      }
    }

    void carregarFotoPerfil();
    return () => {
      ativo = false;
    };
  }, [user?.email]);

  async function enviarFotoPerfil(uri: string) {
    if (salvandoFoto) return;

    try {
      setSalvandoFoto(true);
      setErroFoto(null);

      const formData = new FormData();

      if (Platform.OS === "web") {
        // Na web, a URI pode ser blob: ou data:; convertemos em arquivo.
        const respostaArquivo = await fetch(uri);
        if (!respostaArquivo.ok) {
          throw new Error("Não foi possível ler a imagem selecionada.");
        }

        const blob = await respostaArquivo.blob();
        if (!blob.size) {
          throw new Error("A imagem selecionada está vazia.");
        }
        if (blob.size > 5 * 1024 * 1024) {
          throw new Error("A imagem deve ter no máximo 5 MB.");
        }

        const tipo = blob.type || "image/jpeg";
        if (!["image/jpeg", "image/png", "image/webp"].includes(tipo)) {
          throw new Error("Escolha uma imagem JPG, PNG ou WEBP.");
        }

        const extensao =
          tipo === "image/png" ? "png" : tipo === "image/webp" ? "webp" : "jpg";

        const arquivo = new File([blob], `foto-perfil.${extensao}`, {
          type: tipo,
        });
        formData.append("foto", arquivo);

        console.log("Foto preparada:", {
          nome: arquivo.name,
          tipo: arquivo.type,
          tamanho: arquivo.size,
        });
      } else {
        const extensaoOriginal = uri
          .split("?")[0]
          .split(".")
          .pop()
          ?.toLowerCase();
        const extensao =
          extensaoOriginal === "png" || extensaoOriginal === "webp"
            ? extensaoOriginal
            : "jpg";
        const tipo =
          extensao === "png"
            ? "image/png"
            : extensao === "webp"
              ? "image/webp"
              : "image/jpeg";

        formData.append("foto", {
          uri,
          name: `foto-perfil.${extensao}`,
          type: tipo,
        } as any);
      }

      const resposta = await api.patch("/me/foto", formData, {
        // Não deixe o Axios serializar FormData como JSON.
        transformRequest: [(dados) => dados],
        // O navegador precisa gerar o multipart boundary automaticamente.
        headers: { "Content-Type": undefined },
      });

      const urlSalva = resposta.data?.fotoPerfilUrl;
      if (typeof urlSalva !== "string" || !urlSalva) {
        throw new Error("A API não retornou o endereço da foto.");
      }

      setFotoPerfil(urlSalva);
      setModalFotoVisible(false);
      console.log("Foto salva com sucesso:", urlSalva);
    } catch (erro) {
      console.error("Erro ao enviar foto:", erro);
      const mensagemServidor = axios.isAxiosError(erro)
        ? erro.response?.data?.error
        : undefined;
      setErroFoto(
        typeof mensagemServidor === "string"
          ? mensagemServidor
          : erro instanceof Error
            ? erro.message
            : "Não foi possível salvar a foto. Tente novamente.",
      );
    } finally {
      setSalvandoFoto(false);
    }
  }

  async function excluirFotoPerfil() {
    if (salvandoFoto) return;

    try {
      setSalvandoFoto(true);
      setErroFoto(null);

      await api.delete("/me/foto");
      setFotoPerfil(null);
      setModalFotoVisible(false);
    } catch (erro) {
      console.error("Erro ao remover foto:", erro);
      setErroFoto("Não foi possível remover a foto.");
    } finally {
      setSalvandoFoto(false);
    }
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
        contentContainerStyle={[
          styles.conteudo,
          { paddingBottom: 150 + insets.bottom },
        ]}
      >
        <HeaderPerfil />

        <View style={styles.profile}>
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={salvandoFoto}
            onPress={() => setModalFotoVisible(true)}
          >
            <Avatar
              name={user?.name ?? "Usuário"}
              image={fotoPerfil ?? undefined}
              size={200}
            />
          </TouchableOpacity>

          {salvandoFoto && (
            <Text style={{ color: "#B6FF00", marginTop: 10 }}>
              Salvando foto...
            </Text>
          )}

          {erroFoto && (
            <Text
              style={{
                color: "#FF7777",
                marginTop: 10,
                textAlign: "center",
              }}
            >
              {erroFoto}
            </Text>
          )}

          <Text style={styles.nome}>{user?.name ?? "Usuário"}</Text>
          <Text style={styles.usuario}>{user?.email ?? ""}</Text>
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
                Seja <Text style={styles.premiumVerde}>PREMIUM</Text>
              </Text>
            </View>
            <Text style={styles.premiumTexto}>
              Desbloqueie recursos exclusivos e{"\n"}relatórios avançados
            </Text>
            <TouchableOpacity
              style={styles.botaoPremium}
              activeOpacity={0.8}
              onPress={() => router.push(Rotas.premium)}
            >
              <Text style={styles.botaoTexto}>Assine já</Text>
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
                <Text style={styles.cardTitulo}>Editar conta</Text>
                <Image
                  source={require("../../../assets/icones/EngrenagemPerfil.png")}
                  style={styles.EngrenagemPerfil}
                />
              </Card>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.85}
              onPress={() => router.push("/conta/dadosBancarios")}
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
            <Text style={styles.tituloSecao}>Configurações</Text>
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/conta/configuracoes")}
            >
              <Image
                source={require("../../../assets/icones/Configurar.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Configurar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/conta/seguranca")}
            >
              <Image
                source={require("../../../assets/icones/Seguranca.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Segurança</Text>
            </TouchableOpacity>

            <Text style={styles.tituloSecao}>Suporte</Text>
            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/conta/contato")}
            >
              <Image
                source={require("../../../assets/icones/Telefone.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Contate-nos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push("/conta/ajuda")}
            >
              <Image
                source={require("../../../assets/icones/Ajuda.png")}
                style={styles.itemIcone}
              />
              <Text style={styles.itemTexto}>Ajuda</Text>
            </TouchableOpacity>
          </Card>

          <View style={{ marginTop: 20, gap: 12 }}>
            <Button
              titulo="Sair da conta"
              variante="terciario"
              onPress={() => setModalSairVisible(true)}
            />

            
<Button
  titulo="Excluir conta"
  variante="terciario"
  onPress={() => router.push("/conta/excluir")}
/>

          </View>
        </View>

        <ModalFotoPerfil
          visible={modalFotoVisible}
          onClose={() => {
            if (!salvandoFoto) setModalFotoVisible(false);
          }}
          onImageSelected={(uri) => {
            if (!salvandoFoto) void enviarFotoPerfil(uri);
          }}
          onRemove={() => {
            if (!salvandoFoto) void excluirFotoPerfil();
          }}
          hasImage={!!fotoPerfil}
        />

        <ModalConfirmarAcao
          visible={modalSairVisible}
          acao="sair"
          onClose={() => setModalSairVisible(false)}
        />
      </ScrollView>
    </LinearGradient>
  );
}
