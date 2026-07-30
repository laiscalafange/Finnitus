import { View, Text, TextInput } from 'react-native'
import { Cores } from '../../constants/Cores'
import { styles } from './InputStyles'
import { InputProps } from "./InputTypes";

export function Input({
  label,
  erro,
  icone,
  placeholder,
  secureTextEntry,
  keyboardType,
  value,
  onChangeText,
}: InputProps) {
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