import { View, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GRADIENTS } from '../../constants/Gradientes'
import { styles } from './HeaderStyles'
import { HeaderProps } from "./HeaderTypes";
import { SinoNotificacoes } from "@/shared/components/SinoNotificacoes";

export function Header({ 
  titulo, 
  subtitulo, 
  onNotificacao, 
  onMenu 
}: HeaderProps) {
  return (
    <LinearGradient
      colors={GRADIENTS.header.colors}
      start={GRADIENTS.header.start}
      end={GRADIENTS.header.end}
    >
      <View style={styles.interno}>
        <View>
          <Text style={styles.titulo}>{titulo}</Text>
          {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
        </View>
        <View style={styles.icones}>
          <SinoNotificacoes onPress={onNotificacao} />
          <TouchableOpacity onPress={onMenu}>
            <Text style={styles.icone}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}
