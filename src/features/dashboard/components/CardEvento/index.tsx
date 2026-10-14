import {
  Text,
  View,
} from 'react-native'

import {
  Cake,
  CalendarDays,
} from 'lucide-react-native'

import {
  Cores,
} from '@/shared/constants/Cores'

import {
  BotaoPilula,
  CardSecao,
} from '../CardSecao'

import {
  styles,
} from './styles'

type Props = {
  evento?: {
    titulo: string
    data: string
  }

  onPress?: () => void
}

export function CardEvento({
  evento,
  onPress,
}: Props) {
  const Icone =
    evento &&
    /anivers/i.test(evento.titulo)
      ? Cake
      : CalendarDays

  return (
    <CardSecao
      titulo="Eventos"
      aoVerTodos={onPress}
    >
      {evento ? (
        <View style={styles.evento}>
          <View style={styles.bolha}>
            <Icone
              size={24}
              color={
                Cores.destaque.limao
              }
            />
          </View>

          <View style={styles.textos}>
            <Text style={styles.label}>
              EVENTO
            </Text>

            <Text
              style={styles.nome}
              numberOfLines={1}
            >
              {evento.titulo}
            </Text>

            <Text style={styles.data}>
              {evento.data}
            </Text>
          </View>

          <BotaoPilula
            titulo="Ver evento"
            aoPress={onPress}
          />
        </View>
      ) : (
        <View style={styles.vazio}>
          <Text
            style={styles.vazioTitulo}
          >
            Próximo evento
          </Text>

          <Text
            style={styles.vazioTexto}
          >
            Nenhum próximo evento
            encontrado no calendário.
          </Text>
        </View>
      )}
    </CardSecao>
  )
}