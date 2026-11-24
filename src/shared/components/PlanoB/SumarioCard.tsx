import { View } from 'react-native'
import { Text } from '@/shared/components/Texto'
import { useMoedaVisivel } from '@/features/configuracoesContext'
import { LinearGradient } from 'expo-linear-gradient'

import { Cores } from '../../../shared/constants/Cores'
import { styles } from '../../../styles/Planobstyle'

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
  const moedaVisivel = useMoedaVisivel()

  return (
    <LinearGradient
      colors={[
        'rgba(44, 27, 67, 0.77)',
        'rgba(33, 18, 53, 0.82)',
      ]}
      style={[
        styles.duploCard,
        {
          borderRadius: 16,
          borderWidth: 1,
          borderColor: 'rgba(163, 87, 255, 0.25)',
          padding: 12,
        },
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text
          style={[
            styles.duploTitulo,
            { color: Cores.destaque.limao },
          ]}
        >
          Sumário
        </Text>

        <Text
          style={{
            color: '#C7A9F5',
            fontSize: 22,
          }}
        >
          ›
        </Text>
      </View>

      <Text
        style={[
          styles.duploDescricao,
          {
            color: '#C7A9F5',
            fontSize: 12,
            marginBottom: 14,
          },
        ]}
      >
        Você tem{' '}
        <Text
          style={{
            color: Cores.roxo.claro,
            fontWeight: 'bold',
          }}
        >
          {moedaVisivel(disponivel)}
        </Text>{' '}
        para investir ou gastar
      </Text>

      {itens.map(item => (
        <View
          key={item.label}
          style={[
            styles.sumarioBarraLinha,
            { marginBottom: 12 },
          ]}
        >
          <View
            style={[
              styles.sumarioBarraHeader,
              {
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 3,
              },
            ]}
          >
            <Text
              style={[
                styles.sumarioBarraLabel,
                { fontSize: 13,
                   color: '#8f60d6',
                 },
              ]}
            >
              {item.label}
            </Text>

            <Text
              style={[
                styles.sumarioBarraValor,
                {
                  color: Cores.destaque.limao,
                  fontSize: 12,
                },
              ]}
            >
              {moedaVisivel(item.valor)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <View
              style={[
                styles.sumarioBarra,
                {
                  flex: 1,
                  height: 6,
                  backgroundColor: '#211235',
                },
              ]}
            >
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

            <Text
              style={{
                color: '#C7A9F5',
                fontSize: 10,
              }}
            >
              {item.porcentagem.toFixed(0)}%
            </Text>
          </View>
        </View>
      ))}
    </LinearGradient>
  )
}