import { Text, View } from 'react-native'
import { EstatisticaResumo } from '../../types'
import { styles } from './styles'

type Props = { dados?: EstatisticaResumo[] }
const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function GraficoEstatisticas({ dados }: Props) {
  const resumo = dados?.length === 1 ? dados[0] : undefined
  const total = resumo ? Math.max(resumo.receitas, resumo.despesas, 1) : 1

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Estatísticas</Text>
        <Text style={styles.periodo}>{resumo ? 'Resumo atual' : 'Semana'}</Text>
      </View>
      <View style={styles.grafico}>
        {resumo ? (
          <View style={styles.resumo}>
            <View style={styles.resumoLinha}>
              <View style={[styles.indicador, styles.receitas]} />
              <Text style={styles.resumoLabel}>Receitas</Text>
              <Text style={styles.resumoValor}>{moeda(resumo.receitas)}</Text>
            </View>
            <View style={styles.barraFundo}>
              <View style={[styles.barra, styles.barraReceitas, { width: `${(resumo.receitas / total) * 100}%` }]} />
            </View>
            <View style={styles.resumoLinha}>
              <View style={[styles.indicador, styles.despesas]} />
              <Text style={styles.resumoLabel}>Despesas</Text>
              <Text style={styles.resumoValor}>{moeda(resumo.despesas)}</Text>
            </View>
            <View style={styles.barraFundo}>
              <View style={[styles.barra, styles.barraDespesas, { width: `${(resumo.despesas / total) * 100}%` }]} />
            </View>
          </View>
        ) : (
          <View style={styles.vazio}>
            <Text style={styles.vazioTitulo}>Dados de estatísticas ainda não disponíveis</Text>
            <Text style={styles.vazioTexto}>Cadastre salário e despesas para visualizar o resumo financeiro.</Text>
          </View>
        )}
      </View>
    </View>
  )
}
