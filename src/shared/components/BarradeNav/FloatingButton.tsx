import { useMemo, useState } from 'react'
import { Text, TouchableOpacity, View, Image, Modal, Pressable } from 'react-native'
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

// Ações do menu que abre ao tocar no +.
// "chave" é o que chega em aoPress — a navegação de cada uma
// fica a cargo de quem usa o FloatingButton (ex: o _layout.jsx).
const ACOES = [
  { chave: 'novoImprevisto', icone: require("../../../../assets/icones/B.png"), rotulo: 'Novo imprevisto' },
  { chave: 'novoGasto', textoIcone: '↓', rotulo: 'Novo gasto' },
  { chave: 'novoEvento', icone: require("../../../../assets/icones/calendar2.png"), rotulo: 'Novo evento' },
  { chave: 'reservaEmergencia', icone: require("../../../../assets/icones/saco.png"), rotulo: 'Reserva de emergência' },
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

  // Controla o menu de ações rápidas que abre ao tocar no +
  const [menuAberto, setMenuAberto] = useState(false)

  const leftTabs = ABAS.slice(0, 3)
  const rightTabs = ABAS.slice(4, 7)

  const barAltura = BAR_H + insetExtra

  function acionarMenu(chave: string) {
    setMenuAberto(false)
    aoPress(chave)
  }

  // ── Posições em arco (meia-lua) ao redor do + ──────────────
  // Ângulos em graus (0° = direita, 90° = topo, 180° = esquerda),
  // distribuídos da esquerda pra direita. Cada botão tem raio e ângulo
  // próprios: os dois de fora ficam mais baixos e mais afastados, e os
  // dois de dentro mais altos, pra o texto de um não ficar por cima do
  // círculo do vizinho (o rótulo "Reserva de emergência" ocupa 2 linhas).
  const POSICOES_ARCO = [
    { raio: 130, angulo: 166 },
    { raio: 125, angulo: 115 },
    { raio: 125, angulo: 65 },
    { raio: 130, angulo: 14 },
  ]
  // Altura aproximada do centro do botão + (soma do recuo do
  // dispositivo, já que o próprio + também sobe nesse caso).
  const CENTRO_FAB_BOTTOM = 77 + insetExtra

  return (
    <View style={styles.container}>

      {/* MENU DE AÇÕES RÁPIDAS */}

      <Modal
        transparent
        visible={menuAberto}
        animationType="fade"
        onRequestClose={() => setMenuAberto(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setMenuAberto(false)} />

        {ACOES.map((acao, indice) => {
          const { raio, angulo } = POSICOES_ARCO[indice]
          const anguloRad = (angulo * Math.PI) / 180
          const dx = raio * Math.cos(anguloRad)
          const dy = raio * Math.sin(anguloRad)

          return (
            <TouchableOpacity
              key={acao.chave}
              style={[
                styles.menuBotaoArco,
                {
                  left: '50%',
                  bottom: CENTRO_FAB_BOTTOM + dy - 29,
                  // metade da largura do botão (100) pra centralizar no +
                  transform: [{ translateX: dx - 50 }],
                },
              ]}
              onPress={() => acionarMenu(acao.chave)}
              activeOpacity={0.8}
            >
              <View style={styles.menuCirculo}>
                {acao.textoIcone ? (
                  <Text style={styles.menuIconeTexto}>{acao.textoIcone}</Text>
                ) : (
                  <Image source={acao.icone} style={styles.menuIcone} />
                )}
              </View>
              <Text style={styles.menuTexto}>{acao.rotulo}</Text>
            </TouchableOpacity>
          )
        })}
      </Modal>


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
        onPress={() => setMenuAberto(true)}
        activeOpacity={0.8}
      >

        <Text style={styles.fabIcone}>
          +
        </Text>

      </TouchableOpacity>

    </View>
  )
}