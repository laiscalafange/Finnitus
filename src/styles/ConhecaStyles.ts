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
  top: 100,
  left: 10,
},

 content2: {
  flex: 1,
  zIndex: 1,
  position: "absolute",
  padding: 24,
  top: 220,
  left: 10,
},

 conteiner: {
  position: "absolute",
  bottom: 50,
  width: "90%",
  alignSelf: "center",
},
    
  title: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(50),
    color: Cores.base.branco,
    marginBottom: -15,
  },
  title2: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(50),
    color: Cores.destaque.limao,
    marginBottom: -5,
  },

  subtitle: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(25),
    color: Cores.base.branco,
    marginBottom: -5,
  },
  subtitle2: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(25),
    color: Cores.roxo.principal,
    marginBottom: -5,
  },

  

});