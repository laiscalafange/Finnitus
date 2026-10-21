import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Eye, EyeOff } from 'lucide-react-native'
import { Cores } from '@/shared/constants/Cores'
import { styles } from './styles'

type Props = {
  saldoAtual?: number
  onPress?: () => void
}

// Sem saldo preenchido, mostra R$ 0,00 (nunca traços). Saldo real não é alterado.
const moeda = (valor?: number) =>
  (valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Saldo atual (fica dentro do header roxo da Home, centralizado)
export function CardSaldo({ saldoAtual, onPress }: Props) {
  // Olho: mostra ou esconde o valor do saldo
  const [oculto, setOculto] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Saldo atual</Text>

      <TouchableOpacity activeOpacity={0.9} onPress={onPress} disabled={!onPress}>
        <Text style={styles.saldo} numberOfLines={1} adjustsFontSizeToFit>
          {oculto ? 'R$ ••••••' : moeda(saldoAtual)}
        </Text>
      </TouchableOpacity>
      <Text style={styles.descricao}>após despesas previstas</Text>

      <TouchableOpacity
        style={styles.olho}
        onPress={() => setOculto(valor => !valor)}
        activeOpacity={0.8}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={oculto ? 'Mostrar saldo' : 'Ocultar saldo'}
      >
        {oculto ? (
          <EyeOff size={26} color={Cores.texto.claro} />
        ) : (
          <Eye size={26} color={Cores.texto.claro} />
        )}
      </TouchableOpacity>
    </View>
  )
}