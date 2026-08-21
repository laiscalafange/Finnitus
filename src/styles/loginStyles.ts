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


texto: {
    fontFamily: "Raleway_600SemiBold",
    fontSize: 16,
    color: "#9B5CF6",
    alignSelf: "center",
    marginTop: -10,
  },

 conteiner: {
  position: "absolute",
  bottom: 50,
  width: "90%",
  alignSelf: "center",
},
    
  title: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(35),
    color: Cores.base.branco,
    marginBottom: -15,
  },
  title2: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(35),
    color: Cores.destaque.limao,
    marginBottom: -15,
  },

  subtitle: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(25),
    color: Cores.base.branco,
    marginTop: 15,
    marginBottom: 15,
  },

});