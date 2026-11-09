
import { useState } from 'react'
import {
  Alert,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native'
import { errorMessage } from '@/services/api'
import { useRouter } from 'expo-router'
import { Trash2 } from 'lucide-react-native'

import { CalendarioSemana } from '../../shared/components/CalendarioSemana'
import { BackgroundGradient } from '../../shared/components/backgroundGradient'
import { styles } from '../../styles/metas'
import { Cores } from '../../shared/constants/Cores'

import { ModalReserva } from '@/features/menuMais/components/ModalReserva'
import { formatarMoeda } from '@/features/menuMais/utils'
import type { TipoModalReserva } from '@/features/menuMais/types'
import { useFinanceiro } from '../../features/financeiroContext'
import {
  percentualMeta,
  textoPrazo,
  type Meta,
} from '../../features/metasData'

import MetasFrame from './MetasFrame'

export default function Metas() {
  const router = useRouter()

  const {
    metas,
    movimentarMeta,
    excluirMeta,
  } = useFinanceiro()

  const metasDoMes = metas.filter(
    meta =>
      meta.tipo === 'mes' &&
      meta.status === 'andamento'
  )

  const metasLongoPrazo = metas.filter(
    meta =>
      meta.tipo === 'longoPrazo' &&
      meta.status === 'andamento'
  )

  const [metaAtivaId, setMetaAtivaId] =
    useState<string | null>(null)

  const [modal, setModal] =
    useState<TipoModalReserva | null>(null)

  const [menuAbertoId, setMenuAbertoId] =
    useState<string | null>(null)

  const [alcancada, setAlcancada] =
    useState<{
      nome: string
      valor: number
    } | null>(null)

  const metaAtiva = metas.find(
    meta => meta.id === metaAtivaId
  )

  const diasMarcados = metas
    .filter(
      meta =>
        meta.status === 'andamento' &&
        meta.dataLimite
    )
    .map(meta => {
      const [dia, mes, ano] =
        (meta.dataLimite as string).split('/')

      return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
    })

  function abrirMovimentar(meta: Meta) {
  setMenuAbertoId(null)

  if (!meta.configurada) {
    Alert.alert(
      'Meta não configurada',
      'Registre o valor limite a ser alcançado para começar a acompanhar esta meta.'
    )
    return
  }

  setMetaAtivaId(meta.id)
  setModal('movimentar')
}
  function abrirExcluir(meta: Meta) {
    setMenuAbertoId(null)
    setMetaAtivaId(meta.id)
    setModal('excluir')
  }

  async function confirmarModal(
    valor: number,
    acao?: 'depositar' | 'retirar'
  ) {
    if (!metaAtiva) {
      setModal(null)
      return
    }

    if (modal === 'excluir') {
      try {
        await excluirMeta(metaAtiva.id)

        setModal(null)
        setMetaAtivaId(null)
      } catch (error) {
        Alert.alert(
          'Erro ao cancelar meta',
          errorMessage(error)
        )
      }

      return
    }

    if (modal === 'movimentar' && acao) {
      try {
        const resultado = await movimentarMeta(
          metaAtiva.id,
          acao === 'depositar'
            ? 'deposito'
            : 'retirada',
          valor
        )

        if (resultado === 'saldoInsuficiente') {
          setModal('saldoInsuficiente')
          return
        }

        if (resultado === 'naoEncontrada') {
          Alert.alert(
            'Meta não encontrada',
            'Atualize suas metas e tente novamente.'
          )
          return
        }

        setModal(null)

        if (resultado === 'concluida') {
          setAlcancada({
            nome: metaAtiva.nome,
            valor:
              (
                Math.round(
                  metaAtiva.valorAtual * 100
                ) +
                Math.round(valor * 100)
              ) / 100,
          })
        }
      } catch (error) {
        Alert.alert(
          'Erro na movimentação',
          errorMessage(error)
        )
      }

      return
    }

    setModal(null)
  }

  return (
    <View style={styles.container}>
      <BackgroundGradient />

      <ScrollView style={styles.scroll}>
        <CalendarioSemana
          titulo="Metas"
          subtitulo="Financeiras"
          diasMarcados={diasMarcados}
        />

        <View style={styles.conteudo}>
          {/* ANÁLISES E HISTÓRICO */}

          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() =>
                router.push('/MetasAnalises')
              }
            >
              <View style={styles.navCaixa}>
                <Image
                  source={require('../../../assets/icones/analise.png')}
                  style={styles.navIconeS}
                />
              </View>

              <Text style={styles.navTextoEsquerda}>
                Análises
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() =>
                router.push('/MetasHistorico')
              }
            >
              <View style={styles.navCaixa}>
                <Image
                  source={require('../../../assets/icones/historicoM.png')}
                  style={styles.navIconeH}
                />
              </View>

              <Text style={styles.navTextoDireita}>
                Histórico
              </Text>
            </TouchableOpacity>
          </View>

          {/* METAS DO MÊS */}

          <Text style={styles.secaoTitulo}>
            Metas do mês
          </Text>

          <View style={styles.metasLista}>
            {metasDoMes.length === 0 ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/MetasFuturas',
                    params: {
                      tipo: 'mes',
                    },
                  })
                }
              >
                <View style={styles.semMetaCard}>
                  <Text style={styles.semMetaTitulo}>
                    Nenhuma meta do mês criada
                  </Text>

                  <Text style={styles.semMetaTexto}>
                    Toque aqui para criar sua primeira
                    meta do mês.
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            {metasDoMes.map(meta => {
              const pct = percentualMeta(meta)
              const dataCurta =
                meta.dataLimite?.slice(0, 5)

              return (
                <View
                  key={meta.id}
                  style={styles.metaLinha}
                >
                  <View style={styles.metaPonto} />

                  <TouchableOpacity
                    style={styles.metaCardWrapper}
                    activeOpacity={0.85}
                    onPress={() =>
                      abrirMovimentar(meta)
                    }
                  >
                    <View style={styles.metaCard}>
                      <View style={styles.metaHeader}>
                        <View
                          style={
                            styles.metaIconeContainer
                          }
                        >
                          <Image
                            source={require('../../../assets/icones/presente.png')}
                            style={styles.metaIcone}
                          />
                        </View>

                        <Text
                          style={styles.metaNome}
                          numberOfLines={1}
                        >
                          {meta.nome}
                        </Text>

                        {menuAbertoId === meta.id ? (
                          <Pressable
                            style={
                              styles.metaMenuOpcao
                            }
                            onPress={() =>
                              abrirExcluir(meta)
                            }
                            accessibilityRole="button"
                          >
                            <Trash2
                              size={14}
                              color={
                                Cores.texto.claro
                              }
                            />

                            <Text
                              style={
                                styles.metaMenuTexto
                              }
                            >
                              Excluir meta
                            </Text>
                          </Pressable>
                        ) : dataCurta ? (
                          <Text
                            style={styles.metaData}
                          >
                            {dataCurta}
                          </Text>
                        ) : null}

                        <Pressable
                          hitSlop={10}
                          onPress={() =>
                            setMenuAbertoId(
                              atual =>
                                atual === meta.id
                                  ? null
                                  : meta.id
                            )
                          }
                          accessibilityRole="button"
                          accessibilityLabel="Opções da meta"
                        >
                          <Text
                            style={styles.metaMenu}
                          >
                            ⋮
                          </Text>
                        </Pressable>
                      </View>

                      <View
                        style={
                          styles.metaBarraFundo
                        }
                      >
                        <View
                          style={[
                            styles.metaBarraPreenchida,
                            {
                              width: `${pct}%`,
                            },
                          ]}
                        />
                      </View>

                      <View
                        style={styles.metaFooter}
                      >
                        <Text
                          style={styles.metaPrazo}
                        >
                          {textoPrazo(
                            meta.dataLimite
                          )}
                        </Text>

                        <Text
                          style={styles.metaValor}
                        >
                          {formatarMoeda(
                            meta.valorAtual
                          )}{' '}
                          de{' '}
                          {formatarMoeda(
                            meta.valorTotal
                          )}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>

          {/* METAS DE LONGO PRAZO */}

          <Text style={styles.secaoTitulo}>
            Metas longo prazo
          </Text>

          <View style={styles.longoPrazoGrid}>
            {metasLongoPrazo.map(meta => (
              <TouchableOpacity
                key={meta.id}
                style={styles.longoPrazoCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/MetasDetalhes',
                    params: {
                      id: meta.id,
                    },
                  })
                }
              >
                <View
                  style={
                    styles.longoPrazoGradiente
                  }
                >
                  <Text
                    style={styles.longoPrazoNome}
                  >
                    {meta.nome}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.longoPrazoCard}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/MetasFuturas',
                  params: {
                    tipo: 'longoPrazo',
                  },
                })
              }
            >
              <View
                style={styles.adicionarCard}
              >
                <Text
                  style={styles.adicionarTexto}
                >
                  +
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE MOVIMENTAÇÃO E EXCLUSÃO */}

      <ModalReserva
        tipo={modal}
        saldo={metaAtiva?.valorAtual ?? 0}
        alvo="meta"
        titulo={metaAtiva?.nome}
        aoFechar={() => setModal(null)}
        aoConfirmar={confirmarModal}
        aoVerDetalhes={() => {
          setModal(null)

          if (metaAtiva) {
            router.push({
              pathname: '/MetasDetalhes',
              params: {
                id: metaAtiva.id,
              },
            })
          }
        }}
      />

      {/* META ALCANÇADA */}

      <MetasFrame
        visible={alcancada !== null}
        tipo="alcancada"
        nome={alcancada?.nome}
        valor={alcancada?.valor}
        onClose={() =>
          setAlcancada(null)
        }
      />
    </View>
  )
}
