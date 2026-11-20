
import { useEffect, useState } from "react";

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { Check, X } from "lucide-react-native";

import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Cards";
import { Input } from "@/shared/components/Input";
import { Cores } from "@/shared/constants/Cores";

import type { CategoriaItem } from "../../types";
import { styles as modalBase } from "../ModalReserva/styles";
import { styles } from "./styles";

export type TextosCategoria = {
  titulo: string;
  criar: string;
  rotuloCampo: string;
  placeholder: string;
  botaoCriar: string;
  semNome: string;
  jaExiste: string;
  falhou: string;
};

export const TEXTOS_CATEGORIA: TextosCategoria = {
  titulo: "Outras categorias",
  criar: "+ Criar categoria",
  rotuloCampo: "Nova categoria",
  placeholder: "Ex: Assinaturas",
  botaoCriar: "Criar categoria",
  semNome: "Informe o nome da categoria.",
  jaExiste: "Essa categoria já existe.",
  falhou: "Não foi possível criar a categoria.",
};

type Props = {
  visivel: boolean;
  opcoes: CategoriaItem[];
  selecionada: string | null;
  aoFechar: () => void;
  aoSelecionar: (id: string) => void;
  aoCriar: (nome: string) => string | null;
  textos?: TextosCategoria;
};

export function ModalOutrasCategorias({
  visivel,
  opcoes,
  selecionada,
  aoFechar,
  aoSelecionar,
  aoCriar,
  textos = TEXTOS_CATEGORIA,
}: Props) {
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (visivel) {
      setCriando(false);
      setNome("");
      setErro("");
    }
  }, [visivel]);

  function criar() {
    const mensagem = aoCriar(nome);

    if (mensagem) {
      setErro(mensagem);
    }
  }

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={aoFechar}
    >
      <KeyboardAvoidingView
        style={modalBase.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable
          style={modalBase.fundo}
          onPress={aoFechar}
        />

        <Card
          gradiente={[
            "rgba(67, 31, 114, 0.92)",
            "rgba(44, 27, 67, 0.92)",
          ]}
          style={modalBase.card}
        >
          <Pressable
            style={modalBase.fechar}
            onPress={aoFechar}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <X size={25} color={Cores.texto.claro} />
          </Pressable>

          <Text style={modalBase.titulo}>
            {textos.titulo}
          </Text>

          <ScrollView
            style={styles.lista}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {opcoes.map((opcao) => {
              const marcada = selecionada === opcao.id;
              const Icone = opcao.icone;

              return (
                <Pressable
                  key={opcao.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: marcada }}
                  onPress={() => aoSelecionar(opcao.id)}
                  style={[
                    styles.linha,
                    marcada && styles.linhaMarcada,
                  ]}
                >
                  <View
                    style={[
                      styles.caixa,
                      marcada && styles.caixaMarcada,
                    ]}
                  >
                    {marcada ? (
                      <Check
                        size={14}
                        color={Cores.texto.contraste}
                      />
                    ) : null}
                  </View>

                  <Icone
                    size={20}
                    color={Cores.destaque.limao}
                  />

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.nome,
                      marcada && styles.nomeMarcado,
                    ]}
                  >
                    {opcao.rotulo}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Button
            titulo={textos.criar}
            variante="botaotexto"
            onPress={() => setCriando(true)}
          />

          {criando ? (
            <View style={styles.areaCriar}>
              <Input
                label={textos.rotuloCampo}
                placeholder={textos.placeholder}
                value={nome}
                onChangeText={(texto) => {
                  setNome(texto);
                  setErro("");
                }}
                autoCapitalize="sentences"
                maxLength={24}
                erro={erro}
              />

              <Button
                titulo={textos.botaoCriar}
                tamanho="compacto"
                onPress={criar}
              />
            </View>
          ) : null}
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  );
}
