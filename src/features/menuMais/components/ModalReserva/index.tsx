import { useEffect, useState, type ReactNode } from "react";

import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import { Trash2, TriangleAlert, X } from "lucide-react-native";

import { Card } from "@/shared/components/Cards";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { Cores } from "@/shared/constants/Cores";

import type { TipoModalReserva } from "../../types";
import {
  formatarMoeda,
  mascararMoeda,
  moedaParaNumero,
} from "../../utils";
import { styles } from "./styles";

type Props = {
  // Qual card mostrar (null = fechado)
  tipo: TipoModalReserva | null;
  // Saldo atual da reserva (mostrado em "Depositar" e "Retirar")
  saldo: number;
  aoFechar: () => void;
  // Chamado ao confirmar. Nos cards com campo de valor, recebe o valor
  // digitado; nos demais (criar, excluir, entendi) recebe 0
  aoConfirmar: (valor: number) => void;
};

// Textos dos cards que têm campo de valor
const CARDS_COM_VALOR = {
  depositar: {
    titulo: "Depositar na reserva",
    pergunta: "Quanto deseja depositar?",
    dica: "Saldo atual",
  },
  retirar: {
    titulo: "Retirar da reserva",
    pergunta: "Quanto deseja retirar?",
    dica: "Saldo disponível",
  },
  meta: {
    titulo: "Meta da reserva",
    pergunta: "Qual valor deseja alcançar?",
    dica: "",
  },
} as const;

// Cards flutuantes da tela de Reserva de emergência (criar, depositar,
// retirar, definir meta, saldo insuficiente e excluir). Mesmo visual do
// ModalConfirmarAcao: fica por cima da tela, com o fundo escurecido.
export function ModalReserva({
  tipo,
  saldo,
  aoFechar,
  aoConfirmar,
}: Props) {
  const [valorTexto, setValorTexto] = useState("");
  const [erro, setErro] = useState("");

  // Sempre que abre outro card, o campo de valor começa limpo
  useEffect(() => {
    setValorTexto("");
    setErro("");
  }, [tipo]);

  function confirmarValor() {
    const valor = moedaParaNumero(valorTexto);

    if (valor <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }

    aoConfirmar(valor);
  }

  // Card com campo de valor (depositar, retirar ou definir meta)
  function renderCardComValor(chave: keyof typeof CARDS_COM_VALOR) {
    const { titulo, pergunta, dica } = CARDS_COM_VALOR[chave];

    return (
      <>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.pergunta}>{pergunta}</Text>

        <Input
          placeholder="0,00"
          keyboardType="numeric"
          value={valorTexto}
          onChangeText={(texto) => {
            setValorTexto(mascararMoeda(texto));
            setErro("");
          }}
          erro={erro}
          icone={<Text style={styles.prefixoMoeda}>R$</Text>}
        />

        {dica ? (
          <Text style={styles.dica}>
            {dica}: {formatarMoeda(saldo)}
          </Text>
        ) : null}

        <View style={styles.botoes}>
          <Button titulo="Confirmar" onPress={confirmarValor} />

          <Button
            titulo="Cancelar"
            variante="botaotexto"
            onPress={aoFechar}
          />
        </View>
      </>
    );
  }

  // Card centralizado, com ícone no topo (criar, saldo insuficiente, excluir)
  function renderCardComIcone(
    icone: ReactNode,
    titulo: string,
    texto: string,
    botoes: ReactNode
  ) {
    return (
      <View style={styles.centralizado}>
        <View style={styles.iconeTopo}>{icone}</View>

        <Text style={[styles.titulo, styles.tituloCentro]}>{titulo}</Text>
        <Text style={styles.texto}>{texto}</Text>

        <View style={styles.botoes}>{botoes}</View>
      </View>
    );
  }

  function renderConteudo() {
    switch (tipo) {
      case "depositar":
      case "retirar":
      case "meta":
        return renderCardComValor(tipo);

      case "criar":
        return renderCardComIcone(
          <Image
            source={require("../../../../../assets/icones/saco.png")}
            style={styles.imagemIcone}
            resizeMode="contain"
          />,
          "Crie sua reserva de emergência",
          "Guarde um valor para lidar com imprevistos sem comprometer seu orçamento.",
          <>
            <Button
              titulo="Criar reserva"
              onPress={() => aoConfirmar(0)}
            />

            <Button
              titulo="Agora não"
              variante="botaotexto"
              onPress={aoFechar}
            />
          </>
        );

      case "saldoInsuficiente":
        return renderCardComIcone(
          <TriangleAlert size={44} color={Cores.roxo.claro} />,
          "Valor maior que o saldo",
          "O valor informado é maior que o saldo disponível na sua reserva de emergência.",
          <Button titulo="Entendi" onPress={() => aoConfirmar(0)} />
        );

      case "excluir":
        return renderCardComIcone(
          <Trash2 size={44} color={Cores.roxo.claro} />,
          "Excluir reserva?",
          "Todos os dados dessa reserva serão removidos.",
          <>
            <Button
              titulo="Excluir"
              variante="perigo"
              onPress={() => aoConfirmar(0)}
            />

            <Button
              titulo="Cancelar"
              variante="botaotexto"
              onPress={aoFechar}
            />
          </>
        );

      default:
        return null;
    }
  }

  return (
    <Modal
      visible={tipo !== null}
      transparent
      animationType="fade"
      onRequestClose={aoFechar}
    >
      {/* Sobe o card quando o teclado abre (campo de valor) */}
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Fundo escurecido (mesmo do menu do +): tocar fora fecha */}
        <Pressable style={styles.fundo} onPress={aoFechar} />

        <Card
          gradiente={["rgba(73, 38, 155, 0.95)", "rgba(45, 17, 108, 0.95)"]}
          style={styles.card}
        >
          {/* Botão X no canto superior direito */}
          <Pressable
            style={styles.fechar}
            onPress={aoFechar}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <X size={22} color={Cores.texto.claro} />
          </Pressable>

          {renderConteudo()}
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  );
}