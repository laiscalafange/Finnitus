import {
  View,
} from 'react-native'
import { Text } from '@/shared/components/Texto'
import { useIdioma } from '@/features/idioma'

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
  const { t } = useIdioma()
  const Icone =
    evento &&
    /anivers/i.test(evento.titulo)
      ? Cake
      : CalendarDays

  return (
    <CardSecao
      titulo={t('Eventos')}
      aoVerTodos={onPress}
      textoVerTodos={t('Ver todos')}
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
              {t('EVENTO')}
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
            titulo={t('Ver evento')}
            aoPress={onPress}
          />
        </View>
      ) : (
        <View style={styles.vazio}>
          <Text
            style={styles.vazioTitulo}
          >
            {t('Próximo evento')}
          </Text>

          <Text
            style={styles.vazioTexto}
          >
            {t('Nenhum próximo evento encontrado no calendário.')}
          </Text>
        </View>
      )}
    </CardSecao>
  )
}
