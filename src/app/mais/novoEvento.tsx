
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";

import {
  dataValida,
  mascararData,
  mascararMoeda,
  moedaParaNumero,
} from "@/features/menuMais/utils";

import { styles } from "@/features/menuMais/styles/formulario";

import {
  cadastrarEvento,
} from "@/features/calendar/services/eventosService";

import {
  agendarLembreteEvento,
} from "@/features/calendar/services/notificacoesEventos";

function mascararHorario(texto: string): string {
  const numeros = texto.replace(/\D/g, "").slice(0, 4);

  if (numeros.length <= 2) {
    return numeros;
  }

  return `${numeros.slice(0, 2)}:${numeros.slice(2)}`;
}

function criarDataLocal(
  data: string,
  horario: string
): Date | null {
  const [dia, mes, ano] = data.split("/").map(Number);
  const [hora, minuto] = horario.split(":").map(Number);

  if (
    !Number.isInteger(dia) ||
    !Number.isInteger(mes) ||
    !Number.isInteger(ano) ||
    !Number.isInteger(hora) ||
    !Number.isInteger(minuto) ||
    hora < 0 ||
    hora > 23 ||
    minuto < 0 ||
    minuto > 59
  ) {
    return null;
  }

  const resultado = new Date(
    ano,
    mes - 1,
    dia,
    hora,
    minuto,
    0
  );

  if (
    resultado.getFullYear() !== ano ||
    resultado.getMonth() !== mes - 1 ||
    resultado.getDate() !== dia ||
    resultado.getHours() !== hora ||
    resultado.getMinutes() !== minuto
  ) {
    return null;
  }

  return resultado;
}

export default function NovoEvento() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [horario, setHorario] = useState("09:00");
  const [diaInteiro, setDiaInteiro] = useState(false);

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function criar() {
    if (salvando) return;

    setErro("");

    if (!nome.trim()) {
      setErro("Informe o nome do evento.");
      return;
    }

    if (!dataValida(dataEvento)) {
      setErro("Informe uma data válida (DD/MM/AAAA).");
      return;
    }

    const dataInicio = criarDataLocal(
      dataEvento,
      diaInteiro ? "00:00" : horario
    );

    if (!dataInicio) {
      setErro("Informe uma data e um horário válidos.");
      return;
    }

    const agora = new Date();

    if (diaInteiro) {
      const hoje = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate()
      );

      if (dataInicio < hoje) {
        setErro("A data do evento não pode estar no passado.");
        return;
      }
    } else if (dataInicio <= agora) {
      setErro("A data e o horário devem estar no futuro.");
      return;
    }

    const valorNumerico = valor.trim()
      ? moedaParaNumero(valor)
      : undefined;

    if (
      valorNumerico !== undefined &&
      (!Number.isFinite(valorNumerico) ||
        valorNumerico < 0)
    ) {
      setErro("Informe um valor válido.");
      return;
    }

    // Eventos com horário duram uma hora por padrão.
    // Eventos de dia inteiro terminam no início
    // do dia seguinte.
    const dataFim = new Date(
      dataInicio.getTime() +
        (diaInteiro ? 24 : 1) * 60 * 60 * 1000
    );

    setSalvando(true);

    try {
      // 1. Salva no banco do Finnitus.
      const evento = await cadastrarEvento({
        Enome: nome.trim(),
        Edescricao: descricao.trim() || undefined,
        data_inicio: dataInicio.toISOString(),
        data_fim: dataFim.toISOString(),
        dia_inteiro: diaInteiro,
        tipo: "OUTRO",
        valor_relacionado: valorNumerico,
      });

      // 2. Agenda uma notificação no dispositivo.
      // Uma falha no alerta não desfaz o cadastro.
      try {
        await agendarLembreteEvento({
          eventoId: evento.id_Evento,
          nome: nome.trim(),
          dataInicio,
          diaInteiro,
        });
      } catch (erroNotificacao) {
        console.warn(
          "Evento salvo, mas o lembrete não foi agendado:",
          erroNotificacao
        );
      }

      // 3. Volta ao calendário.
      router.dismissTo("/calendario");
    } catch (error: any) {
      console.error("Erro ao cadastrar evento:", error);

      const mensagem =
        typeof error?.response?.data?.mensagem === "string"
          ? error.response.data.mensagem
          : "Não foi possível salvar o evento. Verifique a conexão e tente novamente.";

      setErro(mensagem);

      Alert.alert("Erro ao criar evento", mensagem);
    } finally {
      setSalvando(false);
    }
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
          <HeaderInterno titulo="Novo evento" />

          <View style={styles.formulario}>
            <Input
              label="Nome do evento"
              placeholder="Ex: Viagem de fim de ano"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="sentences"
              maxLength={60}
            />

            <Input
              label="Descrição (opcional)"
              placeholder="Detalhes do evento"
              value={descricao}
              onChangeText={setDescricao}
              autoCapitalize="sentences"
              maxLength={200}
            />

            <Input
              label="Valor relacionado (opcional)"
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

            <Input
              label="Data do evento"
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              value={dataEvento}
              onChangeText={(texto) =>
                setDataEvento(mascararData(texto))
              }
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 12,
              }}
            >
              <Text
                style={{
                  color: "#B9FF00",
                  fontSize: 17,
                  fontWeight: "600",
                }}
              >
                Evento de dia inteiro
              </Text>

              <Switch
                value={diaInteiro}
                onValueChange={setDiaInteiro}
                trackColor={{
                  false: "#5E467E",
                  true: "#7F3BED",
                }}
                thumbColor={
                  diaInteiro ? "#B9FF00" : "#FFFFFF"
                }
              />
            </View>

            {!diaInteiro && (
              <Input
                label="Horário do evento"
                placeholder="HH:MM"
                keyboardType="numeric"
                maxLength={5}
                value={horario}
                onChangeText={(texto) =>
                  setHorario(mascararHorario(texto))
                }
              />
            )}

            <Text
              style={{
                color: "#BDA1E9",
                fontSize: 13,
                marginVertical: 12,
              }}
            >
              O Finnitus tentará enviar um lembrete
              antes do evento.
            </Text>

            {erro ? (
              <Text
                style={styles.erro}
                accessibilityRole="alert"
              >
                {erro}
              </Text>
            ) : null}

            <Button
              titulo={
                salvando
                  ? "Salvando evento..."
                  : "Criar evento"
              }
              onPress={criar}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
