import { Text, TouchableOpacity, View, Image } from 'react-native'
import MaskedView from '@react-native-masked-view/masked-view'
import Svg, { Defs, Mask, Rect, Circle } from 'react-native-svg'

import { styles } from './FloatingButtonStyles'
import { FloatingButtonProps } from './FloatingButtonTypes'

const NOTCH_R = 42
const FAB_R = 26
const BAR_H = 80

const ABAS = [
  { chave: 'home', icone: require("../../../../assets/icones/estrela.png")},
  { chave: 'dashboard', icone: require("../../../../assets/icones/economia2.png") },
  { chave: 'metas', icone: require("../../../../assets/icones/check.png") },
  { chave: 'fab', icone: '+' },
  { chave: 'perfil', icone: require("../../../../assets/icones/boneco.png")},
  { chave: 'calendario', icone: require("../../../../assets/icones/calendar2.png") },
  { chave: 'planoB', icone: require("../../../../assets/icones/B.png") },
]

export function FloatingButton({
  abaAtiva,
  aoPress,
}: FloatingButtonProps) {

  const leftTabs = ABAS.slice(0, 3)
  const rightTabs = ABAS.slice(4, 7)

  return (
    <View style={styles.container}>

      {/* ==================================================
          BARRA COM RECORTE CENTRAL
      ================================================== */}

      <MaskedView
        style={styles.maskContainer}
        maskElement={
          <Svg
            width="100%"
            height={BAR_H}
          >
            <Defs>
              <Mask
                id="navMask"
                x="0"
                y="0"
                width="100%"
                height={BAR_H}
              >
                {/* Barra inteira */}
                <Rect
                  x="0"
                  y="0"
                  width="100%"
                  height={BAR_H}
                  fill="white"
                  rx="20"
                />

                {/* Recorte circular */}
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
              height={BAR_H}
              fill="white"
              mask="url(#navMask)"
            />
          </Svg>
        }
      >
        <View style={styles.barra} />
      </MaskedView>


      {/* ==================================================
          ÍCONES
      ================================================== */}

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

      </View>


      {/* ==================================================
          FAB
      ================================================== */}

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