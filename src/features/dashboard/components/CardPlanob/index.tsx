import { Text, TouchableOpacity, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { PlanoBResumo } from '../../types'
import { Cores } from '@/shared/constants/Cores'
import { styles } from './styles'
import { PLANOB_MOCK } from '@/shared/components/Mocks'

type Props = {
  dados?: PlanoBResumo
  onPress?: () => void
}

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function CardPlanob({ dados, onPress }: Props) {
  const percentual = dados
    ? Math.min(100, Math.max(0, (dados.valorAtual / Math.max(dados.valorMeta, 1)) * 100))
    : 0
  const restante = dados ? Math.max(0, dados.valorMeta - dados.valorAtual) : undefined
  const categorias = PLANOB_MOCK.categorias.slice(0, 4)
  const raio = 34
  const circ = 2 * Math.PI * raio

  return (
    <View style={styles.container}>
      <View style={styles.tituloLinha}>
        <Text style={styles.titulo}>Plano-B</Text>
        <Text style={styles.subtitulo}>{dados ? 'Resumo do mês' : 'Sem dados'}</Text>
      </View>

      <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.9} style={styles.corpo}>
        <View style={styles.gauge}>
          <Svg width={86} height={86} viewBox="0 0 86 86" style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle cx="43" cy="43" r={raio} fill="none" stroke="#4B2E74" strokeWidth="9" />
            <Circle
              cx="43"
              cy="43"
              r={raio}
              fill="none"
              stroke={Cores.destaque.limao}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${(percentual / 100) * circ} ${circ}`}
            />
          </Svg>
          <View style={styles.gaugeTexto}>
            <Text style={styles.gaugeValor}>{dados ? moeda(restante ?? 0) : 'R$ —'}</Text>
            <Text style={styles.gaugeLabel}>restante</Text>
          </View>
        </View>

        <View style={styles.categorias}>
          {categorias.map(categoria => (
            <View key={categoria.nome} style={styles.categoria}>
              <View style={[styles.categoriaLinha, { backgroundColor: categoria.cor }]} />
              <View style={styles.categoriaTextos}>
                <Text style={styles.categoriaNome}>{categoria.nome}</Text>
                <Text style={styles.categoriaValor}>{moeda(categoria.valor)}</Text>
              </View>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </View>
  )
}
