import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Trash2 } from "lucide-react-native";

import { HeaderInterno } from "../../shared/components/Header";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";
import { Rotas } from "../../shared/constants/Rotas";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { styles as form } from "@/features/menuMais/styles/formulario";
import { styles as modal } from "@/features/menuMais/components/ModalReserva/styles";
import { formatarMoeda } from "@/features/menuMais/utils";
import { useFinanceiro } from "@/features/financeiroContext";
import { obterResumoMes } from "@/features/dashboard/homeSelectors";
import {
  competenciaAtual,
  contasDoMes,
  dataPorExtenso,
  diasAte,
  estaAberta,
  mesPorExtenso,
  rotuloData,
  type Competencia,
  type ContaDoMes,
} from "@/features/contas/contasData";
import {
  BadgeStatus,
  CardConta,
  LinhaInfo,
  ModalCartao,
  SeletorMes,
  textoDiferenca,
} from "@/features/contas/components/ContaUI";
import { styles } from "@/features/contas/styles";

type Filtro = "todas" | "entrada" | "gasto";

const OPCOES: { id: Filtro; rotulo: string; cor?: string }[] = [
  { id: "todas", rotulo: "Todas" },
  { id: "entrada", rotulo: "Receitas", cor: Cores.estado.alerta },
  { id: "gasto", rotulo: "Despesas", cor: Cores.estado.alerta },
];

const moeda = (valor?: number) => (valor === undefined ? "R$ —" : formatarMoeda(valor));

// "Hoje", "Ontem" ou "10 de outubro"
function rotuloDia(dataVencimento: string): string {
  const dias = diasAte(dataVencimento);

  if (dias === 0) return "Hoje";
  if (dias === -1) return "Ontem";
  if (dias === 1) return "Amanhã";

  return dataPorExtenso(dataVencimento).replace(/ de \d{4}$/, "");
}

// Tela "Movimentações": todas as receitas e despesas do mês (gastos
// variáveis e contas fixas). Aberta pelo resumo Receitas/Despesas da Home.
// Aceita ?filtro=entrada|gasto&competencia=AAAA-MM.
export default function Movimentacoes() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filtro?: string; competencia?: string }>();
  const { salario, despesas, transacoes, baixas, excluirTransacao } = useFinanceiro();

  const [filtro, setFiltro] = useState<Filtro>(
    params.filtro === "entrada" || params.filtro === "gasto" ? params.filtro : "todas",
  );
  const [competencia, setCompetencia] = useState<Competencia>(
    params.competencia ?? competenciaAtual(),
  );

  // Registro aberto no modal e se o modal está na etapa de excluir
  const [selecionada, setSelecionada] = useState<ContaDoMes | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const todas = useMemo(
    () => contasDoMes(transacoes, baixas, competencia),
    [transacoes, baixas, competencia],
  );

  const resumo = obterResumoMes(todas, salario, despesas, transacoes.length > 0);

  // Mais recentes primeiro, agrupadas por dia
  const grupos = useMemo(() => {
    const visiveis = todas.filter((conta) => filtro === "todas" || conta.tipo === filtro).reverse();
    const mapa = new Map<string, ContaDoMes[]>();

    for (const conta of visiveis) {
      mapa.set(conta.dataVencimento, [...(mapa.get(conta.dataVencimento) ?? []), conta]);
    }

    return Array.from(mapa.entries());
  }, [todas, filtro]);

  function fechar() {
    setSelecionada(null);
    setExcluindo(false);
  }

  // Fecha o modal e abre outra tela (nunca dois modais ao mesmo tempo)
  function ir(pathname: string, conta: ContaDoMes) {
    fechar();
    router.push({ pathname, params: { id: conta.transacaoId, competencia: conta.competencia } } as never);
  }

  function excluir(conta: ContaDoMes) {
    excluirTransacao(conta.transacaoId, conta.competencia);
    fechar();
  }

  function renderModal(conta: ContaDoMes) {
    const entrada = conta.tipo === "entrada";
    const Icone = conta.icone;

    if (excluindo) {
      return (
        <View style={modal.centralizado}>
          <View style={modal.iconeTopo}>
            <Trash2 size={44} color={Cores.roxo.claro} />
          </View>
          <Text style={[modal.titulo, modal.tituloCentro]}>
            Excluir {entrada ? "receita" : "despesa"}?
          </Text>
          <Text style={modal.texto}>
            {conta.recorrente
              ? `A conta deixa de existir a partir de ${mesPorExtenso(conta.competencia)} e não aparece nos meses seguintes. Os meses e ${entrada ? "recebimentos" : "pagamentos"} anteriores continuam no histórico.`
              : "Esse registro será removido definitivamente."}
          </Text>
          <View style={modal.botoes}>
            <Button titulo="Excluir" variante="perigo" onPress={() => excluir(conta)} />
            <Button titulo="Voltar" variante="botaotexto" onPress={() => setExcluindo(false)} />
          </View>
        </View>
      );
    }

    const diferenca = textoDiferenca(conta);

    return (
      <>
        <View style={styles.modalIcone}>
          <Icone size={30} color={Cores.texto.principal} />
        </View>
        <Text style={[modal.titulo, modal.tituloCentro]}>{conta.nome}</Text>
        <Text style={styles.modalSubtitulo}>
          {entrada ? "Receita" : "Despesa"} {conta.recorrente ? "fixa · Mensal" : "avulsa"}
        </Text>

        <LinhaInfo primeira rotulo={conta.valorRealizado !== undefined ? "Valor previsto" : "Valor"} valor={formatarMoeda(conta.valorPrevisto)} />
        <LinhaInfo rotulo={rotuloData(conta)} valor={dataPorExtenso(conta.dataVencimento)} />
        {conta.valorRealizado !== undefined && conta.recorrente ? (
          <LinhaInfo
            rotulo={entrada ? "Recebido em" : "Pago em"}
            valor={`${conta.dataRealizada} · ${formatarMoeda(conta.valorRealizado)}`}
          />
        ) : null}
        <View style={[styles.info, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
          <Text style={styles.infoRotulo}>Status</Text>
          <BadgeStatus conta={conta} />
        </View>

        {diferenca ? <Text style={[styles.aviso, { marginTop: 10 }]}>{diferenca}</Text> : null}

        <View style={[styles.modalBotoes, { marginTop: 14 }]}>
          {conta.recorrente && estaAberta(conta) ? (
            <>
              <Button
                titulo={entrada ? "Marcar como recebida" : "Marcar como paga"}
                onPress={() => ir(Rotas.confirmarConta, conta)}
              />
              <View style={styles.espaco} />
            </>
          ) : null}

          <View style={form.linhaBotoes}>
            <View style={form.colunaBotao}>
              <Button titulo="Editar" variante="outline" onPress={() => ir(Rotas.editarConta, conta)} />
            </View>
            <View style={form.colunaBotao}>
              <Button titulo="Excluir" variante="perigo" onPress={() => setExcluindo(true)} />
            </View>
          </View>

          {conta.recorrente ? (
            <Button titulo="Ver detalhes" variante="botaotexto" onPress={() => ir(Rotas.detalhesConta, conta)} />
          ) : null}
        </View>
      </>
    );
  }

  return (
    <LinearGradient
      colors={["#160B24", "#08070A", "#160B24"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={form.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={form.conteudo}>
        <HeaderInterno titulo="Movimentações" subtitulo="Receitas e despesas" />

        <View style={form.formulario}>
          <AlternadorTipo<Filtro> valor={filtro} aoMudar={setFiltro} opcoes={OPCOES} />

          <SeletorMes competencia={competencia} aoMudar={setCompetencia} />

          {/* Totais do mês (os mesmos do topo da Home) */}
          <View style={styles.resumoLinha}>
            <View style={styles.resumoCard}>
              <Text style={styles.resumoRotulo}>Receitas</Text>
              <Text style={[styles.resumoValor, { color: Cores.destaque.limao }]} numberOfLines={1} adjustsFontSizeToFit>
                {moeda(resumo.receitas)}
              </Text>
            </View>
            <View style={styles.resumoCard}>
              <Text style={styles.resumoRotulo}>Despesas</Text>
              <Text style={[styles.resumoValor, { color: Cores.base.branco }]} numberOfLines={1} adjustsFontSizeToFit>
                {moeda(resumo.despesas)}
              </Text>
            </View>
          </View>

          {salario !== undefined || despesas !== undefined ? (
            <Text style={styles.aviso}>
              Os totais incluem o que você informou na configuração inicial
              {salario !== undefined ? ` (salário ${formatarMoeda(salario)}` : ""}
              {salario !== undefined && despesas !== undefined ? " e " : salario !== undefined ? ")" : " ("}
              {despesas !== undefined ? `despesas mensais ${formatarMoeda(despesas)})` : ""}.
            </Text>
          ) : null}

          {grupos.length === 0 ? (
            <Text style={styles.vazio}>Nenhuma movimentação registrada neste mês.</Text>
          ) : null}

          {grupos.map(([dataVencimento, contas]) => (
            <View key={dataVencimento}>
              <Text style={styles.secaoTitulo}>{rotuloDia(dataVencimento)}</Text>
              {contas.map((conta) => (
                <CardConta
                  key={`${conta.transacaoId}-${conta.competencia}`}
                  conta={conta}
                  aoPress={() => setSelecionada(conta)}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <ModalCartao visible={selecionada !== null} aoFechar={fechar}>
        {selecionada ? renderModal(selecionada) : null}
      </ModalCartao>
    </LinearGradient>
  );
}