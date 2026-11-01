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

import { Ban, Trash2, TriangleAlert, X } from "lucide-react-native";

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
  // Saldo atual (mostrado em "Depositar", "Retirar" e "Movimentar")
  saldo: number;
  aoFechar: () => void;
  // Chamado ao confirmar. Nos cards com campo de valor, recebe o valor
  // digitado (e, no card "movimentar", qual botão foi tocado); nos demais
  // (criar, excluir, entendi) recebe 0
  aoConfirmar: (valor: number, acao?: "depositar" | "retirar") => void;
  // O que está sendo movimentado: muda os textos dos cards. Padrão: reserva
  alvo?: "reserva" | "meta";
  // Título do card "movimentar" (nome da meta)
  titulo?: string;
  // Se vier, o card "movimentar" mostra o botão "Ver detalhes"
  aoVerDetalhes?: () => void;
  erroServidor?: string;
  processando?: boolean;
};

// Textos que mudam entre a reserva de emergência e as metas
const TEXTOS = {
  reserva: {
    depositar: "Depositar na reserva",
    retirar: "Retirar da reserva",
    dicaDepositar: "Saldo atual",
    dicaRetirar: "Saldo disponível",
    insuficienteTitulo: "Valor maior que o saldo",
    insuficienteTexto:
      "O valor informado é maior que o saldo disponível na sua reserva de emergência.",
    excluirTitulo: "Excluir reserva?",
    excluirTexto: "Todos os dados dessa reserva serão removidos.",
  },
  meta: {
    depositar: "Depositar na meta",
    retirar: "Retirar da meta",
    dicaDepositar: "Guardado até agora",
    dicaRetirar: "Disponível para retirar",
    insuficienteTitulo: "Valor maior que o guardado",
    insuficienteTexto:
      "O valor informado é maior que o valor guardado nessa meta.",
    excluirTitulo: "Excluir meta?",
    excluirTexto: "Todos os dados dessa meta serão removidos.",
  },
} as const;

// Cards flutuantes usados na Reserva de emergência e nas Metas (criar,
// depositar, retirar, movimentar, definir meta, saldo insuficiente, excluir e
// cancelar). Mesmo visual do ModalConfirmarAcao: fica por cima da tela, com o
// fundo escurecido.
export function ModalReserva({
  tipo,
  saldo,
  aoFechar,
  aoConfirmar,
  alvo = "reserva",
  titulo,
  aoVerDetalhes,
  erroServidor,
  processando = false,
}: Props) {
  const textos = TEXTOS[alvo];

  // Nas metas os botões do card são compactos (a Reserva de emergência segue
  // com os botões de sempre)
  const compacto = alvo === "meta";
  const tamanho = compacto ? "compacto" : "padrao";

  const [valorTexto, setValorTexto] = useState("");
  const [erro, setErro] = useState("");

  // Sempre que abre outro card, o campo de valor começa limpo
  useEffect(() => {
    setValorTexto("");
    setErro("");
  }, [tipo]);

  function confirmarValor(acao?: "depositar" | "retirar") {
    const valor = moedaParaNumero(valorTexto);

    if (valor <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }

    aoConfirmar(valor, acao);
  }

  // Campo de valor com o "R$" (igual em todos os cards que pedem valor)
  function renderCampoValor() {
    return (
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
    );
  }

  // Card com campo de valor (depositar, retirar ou definir meta da reserva)
  function renderCardComValor(chave: "depositar" | "retirar" | "meta") {
    const card =
      chave === "meta"
        ? {
            titulo: "Meta da reserva",
            pergunta: "Qual valor deseja alcançar?",
            dica: "",
          }
        : {
            titulo: textos[chave],
            pergunta:
              chave === "depositar"
                ? "Quanto deseja depositar?"
                : "Quanto deseja retirar?",
            dica:
              chave === "depositar"
                ? textos.dicaDepositar
                : textos.dicaRetirar,
          };

    return (
      <>
        <Text style={styles.titulo}>{card.titulo}</Text>
        <Text style={styles.pergunta}>{card.pergunta}</Text>

        {renderCampoValor()}

        {card.dica ? (
          <Text style={styles.dica}>
            {card.dica}: {formatarMoeda(saldo)}
          </Text>
        ) : null}

        <View style={[styles.botoes, compacto && styles.botoesCompactos]}>
          <Button
            tamanho={tamanho}
            titulo="Confirmar"
            onPress={() => confirmarValor()}
          />

          <Button
            tamanho={tamanho}
            titulo="Cancelar"
            variante="botaotexto"
            onPress={aoFechar}
          />
        </View>
      </>
    );
  }

  // Card com um campo de valor e dois botões: "Depositar" e "Retirar"
  // (tela Metas, ao tocar numa meta do mês)
  function renderCardMovimentar() {
    return (
      <>
        <Text style={styles.titulo}>{titulo ?? "Movimentar"}</Text>
        <Text style={styles.pergunta}>Quanto deseja movimentar?</Text>

        {renderCampoValor()}

        <Text style={styles.dica}>
          {textos.dicaDepositar}: {formatarMoeda(saldo)}
        </Text>

        <View style={[styles.botoes, compacto && styles.botoesCompactos]}>
          {/* Depositar | Retirar, lado a lado */}
          <View style={styles.linhaBotoes}>
            <View style={styles.colunaBotao}>
              <Button
                tamanho={tamanho}
                titulo="Depositar"
                onPress={() => confirmarValor("depositar")}
              />
            </View>

            <View style={styles.colunaBotao}>
              <Button
                tamanho={tamanho}
                titulo="Retirar"
                variante="outline"
                onPress={() => confirmarValor("retirar")}
              />
            </View>
          </View>

          {aoVerDetalhes ? (
            <Button
            tamanho={tamanho}
              titulo="Ver detalhes"
              variante="botaotexto"
              onPress={aoVerDetalhes}
            />
          ) : null}
        </View>
      </>
    );
  }

  // Card centralizado, com ícone no topo (criar, saldo insuficiente, excluir)
  function renderCardComIcone(
    icone: ReactNode,
    tituloCard: string,
    texto: string,
    botoes: ReactNode
  ) {
    return (
      <View style={styles.centralizado}>
        <View style={styles.iconeTopo}>{icone}</View>

        <Text style={[styles.titulo, styles.tituloCentro]}>{tituloCard}</Text>
        <Text style={styles.texto}>{texto}</Text>

        <View style={[styles.botoes, compacto && styles.botoesCompactos]}>{botoes}</View>
      </View>
    );
  }

  function renderConteudo() {
    switch (tipo) {
      case "depositar":
      case "retirar":
      case "meta":
        return renderCardComValor(tipo);

      case "movimentar":
        return renderCardMovimentar();

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
            tamanho={tamanho}
              titulo="Criar reserva"
              onPress={() => aoConfirmar(0)}
            />

            <Button
            tamanho={tamanho}
              titulo="Agora não"
              variante="botaotexto"
              onPress={aoFechar}
            />
          </>
        );

      case "saldoInsuficiente":
        return renderCardComIcone(
          <TriangleAlert size={44} color={Cores.roxo.claro} />,
          textos.insuficienteTitulo,
          textos.insuficienteTexto,
          <Button
            tamanho={tamanho}
            titulo="Entendi"
            onPress={() => aoConfirmar(0)}
          />
        );

      case "excluir":
        return renderCardComIcone(
          <Trash2 size={44} color={Cores.roxo.claro} />,
          textos.excluirTitulo,
          textos.excluirTexto,
          <>
            <Button
            tamanho={tamanho}
              titulo="Excluir"
              variante="perigo"
              onPress={() => aoConfirmar(0)}
            />

            <Button
            tamanho={tamanho}
              titulo="Cancelar"
              variante="botaotexto"
              onPress={aoFechar}
            />
          </>
        );

      case "cancelar":
        return renderCardComIcone(
          <Ban size={44} color={Cores.roxo.claro} />,
          "Cancelar meta?",
          "A meta vai para o Histórico como cancelada. O valor guardado não é apagado.",
          <>
            <Button
            tamanho={tamanho}
              titulo="Cancelar meta"
              variante="perigo"
              onPress={() => aoConfirmar(0)}
            />

            <Button
            tamanho={tamanho}
              titulo="Voltar"
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
          {erroServidor ? (
            <Text accessibilityRole="alert" style={{ color: '#FFDFDF', paddingTop: 8 }}>
              {erroServidor}
            </Text>
          ) : null}
          {processando ? <Text style={{ color: '#FFFFFF' }}>Processando...</Text> : null}
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  );
}