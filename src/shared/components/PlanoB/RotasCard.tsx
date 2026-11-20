import React from 'react'
import { View } from 'react-native'
import { Text } from '@/shared/components/Texto'
import { useExibirValores, useMoedaVisivel } from '@/features/configuracoesContext'
import Svg, { Circle } from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'

import { FONTS } from '../../constants/Tipografia'
import { CATEGORIAS_POR_ID } from '@/features/menuMais/constants'

export interface RotaCategoria {
  // Mesmo id das categorias do Novo gasto (src/features/menuMais/constants.ts)
  categoriaId: string
  valor: number
  percentual: number
  cor: string
  tendencia?: 'up' | 'down' | 'stable'
}

interface RotasCardProps {
  titulo: string
  total: number
  categorias: RotaCategoria[]
  sobra?: number
  sobraTexto?: string
  // Mensagem mostrada no lugar da lista quando não há categorias
  vazio?: string
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
  sobra,
  sobraTexto,
  vazio,
  styles,
}: RotasCardProps) {
  const exibir = useExibirValores()
  const moedaVisivel = useMoedaVisivel()

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

          {/* Sem categorias (totalPercentual 0) só aparece a trilha */}
          {totalPercentual > 0 && categorias.map((categoria) => {

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
                key={categoria.categoriaId}
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
            {exibir(formatarMoeda(total))}
          </Text>
        </View>
      </View>


      {/* CATEGORIAS: o ícone (mesmo do Novo gasto) já usa a cor do gráfico,
          por isso não tem nome nem pontinho de cor */}

      <View style={styles.rotasCategorias}>

        {categorias.map((categoria) => {

          const item =
            CATEGORIAS_POR_ID[categoria.categoriaId] ??
            CATEGORIAS_POR_ID.outros

          const Icone = item.icone

          return (
            <View
              key={categoria.categoriaId}
              style={styles.rotasCategoriaLinha}
            >

              <View
                style={{ flex: 1 }}
                accessible
                accessibilityLabel={item.rotulo}
              >
                <Icone size={18} color={categoria.cor} />
              </View>

              <Text style={styles.rotasCategoriaValor}>
                {exibir(formatarMoeda(categoria.valor))}
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
          )
        })}

      </View>


      {/* MENSAGEM QUANDO NÃO HÁ O QUE MOSTRAR */}

      {vazio && (
        <Text style={styles.rotasSobraTexto}>
          {vazio}
        </Text>
      )}


      {/* SOBRA */}

      {sobra !== undefined && (
        <Text style={styles.rotasSobra}>
          Sobra: {moedaVisivel(sobra)}
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
