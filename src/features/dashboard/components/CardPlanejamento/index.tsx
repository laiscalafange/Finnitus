import { Image, Text, View } from 'react-native'
import { Progress } from '@/shared/components/Progress'
import { Cores } from '@/shared/constants/Cores'
import { formatarMoeda } from '@/features/menuMais/utils'
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
  return (
    <CardSecao titulo="Metas" aoVerTodos={onPress} textoVerTodos="Ver todas">
      {dados ? (
        <View style={styles.meta}>
          <View style={styles.bolha}>
            <Image source={require('../../../../../assets/icones/presente.png')} style={styles.iconeImagem} />
          </View>

          <View style={styles.textos}>
            <Text style={styles.label}>META</Text>
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
              Faltam {formatarMoeda(dados.faltam)} de {formatarMoeda(dados.total)}
            </Text>
          </View>

          <BotaoPilula titulo="Ver meta" aoPress={onPress} />
        </View>
      ) : (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Crie uma meta para acompanhar seu progresso.</Text>
        </View>
      )}
    </CardSecao>
  )
}