import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.fundo.principal,
  },

  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  conteudo: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    paddingTop: 8,
  },

  // ── NAV ANÁLISES / HISTÓRICO ───────────────────────────

  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  navItem: {
    width: '47%',
  },

  navCaixa: {
    height: 65,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIconeS: {
    width: 53,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginLeft: 9,
  },

  navIconeH: {
    width: 53,
    height: 50,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginRight: 5,
  },

  navTextoEsquerda: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.roxo.principal,
    textAlign: 'left',
    marginTop: 6,
  },

  navTextoDireita: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 14,
    color: Cores.roxo.principal,
    textAlign: 'right',
    marginTop: 6,
  },

  // ── SEÇÃO ────────────────────────────────────────────────

  secaoTitulo: {
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 22,
    color: Cores.destaque.limao,
    marginBottom: 12,
  },

  // ── METAS DO MÊS ─────────────────────────────────────────

  metasLista: {
    marginBottom: 28,
    gap: 14,
  },

  metaLinha: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
  },

  metaPonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Cores.destaque.limao,
    marginTop: 8,
  },

  // Wrapper novo: o TouchableOpacity precisa de flex: 1 pra
  // o card continuar ocupando o espaço disponível na linha
  metaCardWrapper: {
    flex: 1,
  },

  metaCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
  },

  metaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },

  metaIconeContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  metaIcone: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  metaNome: {
    flex: 1,
    fontFamily: FONTS.raleway.extrabold,
    fontSize: 17,
    color: Cores.destaque.limao,
  },

  metaData: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 13,
    color: Cores.texto.claro,
    marginRight: 6,
  },

  metaMenu: {
    color: Cores.texto.claro,
    fontSize: 16,
  },

  // Opção "Excluir meta" que aparece ao tocar no ⋮
  metaMenuOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: Cores.overlay.medio,
  },

  metaMenuTexto: {
    fontFamily: FONTS.quicksand.bold,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  // Texto quando não há nenhuma meta do mês
  vazio: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.texto.claro,
  },

  metaBarraFundo: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Cores.overlay.medio,
    overflow: 'hidden',
    marginBottom: 8,
  },

  metaBarraPreenchida: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Cores.roxo.claro,
  },

  metaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  metaPrazo: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  metaValor: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.texto.claro,
  },

  // ── METAS LONGO PRAZO ────────────────────────────────────
  longoPrazoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },

  longoPrazoCard: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },

  longoPrazoGradiente: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },

  longoPrazoNome: {
    fontFamily: FONTS.quicksand.semibold,
    fontSize: 14,
    color: Cores.texto.claro,
  },

  adicionarCard: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: Cores.fundo.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },

  adicionarTexto: {
    fontSize: 32,
    color: Cores.texto.secundario,
    fontFamily: FONTS.quicksand.regular,
  },
})