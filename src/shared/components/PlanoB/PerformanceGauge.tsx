import React from 'react'
import { View } from 'react-native'
import { Text } from '@/shared/components/Texto'
import Svg, { Path } from 'react-native-svg'

interface PerformanceGaugeProps {
  label: string
  percentual: number
  cor: string
  variacao: number
  styles: any
}

export function PerformanceGauge({
  label,
  percentual,
  cor,
  variacao,
  styles,
}: PerformanceGaugeProps) {

  const width = 190
  const height = 85
  const radius = 55
  const strokeWidth = 11

  const circumference = Math.PI * radius

  const percentualSeguro = Math.max(
    0,
    Math.min(100, percentual),
  )

  const dashOffset =
    circumference -
    (circumference * percentualSeguro) / 100

  const path = `
    M 20 70
    A ${radius} ${radius} 0 0 1 130 70
  `

  return (
    <View style={styles.performanceGaugeContainer}>

      <Svg
        width={width}
        height={height}
        viewBox="0 0 153 75"
      >

        {/* Fundo da meia lua */}

        <Path
          d={path}
          fill="none"
          stroke="#FFFFFF25"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progresso */}

        <Path
          d={path}
          fill="none"
          stroke={cor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={dashOffset}
        />

      </Svg>

      <View
        style={{
          position: 'absolute',
          top: 25,
          alignItems: 'center',
        }}
      >

        <Text style={styles.performanceGaugeValor}>
          {label}
        </Text>

        <Text
          style={
            styles.performanceGaugeLabel
          }
        >
          {variacao > 0 ? '+' : ''}
          {variacao}% Gastos
        </Text>

      </View>

    </View>
  )
}