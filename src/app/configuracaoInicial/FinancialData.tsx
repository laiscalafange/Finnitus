import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { BackHandler, Text, View, Image, ScrollView } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { Card } from "../../shared/components/Cards";
import { SelectCard } from "../../shared/components/SelectCard";
import { styles } from "../../styles/FinancialDataStyles";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";
import { useFinanceiro } from "../../features/financeiroContext";
import {
  formatarCentavos,
  mascararMoeda,
  moedaParaNumero,
} from "../../features/menuMais/utils";

// Limite do aumento de fonte do sistema (evita o texto passar do campo)
const LIMITE_FONTE = 1.1;

// Gradiente suave do card (mesmo tom dos cards roxos do app)
const GRADIENTE_CARD: [string, string] = [
  "rgba(72, 34, 135, 0.55)",
  "rgba(48, 9, 110, 0.40)",
];

// A tela tem 3 etapas:
// - "fixa": renda fixa (com o check "Não tenho renda fixa")
// - "variavel": renda variável (com o check "Não tenho renda variável") + despesas
// - "semRenda": só aparece para quem não tem nenhuma das duas rendas
type Etapa = "fixa" | "variavel" | "semRenda";

// Os campos de dinheiro usam a mesma máscara do resto do app: a pessoa
// digita só números e os centavos vão se formando (150 -> 1,50).
function paraNumero(texto: string): number | undefined {
  return texto.trim() ? moedaParaNumero(texto) : undefined;
}

// Número salvo -> texto mascarado do campo (1234.5 -> "1.234,50")
function paraTexto(valor?: number): string {
  return valor === undefined ? "" : formatarCentavos(Math.round(valor * 100));
}

// Devolve a mensagem de erro de um campo (ou undefined se estiver ok).
// Campo obrigatório precisa ser maior que zero; opcional pode ficar vazio.
function erroValor(texto: string, obrigatorio: boolean, msgVazio: string) {
  if (!texto.trim()) {
    return obrigatorio ? msgVazio : undefined;
  }

  if (obrigatorio && moedaParaNumero(texto) <= 0) {
    return "Digite um valor maior que zero.";
  }

  return undefined;
}

type Erros = {
  fixa?: string;
  variavel?: string;
  media?: string;
  despesas?: string;
};

export default function DadosFinanceiros() {
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

  const [etapa, setEtapa] = useState<Etapa>("fixa");

  const [fixa, setFixa] = useState<string>(paraTexto(fixaSalva));
  const [variavel, setVariavel] = useState<string>(paraTexto(variavelSalva));
  // Dinheiro que entra em média, na etapa "semRenda"
  const [media, setMedia] = useState<string>("");
  const [despesas, setDespesasLocal] = useState<string>(paraTexto(despesasSalvas));

  // Checks "Não tenho renda fixa" / "Não tenho renda variável"
  const [semFixa, setSemFixa] = useState(false);
  const [semVariavel, setSemVariavel] = useState(false);

  const [erros, setErros] = useState<Erros>({});

  // Botão voltar do Android volta de etapa em vez de sair da tela
  useEffect(() => {
    const ouvinte = BackHandler.addEventListener("hardwareBackPress", () => {
      if (etapa === "semRenda") {
        setErros({});
        setEtapa("variavel");
        return true;
      }

      if (etapa === "variavel") {
        setErros({});
        setEtapa("fixa");
        return true;
      }

      return false;
    });

    return () => ouvinte.remove();
  }, [etapa]);

  function limparErro(campo: keyof Erros) {
    setErros((atual) => ({ ...atual, [campo]: undefined }));
  }

  // Salva tudo e segue o fluxo. "salario" é o total que o app usa nos cálculos.
  function salvarESeguir(valorFixa?: number, valorVariavel?: number) {
    const total = (valorFixa ?? 0) + (valorVariavel ?? 0);

    setRendaFixa(valorFixa);
    setRendaVariavel(valorVariavel);
    setSalario(total > 0 ? total : undefined);
    setDespesas(paraNumero(despesas));
    roteador.push("/configuracaoInicial/FutureSavings");
  }

  // Etapa 1: renda fixa
  function continuarFixa() {
    if (!semFixa) {
      const erro = erroValor(fixa, true, "Informe sua renda fixa mensal.");

      if (erro) {
        setErros({ fixa: erro });
        return;
      }
    }

    setErros({});
    setEtapa("variavel");
  }

  // Etapa 2: renda variável + despesas
  function continuarVariavel() {
    const novos: Erros = {
      variavel: semVariavel
        ? undefined
        : erroValor(variavel, true, "Informe sua renda variável média."),
      despesas: erroValor(despesas, false, ""),
    };

    if (novos.variavel || novos.despesas) {
      setErros(novos);
      return;
    }

    setErros({});

    // Sem renda fixa e sem renda variável: vai para a etapa "sem renda"
    if (semFixa && semVariavel) {
      setEtapa("semRenda");
      return;
    }

    salvarESeguir(
      semFixa ? undefined : paraNumero(fixa),
      semVariavel ? undefined : paraNumero(variavel),
    );
  }

  // Etapa 3: sem renda (a média recebida e as despesas são opcionais)
  function confirmarSemRenda() {
    const novos: Erros = {
      media: erroValor(media, false, ""),
      despesas: erroValor(despesas, false, ""),
    };

    if (novos.media || novos.despesas) {
      setErros(novos);
      return;
    }

    salvarESeguir(undefined, paraNumero(media));
  }

  // "Entrar sem dados financeiros": segue sem guardar nenhum valor
  function entrarSemDados() {
    setRendaFixa(undefined);
    setRendaVariavel(undefined);
    setSalario(undefined);
    setDespesas(undefined);
    roteador.push("/configuracaoInicial/FutureSavings");
  }

  const iconeSalario = (
    <Image source={require("../../../assets/icones/salario.png")} style={styles.iconeInput} />
  );

  const campoDespesas = (
    <Input
      label="Despesas"
      placeholder="0,00"
      icone={<Image source={require("../../../assets/icones/despesas.png")} style={styles.iconeInput} />}
      value={despesas}
      onChangeText={(texto) => {
        setDespesasLocal(mascararMoeda(texto));
        limparErro("despesas");
      }}
      keyboardType="numeric"
      erro={erros.despesas}
    />
  );

  const subtitulo =
    etapa === "fixa"
      ? "Qual é a sua renda fixa? Por exemplo, o salário que cai todo mês."
      : etapa === "variavel"
        ? "E a sua renda variável? Por exemplo, bicos, comissões ou freelas."
        : "Tudo bem! Conte quanto dinheiro costuma entrar, se quiser.";

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
          <Text style={styles.titulo} maxFontSizeMultiplier={LIMITE_FONTE}>
            <Text style={styles.tituloDestaque}>Dados</Text> financeiros
          </Text>
          <Text style={styles.subtitulo} maxFontSizeMultiplier={LIMITE_FONTE}>{subtitulo}</Text>

          {/* ETAPA 1: RENDA FIXA */}
          {etapa === "fixa" && (
            <>
              {!semFixa && (
                <Input
                  label="Salário / renda fixa"
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
                  limparErro("fixa");
                }}
              />
            </>
          )}

          {/* ETAPA 2: RENDA VARIÁVEL + DESPESAS */}
          {etapa === "variavel" && (
            <>
              {!semVariavel && (
                <Input
                  label="Renda variável"
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
                  limparErro("variavel");
                }}
              />

              {campoDespesas}
            </>
          )}

          {/* ETAPA 3: SEM RENDA FIXA NEM VARIÁVEL */}
          {etapa === "semRenda" && (
            <>
              <Card gradiente={GRADIENTE_CARD} style={styles.cardRenda}>
                <Text style={styles.cardTitulo} maxFontSizeMultiplier={LIMITE_FONTE}>
                  Quanto dinheiro você recebe em média?
                </Text>
                <Text style={styles.cardAjuda} maxFontSizeMultiplier={LIMITE_FONTE}>
                  Mesada, ajuda da família, bicos... valor por mês (opcional).
                </Text>
                <Input
                  placeholder="0,00"
                  icone={iconeSalario}
                  value={media}
                  onChangeText={(texto) => {
                    setMedia(mascararMoeda(texto));
                    limparErro("media");
                  }}
                  keyboardType="numeric"
                  erro={erros.media}
                />
              </Card>

              {campoDespesas}
            </>
          )}
        </ScrollView>

        {etapa === "fixa" && (
          <Button variante="primario" titulo="Continuar" onPress={continuarFixa} />
        )}

        {etapa === "variavel" && (
          <Button
            variante="primario"
            titulo={semFixa && semVariavel ? "Continuar" : "Confirmar"}
            onPress={continuarVariavel}
          />
        )}

        {etapa === "semRenda" && (
          <>
            <Button variante="primario" titulo="Confirmar" onPress={confirmarSemRenda} />
            <Button
              variante="botaotexto"
              titulo="Entrar sem dados financeiros"
              onPress={entrarSemDados}
            />
          </>
        )}
      </View>
    </View>
  );
}