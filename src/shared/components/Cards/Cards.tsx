import { LinearGradient } from 'expo-linear-gradient'
import { styles } from './CardsStyles'
import { CardProps } from "./CardsTypes";

export function Card({
  children,
  style,
  gradiente,
}: CardProps) {

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