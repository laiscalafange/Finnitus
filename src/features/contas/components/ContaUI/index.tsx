
import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, TouchableOpacity, View } from 'react-native'
import { Text } from '@/shared/components/Texto'
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native'
import { Card } from '@/shared/components/Cards'
import { Cores } from '@/shared/constants/Cores'
import { formatarMoeda } from '@/features/menuMais/utils'
import { useMoedaVisivel } from '@/features/configuracoesContext'
// Mesmo card flutuante dos modais de Metas/Reserva (fundo escurecido + X)
import { styles as modal } from '@/features/menuMais/components/ModalReserva/styles'
import {
  competenciaAnterior,
  competenciaSeguinte,
  diaMes,
  diferencaDaConta,
  nomeCompetencia,
  rotuloData,
  rotuloStatus,
  type Competencia,
  type ContaDoMes,
  type StatusConta,
} from '../../contasData'
import { styles } from '../../styles'

// ─────────────────────────────────────────────────────────────
// Peças compartilhadas pelas telas de contas
// ─────────────────────────────────────────────────────────────

// Cores do selo de cada status (o texto do status sempre aparece escrito)
const TONS: Record<StatusConta, { cor: string; fundo: string }> = {
  paga: { cor: Cores.estado.sucesso, fundo: 'rgba(34, 197, 94, 0.18)' },
  recebida: { cor: Cores.estado.sucesso, fundo: 'rgba(34, 197, 94, 0.18)' },
  pendente: { cor: Cores.estado.alerta, fundo: 'rgba(255, 204, 1, 0.16)' },
  atrasada: { cor: Cores.estado.erro, fundo: 'rgba(239, 68, 68, 0.2)' },
  emDia: { cor: Cores.texto.claro, fundo: Cores.overlay.suave },
}

// Selo de status: "Pendente", "Em dia", "Atrasada", "Paga", "Recebida"
export function BadgeStatus({ conta }: { conta: ContaDoMes }) {
  const tom = TONS[conta.status]

  return (
    <View style={[styles.badge, { backgroundColor: tom.fundo, borderColor: tom.cor }]}>
      <Text style={[styles.badgeTexto, { color: tom.cor }]}>{rotuloStatus(conta)}</Text>
    </View>
  )
}

// Linha de uma conta (lista de Contas fixas e de Movimentações)
export function CardConta({ conta, aoPress }: { conta: ContaDoMes; aoPress?: () => void }) {
  const moedaVisivel = useMoedaVisivel()
  const Icone = conta.icone
  const entrada = conta.tipo === 'entrada'
  const valor = conta.valorRealizado ?? conta.valorPrevisto
  const tom = TONS[conta.status]

  const detalhe = conta.recorrente
    ? `${rotuloData(conta)} ${diaMes(conta.dataVencimento)} · ${entrada ? 'Receita fixa' : 'Despesa fixa'}`
    : `${diaMes(conta.dataVencimento)} · ${entrada ? 'Receita' : 'Despesa'}`

  return (
    <TouchableOpacity
      style={styles.conta}
      onPress={aoPress}
      disabled={!aoPress}
      activeOpacity={0.88}
      accessibilityRole="button"
      accessibilityLabel={`${conta.nome}, ${moedaVisivel(valor)}, ${rotuloStatus(conta)}`}
    >
      <View style={[styles.contaFaixa, { backgroundColor: tom.cor }]} />

      <View style={styles.contaBolha}>
        <Icone size={22} color={Cores.destaque.limao} />
      </View>

      <View style={styles.contaTextos}>
        <Text style={styles.contaNome} numberOfLines={1}>{conta.nome}</Text>
        <Text style={styles.contaDetalhe} numberOfLines={1}>{detalhe}</Text>
      </View>

      <View style={styles.contaDireita}>
        <Text style={[styles.contaValor, entrada && styles.contaValorEntrada]}>
          {entrada ? '+' : '-'}{moedaVisivel(valor)}
        </Text>
        <BadgeStatus conta={conta} />
      </View>
    </TouchableOpacity>
  )
}

// "‹ Outubro 2026 ›"
export function SeletorMes({
  competencia,
  aoMudar,
}: {
  competencia: Competencia
  aoMudar: (nova: Competencia) => void
}) {
  return (
    <View style={styles.seletorMes}>
      <TouchableOpacity
        style={styles.seletorMesBotao}
        onPress={() => aoMudar(competenciaAnterior(competencia))}
        accessibilityLabel="Mês anterior"
      >
        <ChevronLeft size={24} color={Cores.base.branco} />
      </TouchableOpacity>

      <Text style={styles.seletorMesTexto}>{nomeCompetencia(competencia)}</Text>

      <TouchableOpacity
        style={styles.seletorMesBotao}
        onPress={() => aoMudar(competenciaSeguinte(competencia))}
        accessibilityLabel="Próximo mês"
      >
        <ChevronRight size={24} color={Cores.base.branco} />
      </TouchableOpacity>
    </View>
  )
}

// Linha "rótulo / valor" dos detalhes
export function LinhaInfo({
  rotulo,
  valor,
  primeira,
}: {
  rotulo: string
  valor: string
  primeira?: boolean
}) {
  return (
    <View style={[styles.info, primeira && styles.infoPrimeira]}>
      <Text style={styles.infoRotulo}>{rotulo}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  )
}

// Texto "Previsto R$ X · Pago R$ Y · Diferença ..." (mantém o previsto separado do realizado)
export function textoDiferenca(conta: ContaDoMes, moeda = formatarMoeda): string | undefined {
  const diferenca = diferencaDaConta(conta)
  if (conta.valorRealizado === undefined || diferenca === 0) return undefined

  const verbo = conta.tipo === 'gasto' ? 'pago' : 'recebido'
  const direcao = diferenca > 0 ? 'a mais' : 'a menos'

  return `Previsto ${moeda(conta.valorPrevisto)} · ${verbo} ${moeda(conta.valorRealizado)} (${moeda(Math.abs(diferenca))} ${direcao})`
}

// Card flutuante (um por vez: nada de modal em cima de modal)
export function ModalCartao({
  visible,
  aoFechar,
  children,
}: {
  visible: boolean
  aoFechar: () => void
  children: ReactNode
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={aoFechar}>
      <KeyboardAvoidingView
        style={modal.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Fundo escurecido: tocar fora fecha */}
        <Pressable style={modal.fundo} onPress={aoFechar} />

        <Card
          gradiente={['rgba(44, 27, 67, 0.98)', 'rgba(33, 18, 53, 0.98)']}
          style={modal.card}
        >
          <Pressable
            style={modal.fechar}
            onPress={aoFechar}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <X size={22} color={Cores.texto.claro} />
          </Pressable>

          {children}
        </Card>
      </KeyboardAvoidingView>
    </Modal>
  )
}
