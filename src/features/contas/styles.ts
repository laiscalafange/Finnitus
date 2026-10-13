import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

// Estilos das telas de contas (Contas fixas, Detalhes, Editar, Confirmar,
// Movimentações) e dos componentes em components/ContaUI. O container, o
// conteúdo "sobre o header" e os botões lado a lado vêm de
// menuMais/styles/formulario (mesmo padrão do Novo gasto).
export const styles = StyleSheet.create({
  // Faixa de seção: título verde fora do card
  secaoTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 20,
    lineHeight: 24,
    color: Cores.destaque.limao,
    marginTop: 6,
    marginBottom: 10,
  },

  vazio: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 19,
    color: Cores.texto.principal,
    backgroundColor: Cores.fundo.card,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },

  // ---- Seletor de mês (‹ Outubro 2026 ›)
  seletorMes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Cores.overlay.cardForte,
    borderWidth: 1.5,
    borderColor: Cores.roxo.claro,
    borderRadius: 30,
    paddingHorizontal: 8,
    height: 52,
    marginBottom: 18,
  },
  seletorMesBotao: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seletorMesTexto: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 17,
    color: Cores.base.branco,
  },

  // ---- Linha de uma conta (lista)
  conta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Cores.fundo.card,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    overflow: 'hidden',
  },
  contaFaixa: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  contaBolha: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Cores.fundo.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contaTextos: {
    flex: 1,
    minWidth: 0,
  },
  contaNome: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 16,
    lineHeight: 20,
    color: Cores.base.branco,
  },
  contaDetalhe: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    lineHeight: 17,
    color: Cores.texto.principal,
    marginTop: 1,
  },
  contaDireita: {
    alignItems: 'flex-end',
    gap: 5,
  },
  contaValor: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },
  contaValorEntrada: {
    color: Cores.destaque.limao,
  },

  // ---- Selo de status (sempre com texto)
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  badgeTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
  },

  // ---- Cartão de informações (Detalhes)
  cartao: {
    backgroundColor: Cores.fundo.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cartaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartaoBolha: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Cores.fundo.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartaoNome: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 20,
    color: Cores.base.branco,
  },
  cartaoTipo: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.principal,
    marginTop: 1,
  },
  cartaoValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 32,
    color: Cores.destaque.limao,
    marginTop: 12,
  },
  cartaoValorLegenda: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: Cores.texto.claro,
  },

  // ---- Linhas "rótulo / valor"
  info: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Cores.overlay.suave,
  },
  infoPrimeira: {
    borderTopWidth: 0,
  },
  infoRotulo: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    color: Cores.texto.claro,
  },
  infoValor: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 16,
    color: Cores.base.branco,
    marginTop: 2,
  },

  // ---- Histórico
  historicoItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Cores.overlay.suave,
  },
  historicoTitulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },
  historicoTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    lineHeight: 18,
    color: Cores.texto.principal,
    marginTop: 2,
  },

  // ---- Avisos e textos de apoio
  aviso: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: Cores.texto.claro,
    marginBottom: 14,
  },
  pergunta: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 16,
    lineHeight: 23,
    color: Cores.texto.principal,
    marginBottom: 18,
  },
  perguntaDestaque: {
    fontFamily: FONTS.quicksand.bold,
    color: Cores.base.branco,
  },
  espaco: {
    height: 12,
  },

  // ---- Resumo do mês (Movimentações)
  resumoLinha: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: Cores.fundo.card,
    borderRadius: 18,
    padding: 14,
  },
  resumoRotulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.texto.claro,
  },
  resumoValor: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 18,
    marginTop: 4,
  },

  // ---- Modal (card flutuante)
  modalData: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Cores.overlay.cardForte,
    borderWidth: 1,
    borderColor: Cores.overlay.medio,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    alignSelf: 'stretch',
  },
  modalDataTexto: {
    flex: 1,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.base.branco,
  },
  modalIcone: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Cores.fundo.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalSubtitulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.texto.principal,
    textAlign: 'center',
    marginBottom: 14,
  },
  modalTexto: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 14,
    lineHeight: 20,
    color: Cores.texto.claro,
    marginBottom: 18,
  },
  modalBotoes: {
    alignSelf: 'stretch',
  },
})