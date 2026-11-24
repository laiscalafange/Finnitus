import { View } from 'react-native'
import { Text } from '@/shared/components/Texto'
import { LinearGradient } from 'expo-linear-gradient'

import { NIVEIS_ATIVIDADE } from '../../../features/sumarioData'
import { styles } from '../../../styles/Planobstyle'

type DiaAtividade = {
  data: string
  nivel: 'alta' | 'media' | 'baixa' | 'nenhuma'
}

type AtividadeHeatmapProps = {
  mes: string
  ano: number
  dias: DiaAtividade[]
}

function obterCorNivel(nivel: string) {
  if (nivel === 'nenhuma') {
    return '#6027a157'
  }

  return (
    NIVEIS_ATIVIDADE.find(
      item => item.id === nivel
    )?.cor ?? '#6027a157'
  )
}

export function HeatmapCard({
  mes,
  ano,
  dias,
}: AtividadeHeatmapProps) {
  const linhas: DiaAtividade[][] = []

  for (let i = 0; i < dias.length; i += 7) {
    linhas.push(dias.slice(i, i + 7))
  }

  return (
    <LinearGradient
      colors={[
        'rgba(44, 27, 67, 0.77)',
        'rgba(33, 18, 53, 0.82)',
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        styles.duploCard,
        {
          borderRadius: 16,
          padding: 12,
          borderWidth: 1,
          borderColor: 'rgba(163, 87, 255, 0.25)',
        },
      ]}
    >
      <View style={styles.atividadeHeader}>
        <Text
          style={[
            styles.duploTitulo,
            { color: 'Cores.destaque.limao' },
          ]}
        >
          Atividade
        </Text>

        <Text
          style={[
            styles.atividadeSeta,
            {
              color: '#C7A9F5',
              fontSize: 22,
            },
          ]}
        >
          ›
        </Text>
      </View>

      <View style={styles.atividadeMes}>
        <Text
          style={[
            styles.duploDescricao,
            {
              color: '#C7A9F5',
              fontSize: 12,
            },
          ]}
        >
          {mes}
        </Text>

        <Text
          style={[
            styles.duploDescricao,
            {
              color: '#C7A9F5',
              fontSize: 12,
            },
          ]}
        >
          {ano}
        </Text>
      </View>

      <View
        style={[
          styles.heatmapGrid,
          { marginTop: 5 },
        ]}
      >
        {linhas.map((linha, linhaIndex) => (
          <View
            key={`linha-${linhaIndex}`}
            style={[
              styles.heatmapLinha,
              {
                justifyContent: 'flex-start',
                gap: 3,
                marginBottom: 6,
              },
            ]}
          >
            {linha.map(dia => (
              <View
                key={dia.data}
                style={[
                  styles.heatmapBolinha,
                  {
                    width: '12%',
                    height: undefined,
                    aspectRatio: 1,
                    borderRadius: 5,
                    backgroundColor: obterCorNivel(dia.nivel),
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      <View
        style={[
          styles.heatmapLegenda,
          {
            flexWrap: 'wrap',
            gap: 5,
            marginTop: 3,
          },
        ]}
      >
        {NIVEIS_ATIVIDADE
          .filter(nivel => nivel.id !== 'nenhuma')
          .map(nivel => (
            <Legenda
              key={nivel.id}
              cor={nivel.cor}
              label={nivel.rotulo}
            />
          ))}
      </View>
    </LinearGradient>
  )
}

function Legenda({
  cor,
  label,
}: {
  cor: string
  label: string
}) {
  return (
    <View style={styles.legendaItem}>
      <View
        style={[
          styles.legendaPonto,
          {
            backgroundColor: cor,
          },
        ]}
      />

      <Text
        style={[
          styles.legendaTexto,
          {
            color: '#C7A9F5',
            fontSize: 10,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  )
}