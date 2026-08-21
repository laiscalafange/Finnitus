import { Text, View } from 'react-native'
import { PlanejamentoResumo } from '../../types'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'
import { styles } from './styles'

type Props={dados?:PlanejamentoResumo}
export function CardPlanejamento({dados}:Props){return <View style={styles.container}><Text style={styles.titulo}>Planejamento</Text><View style={styles.card}><View style={styles.icone}><Text style={styles.iconeTexto}>✓</Text></View><View style={styles.textos}><Text style={styles.nome}>{dados?.titulo??'Planejamento'}</Text><Text style={styles.valor}>{dados?.valor??'Dados ainda não disponíveis'}</Text></View><Text style={styles.seta}>›</Text></View></View>}
