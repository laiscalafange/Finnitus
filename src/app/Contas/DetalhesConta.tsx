import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { HeaderInterno } from "../../shared/components/Header";
import { BackgroundGradient } from "@/shared/components/backgroundGradient";
import { Button } from "../../shared/components/Button";
import { Cores } from "../../shared/constants/Cores";
import { Rotas } from "../../shared/constants/Rotas";

import { AlternadorTipo } from "@/features/menuMais/components/AlternadorTipo";
import { styles as form } from "@/features/menuMais/styles/formulario";
import { useVoltar } from "@/features/menuMais/useVoltar";
import { formatarMoeda } from "@/features/menuMais/utils";
import { useFinanceiro } from "@/features/financeiroContext";
import {
  competenciaAtual,
  competenciaAnterior,
  contaDoMes,
  type ContaDoMes,
  dataPorExtenso,
  diferencaDaConta,
  estaAberta,
  mesPorExtenso,
  nomeCompetencia,
  rotuloData,
  versaoNoMes,
} from "@/features/contas/contasData";
import {
  BadgeStatus,
  LinhaInfo,
  ModalCartao,
  textoDiferenca,
} from "@/features/contas/components/ContaUI";
import { ModalConfirmarConta } from "@/features/contas/components/ConfirmarConta";
import { styles } from "@/features/contas/styles";
import { styles as modal } from "@/features/menuMais/components/ModalReserva/styles";
import { Trash2 } from "lucide-react-native";

type Aba = "info" | "historico";

const ABAS: { id: Aba; rotulo: string }[] = [
  { id: "info", rotulo: "Informações" },
  { id: "historico", rotulo: "Histórico" },
];

const TIPOS_RECEBIMENTO = {
  integral: "Integral",
  parcial: "Parcial",
  adiantamento: "Adiantamento",
} as const;

// Tela "Detalhes da despesa/receita fixa". Recebe ?id=...&competencia=AAAA-MM.
export default function DetalhesConta() {
  const router = useRouter();
  const voltar = useVoltar();
  const { id, competencia: competenciaParam } = useLocalSearchParams<{
    id?: string;
    competencia?: string;
  }>();

  const { transacoes, baixas, excluirTransacao } = useFinanceiro();

  const [aba, setAba] = useState<Aba>("info");
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  // "Marcar como paga/recebida" abre um modal (não é mais uma tela separada)
  const [confirmandoBaixa, setConfirmandoBaixa] = useState(false);

  const transacao = transacoes.find((item) => item.id === id);
  const competencia = competenciaParam ?? competenciaAtual();
  const conta = transacao ? contaDoMes(transacao, baixas, competencia) : undefined;

  const tituloHeader = conta?.tipo === "entrada" ? "Detalhes da receita" : "Detalhes da despesa";

  // Conta não encontrada (ex.: foi excluída)
  if (!transacao || !conta) {
    return (
      <View style={form.container}>
        <BackgroundGradient variante="funcional" />
        <HeaderInterno titulo="Detalhes da conta" />
        <View style={form.formulario}>
          <Text style={styles.vazio}>Não encontramos essa conta neste mês. Ela pode ter sido excluída.</Text>
          <Button titulo="Voltar" variante="outline" onPress={voltar} />
        </View>
      </View>
    );
  }

  const Icone = conta.icone;
  const entrada = conta.tipo === "entrada";
  const aberta = estaAberta(conta);
  const diferenca = diferencaDaConta(conta);
  const resumoDiferenca = textoDiferenca(conta);

  // Pagamentos/recebimentos confirmados desta conta (histórico financeiro)
  const historicoBaixas = baixas
    .filter((baixa) => baixa.transacaoId === transacao.id)
    .sort((a, b) => b.registradaEm.localeCompare(a.registradaEm));

  // Alterações de valor feitas na conta
  const alteracoes = (transacao.vigencias ?? [])
    .map((vigencia) => ({
      vigencia,
      anterior: versaoNoMes(transacao, competenciaAnterior(vigencia.desde)).valor,
    }))
    .filter((item) => item.anterior !== item.vigencia.dados.valor)
    .sort((a, b) => b.vigencia.alteradaEm.localeCompare(a.vigencia.alteradaEm));

  function abrirConfirmar() {
    setConfirmandoBaixa(true);
  }

  function abrirEditar() {
    router.push({
      pathname: Rotas.editarConta,
      params: { id: transacao!.id, competencia },
    });
  }

  function excluir() {
    excluirTransacao(transacao!.id, competencia);
    setConfirmandoExclusao(false);
    voltar();
  }

  return (
    <View style={form.container}>
      <BackgroundGradient variante="funcional" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={form.conteudo}>
        <HeaderInterno titulo={tituloHeader} />

        <View style={form.formulario}>
          {/* Resumo da conta */}
          <View style={styles.cartao}>
            <View style={styles.cartaoTopo}>
              <View style={styles.cartaoBolha}>
                <Icone size={28} color={Cores.texto.principal} />
              </View>

              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.cartaoNome} numberOfLines={1}>{conta.nome}</Text>
                <Text style={styles.cartaoTipo}>
                  {entrada ? "Receita" : "Despesa"} {conta.recorrente ? "fixa · Mensal" : "avulsa"}
                </Text>
              </View>

              <BadgeStatus conta={conta} />
            </View>

            <Text style={styles.cartaoValor}>{formatarMoeda(conta.valorPrevisto)}</Text>
            <Text style={styles.cartaoValorLegenda}>
              Valor previsto · {nomeCompetencia(conta.competencia)}
            </Text>
          </View>

          {/* Ação principal (só enquanto não foi pago/recebido) */}
          {conta.recorrente && aberta ? (
            <>
              <Button
                titulo={entrada ? "Marcar como recebida" : "Marcar como paga"}
                onPress={abrirConfirmar}
              />
              <View style={styles.espaco} />
            </>
          ) : null}

          <AlternadorTipo<Aba> valor={aba} aoMudar={setAba} opcoes={ABAS} />

          {aba === "info" ? (
            <View style={styles.cartao}>
              <LinhaInfo primeira rotulo="Valor previsto" valor={formatarMoeda(conta.valorPrevisto)} />
              <LinhaInfo
                rotulo={entrada ? "Data de recebimento" : "Data de vencimento"}
                valor={dataPorExtenso(conta.dataVencimento)}
              />
              <LinhaInfo rotulo="Frequência" valor={conta.recorrente ? "Mensal" : "Única"} />
              <LinhaInfo rotulo="Status" valor={rotuloStatusTexto(conta)} />

              {conta.valorRealizado !== undefined ? (
                <>
                  <LinhaInfo
                    rotulo={entrada ? "Data do recebimento" : "Data do pagamento"}
                    valor={conta.dataRealizada ? dataPorExtenso(conta.dataRealizada) : "-"}
                  />
                  <LinhaInfo
                    rotulo={entrada ? "Valor recebido" : "Valor pago"}
                    valor={formatarMoeda(conta.valorRealizado)}
                  />
                  {diferenca !== 0 ? (
                    <LinhaInfo
                      rotulo="Diferença em relação ao previsto"
                      valor={`${diferenca > 0 ? "+" : "-"}${formatarMoeda(Math.abs(diferenca))}`}
                    />
                  ) : null}
                </>
              ) : null}

              {entrada ? (
                <LinhaInfo
                  rotulo="Tipo de recebimento"
                  valor={TIPOS_RECEBIMENTO[conta.tipoRecebimento ?? "integral"]}
                />
              ) : null}

              <LinhaInfo rotulo="Observações" valor={conta.observacao || "-"} />
            </View>
          ) : (
            <View style={styles.cartao}>
              {historicoBaixas.length === 0 && alteracoes.length === 0 ? (
                <Text style={styles.historicoTexto}>
                  Nenhum {entrada ? "recebimento" : "pagamento"} registrado ainda. O histórico
                  aparece aqui quando você confirmar.
                </Text>
              ) : null}

              {historicoBaixas.map((baixa, indice) => (
                <View key={baixa.id} style={[styles.historicoItem, indice === 0 && styles.infoPrimeira]}>
                  <Text style={styles.historicoTitulo}>
                    {entrada ? "Recebimento confirmado" : "Pagamento confirmado"} ·{" "}
                    {nomeCompetencia(baixa.competencia)}
                  </Text>
                  <Text style={styles.historicoTexto}>
                    {entrada ? "Recebido" : "Pago"} em {baixa.dataRealizada}:{" "}
                    {formatarMoeda(baixa.valorRealizado)}
                    {"\n"}Previsto: {formatarMoeda(baixa.valorPrevisto)}
                    {baixa.valorRealizado !== baixa.valorPrevisto
                      ? ` · diferença de ${formatarMoeda(Math.abs(baixa.valorRealizado - baixa.valorPrevisto))} ${baixa.valorRealizado > baixa.valorPrevisto ? "a mais" : "a menos"}`
                      : ""}
                  </Text>
                </View>
              ))}

              {alteracoes.map(({ vigencia, anterior }) => (
                <View key={vigencia.desde + vigencia.alteradaEm} style={styles.historicoItem}>
                  <Text style={styles.historicoTitulo}>Valor previsto alterado</Text>
                  <Text style={styles.historicoTexto}>
                    De {formatarMoeda(anterior)} para {formatarMoeda(vigencia.dados.valor)} a partir de{" "}
                    {mesPorExtenso(vigencia.desde)}.
                  </Text>
                </View>
              ))}
            </View>
          )}

          {resumoDiferenca ? <Text style={styles.aviso}>{resumoDiferenca}</Text> : null}

          {/* Editar | Excluir */}
          <View style={form.linhaBotoes}>
            <View style={form.colunaBotao}>
              <Button titulo="Editar" variante="outline" onPress={abrirEditar} />
            </View>
            <View style={form.colunaBotao}>
              <Button titulo="Excluir" variante="perigo" onPress={() => setConfirmandoExclusao(true)} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirmar pagamento / recebimento (modal) */}
      <ModalConfirmarConta
        visible={confirmandoBaixa}
        conta={conta}
        aoFechar={() => setConfirmandoBaixa(false)}
      />

      {/* Confirmação de exclusão */}
      <ModalCartao visible={confirmandoExclusao} aoFechar={() => setConfirmandoExclusao(false)}>
        <View style={modal.centralizado}>
          <View style={modal.iconeTopo}>
            <Trash2 size={44} color={Cores.roxo.claro} />
          </View>
          <Text style={[modal.titulo, modal.tituloCentro]}>
            Excluir {entrada ? "receita" : "despesa"}?
          </Text>
          <Text style={modal.texto}>
            {conta.recorrente
              ? `A conta deixa de existir a partir de ${mesPorExtenso(competencia)} e não aparece nos meses seguintes. Os meses e ${entrada ? "recebimentos" : "pagamentos"} anteriores continuam no histórico.`
              : "Esse registro será removido definitivamente."}
          </Text>
          <View style={modal.botoes}>
            <Button titulo="Excluir" variante="perigo" onPress={excluir} />
            <Button titulo="Cancelar" variante="botaotexto" onPress={() => setConfirmandoExclusao(false)} />
          </View>
        </View>
      </ModalCartao>
    </View>
  );
}

// Texto do status com a explicação (ex.: "Pendente · vence em 2 dias")
function rotuloStatusTexto(conta: ContaDoMes): string {
  const nome = conta.tipo === "gasto" ? "vence" : "é prevista";

  switch (conta.status) {
    case "paga":
      return "Paga";
    case "recebida":
      return diferencaDaConta(conta) < 0 ? "Recebida (parcial)" : "Recebida";
    case "atrasada":
      return `Atrasada · ${rotuloData(conta).toLowerCase()} há ${Math.abs(conta.diasParaVencer)} dia(s)`;
    case "pendente":
      return conta.diasParaVencer === 0
        ? `Pendente · ${nome} hoje`
        : `Pendente · ${nome} em ${conta.diasParaVencer} dia(s)`;
    default:
      return `Em dia · ${nome} em ${conta.diasParaVencer} dias`;
  }
}