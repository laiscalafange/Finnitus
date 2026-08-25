import { PLANOB_MOCK } from '@/shared/components/Mocks'
import type { ReactElement } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { PlanoBResumo } from '../../types'
import { styles } from './styles'

type Props = {
  dados?: PlanoBResumo
  onPress?: () => void
}

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function CardPlanob({ dados, onPress }: Props) {
  const restante = dados ? Math.max(0, dados.valorMeta - dados.valorAtual) : undefined
  const categorias = PLANOB_MOCK.categorias.slice(0, 4).map((categoria, index) => ({
    ...categoria,
    // Os ícones podem ser trocados pelos arquivos equivalentes em assets/icones/.
    iconeFonte: [
      require('../../../../../assets/icones/economia2.png'),
      require('../../../../../assets/icones/saco.png'),
      require('../../../../../assets/icones/decisoes.png'),
      require('../../../../../assets/icones/historicoM.png'),
    ][index],
  }))
  const raio = 34
  const circ = 2 * Math.PI * raio
  const totalCategorias = categorias.reduce((soma, categoria) => soma + categoria.valor, 0) || 1

  return (
    <View style={styles.container}>
      <View style={styles.tituloLinha}>
        <Text style={styles.titulo}>Plano-B</Text>
      </View>

      <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.9} style={styles.corpo}>
        <View style={styles.navegacao}>
          <Text style={styles.navegacaoSeta}>‹</Text>
          <Text style={styles.navegacaoTexto}>Mês</Text>
          <Text style={styles.navegacaoSeta}>›</Text>
          <Text style={styles.statusLabel}>Status</Text>
        </View>

        <View style={styles.linha}>
          <View style={styles.gauge}>
            <Svg width={86} height={86} viewBox="0 0 86 86" style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle cx="43" cy="43" r={raio} fill="none" stroke="#4B2E74" strokeWidth="9" />
              {categorias.reduce<{ acumulado: number; elementos: ReactElement[] }>(
                (resultado, categoria) => {
                  const fatia = (categoria.valor / totalCategorias) * circ
                  resultado.elementos.push(
                    <Circle
                      key={categoria.nome}
                      cx="43"
                      cy="43"
                      r={raio}
                      fill="none"
                      stroke={categoria.cor}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${fatia} ${circ}`}
                      strokeDashoffset={-resultado.acumulado}
                    />,
                  )
                  resultado.acumulado += fatia + 2
                  return resultado
                },
                { acumulado: 0, elementos: [] },
              ).elementos}
            </Svg>
            <View style={styles.gaugeTexto}>
              <Text style={styles.gaugeValor}>{dados ? moeda(restante ?? 0) : 'R$ —'}</Text>
              <Text style={styles.gaugeLabel}>Restantes</Text>
            </View>
          </View>

          <View style={styles.categorias}>
            {categorias.map(categoria => (
              <View key={categoria.nome} style={styles.categoria}>
                <View style={[styles.categoriaIcone, { backgroundColor: categoria.cor }]}><Image source={categoria.iconeFonte} style={styles.categoriaImagem} /></View>
                <View style={styles.categoriaTextos}>
                  <Text style={styles.categoriaNome}>{categoria.nome}</Text>
                  <Text style={styles.categoriaValor}>{moeda(categoria.valor)}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}
