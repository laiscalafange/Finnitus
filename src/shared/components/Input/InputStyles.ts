import { StyleSheet } from 'react-native'
import { Cores } from '../../constants/Cores'
import { FONTS } from '../../constants/Tipografia'

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.raleway.bold,
    fontSize: 16,
    color: Cores.destaque.limao,
    marginBottom: 8,
  },
  campo: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Cores.fundo.principal,
  borderWidth: 1.5,
  borderColor: Cores.roxo.claro,
  borderRadius: 14,
  paddingHorizontal: 16,
  height: 64, 
},
  campoErro: {
    borderColor: Cores.estado.erro,
  },
  // Modo multilinha: caixa mais alta, com o texto começando no topo
  campoMultilinha: {
    height: 140,
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  inputMultilinha: {
    height: '100%',
    textAlignVertical: 'top',
  },
  icone: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.quicksand.bold,
    fontSize: 15,
    color: Cores.base.branco,
  },
  erro: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: 12,
    color: Cores.estado.erro,
    marginTop: 6,
  },
})