import { StyleSheet } from 'react-native'
import { FONTS } from '@/shared/constants/Tipografia'
export const styles=StyleSheet.create({
 container:{borderRadius:26,padding:18,marginHorizontal:14,marginBottom:18},
 topo:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 titulo:{fontFamily:FONTS.raleway.extrabold,fontSize:17,color:'#21102F'},mes:{fontFamily:FONTS.quicksand.semibold,fontSize:10,color:'#4C3D19'},
 saldo:{fontFamily:FONTS.raleway.extrabold,fontSize:28,color:'#171B12',marginTop:4},divisor:{height:1,backgroundColor:'#5C6D16',opacity:.35,marginVertical:12},
 label:{fontFamily:FONTS.quicksand.bold,fontSize:11,color:'#314113'},valorMes:{fontFamily:FONTS.raleway.bold,fontSize:18,color:'#171B12',marginTop:2},
 observacao:{fontFamily:FONTS.quicksand.regular,fontSize:9,lineHeight:14,color:'#354514',marginTop:10}
})
