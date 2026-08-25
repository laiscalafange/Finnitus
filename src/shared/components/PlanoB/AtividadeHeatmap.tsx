import { View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { Cores } from '../../../shared/constants/Cores'
import { styles } from "../../../styles/Planobstyle";

type DiaAtividade = {
  data: string
  nivel: 'alta' | 'media' | 'baixa' | 'nenhuma'
}

type AtividadeHeatmapProps = {
  mes: string
  ano: number
  dias: DiaAtividade[]
}

const CORES_NIVEL = {
  alta: Cores.destaque.limao,
  media: Cores.roxo.claro,
  baixa: '#FF8800',
  nenhuma: '#ffffff20',
}

function obterCorNivel(nivel: string) {
  switch (nivel) {
    case 'alta':
      return '#B7FF00'

    case 'baixa':
      return '#FF8800'

    case 'media':
      return '#9A6CFF'

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
          Atividade
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

      <Text
        style={[
          styles.duploDescricao,
          {
            marginBottom: 6,
          },
        ]}
      >
        {mes}      {ano}
      </Text>

      <View style={styles.heatmapGrid}>

  <View style={styles.heatmapLinha}>
    {dias.slice(0, 15).map((dia) => (
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

  <View style={styles.heatmapLinha}>
    {dias.slice(15, 30).map((dia) => (
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

</View>

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