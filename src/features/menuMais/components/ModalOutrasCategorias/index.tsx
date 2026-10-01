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
// Overlay, card, X e título iguais aos do ModalReserva (mesmo visual)
import { styles as modalBase } from "../ModalReserva/styles";
import { styles } from "./styles";

type Props = {
  visivel: boolean;
  // Categorias da lista (extras + as criadas pela pessoa)
  opcoes: CategoriaItem[];
  // id da categoria marcada (null = nenhuma)
  selecionada: string | null;
  aoFechar: () => void;
  aoSelecionar: (id: string) => void;
  // Cria a categoria. Retorna a mensagem de erro ou null se deu certo
  // (nesse caso quem chamou já fecha o modal)
  aoCriar: (nome: string) => string | null;
};

// Modal do card "Outros": lista de categorias com caixinha de marcar (escolhe
// uma) e, no final, o botão "+ Criar categoria", que mostra o campo de texto
// e o botão pra criar uma nova.
export function ModalOutrasCategorias({
  visivel,
  opcoes,
  selecionada,
  aoFechar,
  aoSelecionar,
  aoCriar,
}: Props) {
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");

  // Sempre que o modal abre, volta ao estado inicial (sem campo de texto)
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
      {/* Sobe o card quando o teclado abre (campo de nova categoria) */}
      <KeyboardAvoidingView
        style={modalBase.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Fundo escurecido: tocar fora fecha */}
        <Pressable style={modalBase.fundo} onPress={aoFechar} />

        <Card
          gradiente={["rgba(73, 38, 155, 0.95)", "rgba(45, 17, 108, 0.95)"]}
          style={modalBase.card}
        >
          <Pressable
            style={modalBase.fechar}
            onPress={aoFechar}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <X size={22} color={Cores.texto.claro} />
          </Pressable>

          <Text style={modalBase.titulo}>Outras categorias</Text>

          {/* Lista de categorias (rola se for grande) */}
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
                  style={[styles.linha, marcada && styles.linhaMarcada]}
                >
                  {/* Caixinha de marcar */}
                  <View style={[styles.caixa, marcada && styles.caixaMarcada]}>
                    {marcada ? (
                      <Check size={14} color={Cores.texto.contraste} />
                    ) : null}
                  </View>

                  <Icone size={20} color={Cores.destaque.limao} />

                  <Text
                    numberOfLines={1}
                    style={[styles.nome, marcada && styles.nomeMarcado]}
                  >
                    {opcao.rotulo}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Botão simples no final da lista */}
          <Button
            titulo="+ Criar categoria"
            variante="botaotexto"
            onPress={() => setCriando(true)}
          />

          {/* Campo de texto + botão, embaixo do "+ Criar categoria" */}
          {criando ? (
            <View style={styles.areaCriar}>
              <Input
                label="Nova categoria"
                placeholder="Ex: Assinaturas"
                value={nome}
                onChangeText={(texto) => {
                  setNome(texto);
                  setErro("");
                }}
                autoCapitalize="sentences"
                maxLength={24}
                erro={erro}
              />

              <Button titulo="Criar categoria" onPress={criar} />
            </View>
          ) : null}
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  );
}