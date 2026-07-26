import { View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'  

export function Card({ children, style , gradiente }: {
  children: React.ReactNode
  style?: any
   gradiente: [string, string] 
}) {
  return (
    
    <LinearGradient
      colors={gradiente}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.base, style]}
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