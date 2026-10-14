import { Text, TouchableOpacity, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { ChevronRight } from 'lucide-react-native'
import { Cores } from '@/shared/constants/Cores'
import { EconomiaResumo } from '../../types'
import { styles } from './styles'

type Props = {
  dados?: EconomiaResumo
  onPress?: () => void
}

// R$ 208 (sem centavos quando o valor é inteiro) ou R$ 208,50
const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: valor % 1 === 0 ? 0 : 2,
  })

const TAMANHO = 100
const RAIO = 34
const CIRCUNFERENCIA = 2 * Math.PI * RAIO

// Card "Economia mensal": quanto foi guardado nas metas no mês selecionado
export function CardEconomia({ dados, onPress }: Props) {
  const percentual = Math.min(100, Math.max(0, dados?.percentual ?? 0))

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Economia mensal</Text>

      <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress} activeOpacity={0.88} accessibilityRole="button">
        <View style={styles.medidor}>
          <Svg
            width={TAMANHO}
            height={TAMANHO}
            viewBox="0 0 92 92"
            style={{ transform: [{ rotate: '-90deg' }] }}
          >
            <Circle cx="46" cy="46" r={RAIO} fill="none" stroke={Cores.roxo.principal} strokeWidth="9" />
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
            <Text style={styles.percentual}>{dados ? `${Math.round(percentual)}%` : '—'}</Text>
          </View>
        </View>

        <View style={styles.textos}>
          <Text style={styles.rotulo}>Você economizou</Text>
          <View style={styles.valorLinha}>
            <Text style={styles.valor}>{moeda(dados?.economizado ?? 0)}</Text>
            <Text style={styles.valorSufixo}>este mês</Text>
          </View>
          <Text style={styles.mensagem}>
            {dados?.metaMensal !== undefined
              ? `Sua meta é economizar ${moeda(dados.metaMensal)} por mês.`
              : 'Mesmo um pequeno esforço já faz uma grande diferença no futuro!'}
          </Text>
        </View>

        {onPress && <ChevronRight size={22} color={Cores.roxo.claro} />}
      </TouchableOpacity>
    </View>
  )
}