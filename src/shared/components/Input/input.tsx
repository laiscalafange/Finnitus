import { View, Text, TextInput } from 'react-native'
import { Cores } from '../../constants/Cores'
import { styles } from './InputStyles'

export function Input({ label, erro, icone, placeholder, secureTextEntry, keyboardType, value, onChangeText }: {
  label?: string
  erro?: string
  icone?: React.ReactNode
  placeholder?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'numeric' | 'email-address'
  value?: string
  onChangeText?: (text: string) => void
}) {
  return (
    <View style={styles.wrapper}>

      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.campo, erro ? styles.campoErro : null]}>
        {icone && <View style={styles.icone}>{icone}</View>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Cores.texto.desabilitado}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {erro && <Text style={styles.erro}>{erro}</Text>}

    </View>
  )
}