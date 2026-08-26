import { Text, TouchableOpacity, View } from 'react-native'
import { EventoResumo } from '../../types'
import { styles } from './styles'

type Props = {
  evento?: EventoResumo
  onPress?: () => void
}

export function CardEvento({ evento, onPress }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} disabled={!onPress} activeOpacity={0.88}>
        <View style={styles.tituloLinha}>
          <Text style={styles.titulo}>Eventos</Text>
          {onPress && <Text style={styles.icone}>›</Text>}
        </View>

        {evento ? (
          <View style={styles.evento}>
            <View style={styles.ponto} />
            <View style={styles.textos}>
              <Text style={styles.label}>Próximo evento</Text>
              <Text style={styles.nome}>{evento.titulo}</Text>
            </View>
            <Text style={styles.data}>{evento.data}</Text>
          </View>
        ) : (
          <View style={styles.vazio}>
            <Text style={styles.vazioTitulo}>Próximo evento</Text>
            <Text style={styles.vazioTexto}>Nenhum próximo evento encontrado no calendário.</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )
}
