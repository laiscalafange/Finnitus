import React from 'react'
import { View, Text } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'

export interface RotaCategoria {
  nome: string
  valor: number
  percentual: number
  cor: string
  tendencia?: 'up' | 'down' | 'stable'
}

interface RotasCardProps {
  titulo: string
  total: number
  categorias: RotaCategoria[]
  resumo: string[]
  sobra?: number
  styles: any
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function RotasCard({
  titulo,
  total,
  categorias,
  resumo,
  sobra,
  styles,
}: RotasCardProps) {
  const radius = 50
  const centro = 60
  const strokeWidth = 13

  const circumference = 2 * Math.PI * radius

  const totalPercentual = categorias.reduce(
    (totalAtual, categoria) =>
      totalAtual + categoria.percentual,
    0,
  )

  let acumulado = 0

  return (
    <LinearGradient
      colors={['#3c1e75bd', '#30096e']}
      style={[
        styles.duploCard,
        {
          flex: 1,
          minHeight: 400,
        },
      ]}
    >
      {/* ==========================================
          TÍTULO
      ========================================== */}

      <Text style={[
        styles.duploTitulo, {
             fontSize: 20,
        }
        ]}>
        {titulo}
      </Text>

      {/* ==========================================
          GAUGE
      ========================================== */}

      <View
        style={{
          height: 180,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg
          width={145}
          height={145}
          viewBox="3 2 120 110"
        >
          {/* Fundo do gauge */}

          <Circle
            cx={centro}
            cy={centro}
            r={radius}
            fill="none"
            stroke="#FFFFFF10"
            strokeWidth={strokeWidth}
          />

          {/* Categorias */}

          {categorias.map((categoria) => {
            const tamanho =
              circumference *
              (categoria.percentual / totalPercentual)

            const offset =
              -(
                circumference *
                acumulado /
                totalPercentual
              )

            acumulado += categoria.percentual

            return (
              <Circle
                key={categoria.nome}
                cx={centro}
                cy={centro}
                r={radius}
                fill="none"
                stroke={categoria.cor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${tamanho} ${circumference}`}
                strokeDashoffset={offset}
                rotation="-90"
                origin={`${centro}, ${centro}`}
              />
            )
          })}
        </Svg>

        {/* Valor central */}

        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            marginBottom:5,
          }}
        >
          <Text
            style={[
              styles.gaugeLabel,
              {
                fontSize: 24,
              },
            ]}
          >
            {formatarMoeda(total)}
          </Text>
        </View>
      </View>

      {/* ==========================================
          CATEGORIAS
      ========================================== */}

      <View
        style={{
          gap: 3,
          marginTop: 4,
        }}
      >
        {categorias.map((categoria) => (
          <View
            key={categoria.nome}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {/* Indicador */}

            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: categoria.cor,
              }}
            />

            {/* Nome */}

            <Text
              style={{
                flex: 1,
                fontSize: 15,
                color: '#B9FF00',
              }}
            >
              {categoria.nome}
            </Text>

            {/* Valor */}

            <Text
              style={{
                fontSize: 14,
                color: '#ad7dfb',
              }}
            >
              {formatarMoeda(categoria.valor)}
            </Text>

            {/* Percentual */}

            <Text
              style={{
                fontSize: 14,
                color: '#c49fff',
                width: 28,
                textAlign: 'right',
              }}
            >
              {categoria.percentual}%
            </Text>

            {/* Tendência */}

            {categoria.tendencia && (
              <Text
                style={{
                  fontSize: 18,
                  color: '#B9FF00',
                }}
              >
                {categoria.tendencia === 'up'
                  ? '↑'
                  : categoria.tendencia === 'down'
                    ? '↓'
                    : '→'}
              </Text>
            )}
          </View>
        ))}
      </View>

      {/* ==========================================
          RESUMO
      ========================================== */}

      <Text
        style={[
          styles.duploTitulo,
          {
            marginTop: 5,
            marginBottom: 5,
            fontSize:18,
            padding:2,
          },
        ]}
      >
        Resumo
      </Text>

      {resumo.map((item) => (
        <Text
          key={item}
          style={{
            fontSize: 15,
            color: '#914DFF',
            lineHeight: 16,
          }}
        >
          {item}
        </Text>
      ))}

      {/* ==========================================
          SOBRA
      ========================================== */}

      {sobra !== undefined && (
        <Text
          style={{
            marginTop: 24,
            fontSize: 14,
            color: '#af7ffe',
          }}
        >
          Sobra: R$ {formatarMoeda(sobra)}
        </Text>
      )}
    </LinearGradient>
  )
}