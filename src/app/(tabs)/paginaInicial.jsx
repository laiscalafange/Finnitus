
import { useState } from 'react'
import { ScrollView, View, Text, Pressable } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
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
  obterProximoEvento,
  obterPlanejamentoHome,
  obterResumoMes,
  obterDespesasFixas,
  obterAlertas,
  obterEconomiaMes,
} from '../../features/dashboard'
import { useFinanceiro } from '../../features/financeiroContext'
import { useAuth } from '../../features/authContext'
import { styles } from '../../styles/paginaInicial'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const MESES_CURTOS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export default function PaginaInicial() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user } = useAuth()

  const {
    salario,
    despesas,
    economiaFutura,
    tempoEconomia,
    metas,
    transacoes,
  } = useFinanceiro()

  const [referencia, setReferencia] = useState(() => {
    const hoje = new Date()

    return {
      mes: hoje.getMonth(),
      ano: hoje.getFullYear(),
    }
  })

  const [modalMes, setModalMes] = useState(false)
  const [resumoVisivel, setResumoVisivel] = useState(true)

  const mesTexto =
    referencia.ano === new Date().getFullYear()
      ? MESES[referencia.mes]
      : `${MESES[referencia.mes]} ${referencia.ano}`

  const resumo = obterResumoMes(
    transacoes,
    salario,
    despesas,
    referencia
  )

  const despesasFixas = obterDespesasFixas(transacoes, referencia)
  const alertas = obterAlertas(despesasFixas, referencia)

  const economia = obterEconomiaMes(
    metas,
    resumo.receitas,
    referencia,
    economiaFutura,
    tempoEconomia
  )

  const evento = obterProximoEvento()

  const emAndamento = metas.filter(
    item => item.status === 'andamento'
  )

  const meta = obterPlanejamentoHome(
    emAndamento.find(item => item.tipo === 'mes') ?? emAndamento[0]
  )

  return (
    <View style={styles.container}>
      <BackgroundGradient />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingBottom: 118 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* CABEÇALHO ROXO */}
        <LinearGradient
          colors={GRADIENTS.header.colors}
          start={GRADIENTS.header.start}
          end={GRADIENTS.header.end}
          style={[
            styles.hero,
            { paddingTop: insets.top + 8 },
          ]}
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

          {/* RECEITAS E DESPESAS */}
          {resumoVisivel && (
            <CardResumo
              receitas={resumo.receitas}
              despesas={resumo.despesas}
            />
          )}

          {/* SETA FUNCIONAL */}
          <Pressable
            style={styles.heroCurva}
            onPress={() => setResumoVisivel(visivel => !visivel)}
            accessibilityRole="button"
            accessibilityLabel={
              resumoVisivel
                ? 'Ocultar receitas e despesas'
                : 'Mostrar receitas e despesas'
            }
            hitSlop={8}
          >
            <View style={styles.heroCurvaForma}>
              <Text style={styles.heroCurvaSeta}>
                {resumoVisivel ? '⌄' : '⌃'}
              </Text>
            </View>
          </Pressable>
        </LinearGradient>

        {/* CONTEÚDO */}
        <View style={styles.conteudo}>
          <CardEvento
            evento={evento}
            onPress={() => router.push('/calendario')}
          />

          <CardPlanejamento
            dados={meta}
            onPress={() => router.push('/metas')}
          />

          {/* DESPESAS FIXAS */}
          <CardSecao
            titulo="Despesas fixas"
            textoVerTodos="Ver todas"
            aoVerTodos={() => router.push('/calendario')}
          >
            {despesasFixas.length > 0 ? (
              <ListaItens>
                {despesasFixas.slice(0, 3).map(despesa => (
                  <LinhaItem
                    key={despesa.id}
                    icone={despesa.icone}
                    titulo={despesa.titulo}
                    subtitulo={`Vencimento ${despesa.vencimento}  ·  ${formatarMoeda(despesa.valor)}`}
                    aoPress={() => router.push('/calendario')}
                  />
                ))}
              </ListaItens>
            ) : (
              <Text style={styles.vazio}>
                Registre um gasto com “repetir mensalmente” e ele aparece aqui.
              </Text>
            )}
          </CardSecao>

          {/* ATENÇÃO */}
          <CardSecao
            titulo="Atenção"
            textoVerTodos="Ver todas"
            aoVerTodos={() => router.push(Rotas.notificacao)}
          >
            {alertas.length > 0 ? (
              <ListaItens>
                {alertas.slice(0, 2).map(alerta => (
                  <LinhaItem
                    key={alerta.id}
                    destaque
                    icone={alerta.icone}
                    titulo={alerta.titulo}
                    subtitulo={alerta.descricao}
                    aoPress={() => router.push('/calendario')}
                  />
                ))}
              </ListaItens>
            ) : (
              <Text style={styles.vazio}>
                Tudo certo por aqui! Nenhum aviso no momento.
              </Text>
            )}
          </CardSecao>

          {/* ECONOMIA MENSAL */}
          <CardEconomia
            dados={economia}
            onPress={() => router.push('/metas')}
          />
        </View>
      </ScrollView>

      {/* SELETOR DE MÊS */}
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
