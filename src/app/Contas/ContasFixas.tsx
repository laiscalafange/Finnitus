import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Cores } from "../../shared/constants/Cores";
import { Rotas } from "../../shared/constants/Rotas";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { styles as form } from "@/features/menuMais/styles/formulario";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  competenciaAtual,
  contasFixasDoMes,
  estaAberta,
  type Competencia,
  type ContaDoMes,
} from "@/features/contas/contasData";
import { CardConta, SeletorMes } from "@/features/contas/components/ContaUI";
import { styles } from "@/features/contas/styles";

type Filtro = "todas" | "gasto" | "entrada";

const OPCOES: { id: Filtro; rotulo: string; cor?: string }[] = [
  { id: "todas", rotulo: "Todas" },
  { id: "gasto", rotulo: "Despesas", cor: Cores.estado.alerta },
  { id: "entrada", rotulo: "Receitas" },
];

// Tela "Contas fixas": as despesas e receitas que se repetem todo mês, com
// o status de cada uma. Aberta pelo "Ver todas" de Despesas fixas da Home.
export default function ContasFixas() {
  const router = useRouter();
  const { transacoes, baixas } = useFinanceiro();

  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [competencia, setCompetencia] = useState<Competencia>(competenciaAtual());

  const contas = useMemo(
    () =>
      contasFixasDoMes(transacoes, baixas, competencia).filter(
        (conta) => filtro === "todas" || conta.tipo === filtro,
      ),
    [transacoes, baixas, competencia, filtro],
  );

  const abertas = contas.filter(estaAberta);
  const registradas = contas.filter((conta) => !estaAberta(conta));

  function abrir(conta: ContaDoMes) {
    router.push({
      pathname: Rotas.detalhesConta,
      params: { id: conta.transacaoId, competencia: conta.competencia },
    });
  }

  return (
    <View style={form.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={form.conteudo}>
        <HeaderInterno titulo="Contas fixas" />

        <View style={form.formulario}>
          <AlternadorTipo<Filtro> valor={filtro} aoMudar={setFiltro} opcoes={OPCOES} />

          <SeletorMes competencia={competencia} aoMudar={setCompetencia} />

          {contas.length === 0 ? (
            <Text style={styles.vazio}>
              Nenhuma conta fixa neste mês. Para criar uma, registre um gasto ou entrada com
              “Repetir mensalmente” ligado em Nova transação.
            </Text>
          ) : null}

          {abertas.length > 0 ? (
            <>
              <Text style={styles.secaoTitulo}>Próximas contas</Text>
              {abertas.map((conta) => (
                <CardConta
                  key={`${conta.transacaoId}-${conta.competencia}`}
                  conta={conta}
                  aoPress={() => abrir(conta)}
                />
              ))}
            </>
          ) : null}

          {registradas.length > 0 ? (
            <>
              <Text style={styles.secaoTitulo}>Já registradas</Text>
              {registradas.map((conta) => (
                <CardConta
                  key={`${conta.transacaoId}-${conta.competencia}`}
                  conta={conta}
                  aoPress={() => abrir(conta)}
                />
              ))}
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}