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

// Mesmas cores da tela Atividade (NIVEIS_ATIVIDADE), pra o mesmo dia ter a
// mesma cor nos dois lugares. Só o "nenhuma" é mais claro aqui, porque o
// fundo do card é roxo.
function obterCorNivel(nivel: string) {
  if (nivel === 'nenhuma') {
    return '#FFFFFF20'
  }

  return (
    NIVEIS_ATIVIDADE.find((item) => item.id === nivel)?.cor ?? '#FFFFFF20'
  )
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

        {NIVEIS_ATIVIDADE.filter((nivel) => nivel.id !== 'nenhuma').map(
          (nivel) => (
            <Legenda
              key={nivel.id}
              cor={nivel.cor}
              label={nivel.rotulo}
            />
          ),
        )}

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