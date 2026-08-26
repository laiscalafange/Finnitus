import { Text, TouchableOpacity, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { EconomiaResumo } from '../../types'
import { Cores } from '@/shared/constants/Cores'
import { styles } from './styles'

type Props = {
  dados?: EconomiaResumo
  onPress?: () => void
}

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function CardEconomia({ dados, onPress }: Props) {
  const percentualBruto = dados?.percentualMeta ?? 0
  const emAlerta = dados !== undefined && percentualBruto < 0
  const percentual = Math.min(100, Math.max(0, Math.abs(percentualBruto)))
  const corDestaque = emAlerta ? Cores.estado.perigo : Cores.destaque.limao
  const raio = 34
  const circ = 2 * Math.PI * raio

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Economia mensal</Text>
      <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress} activeOpacity={0.88}>
        <View style={styles.medidor}>
          <Svg width={92} height={92} viewBox="0 0 92 92" style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle cx="46" cy="46" r={raio} fill="none" stroke={Cores.roxo.principal} strokeWidth="9" />
            <Circle
              cx="46"
              cy="46"
              r={raio}
              fill="none"
              stroke={corDestaque}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${(percentual / 100) * circ} ${circ}`}
            />
          </Svg>
          <View style={styles.medidorInterno}>
            <Text style={[styles.percentual, { color: corDestaque }]}>
              {dados ? `${Math.round(percentual)}%` : '—'}
            </Text>
          </View>
        </View>
        <View style={styles.textos}>
          <Text style={[styles.destaque, emAlerta && styles.destaqueAlerta]}>
            {!dados ? 'Dados não disponíveis' : emAlerta ? 'Ops!' : 'Meta de economia'}
          </Text>
          <Text style={styles.descricao}>
            {dados
              ? emAlerta
                ? `Este mês você gastou ${moeda(Math.abs(dados.economiaMensal))} a mais do que ganhou. Pense bem nas próximas despesas e reveja metas e planejamento.`
                : `Economize ${moeda(dados.economiaMensal)} por mês para chegar a ${moeda(dados.economiaFutura)} em ${dados.tempoEconomia} ${dados.tempoEconomia === 1 ? 'mês' : 'meses'}.`
              : 'Preencha a economia futura e o tempo estimado para calcular sua meta mensal.'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
