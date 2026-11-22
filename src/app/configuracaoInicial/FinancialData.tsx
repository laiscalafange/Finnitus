
import { useEffect, useState } from "react";

import {
  Text,
  View,
  Image,
  ScrollView,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";

import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { SelectCard } from "../../shared/components/SelectCard";

import { styles } from "../../styles/FinancialDataStyles";

import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";

import { useFinanceiro } from "../../features/financeiroContext";

import {
  formatarCentavos,
  mascararMoeda,
  moedaParaNumero,
} from "../../features/menuMais/utils";

import { perfilFinanceiroService } from "../../services/perfilFinanceiro";

// Limita o aumento de fonte do sistema.
const LIMITE_FONTE = 1.1;

// Converte o texto digitado em número.
function paraNumero(texto: string): number | undefined {
  return texto.trim() ? moedaParaNumero(texto) : undefined;
}

// Converte um número para o formato monetário brasileiro.
function paraTexto(valor?: number): string {
  return valor === undefined
    ? ""
    : formatarCentavos(Math.round(valor * 100));
}

type Erros = {
  fixa?: string;
  variavel?: string;
  despesas?: string;
};

export default function FinancialData() {
  const roteador = useRouter();

  const {
    rendaFixa: fixaSalva,
    rendaVariavel: variavelSalva,
    despesas: despesasSalvas,
    setRendaFixa,
    setRendaVariavel,
    setSalario,
    setDespesas,
  } = useFinanceiro();

  const [fixa, setFixa] = useState(paraTexto(fixaSalva));
  const [variavel, setVariavel] = useState(paraTexto(variavelSalva));
  const [despesas, setDespesasLocal] = useState(paraTexto(despesasSalvas));

  const [semFixa, setSemFixa] = useState(false);
  const [semVariavel, setSemVariavel] = useState(false);

  const [erros, setErros] = useState<Erros>({});
  const [salvando, setSalvando] = useState(false);

  // Atualiza os campos caso os dados sejam carregados do contexto
  // depois que a tela já tiver sido aberta.
  useEffect(() => {
    if (fixaSalva !== undefined) {
      setFixa(paraTexto(fixaSalva));
    }

    if (variavelSalva !== undefined) {
      setVariavel(paraTexto(variavelSalva));
    }

    if (despesasSalvas !== undefined) {
      setDespesasLocal(paraTexto(despesasSalvas));
    }
  }, [fixaSalva, variavelSalva, despesasSalvas]);

  function limparErro(campo: keyof Erros) {
    setErros((atual) => ({
      ...atual,
      [campo]: undefined,
    }));
  }

  // Salva os dados no backend e atualiza o contexto.
  async function salvarESeguir() {
    if (salvando) return;

    setSalvando(true);

    try {
      const valorFixa = semFixa ? null : paraNumero(fixa) ?? null;

      const valorVariavel = semVariavel
        ? null
        : paraNumero(variavel) ?? null;

      const valorDespesas = paraNumero(despesas);

      if (valorDespesas === undefined) {
        Alert.alert(
          "Atenção",
          "Informe suas despesas mensais."
        );
        return;
      }

      // Envia os dados para a API.
      // O usuário é identificado pelo token de autenticação.
      await perfilFinanceiroService.salvar({
        renda_fixa: valorFixa,
        renda_variavel: valorVariavel,
        despesas_mensais: valorDespesas,
      });

      // Calcula a renda total.
      const total = (valorFixa ?? 0) + (valorVariavel ?? 0);

      // Atualiza os dados do contexto financeiro.
      setRendaFixa(valorFixa ?? undefined);
      setRendaVariavel(valorVariavel ?? undefined);
      setSalario(total > 0 ? total : undefined);
      setDespesas(valorDespesas);

      // Avança somente depois da confirmação da API.
      roteador.push("/configuracaoInicial/FutureSavings");
    } catch (erro) {
      console.error("Erro ao salvar perfil financeiro:", erro);

      Alert.alert(
        "Não foi possível salvar",
        "Ocorreu um erro ao salvar seus dados financeiros. Verifique sua conexão e tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  }

  function continuar() {
    if (salvando) return;

    const novosErros: Erros = {};

    // Validação da renda fixa.
    if (!semFixa) {
      if (!fixa.trim()) {
        novosErros.fixa =
          "Informe sua renda fixa ou marque a opção correspondente.";
      } else if (moedaParaNumero(fixa) <= 0) {
        novosErros.fixa = "Digite um valor maior que zero.";
      }
    }

    // Validação da renda variável.
    if (!semVariavel) {
      if (!variavel.trim()) {
        novosErros.variavel =
          "Informe sua renda variável ou marque a opção correspondente.";
      } else if (moedaParaNumero(variavel) <= 0) {
        novosErros.variavel = "Digite um valor maior que zero.";
      }
    }

    // Despesas são obrigatórias, mas podem ser zero.
    if (!despesas.trim()) {
      novosErros.despesas =
        "Informe suas despesas mensais. Se não tiver, digite 0,00.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    void salvarESeguir();
  }

  const iconeSalario = (
    <Image
      source={require("../../../assets/icones/salario.png")}
      style={styles.iconeInput}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <BackgroundGradient />

      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ProgressDots total={4} atual={1} />

          <Text
            style={styles.titulo}
            maxFontSizeMultiplier={LIMITE_FONTE}
          >
            <Text style={styles.tituloDestaque}>Dados</Text> financeiros
          </Text>

          <Text
            style={styles.subtitulo}
            maxFontSizeMultiplier={LIMITE_FONTE}
          >
            Conte um pouco sobre sua situação financeira atual.
          </Text>

          {/* CAMPO DE RENDA FIXA */}
          {!semFixa && (
            <Input
              label="Renda fixa mensal"
              placeholder="0,00"
              icone={iconeSalario}
              value={fixa}
              onChangeText={(texto) => {
                setFixa(mascararMoeda(texto));
                limparErro("fixa");
              }}
              keyboardType="numeric"
              erro={erros.fixa}
            />
          )}

          <SelectCard
            label="Não tenho renda fixa"
            icon={null}
            selected={semFixa}
            onPress={() => {
              setSemFixa((atual) => !atual);
              setFixa("");
              limparErro("fixa");
            }}
          />

          {/* CAMPO DE RENDA VARIÁVEL */}
          {!semVariavel && (
            <Input
              label="Renda variável mensal"
              placeholder="0,00"
              icone={iconeSalario}
              value={variavel}
              onChangeText={(texto) => {
                setVariavel(mascararMoeda(texto));
                limparErro("variavel");
              }}
              keyboardType="numeric"
              erro={erros.variavel}
            />
          )}

          <SelectCard
            label="Não tenho renda variável"
            icon={null}
            selected={semVariavel}
            onPress={() => {
              setSemVariavel((atual) => !atual);
              setVariavel("");
              limparErro("variavel");
            }}
          />

          {/* CAMPO DE DESPESAS */}
          <Input
            label="Despesas mensais totais"
            placeholder="0,00"
            icone={
              <Image
                source={require("../../../assets/icones/despesas.png")}
                style={styles.iconeInput}
              />
            }
            value={despesas}
            onChangeText={(texto) => {
              setDespesasLocal(mascararMoeda(texto));
              limparErro("despesas");
            }}
            keyboardType="numeric"
            erro={erros.despesas}
          />

          <Text
            style={styles.subtitulo}
            maxFontSizeMultiplier={LIMITE_FONTE}
          >
            Informe seus valores mensais atuais. Você poderá atualizar
            essas informações posteriormente.
          </Text>
        </ScrollView>

        <Button
          variante="primario"
          titulo={salvando ? "Salvando..." : "Continuar"}
          onPress={continuar}
        />
      </View>
    </View>
  );
}
