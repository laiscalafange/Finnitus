import { StyleSheet } from 'react-native';
import { Cores } from '../shared/constants/Cores';
import { FONTS } from '../shared/constants/Tipografia';
import { RFValue } from "react-native-responsive-fontsize";


export const styles = StyleSheet.create({

    
  content: {
  flex: 1,
  zIndex: 1,
  padding: 24,
  position: "absolute",
  top: 50,
},

 conteiner: {
  position: "absolute",
  bottom: 50,
  width: "90%",
  alignSelf: "center",
},
    
  title: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(34),
    color: Cores.base.branco,
    marginBottom: -8,
  },
  title2: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(34),
    color: Cores.destaque.limao,
    marginBottom: -8,
  },

  subtitle: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(19),
    color: Cores.base.branco,
    marginTop: 15,
    marginBottom: 15,
  },

});