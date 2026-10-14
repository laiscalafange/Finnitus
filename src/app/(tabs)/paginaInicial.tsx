import { useCallback, useState } from 'react'

import { ScrollView, View, Text, TouchableOpacity } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import { useFocusEffect, useRouter } from 'expo-router'

import { ChevronDown, ChevronUp, CalendarDays, Target, TriangleAlert } from 'lucide-react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BackgroundGradient } from '../../shared/components/backgroundGradient'

import { DashboardHeader } from '../../features/dashboard/components/DashboardHeader'

import { ModalMesAno } from '../../features/calendar/components/ModalMesAno'

import { GRADIENTS } from '../../shared/constants/Gradientes'
import { Rotas } from '../../shared/constants/Rotas'

import { formatarMoeda } from '../../features/menuMais/utils'

import {
  CardSaldo,
  CardResumo,
  CardSecao,
  ListaItens,
  LinhaItem,
  CardEvento,
  CardPlanejamento,
  CardEconomia,
  obterPlanejamentoHome,
  obterResumoMes,
  obterEconomiaMes,
} from '../../features/dashboard'

import { competenciaDe, contasDoMes, rotuloStatus, diaMes } from '../../features/contas/contasData'

import { gerarNotificacoes } from '../../features/contas/notificacoesData'

import { useFinanceiro } from '../../features/financeiroContext'

import { useAuth } from '../../features/authContext'

import { Cores } from '../../shared/constants/Cores'

import { styles } from '../../styles/paginaInicial'

import {

  listarItensCalendario,

} from '../../features/calendar/services/calendarService'
const MESES = [

  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',

]

const MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

type EventoHome = {
  titulo: string
  data: string

}
/*

 * Gera AAAA-MM-DD usando a data local.

 * Evita problemas de fuso horário.

 */

function chaveDataLocal(data: Date) {

  const ano = data.getFullYear()

  const mes = String(

    data.getMonth() + 1

  ).padStart(2, '0')

  const dia = String(

    data.getDate()

  ).padStart(2, '0')

  return `${ano}-${mes}-${dia}`

}

/*

 * Formata a data exibida no CardEvento da Home.

 */

function formatarDataEventoHome(

  dataInicio: string,

  diaInteiro: boolean,

) {

  if (diaInteiro) {

    const [ano, mes, dia] =

      dataInicio

        .slice(0, 10)

        .split('-')

    return `${dia}/${mes}/${ano} • Dia inteiro`

  }

  const data = new Date(dataInicio)

  const dia =

    data.toLocaleDateString(

      'pt-BR',

      {

        day: '2-digit',

        month: '2-digit',

        year: 'numeric',

      }

    )

  const hora =

    data.toLocaleTimeString(

      'pt-BR',

      {

        hour: '2-digit',

        minute: '2-digit',

      }

    )

  return `${dia} • ${hora}`

}

export default function PaginaInicial() {

  const router = useRouter()

  const insets = useSafeAreaInsets()

  const { user } = useAuth()

  const [

  evento,

  setEvento,

] = useState<EventoHome | undefined>(

  undefined

)

  const {

    salario,

    despesas,

    economiaFutura,

    tempoEconomia,

    metas,

    transacoes,

    baixas,

    notificacoesLidas,

  } = useFinanceiro()

  // Mês que a Home está mostrando (começa no mês atual)

  const [referencia, setReferencia] = useState(() => {

    const hoje = new Date()

    return { mes: hoje.getMonth(), ano: hoje.getFullYear() }

  })

  const [modalMes, setModalMes] = useState(false)

  // Seta do header: esconde ou mostra Receitas e Despesas

  const [resumoVisivel, setResumoVisivel] = useState(true)

  // "Outubro" no ano atual; em outro ano mostra também o ano ("Outubro 2025")

  const mesTexto =

    referencia.ano === new Date().getFullYear()

      ? MESES[referencia.mes]

      : `${MESES[referencia.mes]} ${referencia.ano}`

  // Contas (fixas e avulsas) do mês selecionado

  const competencia = competenciaDe(referencia.mes, referencia.ano)

  const contas = contasDoMes(transacoes, baixas, competencia)

  const resumo = obterResumoMes(contas, salario, despesas, transacoes.length > 0)

  const economia = obterEconomiaMes(metas, resumo.receitas, competencia, economiaFutura, tempoEconomia)

  // Despesas fixas: só algumas, as mais relevantes primeiro (atrasadas e

  // pendentes antes das em dia e das já pagas)

  const ordemStatus = { atrasada: 0, pendente: 1, emDia: 2, paga: 3, recebida: 3 }

  const despesasFixas = contas

    .filter(conta => conta.recorrente && conta.tipo === 'gasto')

    .sort((a, b) => ordemStatus[a.status] - ordemStatus[b.status])

  // Atenção: resumo das notificações ainda não lidas (a central completa

  // fica na tela Notificações)

  const atencao = gerarNotificacoes(transacoes, baixas, metas)

    .filter(item => !notificacoesLidas.includes(item.id))

    .slice(0, 2)

  // Primeira meta do mês em andamento (a mesma da tela Metas); se não houver,

  // a primeira de longo prazo

  const emAndamento = metas.filter(meta => meta.status === 'andamento')

  const meta = obterPlanejamentoHome(

    emAndamento.find(item => item.tipo === 'mes') ?? emAndamento[0],

  )

  useFocusEffect(
    useCallback(() => {
      let telaAtiva = true

      async function carregarProximoEventoFinanceiro() {
        try {
          const agora = new Date()

          // Busca eventos financeiros dos próximos 90 dias.
          const fimBusca = new Date(agora)
          fimBusca.setDate(fimBusca.getDate() + 90)

          const inicio = chaveDataLocal(agora)
          const fim = chaveDataLocal(fimBusca)

          const itens = await listarItensCalendario(inicio, fim)

          /*
           * A Home mostra SOMENTE eventos que já foram
           * confirmados pelo usuário como financeiros.
           *
           * Eventos comuns do celular, não analisados,
           * suspeitos ou marcados como não financeiros
           * não aparecem aqui.
           */
          const eventosFinanceiros = itens.filter(
            item =>
              item.tipo === 'EVENTO' &&
              item.statusFinanceiro === 'CONFIRMADO',
          )

          /*
           * Remove eventos que já terminaram.
           * Para eventos de dia inteiro, mantém o evento
           * disponível durante todo o dia atual.
           */
          const hoje = chaveDataLocal(agora)

          const eventosFuturos = eventosFinanceiros.filter(item => {
            const dataInicio = item.horarioInicio ?? item.data

            if (item.diaInteiro) {
              return dataInicio.slice(0, 10) >= hoje
            }

            const dataReferencia = item.horarioFim
              ? new Date(item.horarioFim)
              : new Date(dataInicio)

            return dataReferencia.getTime() >= agora.getTime()
          })

          // Mais próximo primeiro.
          eventosFuturos.sort((a, b) => {
            const dataA = a.horarioInicio ?? a.data
            const dataB = b.horarioInicio ?? b.data

            return new Date(dataA).getTime() - new Date(dataB).getTime()
          })

          const proximo = eventosFuturos[0]

          if (!telaAtiva) {
            return
          }

          if (!proximo) {
            setEvento(undefined)
            return
          }

          const dataInicio = proximo.horarioInicio ?? proximo.data

          setEvento({
            titulo: proximo.titulo,
            data: formatarDataEventoHome(
              dataInicio,
              proximo.diaInteiro ?? false,
            ),
          })
        } catch (error) {
          console.error(
            'Erro ao carregar próximo evento financeiro da Home:',
            error,
          )

          if (telaAtiva) {
            setEvento(undefined)
          }
        }
      }

      carregarProximoEventoFinanceiro()

      return () => {
        telaAtiva = false
      }
    }, []),
  )

  return (

    <View style={styles.container}>

      <BackgroundGradient />

      <ScrollView

        style={styles.scroll}

        contentContainerStyle={{ paddingBottom: 118 + insets.bottom }}

        showsVerticalScrollIndicator={false}

        contentInsetAdjustmentBehavior="automatic"

      >

        {/* HEADER ROXO: avatar, mês, sino, saldo, receitas e despesas */}

        <LinearGradient

          colors={GRADIENTS.header.colors}

          start={GRADIENTS.header.start}

          end={GRADIENTS.header.end}

          style={[styles.hero, { paddingTop: insets.top + 8 }]}

        >

          <DashboardHeader

            nome={user?.name}
            mes={mesTexto}
            aoPressMes={() => setModalMes(true)}
            onPremium={() => router.push(Rotas.premium)}
            onNotificacao={() => router.push(Rotas.notificacao)}
            onPerfil={() => router.push('/perfil')}

          />

          <CardSaldo
            saldoAtual={resumo.saldo}
            onPress={() => router.push('/dashboard')}

          />

          {resumoVisivel && (
            <CardResumo
              receitas={resumo.receitas}
              despesas={resumo.despesas}
              onPressReceitas={() =>
                router.push({ pathname: Rotas.movimentacoes, params: { filtro: 'entrada', competencia } })
              }

              onPressDespesas={() =>
                router.push({ pathname: Rotas.movimentacoes, params: { filtro: 'gasto', competencia } })
              }

            />

          )}

        </LinearGradient>

        {/* Seta: esconde/mostra Receitas e Despesas */}

        <View style={styles.setaContainer}>
          <TouchableOpacity
            style={styles.setaForma}
            onPress={() => setResumoVisivel(visivel => !visivel)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={resumoVisivel ? 'Esconder receitas e despesas' : 'Mostrar receitas e despesas'}

          >

            {resumoVisivel ? (
              <ChevronUp size={26} color={Cores.base.branco} />
            ) : (
              <ChevronDown size={26} color={Cores.base.branco} />

            )}

          </TouchableOpacity>

        </View>

        {/* CONTEÚDO */}

        <View style={styles.conteudo}>

          {/* EVENTOS (card separado) */}

          <CardEvento
            evento={evento}
            onPress={() => router.push('/calendario')}
          />

          {/* METAS (card separado) */}

          <CardPlanejamento
            dados={meta}
            onPress={() => router.push('/metas')}
          />

          {/* DESPESAS FIXAS */}

          <CardSecao
            titulo="Despesas fixas"
            textoVerTodos="Ver todas"
            aoVerTodos={() => router.push(Rotas.contasFixas)}
          >

            {despesasFixas.length > 0 ? (
              <ListaItens>
                {despesasFixas.slice(0, 3).map(conta => (
                  <LinhaItem
                    key={`${conta.transacaoId}-${conta.competencia}`}
                    icone={conta.icone}
                    titulo={conta.nome}
                    subtitulo={`Vencimento ${diaMes(conta.dataVencimento)}  ·  ${formatarMoeda(conta.valorRealizado ?? conta.valorPrevisto)}  ·  ${rotuloStatus(conta)}`}

                    aoPress={() =>

                      router.push({

                        pathname: Rotas.detalhesConta,

                        params: { id: conta.transacaoId, competencia: conta.competencia },

                      })

                    }

                  />

                ))}

              </ListaItens>

            ) : (

              <Text style={styles.vazio}>

                Registre um gasto com “repetir mensalmente” e ele aparece aqui.

              </Text>

            )}

          </CardSecao>

          {/* ATENÇÃO: resumo das notificações; toque abre a central completa */}

          <CardSecao

            titulo="Atenção"

            textoVerTodos="Ver todas"

            aoVerTodos={() => router.push(Rotas.notificacao)}

          >
            {atencao.length > 0 ? (
              <ListaItens>
                {atencao.map(item => (
                  <LinhaItem
                    key={item.id}
                    destaque
                    icone={
                      item.conta
                        ? item.conta.icone
                        : item.categoria === 'metas'
                          ? Target
                          : item.categoria === 'eventos'
                            ? CalendarDays
                            : TriangleAlert
                    }
                    titulo={item.titulo}
                    subtitulo={`${item.subtitulo}  ·  ${item.quando}`}
                    aoPress={() => router.push(Rotas.notificacao)}
                  />

                ))}

              </ListaItens>

            ) : (

              <Text style={styles.vazio}>Tudo certo por aqui! Nenhum aviso no momento.</Text>

            )}

          </CardSecao>

          {/* ECONOMIA MENSAL */}

          <CardEconomia

            dados={economia}

            onPress={() => router.push('/metas')}

          />

        </View>

      </ScrollView>

      {/* Seletor de mês (o mesmo card flutuante do calendário) */}

      <ModalMesAno

        visible={modalMes}

        mes={referencia.mes}

        ano={referencia.ano}

        nomesMeses={MESES_CURTOS}

        aoFechar={() => setModalMes(false)}

        aoConfirmar={(mes, ano) => {

          setReferencia({ mes, ano })

          setModalMes(false)

        }}

      />

    </View>

  )

}
