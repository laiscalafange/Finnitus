import { View, Text, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Circle } from 'react-native-svg'

import { styles } from "../../../styles/Planobstyle";

type Categoria = {
  nome: string
  valor: number
  porcentagem: number
  icone: any
  cor: string
}

type PlanoBCardProps = {
  categorias: Categoria[]
  restante: number
  mes?: string
}

function GaugeCircular({
  tamanho = 180,
  label,
  sublabel,
  segmentos,
}: {
  tamanho?: number
  label: string
  sublabel: string
  segmentos: {
    pct: number
    cor: string
  }[]
}) {
  const r = (tamanho - 18) / 2
  const cx = tamanho / 2
  const cy = tamanho / 2
  const circunferencia = 2 * Math.PI * r

  return (
    <View
      style={{
        width: tamanho,
        height: tamanho,
        position: 'relative',
      }}
    >
      <Svg
        width={tamanho}
        height={tamanho}
        style={{
          transform: [{ rotate: '-90deg' }],
        }}
      >
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#ffffff15"
          strokeWidth={18}
        />

        {segmentos.map((seg, i) => {
          const len =
            (seg.pct / 100) * circunferencia

          const offset =
            segmentos
              .slice(0, i)
              .reduce(
                (acc, item) =>
                  acc +
                  (item.pct / 100) *
                    circunferencia,
                0,
              )

          return (
            <Circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.cor}
              strokeWidth={18}
              strokeDasharray={`${len} ${
                circunferencia - len
              }`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          )
        })}
      </Svg>

      <View
        style={{
          position: 'absolute',
          inset: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={styles.gaugeLabel}>
          {label}
        </Text>

        <Text style={styles.gaugeSublabel}>
          {sublabel}
        </Text>
      </View>
    </View>
  )
}

export function PlanoBCard({
  categorias,
  restante,
  mes = 'Mês',
}: PlanoBCardProps) {
  return (
    <LinearGradient
      colors={['#3c1e75bd', '#30096e']}
      style={styles.card}
    >
      <View style={styles.planoBHeader}>
        <Text style={styles.planoBNav}>
          ◂ {mes} ▸
        </Text>

        <Text style={styles.planoBNav}>
          Status
        </Text>
      </View>

      <View style={styles.planoBCorpo}>
        <GaugeCircular
          tamanho={180}
          label={restante.toLocaleString(
            'pt-BR',
            {
              minimumFractionDigits: 2,
            },
          )}
          sublabel="Restantes"
          segmentos={categorias.map(cat => ({
            cor: cat.cor,
            pct: cat.porcentagem,
          }))}
        />

        <View style={styles.categoriaLista}>
          {categorias.map(cat => (
            <View
              key={cat.nome}
              style={styles.categoriaItem}
            >
              <Image
  source={cat.icone}
  style={styles.categoriaIcone}
/>

              <View>
                <Text style={styles.categoriaNome}>
                  {cat.nome}
                </Text>

                <Text style={styles.categoriaValor}>
                  R$
                  {cat.valor.toLocaleString(
                    'pt-BR',
                    {
                      minimumFractionDigits: 2,
                    },
                  )}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </LinearGradient>
  )
}