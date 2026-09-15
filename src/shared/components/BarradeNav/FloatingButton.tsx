import { useMemo } from 'react'
import { Text, TouchableOpacity, View, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MaskedView from '@react-native-masked-view/masked-view'
import Svg, { Defs, Mask, Rect, Circle } from 'react-native-svg'

import { getStyles } from './FloatingButtonStyles'
import { FloatingButtonProps } from './FloatingButtonTypes'

const NOTCH_R = 42
const FAB_R = 26
const BAR_H = 80

const ABAS = [
  {
    chave: 'home',
    icone: require("../../../../assets/icones/estrela.png"),
  },
  {
    chave: 'dashboard',
    icone: require("../../../../assets/icones/economia2.png"),
  },
  {
    chave: 'metas',
    icone: require("../../../../assets/icones/check.png"),
  },
  {
    chave: 'fab',
    icone: '+',
  },
  {
    chave: 'calendario',
    icone: require("../../../../assets/icones/calendar2.png"),
  },
  {
    chave: 'planoB',
    icone: require("../../../../assets/icones/B.png"),
  },
  {
    chave: 'maisOpcoes',
    icone: '⋮',
  },
]

export function FloatingButton({
  abaAtiva,
  aoPress,
}: FloatingButtonProps) {

  const insets = useSafeAreaInsets()

  const insetExtra = insets.bottom > 24 ? insets.bottom : 0

  const styles = useMemo(
    () => getStyles(insetExtra),
    [insetExtra]
  )

  const leftTabs = ABAS.slice(0, 3)
  const rightTabs = ABAS.slice(4, 7)

  const barAltura = BAR_H + insetExtra

  return (
    <View style={styles.container}>

      {/* BARRA COM RECORTE CENTRAL */}

      <MaskedView
        style={styles.maskContainer}
        maskElement={
          <Svg
            width="100%"
            height={barAltura}
          >
            <Defs>
              <Mask
                id="navMask"
                x="0"
                y="0"
                width="100%"
                height={barAltura}
              >

                <Rect
                  x="0"
                  y="0"
                  width="100%"
                  height={barAltura}
                  fill="white"
                  rx="20"
                />

                <Circle
                  cx="50%"
                  cy="0"
                  r={NOTCH_R}
                  fill="black"
                />

              </Mask>
            </Defs>

            <Rect
              x="0"
              y="0"
              width="100%"
              height={barAltura}
              fill="white"
              mask="url(#navMask)"
            />

          </Svg>
        }
      >
        <View style={styles.barra} />
      </MaskedView>


      {/* ÍCONES */}

      <View style={styles.conteudo}>

        {/* ESQUERDA */}

        <View style={styles.grupo}>

          {leftTabs.map((aba) => (

            <TouchableOpacity
              key={aba.chave}
              style={styles.aba}
              onPress={() => aoPress(aba.chave)}
              activeOpacity={0.7}
            >

              <Image
                source={aba.icone}
                style={[
                  styles.icone,
                  abaAtiva === aba.chave && styles.iconeAtivo,
                ]}
              />

            </TouchableOpacity>

          ))}

        </View>


        {/* ESPAÇO DO FAB */}

        <View
          style={{
            width: FAB_R * 2 + 50,
          }}
        />


        {/* DIREITA */}

        <View style={styles.grupo}>

          {rightTabs.map((aba) => (

            <TouchableOpacity
              key={aba.chave}
              style={styles.aba}
              onPress={() => aoPress(aba.chave)}
              activeOpacity={0.7}
            >

              {aba.chave === 'maisOpcoes' ? (

                <Text
                  style={[
                    styles.maisOpcoes,
                    abaAtiva === aba.chave &&
                      styles.maisOpcoesAtivo,
                  ]}
                >
                  ⋮
                </Text>

              ) : (

                <Image
                  source={aba.icone}
                  style={[
                    styles.icone,
                    abaAtiva === aba.chave &&
                      styles.iconeAtivo,
                  ]}
                />

              )}

            </TouchableOpacity>

          ))}

        </View>

      </View>


      {/* BOTÃO + */}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => aoPress('fab')}
        activeOpacity={0.8}
      >

        <Text style={styles.fabIcone}>
          +
        </Text>

      </TouchableOpacity>

    </View>
  )
}