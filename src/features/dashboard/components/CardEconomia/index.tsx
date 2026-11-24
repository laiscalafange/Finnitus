
import { View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

import { Cores } from '@/shared/constants/Cores'
import { Text } from '@/shared/components/Texto'
import { useMoedaVisivel } from '@/features/configuracoesContext'
import { useIdioma } from '@/features/idioma'

import type { EconomiaResumo } from '../../types'
import { styles } from './styles'

type Props = {
  dados?: EconomiaResumo
}

const TAMANHO = 100
const RAIO = 34
const CIRCUNFERENCIA = 2 * Math.PI * RAIO

export function CardEconomia({ dados }: Props) {
  const moedaVisivel = useMoedaVisivel()
  const { t } = useIdioma()

  const percentual = Math.min(
    100,
    Math.max(0, dados?.percentualObjetivo ?? 0),
  )

  const economiaLiquida = dados?.variacaoPeriodo ?? 0

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{t('Economia mensal')}</Text>

      <View style={styles.card}>
        <View style={styles.medidor}>
          <Svg
            width={TAMANHO}
            height={TAMANHO}
            viewBox="0 0 92 92"
            style={{ transform: [{ rotate: '-90deg' }] }}
          >
            <Circle
              cx="46"
              cy="46"
              r={RAIO}
              fill="none"
              stroke={Cores.roxo.principal}
              strokeWidth="9"
            />

            <Circle
              cx="46"
              cy="46"
              r={RAIO}
              fill="none"
              stroke={Cores.destaque.limao}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${(percentual / 100) * CIRCUNFERENCIA} ${CIRCUNFERENCIA}`}
            />
          </Svg>

          <View style={styles.medidorInterno}>
            <Text style={styles.percentual}>
              {dados?.possuiReserva &&
              dados.percentualObjetivo !== null
                ? `${Math.round(percentual)}%`
                : '—'}
            </Text>
          </View>
        </View>

        <View style={styles.textos}>
          <Text style={styles.rotulo}>
            {economiaLiquida < 0
              ? 'Retiradas superaram depósitos'
              : 'Você economizou'}
          </Text>

          <View style={styles.valorLinha}>
            <Text style={styles.valor}>
              {moedaVisivel(economiaLiquida)}
            </Text>

            <Text style={styles.valorSufixo}>
              {t('este mês')}
            </Text>
          </View>

          <Text style={styles.mensagem}>
          {dados?.possuiReserva
          ? `Objetivo total da reserva: ${moedaVisivel(dados.valorDesejado)}`
          : 'Você ainda não possui uma reserva cadastrada.'}
        </Text>
        </View>
      </View>
    </View>
  )
}
