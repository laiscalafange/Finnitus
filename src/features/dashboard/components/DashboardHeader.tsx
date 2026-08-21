import { Image, Text, TouchableOpacity, View } from 'react-native'
import { FONTS } from '@/shared/constants/Tipografia'
import { styles } from './DashboardHeaderStyles'

type Props={onPremium?:()=>void;onNotificacao?:()=>void}
export function DashboardHeader({onPremium,onNotificacao}:Props){return <View style={styles.container}><View><Text style={styles.titulo}>Olá!</Text><Text style={styles.subtitulo}>Seu resumo financeiro</Text></View><View style={styles.icones}><TouchableOpacity onPress={onPremium}><Image source={require('../../../../assets/icones/coroa.png')} style={styles.icone}/></TouchableOpacity><TouchableOpacity onPress={onNotificacao}><Image source={require('../../../../assets/icones/sino.png')} style={styles.icone}/></TouchableOpacity></View></View>}
