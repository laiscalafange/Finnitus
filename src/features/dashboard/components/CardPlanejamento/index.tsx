import { Image, View } from 'react-native'
import { Text } from '@/shared/components/Texto'
import { useMoedaVisivel } from '@/features/configuracoesContext'
import { useIdioma } from '@/features/idioma'
import { Progress } from '@/shared/components/Progress'
import { Cores } from '@/shared/constants/Cores'
import { PlanejamentoResumo } from '../../types'
import { BotaoPilula, CardSecao } from '../CardSecao'
import { styles } from './styles'

type Props = {
  dados?: PlanejamentoResumo
  // "Ver todas" e "Ver meta" levam para a tela Metas
  onPress?: () => void
}

// Card "Metas" da Home (antigo "Planejamento"; separado do card "Eventos")
export function CardPlanejamento({ dados, onPress }: Props) {
  const moedaVisivel = useMoedaVisivel()
  const { t } = useIdioma()
  return (
    <CardSecao titulo={t('Metas')} aoVerTodos={onPress} textoVerTodos={t('Ver todas')}>
      {dados ? (
        <View style={styles.meta}>
          <View style={styles.bolha}>
            <Image source={require('../../../../../assets/icones/presente.png')} style={styles.iconeImagem} />
          </View>

          <View style={styles.textos}>
            <Text style={styles.label}>{t('META')}</Text>
            <Text style={styles.nome} numberOfLines={1}>{dados.titulo}</Text>

            <View style={styles.linhaProgresso}>
              <View style={styles.barra}>
                <Progress
                  value={dados.percentual}
                  height={8}
                  color={Cores.destaque.limao}
                  backgroundColor={Cores.overlay.medio}
                />
              </View>
              <Text style={styles.percentual}>{dados.percentual}%</Text>
            </View>

            <Text style={styles.faltam}>
              {t('Faltam {restante} de {total}', {
                restante: moedaVisivel(dados.faltam), total: moedaVisivel(dados.total),
              })}
            </Text>
          </View>

          <BotaoPilula titulo={t('Ver meta')} aoPress={onPress} />
        </View>
      ) : (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>{t('Crie uma meta para acompanhar seu progresso.')}</Text>
        </View>
      )}
    </CardSecao>
  )
}
