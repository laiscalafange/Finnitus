import { StyleSheet } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'
export const styles=StyleSheet.create({container:{paddingTop:14,paddingHorizontal:20,paddingBottom:14,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},titulo:{fontFamily:FONTS.raleway.extrabold,fontSize:24,color:Cores.destaque.limao},subtitulo:{fontFamily:FONTS.quicksand.regular,fontSize:11,color:Cores.texto.principal,marginTop:2},icones:{flexDirection:'row',gap:16},icone:{width:22,height:22,resizeMode:'contain'}})
