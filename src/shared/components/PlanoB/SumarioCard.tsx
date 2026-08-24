import { View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { Cores } from '../../../shared/constants/Cores'
import { styles } from "../../../styles/Planobstyle";

type ItemSumario = {
  label: string
  valor: number
  porcentagem: number
  cor: string
}

type SumarioCardProps = {
  disponivel: number
  itens: ItemSumario[]
}

export function SumarioCard({
  disponivel,
  itens,
}: SumarioCardProps) {
  return (
    <LinearGradient
      colors={['#3c1e75', '#30096e']}
      style={styles.duploCard}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={styles.duploTitulo}>
          Sumário
        </Text>

        <Text
          style={{
            color: Cores.roxo.claro,
            fontSize: 16,
          }}
        >
          ›
        </Text>
      </View>

      <Text style={styles.duploDescricao}>
        Você tem R$
        {disponivel.toLocaleString(
          'pt-BR',
          {
            minimumFractionDigits: 2,
          },
        )}{' '}
        para investir ou gastar
      </Text>

      {itens.map(item => (
        <View
          key={item.label}
          style={styles.sumarioBarraLinha}
        >
          <View style={styles.sumarioBarraHeader}>
            <Text style={styles.sumarioBarraLabel}>
              {item.label}
            </Text>

            <Text style={styles.sumarioBarraValor}>
              {item.valor.toLocaleString(
                'pt-BR',
                {
                  minimumFractionDigits: 2,
                },
              )}
            </Text>
          </View>

          <View style={styles.sumarioBarra}>
            <View
              style={[
                styles.sumarioBarraPreenchida,
                {
                  width: `${item.porcentagem}%`,
                  backgroundColor: item.cor,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </LinearGradient>
  )
}