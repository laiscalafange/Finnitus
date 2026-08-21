import { Text, View } from 'react-native'
import { EconomiaResumo } from '../../types'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'
import { styles } from './styles'

type Props={dados?:EconomiaResumo}
export function CardEconomia({dados}:Props){return <View style={styles.container}><Text style={styles.titulo}>Economia mensal</Text><View style={styles.card}><View style={styles.medidor}><View style={styles.medidorInterno}><Text style={styles.percentual}>{dados===undefined?'—':`${dados.percentual}%`}</Text></View></View><View style={styles.textos}><Text style={styles.destaque}>{dados===undefined?'Dados não disponíveis':'Continue assim!'}</Text><Text style={styles.descricao}>{dados?.mensagem??'Este resumo será alimentado pelos dados reais de economia quando a funcionalidade estiver conectada.'}</Text></View></View></View>}
