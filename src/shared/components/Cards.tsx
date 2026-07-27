import { View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GRADIENTS } from '@/shared/constants/Gradientes'  

export function Card({ children, style , gradiente }: {
  children: React.ReactNode
  style?: any
   gradiente: [string, string] 
}) {
  return (
    
  <LinearGradient
       colors={gradiente}
       start={GRADIENTS.background.start}
       end={GRADIENTS.background.end}
    >
      {children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#482287',
    padding: 18,
    marginBottom: 12,
  },
})