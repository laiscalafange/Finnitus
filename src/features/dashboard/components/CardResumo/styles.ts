import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

// Medidas usadas no layout E no cálculo do tamanho da fonte do valor
// (index.tsx). Mexeu aqui, o cálculo acompanha automaticamente.
export const MEDIDAS = {
  linhaPadding: 20, // padding lateral da linha
  linhaGap: 7, // espaço entre Receitas e Despesas
  itemPadding: 8, // padding lateral de cada metade
  itemGap: 8, // espaço entre o ícone e o texto
  bolha: 42, // tamanho do ícone (seta)
} as const

export const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    gap: MEDIDAS.linhaGap,
    paddingHorizontal: MEDIDAS.linhaPadding,
    marginTop: 2,
  },

  // Cada metade tem o mesmo tamanho (flex: 1) e o conteúdo fica centralizado.
  item: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: MEDIDAS.itemGap,

    paddingHorizontal: MEDIDAS.itemPadding,
    paddingVertical: 5,
  },

  bolha: {
    width: MEDIDAS.bolha,
    height: MEDIDAS.bolha,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bolhaReceita: {
    backgroundColor: Cores.destaque.limao,
  },

  bolhaDespesa: {
    backgroundColor: 'rgba(187, 19, 19, 0.9)',
  },

  // flex: 1 dá uma largura definida ao texto
  textos: {
    flex: 1,
    minWidth: 0,
  },

  rotuloLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  label: {
    flexShrink: 1,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 13,
    lineHeight: 18,
    color: '#E4D2FF',
  },

  // O fontSize é calculado no index.tsx (depende da largura do valor)
  valor: {
    fontFamily: FONTS.raleway.extrabold,
    lineHeight: 23,
  },

  valorReceita: {
    color: Cores.base.branco,
  },

  valorDespesa: {
    color: Cores.base.branco,
  },
})