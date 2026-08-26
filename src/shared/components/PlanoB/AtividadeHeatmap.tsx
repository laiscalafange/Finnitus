import { View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { Cores } from '../../../shared/constants/Cores'
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
  switch (nivel) {
    case 'alta':
      return Cores.destaque.limao

    case 'baixa':
      return '#FF8800'

    case 'media':
      return Cores.roxo.claro

    case 'nenhuma':
    default:
      return '#FFFFFF20'
  }
}

export function HeatmapCard({
  mes,
  ano,
  dias,
}: AtividadeHeatmapProps) {

  /*
   * O card de Atividade ocupa apenas metade da tela.
   * Por isso não podemos colocar 15 bolinhas em uma única linha.
   *
   * Agora são 7 bolinhas por linha.
   */
  const linhas: DiaAtividade[][] = []

  for (let i = 0; i < dias.length; i += 7) {
    linhas.push(dias.slice(i, i + 7))
  }

  return (
    <LinearGradient
      colors={['#3c1e75', '#30096e']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.duploCard}
    >

      {/* TÍTULO */}
      <View style={styles.atividadeHeader}>
        <Text style={styles.duploTitulo}>
          Atividade
        </Text>

        <Text style={styles.atividadeSeta}>
          ›
        </Text>
      </View>

      {/* MÊS / ANO */}
      <View style={styles.atividadeMes}>
        <Text style={styles.duploDescricao}>
          {mes}
        </Text>

        <Text style={styles.duploDescricao}>
          {ano}
        </Text>
      </View>

      {/* BOLINHAS */}
      <View style={styles.heatmapGrid}>
        {linhas.map((linha, linhaIndex) => (
          <View
            key={`linha-${linhaIndex}`}
            style={styles.heatmapLinha}
          >
            {linha.map((dia) => (
              <View
                key={dia.data}
                style={[
                  styles.heatmapBolinha,
                  {
                    backgroundColor: obterCorNivel(dia.nivel),
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </View>

      {/* LEGENDA */}
      <View style={styles.heatmapLegenda}>

        <Legenda
          cor={Cores.destaque.limao}
          label="Alta"
        />

        <Legenda
          cor="#FF8800"
          label="Baixa"
        />

        <Legenda
          cor={Cores.roxo.claro}
          label="Média"
        />

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

      <Text style={styles.legendaTexto}>
        {label}
      </Text>

    </View>
  )
}