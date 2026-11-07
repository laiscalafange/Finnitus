
import { useState } from "react";

import {
  Text,
  View,
  Image,
  ScrollView,
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
import { Alert } from "react-native";
import { perfilFinanceiroService } from "../../services/perfilFinanceiro";

// Limita o aumento de fonte do sistema para evitar
// que os textos ultrapassem os campos.
const LIMITE_FONTE = 1.1;

// Converte o texto digitado em número.
// Se o campo estiver vazio, retorna undefined.
function paraNumero(texto: string): number | undefined {
  return texto.trim() ? moedaParaNumero(texto) : undefined;
}

// Converte um valor numérico para o formato monetário brasileiro.
function paraTexto(valor?: number): string {
  return valor === undefined
    ? ""
    : formatarCentavos(Math.round(valor * 100));
}

// Valida os campos financeiros.
type Erros = {
  fixa?: string;
  variavel?: string;
  despesas?: string;
};

export default function FinancialData() {
  const roteador = useRouter();

  // Recupera os dados financeiros armazenados no contexto.
  const {
    rendaFixa: fixaSalva,
    rendaVariavel: variavelSalva,
    despesas: despesasSalvas,
    setRendaFixa,
    setRendaVariavel,
    setSalario,
    setDespesas,
  } = useFinanceiro();

  // Valores dos campos.
  const [fixa, setFixa] = useState(paraTexto(fixaSalva));
  const [variavel, setVariavel] = useState(paraTexto(variavelSalva));
  const [despesas, setDespesasLocal] = useState(paraTexto(despesasSalvas));

  // Opções para quem não possui renda fixa ou variável.
  const [semFixa, setSemFixa] = useState(false);
  const [semVariavel, setSemVariavel] = useState(false);

  // Mensagens de validação.
  const [erros, setErros] = useState<Erros>({});

  // Limpa o erro de um campo quando ele é alterado.
  function limparErro(campo: keyof Erros) {
    setErros((atual) => ({
      ...atual,
      [campo]: undefined,
    }));
  }

  // Salva os dados no contexto financeiro e avança para a próxima tela.
  // Salva os dados no banco, atualiza o contexto e avança.
async function salvarESeguir() {
  try {
    // Converte os valores digitados para números.
    const valorFixa = semFixa ? null : paraNumero(fixa) ?? null;

    const valorVariavel = semVariavel
      ? null
      : paraNumero(variavel) ?? null;

    const valorDespesas = paraNumero(despesas);

    // Envia os dados para o backend.
    // O usuário será identificado pelo token de autenticação.
    await perfilFinanceiroService.salvar({
      renda_fixa: valorFixa,
      renda_variavel: valorVariavel,
      despesas_mensais: valorDespesas ?? 0,
    });

    // Calcula a renda total para utilizar no contexto.
    const total = (valorFixa ?? 0) + (valorVariavel ?? 0);

    // Atualiza o contexto financeiro do aplicativo.
    setRendaFixa(valorFixa ?? undefined);
    setRendaVariavel(valorVariavel ?? undefined);
    setSalario(total > 0 ? total : undefined);
    setDespesas(valorDespesas);

    // Só avança depois que o banco confirmar o salvamento.
    roteador.push("/configuracaoInicial/FutureSavings");

  } catch (erro) {
    // Informa o usuário caso a API não consiga salvar os dados.
    console.error("Erro ao salvar perfil financeiro:", erro);

    Alert.alert(
      "Não foi possível salvar",
      "Ocorreu um erro ao salvar seus dados financeiros. Verifique sua conexão e tente novamente."
    );
  }
}

  // Valida os campos antes de permitir o avanço.
  function continuar() {
    const novosErros: Erros = {};

    // Renda fixa: obrigatória se a pessoa não marcar que não possui.
    if (!semFixa) {
      if (!fixa.trim()) {
        novosErros.fixa = "Informe sua renda fixa ou marque a opção correspondente.";
      } else if (moedaParaNumero(fixa) <= 0) {
        novosErros.fixa = "Digite um valor maior que zero.";
      }
    }

    // Renda variável: obrigatória se a pessoa não marcar que não possui.
    if (!semVariavel) {
      if (!variavel.trim()) {
        novosErros.variavel = "Informe sua renda variável ou marque a opção correspondente.";
      } else if (moedaParaNumero(variavel) <= 0) {
        novosErros.variavel = "Digite um valor maior que zero.";
      }
    }

    // Despesas: o usuário precisa informar o valor.
    // Caso não tenha despesas, pode informar 0,00.
    if (!despesas.trim()) {
      novosErros.despesas = "Informe suas despesas mensais. Se não tiver, digite 0,00.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    void salvarESeguir();
  }

  // Ícone utilizado nos campos de renda.
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
          {/* Indica que esta é a primeira etapa do onboarding. */}
          <ProgressDots total={4} atual={1} />

          {/* Título da tela. */}
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

          {/* Explicação sobre os valores solicitados. */}
          <Text
            style={styles.subtitulo}
            maxFontSizeMultiplier={LIMITE_FONTE}
          >
            Informe seus valores mensais atuais. Você poderá atualizar
            essas informações posteriormente.
          </Text>
        </ScrollView>

        {/* Botão para validar os dados e avançar. */}
        <Button
          variante="primario"
          titulo="Continuar"
          onPress={continuar}
        />
      </View>
    </View>
  );
}
