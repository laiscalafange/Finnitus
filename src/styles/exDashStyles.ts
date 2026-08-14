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
  top: 60,
},

 content2: {
  flex: 1,
  zIndex: 1,
  position: "absolute",
  padding: 24,
  top: 220,
},

linha: {
  flexDirection: "row",
  alignItems: "flex-end",
  gap: 8,
},

 conteiner: {
  position: "absolute",
  bottom: 50,
  width: "90%",
  alignSelf: "center",
},
    
  title: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(42),
    color: Cores.base.branco,
    marginBottom: -15,
  },
  title2: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(42),
    color: Cores.destaque.limao,
    marginBottom: -15,
  },

  stitulo: {
    fontFamily: FONTS.raleway.bold,
    fontSize: RFValue(26),
    color: Cores.destaque.limao,
    marginBottom: -15,
  },

  content3: {
  flex: 1,
  zIndex: 1,
  position: "absolute",
  padding: 24,
  top: 370,
},

linhaTexto: {
  flexDirection: "row",
  alignItems: "center",
},

iconeInput: {
  width: 30,
  height: 30,
  resizeMode: "contain",
  marginRight: 2,
  top: 9,
},

  subtitle: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(24),
    color: Cores.base.branco,
    marginTop: 10,
    marginBottom: -5,
  },

  subtitle2: {
    fontFamily: FONTS.quicksand.regular,
    fontSize: RFValue(24),
    color: Cores.base.branco,
    marginTop: 10,
    marginBottom: -14,
  },

});