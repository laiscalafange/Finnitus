import React from 'react'
import { View, Text } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'

import { Cores } from '../../constants/Cores'
import { FONTS } from '../../constants/Tipografia'

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
  sobraTexto?: string
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
  sobraTexto,
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

      {/* TÍTULO */}

      <Text
        style={[
          styles.duploTitulo,
          {
            fontFamily: FONTS.raleway.extrabold,
            fontSize: 20,
          },
        ]}
      >
        {titulo}
      </Text>


      {/* GAUGE */}

      <View style={styles.rotasGaugeContainer}>
        <Svg
          width={145}
          height={145}
          viewBox="3 2 120 110"
        >

          <Circle
            cx={centro}
            cy={centro}
            r={radius}
            fill="none"
            stroke="#FFFFFF10"
            strokeWidth={strokeWidth}
          />

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

        <View style={styles.rotasGaugeValor}>
          <Text style={styles.gaugeLabel}>
            {formatarMoeda(total)}
          </Text>
        </View>
      </View>


      {/* CATEGORIAS */}

      <View style={styles.rotasCategorias}>

        {categorias.map((categoria) => (

          <View
            key={categoria.nome}
            style={styles.rotasCategoriaLinha}
          >

            <View
              style={[
                styles.rotasIndicador,
                {
                  backgroundColor: categoria.cor,
                },
              ]}
            />

            <Text style={styles.rotasCategoriaNome}>
              {categoria.nome}
            </Text>

            <Text style={styles.rotasCategoriaValor}>
              {formatarMoeda(categoria.valor)}
            </Text>

            <Text style={styles.rotasCategoriaPercentual}>
              {categoria.percentual}%
            </Text>

            {categoria.tendencia && (
              <Text style={styles.rotasTendencia}>
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


      {/* RESUMO */}

      <Text style={styles.rotasResumoTitulo}>
        Resumo
      </Text>

      <View style={styles.rotasResumo}>

        {resumo.map((item) => (

          <Text
            key={item}
            style={styles.rotasResumoTexto}
          >
            {item}
          </Text>

        ))}

      </View>


      {/* SOBRA */}

      {sobra !== undefined && (
        <Text style={styles.rotasSobra}>
          Sobra: R$ {formatarMoeda(sobra)}
        </Text>
      )}

      {sobraTexto && (
        <Text style={styles.rotasSobraTexto}>
          {sobraTexto}
        </Text>
      )}

    </LinearGradient>
  )
}