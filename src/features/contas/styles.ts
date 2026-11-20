
import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
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
    color: Cores.texto.claro,
    backgroundColor: "rgba(44, 27, 67, 0.83)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },

  seletorMes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "rgba(44, 27, 67, 0.83)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.30)",
    borderRadius: 16,
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

  conta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: "rgba(44, 27, 67, 0.83)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    borderRadius: 16,
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
    borderRadius: 11,
    backgroundColor: "rgba(183, 255, 0, 0.10)",
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
    color: Cores.texto.claro,
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

  cartao: {
    backgroundColor: "rgba(44, 27, 67, 0.83)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    borderRadius: 16,
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
    borderRadius: 16,
    backgroundColor: "rgba(183, 255, 0, 0.10)",
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
    color: Cores.texto.claro,
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

  info: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(163, 87, 255, 0.22)",
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

  historicoItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(163, 87, 255, 0.22)",
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
    color: Cores.texto.claro,
    marginTop: 2,
  },

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
    color: Cores.texto.claro,
    marginBottom: 18,
  },
  perguntaDestaque: {
    fontFamily: FONTS.quicksand.bold,
    color: Cores.base.branco,
  },
  espaco: {
    height: 12,
  },

  resumoLinha: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: "rgba(44, 27, 67, 0.83)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    borderRadius: 16,
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

  modalData: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: "rgba(44, 27, 67, 0.83)",
    borderWidth: 1,
    borderColor: "rgba(163, 87, 255, 0.22)",
    borderRadius: 16,
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
    borderRadius: 16,
    backgroundColor: "rgba(183, 255, 0, 0.10)",
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalSubtitulo: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    color: Cores.texto.claro,
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

  // Botões da tela de detalhes
  acoesContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  acoesLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  acaoColuna: {
    flex: 1,
    minWidth: 0,
  },
  botaoExcluir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    width: '100%',
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.13)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.45)',
    borderRadius: 14,
  },
  botaoExcluirTexto: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 15,
    color: '#FF6B6B',
  },
})
