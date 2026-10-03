import { useState } from 'react'
import { View, ScrollView, Text, TouchableOpacity, Pressable, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
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
import { percentualMeta, textoPrazo, type Meta } from '../../features/metasData'

import MetasFrame from './MetasFrame'

export default function Metas() {
  // Hook de navegação do Expo Router
  const router = useRouter()

  // Todas as telas de Metas usam essa mesma lista (FinanceiroProvider)
  const { metas, movimentarMeta, excluirMeta } = useFinanceiro()

  // Só as metas em andamento aparecem aqui (as concluídas e canceladas
  // ficam no Histórico)
  const metasDoMes = metas.filter(meta => meta.tipo === 'mes' && meta.status === 'andamento')
  const metasLongoPrazo = metas.filter(meta => meta.tipo === 'longoPrazo' && meta.status === 'andamento')

  // Meta tocada no card, card flutuante aberto e menu (⋮) aberto
  const [metaAtivaId, setMetaAtivaId] = useState<string | null>(null)
  const [modal, setModal] = useState<TipoModalReserva | null>(null)
  const [menuAbertoId, setMenuAbertoId] = useState<string | null>(null)

  // "Meta alcançada!" quando um depósito completa o valor da meta
  const [alcancada, setAlcancada] = useState<{ nome: string; valor: number } | null>(null)

  const metaAtiva = metas.find(meta => meta.id === metaAtivaId)

  // Tocar no card: abre o modal com os botões "Depositar" e "Retirar"
  function abrirMovimentar(meta: Meta) {
    setMenuAbertoId(null)
    setMetaAtivaId(meta.id)
    setModal('movimentar')
  }

  // "Excluir meta" do menu (⋮): pede confirmação antes de excluir
  function abrirExcluir(meta: Meta) {
    setMenuAbertoId(null)
    setMetaAtivaId(meta.id)
    setModal('excluir')
  }

  // Trata a confirmação de cada card
  function confirmarModal(valor: number, acao?: 'depositar' | 'retirar') {
    if (!metaAtiva) {
      setModal(null)
      return
    }

    if (modal === 'excluir') {
      excluirMeta(metaAtiva.id)
      setModal(null)
      setMetaAtivaId(null)
      return
    }

    if (modal === 'movimentar' && acao) {
      const resultado = movimentarMeta(
        metaAtiva.id,
        acao === 'depositar' ? 'deposito' : 'retirada',
        valor,
      )

      // Retirou mais do que tem guardado
      if (resultado === 'saldoInsuficiente') {
        setModal('saldoInsuficiente')
        return
      }

      setModal(null)

      // O depósito completou o valor da meta
      if (resultado === 'concluida') {
        setAlcancada({
          nome: metaAtiva.nome,
          valor: (Math.round(metaAtiva.valorAtual * 100) + Math.round(valor * 100)) / 100,
        })
      }

      return
    }

    // "Entendi" do aviso de saldo insuficiente
    setModal(null)
  }

  return (
    <View style={styles.container}>
      {/* Fundo gradiente compartilhado (componente próprio, diferente
          das outras telas que usam LinearGradient direto) */}
      <BackgroundGradient />

      <ScrollView style={styles.scroll}>

        {/* Cabeçalho com calendário da semana + ações de adicionar/editar meta */}
        <CalendarioSemana
          titulo="Metas"
          subtitulo="Financeiras"
          aoSelecionarDia={(data) => console.log(data)}
          mostrarAcoes
          aoPressAdicionar={() => router.push('/MetasFuturas')}
          // TODO: ajustar "/editar-metas" pro nome real da rota de edição de metas
          aoPressEditar={() => router.push('/')}
        />

        <View style={styles.conteudo}>

          {/* ── ANÁLISES / HISTÓRICO ── */}
          <View style={styles.navRow}>

            {/* ANÁLISES — leva pra tela de análises financeiras das metas */}
            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push('/MetasAnalises')}
            >
              <LinearGradient
                colors={[Cores.fundo.destaque, '#5a2dc7']}
                style={styles.navCaixa}
              >
                <Image
                  source={require('../../../assets/icones/analise.png')}
                  style={styles.navIconeS}
                />
              </LinearGradient>

              <Text style={styles.navTextoEsquerda}>
                Análises
              </Text>
            </TouchableOpacity>

            {/* HISTÓRICO — leva pra tela com as metas concluídas e canceladas */}
            <TouchableOpacity
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={() => router.push('/MetasHistorico')}
            >
              <LinearGradient
                colors={[Cores.fundo.destaque, '#5a2dc7']}
                style={styles.navCaixa}
              >
                <Image
                  source={require('../../../assets/icones/historicoM.png')}
                  style={styles.navIconeH}
                />
              </LinearGradient>

              <Text style={styles.navTextoDireita}>
                Histórico
              </Text>
            </TouchableOpacity>

          </View>

          {/* ── METAS DO MÊS ── */}
          <Text style={styles.secaoTitulo}>
            Metas do mês
          </Text>

          <View style={styles.metasLista}>
            {metasDoMes.length === 0 ? (
              <Text style={styles.vazio}>
                Nenhuma meta do mês. Toque no + para criar uma.
              </Text>
            ) : null}

            {metasDoMes.map(meta => {
              // Porcentagem preenchida da barra de progresso (limitada a 100%)
              const pct = percentualMeta(meta)

              // Dia/mês do prazo (ex.: 14/10), se a meta tem data limite
              const dataCurta = meta.dataLimite?.slice(0, 5)

              return (
                <View key={meta.id} style={styles.metaLinha}>
                  <View style={styles.metaPonto} />

                  {/* Card inteiro é clicável — abre o modal pra depositar ou
                      retirar dinheiro dessa meta */}
                  <TouchableOpacity
                    style={styles.metaCardWrapper}
                    activeOpacity={0.85}
                    onPress={() => abrirMovimentar(meta)}
                  >
                    <LinearGradient
                      colors={[Cores.fundo.destaque, '#330e6d']}
                      style={styles.metaCard}
                    >
                      <View style={styles.metaHeader}>

                        <View style={styles.metaIconeContainer}>
                          <Image
                            source={require('../../../assets/icones/IconMetas.png')}
                            style={styles.metaIcone}
                          />
                        </View>

                        <Text style={styles.metaNome} numberOfLines={1}>
                          {meta.nome}
                        </Text>

                        {/* Menu aberto: mostra a opção "Excluir meta" no lugar da data */}
                        {menuAbertoId === meta.id ? (
                          <Pressable
                            style={styles.metaMenuOpcao}
                            onPress={() => abrirExcluir(meta)}
                            accessibilityRole="button"
                          >
                            <Trash2 size={14} color={Cores.texto.claro} />
                            <Text style={styles.metaMenuTexto}>Excluir meta</Text>
                          </Pressable>
                        ) : dataCurta ? (
                          <Text style={styles.metaData}>
                            {dataCurta}
                          </Text>
                        ) : null}

                        {/* Menu de opções (⋮) — abre/fecha "Excluir meta" sem
                            disparar o clique do card inteiro */}
                        <Pressable
                          hitSlop={10}
                          onPress={() =>
                            setMenuAbertoId(atual => (atual === meta.id ? null : meta.id))
                          }
                          accessibilityRole="button"
                          accessibilityLabel="Opções da meta"
                        >
                          <Text style={styles.metaMenu}>
                            ⋮
                          </Text>
                        </Pressable>

                      </View>

                      <View style={styles.metaBarraFundo}>
                        <View
                          style={[
                            styles.metaBarraPreenchida,
                            { width: `${pct}%` },
                          ]}
                        />
                      </View>

                      <View style={styles.metaFooter}>
                        <Text style={styles.metaPrazo}>
                          {textoPrazo(meta.dataLimite)}
                        </Text>

                        <Text style={styles.metaValor}>
                          {formatarMoeda(meta.valorAtual)} de {formatarMoeda(meta.valorTotal)}
                        </Text>
                      </View>

                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>

          {/* ── METAS LONGO PRAZO ── */}
          <Text style={styles.secaoTitulo}>
            Metas longo prazo
          </Text>

          <View style={styles.longoPrazoGrid}>
            {metasLongoPrazo.map(meta => (
              // Cada card de meta de longo prazo leva pros detalhes dela
              <TouchableOpacity
                key={meta.id}
                style={styles.longoPrazoCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: '/MetasDetalhes',
                    params: { id: meta.id },
                  })
                }
              >
                <LinearGradient
                  colors={[Cores.fundo.destaque, '#5a2dc7']}
                  style={styles.longoPrazoGradiente}
                >
                  <Text style={styles.longoPrazoNome}>
                    {meta.nome}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}

            {/* Card "+" — leva pra tela de criação de nova meta */}
            <TouchableOpacity
              style={styles.longoPrazoCard}
              activeOpacity={0.8}
              onPress={() => router.push('/MetasFuturas')}
            >
              <View style={styles.adicionarCard}>
                <Text style={styles.adicionarTexto}>+</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Card flutuante: depositar/retirar (um só, com dois botões) e excluir */}
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
              params: { id: metaAtiva.id },
            })
          }
        }}
      />

      {/* "Meta alcançada!" quando um depósito completa o valor da meta */}
      <MetasFrame
        visible={alcancada !== null}
        tipo="alcancada"
        nome={alcancada?.nome}
        valor={alcancada?.valor}
        onClose={() => setAlcancada(null)}
      />
    </View>
  )
}