import { Text, TouchableOpacity, View } from 'react-native'
import { Cores } from '@/shared/constants/Cores'
import { FONTS } from '@/shared/constants/Tipografia'
import { EventoResumo } from '../../types'
import { styles } from './styles'

type Props={evento?:EventoResumo;onPress?:()=>void}
export function CardEvento({evento,onPress}:Props){return <TouchableOpacity style={styles.container} disabled={!evento||!onPress} onPress={onPress} activeOpacity={.8}>
 <View style={styles.tituloLinha}><Text style={styles.titulo}>Eventos</Text><Text style={styles.icone}>›</Text></View>
 {evento?<View style={styles.evento}><View style={styles.ponto}/><View style={styles.textos}><Text style={styles.label}>Próximo evento</Text><Text style={styles.nome}>{evento.titulo}</Text></View><Text style={styles.data}>{evento.data}</Text></View>:<View style={styles.vazio}><Text style={styles.vazioTitulo}>Próximo evento</Text><Text style={styles.vazioTexto}>O calendário ainda não disponibiliza um evento para o resumo da Home.</Text></View>}
 </TouchableOpacity>}
