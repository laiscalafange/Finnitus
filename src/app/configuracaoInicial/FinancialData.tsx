import { useState } from "react";
import { useRouter } from "expo-router";
import { Text, View, Image, ScrollView } from "react-native";
import { BackgroundGradient } from "../../shared/components/backgroundGradient";
import { Input } from "../../shared/components/Input";
import { Button } from "../../shared/components/Button";
import { styles } from "../../styles/FinancialDataStyles";
import { ProgressDots } from "../../shared/components/ProgressDots/ProgressDots";
import { AlternadorTipo } from "../../features/menuMais/components/AlternadorTipo";
import { useFinanceiro, type TipoRenda } from "../../features/financeiroContext";

// Opções do alternador "Sua renda" (reaproveita o AlternadorTipo do app)
const OPCOES_RENDA: { id: TipoRenda; rotulo: string }[] = [
  { id: "fixa", rotulo: "Renda fixa" },
  { id: "variavel", rotulo: "Variável" },
  { id: "nenhuma", rotulo: "Sem renda" },
];

// Converte o texto digitado em número. Aceita o formato brasileiro
// (1.500,50) e também 1500.50 / 1500. Devolve undefined se estiver vazio
// ou inválido.
function parseNumero(texto: string): number | undefined {
  const limpo = texto.replace(/[^0-9,.]/g, "");

  if (!limpo) {
    return undefined;
  }

  let normal = limpo;

  if (limpo.includes(",")) {
    // 1.500,50 -> ponto é milhar, vírgula é decimal
    normal = limpo.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(limpo)) {
    // 1.500 -> ponto de milhar sem centavos
    normal = limpo.replace(/\./g, "");
  }

  const valor = Number(normal);
  return Number.isFinite(valor) ? valor : undefined;
}

type Erros = {
  salario?: string;
  despesas?: string;
};

export default function DadosFinanceiros() {
  const roteador = useRouter();
  const {
    tipoRenda: tipoSalvo,
    salario: salarioSalvo,
    despesas: despesasSalvas,
    setTipoRenda,
    setSalario,
    setDespesas,
  } = useFinanceiro();

  const [tipo, setTipo] = useState<TipoRenda>(tipoSalvo ?? "fixa");
  const [salario, setSalarioLocal] = useState<string>(salarioSalvo?.toString() ?? "");
  const [despesas, setDespesasLocal] = useState<string>(despesasSalvas?.toString() ?? "");
  const [erros, setErros] = useState<Erros>({});

  // Trocar o tipo de renda limpa o erro do campo de renda
  function escolherTipo(novo: TipoRenda) {
    setTipo(novo);
    setErros((atual) => ({ ...atual, salario: undefined }));
  }

  // Validações de acordo com a opção escolhida:
  // - renda fixa: valor obrigatório (maior que zero)
  // - renda variável: valor opcional (média), mas se digitar precisa ser válido
  // - sem renda: não pede nem valida valor de renda
  // - despesas: opcional, mas se digitar precisa ser válido
  function validar(): Erros {
    const novos: Erros = {};

    if (tipo === "fixa") {
      const valor = parseNumero(salario);

      if (!salario.trim()) {
        novos.salario = "Informe sua renda mensal.";
      } else if (valor === undefined || valor <= 0) {
        novos.salario = "Digite um valor válido, maior que zero.";
      }
    }

    if (tipo === "variavel" && salario.trim()) {
      const valor = parseNumero(salario);

      if (valor === undefined || valor < 0) {
        novos.salario = "Digite um valor válido ou deixe em branco.";
      }
    }

    if (despesas.trim()) {
      const valor = parseNumero(despesas);

      if (valor === undefined || valor < 0) {
        novos.despesas = "Digite um valor válido.";
      }
    }

    return novos;
  }

  function confirmar() {
    const novos = validar();
    setErros(novos);

    if (novos.salario || novos.despesas) {
      return;
    }

    setTipoRenda(tipo);
    // Quem não tem renda não guarda valor de salário
    setSalario(tipo === "nenhuma" ? undefined : parseNumero(salario));
    setDespesas(parseNumero(despesas));
    roteador.push("/configuracaoInicial/FutureSavings");
  }

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
          <Text style={styles.titulo}>
            <Text style={styles.tituloDestaque}>Dados</Text> financeiros
          </Text>
          <Text style={styles.subtitulo}>
            Preencha seus dados financeiros para que possamos te ajudar a controlar
            melhor suas finanças.
          </Text>

          <Text style={styles.rotulo}>Sua renda</Text>
          <AlternadorTipo<TipoRenda>
            valor={tipo}
            aoMudar={escolherTipo}
            opcoes={OPCOES_RENDA}
          />

          {tipo === "fixa" && (
            <Input
              label="Salário / renda fixa"
              placeholder="Qual sua renda mensal?"
              icone={<Image source={require("../../../assets/icones/salario.png")} style={styles.iconeInput} />}
              value={salario}
              onChangeText={(texto) => {
                setSalarioLocal(texto);
                setErros((atual) => ({ ...atual, salario: undefined }));
              }}
              keyboardType="numeric"
              erro={erros.salario}
            />
          )}

          {tipo === "variavel" && (
            <Input
              label="Renda média mensal"
              placeholder="Média dos últimos meses (opcional)"
              icone={<Image source={require("../../../assets/icones/salario.png")} style={styles.iconeInput} />}
              value={salario}
              onChangeText={(texto) => {
                setSalarioLocal(texto);
                setErros((atual) => ({ ...atual, salario: undefined }));
              }}
              keyboardType="numeric"
              erro={erros.salario}
            />
          )}

          {tipo === "nenhuma" && (
            <Text style={styles.aviso}>
              Sem problema! Você pode registrar entradas de dinheiro quando elas
              acontecerem.
            </Text>
          )}

          <Input
            label="Despesas"
            placeholder="Quais suas despesas mensais?"
            icone={<Image source={require("../../../assets/icones/despesas.png")} style={styles.iconeInput} />}
            value={despesas}
            onChangeText={(texto) => {
              setDespesasLocal(texto);
              setErros((atual) => ({ ...atual, despesas: undefined }));
            }}
            keyboardType="numeric"
            erro={erros.despesas}
          />
        </ScrollView>
        <Button variante="primario" titulo="Confirmar" onPress={confirmar} />
      </View>
    </View>
  );
}