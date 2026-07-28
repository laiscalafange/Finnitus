import { View, Text, TextInput, StyleSheet } from 'react-native'

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
    <View style={styles.wrapper}>  {/*wrapper garante que cada Input tenha um espaço embaixo quando você colocar vários em sequência*/}

      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.campo, erro ? styles.campoErro : null]}>  {/*se der erro ,muda pro style de erro*/}
        {icone && <View style={styles.icone}>{icone}</View>}
       {/* Mesmo coisa pro erro e icone , só aparecem se você passar. */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#684D94"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {erro && <Text style={styles.erro}>{erro}</Text>}
{/*basicamente configurando as funções do input , colocando valores e comportamentos específicos*/}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B7FF00',
    marginBottom: 8,
  },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1112', 
    borderWidth: 1.5,
    borderColor: '#7E3BED',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },
  campoErro: {
    borderColor: '#811b1b',  // borda vermelha quando tem erro
  },
  icone: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#7E3BED',
  },
  erro: {
    fontSize: 12,
    color: '#760707',
    marginTop: 6,
  },
})