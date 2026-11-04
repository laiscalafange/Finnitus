
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { SeletorCategoria } from "@/features/menuMais/components/SeletorCategoria";
import {
  CATEGORIAS_ENTRADA,
  CATEGORIAS_GASTO,
} from "@/features/menuMais/constants";
import { useFinanceiro } from "@/features/financeiroContext";
import { useVoltar } from "@/features/menuMais/useVoltar";
import {
  dataValida,
  hojeFormatado,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "@/features/menuMais/utils";
import type { TipoTransacao } from "@/features/menuMais/types";
import { styles } from "@/features/menuMais/styles/formulario";

export default function NovoGasto() {
  const voltar = useVoltar();
  const { adicionarTransacao } = useFinanceiro();

  const [tipo, setTipo] = useState<TipoTransacao>("gasto");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState<string | null>(
    null
  );
  const [data, setData] = useState(hojeFormatado());
  const [descricao, setDescricao] = useState("");
  const [repetir, setRepetir] = useState(false);
  const [erro, setErro] = useState("");

  const categorias =
    tipo === "gasto"
      ? CATEGORIAS_GASTO
      : CATEGORIAS_ENTRADA;

  function mudarTipo(novo: TipoTransacao) {
    setTipo(novo);
    setCategoria(null);
    setErro("");
  }

  function salvar() {
    if (moedaParaNumero(valor) <= 0) {
      setErro("Informe o valor da transação.");
      return;
    }

    if (!categoria) {
      setErro("Escolha uma categoria.");
      return;
    }

    if (!dataValida(data)) {
      setErro("Informe uma data válida (DD/MM/AAAA).");
      return;
    }

    setErro("");

    adicionarTransacao({
      tipo,
      valor: moedaParaNumero(valor),
      categoriaId: categoria,
      data,
      descricao: descricao.trim() || undefined,
      repetirMensalmente: repetir,
    });

    voltar();
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient variante="funcional" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === "ios" ? "padding" : "height"
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.conteudo}
        >
          <HeaderInterno titulo="Nova transação" />

          <View style={styles.formulario}>
            <AlternadorTipo
              valor={tipo}
              aoMudar={mudarTipo}
            />

            <Input
              label="Valor"
              placeholder="0,00"
              keyboardType="numeric"
              value={valor}
              onChangeText={(texto) =>
                setValor(mascararMoeda(texto))
              }
              icone={
                <Text style={styles.prefixoMoeda}>
                  R$
                </Text>
              }
            />

            <SeletorCategoria
              categorias={categorias}
              selecionada={categoria}
              aoSelecionar={setCategoria}
            />

            <Input
              label="Data"
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              value={data}
              onChangeText={(texto) =>
                setData(mascararData(texto))
              }
            />

            <Input
              label="Descrição (opcional)"
              placeholder="Ex: Almoço em família"
              value={descricao}
              onChangeText={setDescricao}
              autoCapitalize="sentences"
              maxLength={120}
            />

            <View style={styles.linhaSwitch}>
              <Text style={styles.textoSwitch}>
                Repetir mensalmente
              </Text>

              <Switch
                value={repetir}
                onValueChange={setRepetir}
                trackColor={{
                  false: Cores.overlay.forte,
                  true: Cores.roxo.claro,
                }}
                thumbColor={
                  repetir
                    ? Cores.destaque.limao
                    : Cores.texto.claro
                }
              />
            </View>

            {erro ? (
              <Text
                style={styles.erro}
                accessibilityRole="alert"
              >
                {erro}
              </Text>
            ) : null}

            <View style={styles.linhaBotoes}>
              <View style={styles.colunaBotao}>
                <Button
                  titulo="Cancelar"
                  variante="outline"
                  onPress={voltar}
                />
              </View>

              <View style={styles.colunaBotao}>
                <Button
                  titulo="Salvar transação"
                  onPress={salvar}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
